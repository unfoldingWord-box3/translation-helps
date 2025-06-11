/**
 * ScripturePanelRCL.jsx
 * Enhanced scripture panel using simple-text-editor-rcl for rich USFM rendering
 */
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { ManifestsContext } from "../../context/MultiManifestsContext";
import { fetchBook } from "../../services/scriptureService";
import { useProskomma, useImport, useCatalog } from "proskomma-react-hooks";

import USFMRenderer from "./USFMRenderer";
import SearchPanel from "./SearchPanel";

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export default function ScripturePanelRCL({ reference, onVerseClick }) {
  const [usfmContent, setUsfmContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [importingBooks, setImportingBooks] = useState(new Set());
  const { organization, languageId, resourceId, updateReference } = useContext(ReferenceContext);
  const { manifests, isLoading: manifestsLoading } = useContext(ManifestsContext);

  // Shared proskomma instance for both USFMRenderer and SearchPanel
  const proskommaHook = useProskomma({ verbose: false });

  // Check what's already imported to prevent duplicate imports
  const catalogHook = useCatalog({
    ...proskommaHook,
    verbose: false,
  });

  // Create a unique key for the current book/resource combination
  const bookResourceKey = useMemo(() => {
    if (!organization || !languageId || !reference?.bookId || !resourceId) return null;

    let cleanResourceId = resourceId;
    if (resourceId && languageId && resourceId.startsWith(`${languageId}_`)) {
      cleanResourceId = resourceId.substring(languageId.length + 1);
    }

    return `${organization}/${languageId}_${cleanResourceId}/${reference.bookId}`;
  }, [organization, languageId, reference?.bookId, resourceId]);

  // Check if the current book is already imported OR currently being imported
  const isBookAlreadyImported = useMemo(() => {
    if (!organization || !languageId || !reference?.bookId || !resourceId || !catalogHook.catalog) {
      return false;
    }

    // Strip language prefix from resourceId for docSet ID construction
    let cleanResourceId = resourceId;
    if (resourceId && languageId && resourceId.startsWith(`${languageId}_`)) {
      cleanResourceId = resourceId.substring(languageId.length + 1);
    }

    // Use clean resourceId in docSet ID
    const docSetId = `${organization}/${languageId}_${cleanResourceId}`;
    const docSets = catalogHook.catalog.docSets || [];

    // Check if this docSet exists and has documents
    const existingDocSet = docSets.find((ds) => ds.id === docSetId);
    const hasDocuments = existingDocSet && existingDocSet.nDocuments > 0;

    console.log("📚 Checking if book is already imported:", {
      docSetId,
      cleanResourceId,
      existingDocSet: !!existingDocSet,
      hasDocuments,
      availableDocSets: docSets.map((ds) => ds.id),
      isCurrentlyImporting: bookResourceKey ? importingBooks.has(bookResourceKey) : false,
    });

    return hasDocuments;
  }, [
    organization,
    languageId,
    reference?.bookId,
    resourceId,
    catalogHook.catalog,
    bookResourceKey,
    importingBooks,
  ]);

  // Check if import is currently in progress for this book
  const isCurrentlyImporting = bookResourceKey ? importingBooks.has(bookResourceKey) : false;

  // Create document configuration only when USFM content is available AND book is not already imported AND not currently importing
  const document = useMemo(() => {
    if (!usfmContent || !organization || !languageId || !reference?.bookId || !resourceId)
      return null;

    // Don't create document config if book is already imported
    if (isBookAlreadyImported) {
      console.log("📚 Book already imported, skipping document creation");
      return null;
    }

    // Don't create document config if import is already in progress
    if (isCurrentlyImporting) {
      console.log("📚 Book import already in progress, skipping document creation");
      return null;
    }

    // Strip language prefix from resourceId for abbr
    let cleanResourceId = resourceId;
    if (resourceId && languageId && resourceId.startsWith(`${languageId}_`)) {
      cleanResourceId = resourceId.substring(languageId.length + 1);
    }

    console.log("📚 Creating new document config for import", {
      originalResourceId: resourceId,
      cleanResourceId,
      organization,
      languageId,
      bookCode: reference.bookId,
      expectedDocSetId: `${organization}/${languageId}_${cleanResourceId}`,
    });

    // Mark this book as being imported
    if (bookResourceKey) {
      setImportingBooks((prev) => new Set([...prev, bookResourceKey]));
    }

    return [
      {
        selectors: { org: organization, lang: languageId, abbr: cleanResourceId },
        data: usfmContent,
        bookCode: reference.bookId,
      },
    ];
  }, [
    usfmContent,
    organization,
    languageId,
    reference?.bookId,
    resourceId,
    isBookAlreadyImported,
    isCurrentlyImporting,
    bookResourceKey,
  ]);

  // Import document into proskomma when document is ready
  const importHook = useImport({
    ...proskommaHook,
    documents: document || [], // Ensure we always pass an array
    verbose: false,
  });

  // Clean up importing state when import completes or fails
  useEffect(() => {
    if (bookResourceKey && importingBooks.has(bookResourceKey)) {
      if (importHook.done && !importHook.importing) {
        console.log("📚 Import completed for:", bookResourceKey);
        setImportingBooks((prev) => {
          const next = new Set(prev);
          next.delete(bookResourceKey);
          return next;
        });

        // Log any import errors
        if (importHook.errors && importHook.errors.length > 0) {
          console.error("📚 Import errors:", importHook.errors);
          setError(`Error importing scripture: ${importHook.errors[0]}`);
        }
      }
    }
  }, [bookResourceKey, importHook.done, importHook.importing, importHook.errors, importingBooks]);

  // Debug: Log render
  console.log("[ScripturePanelRCL] Rendering with:", {
    reference,
    organization,
    languageId,
    resourceId,
    manifestsLoading,
    hasManifests: !!manifests,
    usfmContentLength: usfmContent?.length,
    hasDocument: !!document,
    importDone: importHook.done,
  });

  useEffect(() => {
    async function loadUSFMChapter() {
      // Don't attempt to load if we don't have required context
      if (!reference?.bookId || !reference.chapter || !organization || !languageId) {
        console.log("📋 ScripturePanelRCL: Missing required context", {
          bookId: reference?.bookId,
          chapter: reference?.chapter,
          organization,
          languageId,
        });
        // Clear content and set helpful guidance message
        setUsfmContent("");
        setError(null);
        if (!organization) {
          setError("Please select an organization from the dropdown above to view scripture.");
        } else if (!languageId) {
          setError("Please select a language from the dropdown above to view scripture.");
        } else if (!reference?.bookId || !reference.chapter) {
          setError("Please select a book and chapter from the dropdowns above to view scripture.");
        }
        return;
      }

      // Don't attempt to load if manifests are still loading
      if (manifestsLoading) {
        console.log("⏳ ScripturePanelRCL: Waiting for manifests to load");
        setLoading(true);
        return;
      }

      // If book is already imported, we don't need to re-fetch the USFM content
      // The existing content can be used for all chapters in the same book
      if (isBookAlreadyImported && usfmContent) {
        console.log("📚 Book already imported and content available, skipping fetch");
        setError(null);
        setLoading(false);
        return;
      }

      // Clear previous content and errors when we need to load new content
      if (!isBookAlreadyImported) {
        setUsfmContent("");
      }
      setError(null);

      // Use the selected resource from context (no fallback needed)
      const selectedResourceId = resourceId;

      // Strip language prefix from resourceId for manifest lookup
      // e.g., "en_ult" -> "ult" to match MultiManifestsContext keys
      let manifestKey = selectedResourceId;
      if (selectedResourceId && languageId && selectedResourceId.startsWith(`${languageId}_`)) {
        manifestKey = selectedResourceId.substring(languageId.length + 1);
      }

      const selectedManifest = manifests[manifestKey];

      if (!selectedManifest) {
        console.log(
          `📋 ScripturePanelRCL: ${selectedResourceId.toUpperCase()} manifest not available`
        );
        // Show helpful guidance instead of technical error
        if (!resourceId) {
          setError("Please select a Bible resource from the dropdown above to view scripture.");
        } else {
          setError(
            `The selected Bible resource (${selectedResourceId.toUpperCase()}) is not available for ${organization}/${languageId}. Please try selecting a different resource from the dropdown above.`
          );
        }
        return;
      }

      setLoading(true);
      const { bookId, chapter } = reference;

      try {
        console.log(
          `📖 ScripturePanelRCL: Loading ${bookId} chapter ${chapter} from ${selectedResourceId}`
        );

        // Fetch raw USFM content
        const rawUSFM = await fetchBook({
          languageId,
          resourceId: selectedResourceId,
          bookId,
          manifest: selectedManifest,
          organization,
        });

        if (!rawUSFM) {
          throw new Error(`Failed to fetch USFM for ${bookId}`);
        }

        // Debug: log the full USFM content
        console.log("📄 Full USFM content length:", rawUSFM.length);
        console.log("📄 First 1000 chars:", rawUSFM.substring(0, 1000));
        console.log("📄 Last 500 chars:", rawUSFM.substring(rawUSFM.length - 500));

        // Pass the full USFM to simple-text-editor-rcl for complete book navigation
        console.log(
          `✅ ScripturePanelRCL: Loaded full USFM for ${bookId} (${rawUSFM.length} characters)`
        );
        // Try passing raw USFM first to see if UsfmEditor can handle it
        console.log("📝 Using raw USFM length:", rawUSFM.length);
        console.log("📝 Raw USFM first 1000 chars:", rawUSFM.substring(0, 1000));

        setUsfmContent(rawUSFM);
        setError(null);
      } catch (e) {
        console.error("❌ ScripturePanelRCL: Failed to load chapter:", e);
        setError(`Failed to load chapter: ${e.message}`);
        setUsfmContent("");
      } finally {
        setLoading(false);
      }
    }

    loadUSFMChapter();
  }, [
    reference?.bookId,
    reference?.chapter,
    resourceId,
    languageId,
    organization,
    manifests,
    manifestsLoading,
    isBookAlreadyImported,
    usfmContent,
  ]);

  // Accept both chapter and verse for context update
  const handleVerseClick = (verseNum, chapterNum) => {
    // If chapterNum is not provided, use the current reference
    const newChapter = chapterNum || reference?.chapter;
    updateReference({ chapter: newChapter, verse: verseNum });
    if (onVerseClick) {
      onVerseClick(verseNum, newChapter);
    }
  };

  // Show loading state if manifests are loading or content is loading
  if (manifestsLoading || loading) {
    return (
      <section data-testid='scripture-panel-rcl' style={{ padding: "20px" }}>
        <h2>Scripture</h2>
        <p>Loading scripture...</p>
      </section>
    );
  }

  // Show message if no reference is selected
  if (!reference?.bookId) {
    return (
      <section data-testid='scripture-panel-rcl' style={{ padding: "20px" }}>
        <h2>Scripture</h2>
        <p>Please select a book and chapter to view scripture.</p>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section data-testid='scripture-panel-rcl' style={{ padding: "20px" }}>
        <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
        <p style={{ color: "#d32f2f" }}>{error}</p>
      </section>
    );
  }

  // Strip language prefix from resourceId for manifest lookup
  let manifestKey = resourceId;
  if (resourceId && languageId && resourceId.startsWith(`${languageId}_`)) {
    manifestKey = resourceId.substring(languageId.length + 1);
  }
  const selectedManifest = manifests[manifestKey];

  // Debug: Log before rendering provider
  console.log("[ScripturePanelRCL] About to render provider with:", {
    usfmContentLength: usfmContent?.length,
    usfmFirst100: usfmContent?.substring(0, 100),
    hasSelectedManifest: !!selectedManifest,
    manifestKey,
    selectedManifest,
  });

  return (
    <section data-testid='scripture-panel-rcl' style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
        <button
          onClick={() => setShowSearch(!showSearch)}
          style={{
            padding: "6px 12px",
            background: showSearch ? "#007bff" : "#f8f9fa",
            color: showSearch ? "white" : "#333",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {showSearch ? "Hide Search" : "Search Scripture"}
        </button>
      </div>

      {showSearch && (
        <SearchPanel
          org={organization}
          lang={languageId}
          abbr={reference.bookId ? reference.bookId.toUpperCase() : ""}
          usfm={usfmContent}
          onResultClick={handleVerseClick}
          proskommaHook={proskommaHook}
          importHook={importHook}
        />
      )}

      <USFMRenderer
        org={organization}
        lang={languageId}
        abbr={reference.bookId ? reference.bookId.toUpperCase() : ""}
        usfm={usfmContent}
        chapter={reference.chapter}
        selectedVerse={reference.verse}
        onVerseClick={handleVerseClick}
        proskommaHook={proskommaHook}
        importHook={importHook}
      />
    </section>
  );
}
