/**
 * TranslationNotesPanel.jsx
 * Table of tN entries.
 */

import React, { useContext, useEffect, useState } from "react";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { RcLinkContext } from "./MainView";
import { ReferenceContext } from "../context/ReferenceContext";
import { getNotesForVerse } from "../services/tnService";
import { processMarkdownWithRcLinks } from "../utils/markdownUtils.jsx";

export function TranslationNotesPanel({ reference }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);
  const { handleRcLinkClick } = useContext(RcLinkContext) || {};
  const { organization, languageId } = useContext(ReferenceContext);

  useEffect(() => {
    async function loadNotes() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setNotes([]);
        setError(null); // Clear any previous errors
        return;
      }

      // Check if we have required context
      if (!organization || !languageId) {
        if (!organization) {
          setError(
            "Please select an organization from the dropdown above to view translation notes."
          );
        } else if (!languageId) {
          setError("Please select a language from the dropdown above to view translation notes.");
        }
        setNotes([]);
        return;
      }

      const tnManifest = manifests.tn;
      if (!tnManifest) {
        console.log("tN manifest not loaded yet");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use the updated tnService with organization and language context
        const parsedNotes = await getNotesForVerse(
          reference.bookId,
          reference.chapter,
          reference.verse,
          organization || "unfoldingWord",
          languageId || "en"
        );

        setNotes(parsedNotes);
      } catch (err) {
        console.error("Error loading translation notes:", err);
        // Provide more user-friendly error messages
        if (err.message.includes("Not Found") || err.message.includes("404")) {
          setError(
            `Translation notes are not available for ${reference.bookId.toUpperCase()} ${
              reference.chapter
            }:${
              reference.verse
            } in the selected language/organization. Try selecting a different verse or language.`
          );
        } else {
          setError("Failed to load translation notes");
        }
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [reference, manifests.tn]);

  if (!reference?.verse) {
    return (
      <section data-testid='translation-notes-panel'>
        <p>Select a verse to view translation notes.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section data-testid='translation-notes-panel'>
        <p>Loading translation notes...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid='translation-notes-panel'>
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  return (
    <section data-testid='translation-notes-panel'>
      <h3>Translation Notes</h3>
      {notes.length === 0 ? (
        <p>No translation notes available for this verse.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                borderLeft: "4px solid #1976d2",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {note.quote && (
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#1565c0",
                    marginBottom: "8px",
                    fontFamily: "monospace",
                    backgroundColor: "#e3f2fd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  "{note.quote}"
                  {note.occurrence && note.occurrence !== "1" && (
                    <span style={{ fontSize: "12px", opacity: 0.8 }}>
                      {" "}
                      (occurrence {note.occurrence})
                    </span>
                  )}
                </div>
              )}
              <div style={{ lineHeight: "1.5", color: "#333" }}>
                {processMarkdownWithRcLinks(note.text, (rcUri) => {
                  if (handleRcLinkClick) {
                    handleRcLinkClick(rcUri, languageId, organization);
                  }
                })}
              </div>
              {note.tags && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  Tags: {note.tags}
                </div>
              )}
              {note.supportReference && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  See also:{" "}
                  {processMarkdownWithRcLinks(note.supportReference, (rcUri) => {
                    if (handleRcLinkClick) {
                      handleRcLinkClick(rcUri, languageId, organization);
                    }
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
