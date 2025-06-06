/**
 * ScripturePanelRCL.jsx
 * Enhanced scripture panel using simple-text-editor-rcl for rich USFM rendering
 */
import React, { useState, useEffect, useContext } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { ManifestsContext } from "../../context/MultiManifestsContext";
import { fetchRawUSFM } from "../../services/scriptureService";
import { simpleWordExtraction } from "../../utils/usfmProcessor";
import USFMRenderer from "./USFMRenderer";

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export default function ScripturePanelRCL({ reference, onVerseClick }) {
  const [usfmContent, setUsfmContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { organization, languageId, resourceId, updateReference } = useContext(ReferenceContext);
  const { manifests, isLoading: manifestsLoading } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadUSFMChapter() {
      // Clear previous content and errors when any context changes
      setUsfmContent("");
      setError(null);

      // Don't attempt to load if we don't have required context
      if (!reference?.bookId || !reference.chapter || !organization || !languageId) {
        console.log("📋 ScripturePanelRCL: Missing required context", {
          bookId: reference?.bookId,
          chapter: reference?.chapter,
          organization,
          languageId,
        });
        // Set helpful guidance message instead of just returning
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

      // Use the selected resource or fallback to 'ult'
      const selectedResourceId = resourceId || "ult";

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
        const rawUSFM = await fetchRawUSFM({
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
        // Process USFM to extract readable text from alignment data
        const processedUSFM = simpleWordExtraction(rawUSFM);
        console.log("📝 Processed USFM length:", processedUSFM.length);
        console.log("📝 Processed first 1000 chars:", processedUSFM.substring(0, 1000));

        setUsfmContent(processedUSFM);
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
  ]);

  const handleVerseClick = (verseNum) => {
    updateReference({ verse: verseNum });
    if (onVerseClick) {
      onVerseClick(verseNum);
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

  return (
    <section data-testid='scripture-panel-rcl' style={{ padding: "20px" }}>
      <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
      <USFMRenderer
        usfm={usfmContent}
        selectedVerse={reference.verse}
        onVerseClick={handleVerseClick}
      />
    </section>
  );
}

/**
 * Extracts a specific chapter from USFM content
 * @param {string} usfm - Full book USFM content
 * @param {number} chapterNum - Chapter number to extract
 * @returns {string} Chapter USFM content
 */
function extractChapterUSFM(usfm, chapterNum) {
  if (!usfm) return "";

  console.log(`🔍 Extracting chapter ${chapterNum} from USFM`);
  const lines = usfm.split("\n");
  const chapterLines = [];
  let inTargetChapter = false;
  let foundChapter = false;
  let chapterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for chapter markers
    if (line.match(/^\\c\s+(\d+)/)) {
      const currentChapter = parseInt(line.match(/^\\c\s+(\d+)/)[1]);
      chapterCount++;

      console.log(`📖 Found chapter marker: \\c ${currentChapter} at line ${i}`);

      if (currentChapter === parseInt(chapterNum)) {
        console.log(`✅ Found target chapter ${chapterNum}!`);
        inTargetChapter = true;
        foundChapter = true;
        chapterLines.push(line);
      } else if (foundChapter) {
        console.log(`🛑 Reached next chapter ${currentChapter}, stopping extraction`);
        // We've moved past our target chapter
        break;
      } else {
        inTargetChapter = false;
      }
    } else if (inTargetChapter) {
      chapterLines.push(line);
    } else if (!foundChapter) {
      // Keep headers and book info before the target chapter
      if (line.match(/^\\(id|usfm|ide|h|toc|mt)/)) {
        chapterLines.push(line);
      }
    }
  }

  console.log(
    `📊 Extraction summary: found ${chapterCount} chapters, target chapter found: ${foundChapter}`
  );
  console.log(
    `📊 Extracted ${chapterLines.length} lines, ${chapterLines.join("\n").length} characters`
  );

  return chapterLines.join("\n");
}
