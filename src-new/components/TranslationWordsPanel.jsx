/**
 * TranslationWordsPanel.jsx
 * Responsible for displaying linked translation words articles from TWL.
 */
import React, { useContext, useEffect, useState } from "react";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { RcLinkContext } from "./MainView";
import { getLinksForVerse } from "../services/twlService";
import { getArticlesForLinks } from "../services/twService";
import { processRcLinks, RcLink } from "../utils/rcLinkUtils.jsx";

/**
 * Extracts a summary from article content (first sentence or paragraph)
 * @param {string} content - Article content
 * @returns {string} Summary text
 */
function extractSummary(content) {
  if (!content) return "";

  // Find first definition section or paragraph
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and headers
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Return first meaningful sentence/paragraph
    if (trimmed.length > 20) {
      return trimmed.split(".")[0] + ".";
    }
  }

  return content.substring(0, 150) + (content.length > 150 ? "..." : "");
}

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 * @param {function} props.onWordClick - Optional callback when a word is clicked for navigation
 */
export function TranslationWordsPanel({ reference, onWordClick }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [twlLinks, setTwlLinks] = useState([]);
  const { manifests } = useContext(ManifestsContext);
  const { handleRcLinkClick } = useContext(RcLinkContext) || {};

  useEffect(() => {
    async function loadWords() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setWords([]);
        setTwlLinks([]);
        return;
      }

      const twlManifest = manifests.twl;
      if (!twlManifest) {
        console.log("TWL manifest not loaded yet");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Step 1: Get TWL links for this verse
        const links = await getLinksForVerse(
          reference.bookId,
          reference.chapter,
          reference.verse,
          twlManifest
        );

        setTwlLinks(links);

        if (links && links.length > 0) {
          // Step 2: Fetch tW articles for the links
          const articles = await getArticlesForLinks(links);

          // Step 3: Transform articles into display format
          const wordsData = articles.map((article, index) => ({
            id: article.rcUri || `article-${index}`,
            title: article.title,
            content: article.content,
            rcUri: article.rcUri,
            summary: extractSummary(article.content),
            error: article.error,
          }));

          setWords(wordsData);
        } else {
          setWords([]);
        }
      } catch (err) {
        console.error("Error loading translation words:", err);
        setError("Failed to load translation words");
        setWords([]);
      } finally {
        setLoading(false);
      }
    }

    loadWords();
  }, [reference, manifests.twl]);

  const handleWordClick = (word) => {
    // First try the provided callback
    if (onWordClick) {
      onWordClick(word);
      return;
    }

    // If no callback provided, and we have the rc link context, open as new tab
    if (handleRcLinkClick && word.rcUri) {
      handleRcLinkClick(word.rcUri);
    }
  };

  if (!reference?.verse) {
    return (
      <section data-testid='translation-words-panel'>
        <p>Select a verse to view translation words.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section data-testid='translation-words-panel'>
        <p>Loading translation words...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid='translation-words-panel'>
        <p style={{ color: "red" }}>{error}</p>
        {twlLinks.length > 0 && (
          <details style={{ marginTop: "8px", fontSize: "0.9em", color: "#666" }}>
            <summary>Debug Info</summary>
            <p>Found {twlLinks.length} TWL link(s) for this verse:</p>
            <ul>
              {twlLinks.map((link, index) => (
                <li key={index} style={{ wordBreak: "break-all" }}>
                  {link}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    );
  }

  return (
    <section data-testid='translation-words-panel'>
      <h3>Translation Words</h3>
      {words.length === 0 ? (
        <div>
          <p>No translation words available for this verse.</p>
          {twlLinks.length > 0 && (
            <details style={{ marginTop: "8px", fontSize: "0.9em", color: "#666" }}>
              <summary>Debug Info</summary>
              <p>Found {twlLinks.length} TWL link(s) but no articles loaded.</p>
            </details>
          )}
        </div>
      ) : (
        <div>
          {words.map((word) => (
            <div
              key={word.id}
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                cursor: onWordClick || (handleRcLinkClick && word.rcUri) ? "pointer" : "default",
              }}
              onClick={() => handleWordClick(word)}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#1976d2",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {word.title}
                {(onWordClick || (handleRcLinkClick && word.rcUri)) && (
                  <span
                    style={{
                      fontSize: "0.8em",
                      color: "#666",
                      fontWeight: "normal",
                    }}
                  >
                    Click to view full article →
                  </span>
                )}
              </h4>

              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#333",
                  lineHeight: "1.4",
                }}
              >
                {processRcLinks(word.summary, handleRcLinkClick)}
              </p>

              {word.rcUri && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8em",
                    color: "#666",
                  }}
                >
                  <RcLink rcUri={word.rcUri} onRcLinkClick={handleRcLinkClick}>
                    {word.rcUri}
                  </RcLink>
                </p>
              )}
            </div>
          ))}

          <div
            style={{
              marginTop: "16px",
              padding: "8px",
              backgroundColor: "#f0f7ff",
              borderRadius: "4px",
              fontSize: "0.9em",
            }}
          >
            <p style={{ margin: 0, color: "#0066cc" }}>
              💡 <strong>Tip:</strong> These words are linked to this verse through Translation
              Words Links (TWL).
              {(onWordClick || handleRcLinkClick) &&
                " Click any word above to view the complete article."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
