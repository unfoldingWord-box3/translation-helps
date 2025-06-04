/**
 * ScripturePanel.jsx
 * Responsible for displaying scripture text aligned with the selected verse.
 */
import React, { useState, useEffect, useContext } from "react";
import { ReferenceContext } from "../context/ReferenceContext";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { fetchBook } from "../services/scriptureService";
import { getChapter, extractVersesFromChapter } from "../utils/usfmParser";

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export function ScripturePanel({ reference, onVerseClick }) {
  const [chapterText, setChapterText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { organization, languageId, resourceId, updateReference } = useContext(ReferenceContext);
  const { manifests, isLoading: manifestsLoading } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadChapter() {
      // Clear previous content and errors when any context changes
      setChapterText([]);
      setError(null);

      // Don't attempt to load if we don't have required context
      if (!reference?.bookId || !reference.chapter || !organization || !languageId) {
        console.log("📋 ScripturePanel: Missing required context", {
          bookId: reference?.bookId,
          chapter: reference?.chapter,
          organization,
          languageId,
        });
        return;
      }

      // Don't attempt to load if manifests are still loading
      if (manifestsLoading) {
        console.log("⏳ ScripturePanel: Waiting for manifests to load");
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
          `📋 ScripturePanel: ${selectedResourceId.toUpperCase()} manifest not available`
        );
        setError(
          `Resource ${selectedResourceId.toUpperCase()} not available for ${organization}/${languageId}`
        );
        return;
      }

      setLoading(true);
      const { bookId, chapter } = reference;

      try {
        console.log(
          `📖 ScripturePanel: Loading ${bookId} chapter ${chapter} from ${selectedResourceId}`
        );

        // Fetch and parse the book using the scripture service
        const chapters = await fetchBook({
          languageId,
          resourceId: selectedResourceId,
          bookId,
          manifest: selectedManifest,
          organization,
        });

        if (!chapters) {
          throw new Error(`Failed to fetch book ${bookId}`);
        }

        // Get the specific chapter
        const chapterData = chapters[String(chapter)];
        if (!chapterData) {
          setError(`Chapter ${chapter} not found in book ${bookId}`);
          setChapterText([]);
          return;
        }

        // Extract verses from the chapter
        const verses = extractVersesFromChapter(chapterData);
        console.log(
          `✅ ScripturePanel: Found ${verses.length} verses in ${bookId} chapter ${chapter}`
        );
        setChapterText(verses);
        setError(null);
      } catch (e) {
        console.error("❌ ScripturePanel: Failed to load chapter:", e);
        setError(`Failed to load chapter: ${e.message}`);
        setChapterText([]);
      } finally {
        setLoading(false);
      }
    }

    loadChapter();
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
      <section data-testid='scripture-panel' style={{ padding: "20px" }}>
        <h2>Scripture</h2>
        <p>Loading scripture...</p>
      </section>
    );
  }

  // Show message if no reference is selected
  if (!reference?.bookId) {
    return (
      <section data-testid='scripture-panel' style={{ padding: "20px" }}>
        <h2>Scripture</h2>
        <p>Please select a book and chapter to view scripture.</p>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section data-testid='scripture-panel' style={{ padding: "20px" }}>
        <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
        <p style={{ color: "#d32f2f" }}>{error}</p>
      </section>
    );
  }

  return (
    <section data-testid='scripture-panel' style={{ padding: "20px" }}>
      <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
      <div className='verses-container'>
        {chapterText.length === 0 ? (
          <p>No verses available for this chapter.</p>
        ) : (
          chapterText.map(({ verse, text }) => (
            <div
              key={verse}
              className='verse'
              onClick={() => handleVerseClick(verse)}
              style={{
                padding: "8px",
                margin: "4px 0",
                cursor: "pointer",
                backgroundColor: reference.verse === verse ? "#e3f2fd" : "transparent",
                borderLeft:
                  reference.verse === verse ? "4px solid #1976d2" : "4px solid transparent",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (reference.verse !== verse) {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (reference.verse !== verse) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <strong style={{ marginRight: "8px", color: "#666" }}>{verse}</strong>
              <span>{text}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
