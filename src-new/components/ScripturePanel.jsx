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
  const { organization, languageId, resourceId, updateReference } = useContext(ReferenceContext);
  const { manifests } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadChapter() {
      if (!reference?.bookId || !reference.chapter) return;

      // Use the selected resource instead of hardcoded 'ult'
      const selectedResourceId = resourceId || "ult"; // Fallback to 'ult' if no resource selected
      const selectedManifest = manifests[selectedResourceId];
      if (!selectedManifest) {
        console.log(`${selectedResourceId.toUpperCase()} manifest not loaded yet`);
        return;
      }

      setLoading(true);
      const { bookId, chapter } = reference;

      try {
        // Fetch and parse the book using the scripture service
        const chapters = await fetchBook({
          languageId: languageId || "en",
          resourceId: selectedResourceId,
          bookId,
          manifest: selectedManifest,
          organization: organization || "unfoldingWord",
        });

        if (!chapters) {
          console.error(`Failed to fetch book ${bookId}`);
          setChapterText([]);
          return;
        }

        // Get the specific chapter
        const chapterData = chapters[String(chapter)];
        if (!chapterData) {
          console.log(`Chapter ${chapter} not found in book ${bookId}`);
          setChapterText([]);
          return;
        }

        // Extract verses from the chapter
        const verses = extractVersesFromChapter(chapterData);
        console.log(`Found ${verses.length} verses in ${bookId} chapter ${chapter}`);
        setChapterText(verses);
      } catch (e) {
        console.error("Failed to load chapter:", e);
        setChapterText([]);
      } finally {
        setLoading(false);
      }
    }

    loadChapter();
  }, [reference?.bookId, reference?.chapter, resourceId, languageId, organization, manifests]);

  const handleVerseClick = (verseNum) => {
    updateReference({ verse: verseNum });
    if (onVerseClick) {
      onVerseClick(verseNum);
    }
  };

  if (!reference?.bookId) {
    return (
      <section data-testid='scripture-panel' style={{ padding: "20px" }}>
        <p>Please select a book and chapter to view scripture.</p>
      </section>
    );
  }

  return (
    <section data-testid='scripture-panel' style={{ padding: "20px" }}>
      <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>

      {loading ? (
        <p>Loading scripture...</p>
      ) : (
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
      )}
    </section>
  );
}
