/**
 * TranslationNotesPanel.jsx
 * Table of tN entries.
 */

import React, { useContext, useEffect, useState } from "react";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { RcLinkContext } from "./MainView";
import { fetchResourceFile } from "../services/dcsClient";
import { parseTsv } from "../utils/parseTsv";
import { processRcLinks } from "../utils/rcLinkUtils.jsx";

export function TranslationNotesPanel({ reference }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);
  const { handleRcLinkClick } = useContext(RcLinkContext) || {};

  useEffect(() => {
    async function loadNotes() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
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
        // Find the project for this book in the manifest
        const project = tnManifest.projects?.find((p) => p.identifier === reference.bookId);
        if (!project) {
          throw new Error(`Book ${reference.bookId} not found in tN manifest`);
        }

        // Get the TSV file path from the manifest
        const filePath = project.path?.replace("./", "");
        if (!filePath) {
          throw new Error(`No file path found for ${reference.bookId} in manifest`);
        }

        // Fetch the TSV content
        const tsvContent = await fetchResourceFile("en", "tn", filePath);

        // Parse the TSV data
        const allNotes = parseTsv(tsvContent);

        // Filter notes for the specific chapter and verse
        // tN TSV format uses Reference field like "1:1" or "gen/1/1"
        const verseNotes = allNotes.filter((note) => {
          if (!note.Reference) return false;

          // Handle different reference formats
          let chapterVerse;
          if (note.Reference.includes("/")) {
            // Format: "gen/1/1" - extract chapter:verse part
            const parts = note.Reference.split("/");
            if (parts.length >= 3) {
              chapterVerse = `${parts[1]}:${parts[2]}`;
            }
          } else {
            // Format: "1:1" - use as is
            chapterVerse = note.Reference;
          }

          const expectedRef = `${reference.chapter}:${reference.verse}`;
          return chapterVerse === expectedRef;
        });

        // Transform notes into display format
        const parsedNotes = verseNotes
          .map((note, index) => ({
            id: index,
            text: note.Note || "",
            quote: note.Quote || "",
            occurrence: note.Occurrence || "1",
            tags: note.Tags || "",
            supportReference: note.SupportReference || "",
          }))
          .filter((note) => note.text);

        setNotes(parsedNotes);
      } catch (err) {
        console.error("Error loading translation notes:", err);
        setError("Failed to load translation notes");
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
                {processRcLinks(note.text, handleRcLinkClick)}
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
                  See also: {processRcLinks(note.supportReference, handleRcLinkClick)}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
