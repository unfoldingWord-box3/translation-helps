/**
 * ScripturePanelRCL.jsx
 * Enhanced scripture panel using simple-text-editor-rcl for rich USFM rendering
 */
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { ManifestsContext } from "../../context/MultiManifestsContext";
import { fetchBook } from "../../services/scriptureService";
import { useCatalog } from "proskomma-react-hooks";

import USFMRenderer from "./USFMRenderer";
import SearchPanel from "./SearchPanel";
import styles from "./ScripturePanelRCL.module.css";

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
  const [fetchTimeout, setFetchTimeout] = useState(null);
  const { organization, languageId, resourceId, updateReference } = useContext(ReferenceContext);
  const { manifests, isLoading: manifestsLoading } = useContext(ManifestsContext);

  // Timeout constants
  const FETCH_TIMEOUT = 10000; // 10 seconds for fetching book content

  // Check what's already imported to prevent duplicate imports
  const catalogHook = useCatalog({
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

  // Debug: Log render
  console.log("[ScripturePanelRCL] Rendering with:", {
    reference,
    organization,
    languageId,
    resourceId,
    manifestsLoading,
    hasManifests: !!manifests,
    usfmContentLength: usfmContent?.length,
    isBookAlreadyImported,
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
    };
  }, [fetchTimeout]);

  useEffect(() => {
    async function loadUSFMChapter() {
      // Clear any existing timeout
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
        setFetchTimeout(null);
      }
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
      if (isBookAlreadyImported) {
        console.log("📚 Book already imported, skipping fetch");
        setError(null);
        setLoading(false);
        return;
      }

      // Clear previous content and errors when we need to load new content
      setUsfmContent("");
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
          `📋 ScripturePanelRCL: ${
            selectedResourceId?.toUpperCase() || "Unknown"
          } manifest not available`
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

      // Create an AbortController for the fetch operation
      const abortController = new AbortController();

      // Set up timeout for fetch operation
      const timeoutId = setTimeout(() => {
        abortController.abort();
        setError(
          `Loading scripture timed out after ${FETCH_TIMEOUT / 1000} seconds. Please try again.`
        );
        setLoading(false);
      }, FETCH_TIMEOUT);

      setFetchTimeout(timeoutId);

      try {
        console.log(
          `📖 ScripturePanelRCL: Loading ${bookId} chapter ${chapter} from ${selectedResourceId}`
        );

        // Fetch raw USFM content with timeout protection
        const fetchPromise = fetchBook({
          languageId,
          resourceId: selectedResourceId,
          bookId,
          manifest: selectedManifest,
          organization,
          signal: abortController.signal, // Pass abort signal if supported
        });

        // Race between fetch and timeout
        const rawUSFM = await Promise.race([
          fetchPromise,
          new Promise((_, reject) => {
            abortController.signal.addEventListener("abort", () => {
              reject(new Error("Fetch aborted due to timeout"));
            });
          }),
        ]);

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
        // Don't override timeout error if it's already set
        if (!error || !error.includes("timed out")) {
          setError(`Failed to load chapter: ${e.message}`);
        }
        setUsfmContent("");
      } finally {
        // Clear timeout on completion
        if (fetchTimeout) {
          clearTimeout(fetchTimeout);
          setFetchTimeout(null);
        }
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
      <section data-testid='scripture-panel-rcl' className={styles["scripture-panel"]}>
        <h2 className={styles.title}>Scripture</h2>
        <div className={styles["loading-state"]}>Loading scripture...</div>
      </section>
    );
  }

  // Show message if no reference is selected
  if (!reference?.bookId) {
    return (
      <section data-testid='scripture-panel-rcl' className={styles["scripture-panel"]}>
        <h2 className={styles.title}>Scripture</h2>
        <div className={styles["empty-state"]}>
          Please select a book and chapter to view scripture.
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section data-testid='scripture-panel-rcl' className={styles["scripture-panel"]}>
        <h2 className={styles.title}>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
        <div className={styles["error-state"]}>{error}</div>
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
    <section data-testid='scripture-panel-rcl' className={styles["scripture-panel"]}>
      <div className={styles.header}>
        <h2 className={styles.title}>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`${styles["search-toggle"]} ${showSearch ? styles.active : ""}`}
        >
          {showSearch ? "Hide Search" : "Search Scripture"}
        </button>
      </div>

      {showSearch && (
        <div className={styles["search-panel"]}>
          <SearchPanel
            org={organization}
            lang={languageId}
            abbr={reference.bookId ? reference.bookId.toUpperCase() : ""}
            usfm={usfmContent}
            onResultClick={handleVerseClick}
          />
        </div>
      )}

      <USFMRenderer
        org={organization}
        lang={languageId}
        abbr={reference.bookId ? reference.bookId.toUpperCase() : ""}
        usfm={usfmContent}
        chapter={reference.chapter}
        selectedVerse={reference.verse}
        onVerseClick={handleVerseClick}
      />
    </section>
  );
}
