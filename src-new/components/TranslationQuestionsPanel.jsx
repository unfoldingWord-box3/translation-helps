/**
 * TranslationQuestionsPanel.jsx
 * tQ entries for comprehension.
 */

import React, { useContext, useEffect, useState } from "react";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { RcLinkContext } from "./MainView";
import { ReferenceContext } from "../context/ReferenceContext";
import { getQuestionsForVerse } from "../services/tqService";
import { processRcLinks } from "../utils/rcLinkUtils.jsx";

export function TranslationQuestionsPanel({ reference }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);
  const { handleRcLinkClick } = useContext(RcLinkContext) || {};
  const { organization, languageId } = useContext(ReferenceContext);

  useEffect(() => {
    async function loadQuestions() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        console.log("tQ: Missing reference data", reference);
        setQuestions([]);
        setError(null); // Clear any previous errors
        return;
      }

      // Check if we have required context
      if (!organization || !languageId) {
        if (!organization) {
          setError(
            "Please select an organization from the dropdown above to view translation questions."
          );
        } else if (!languageId) {
          setError(
            "Please select a language from the dropdown above to view translation questions."
          );
        }
        setQuestions([]);
        return;
      }

      console.log("tQ: Loading questions for", reference);
      setLoading(true);
      setError(null);

      try {
        // Try to get custom file path from manifest if available
        let customFilePath = null;
        const tqManifest = manifests.tq;

        if (tqManifest) {
          const project = tqManifest.projects?.find((p) => p.identifier === reference.bookId);
          if (project && project.path) {
            customFilePath = project.path.replace("./", "");
            console.log(`tQ: Using manifest file path: ${customFilePath}`);
          } else {
            console.log(`tQ: Book ${reference.bookId} not found in manifest, using default naming`);
          }
        } else {
          console.log("tQ: Manifest not loaded, using default naming");
        }

        // Use the tqService to load questions
        const loadedQuestions = await getQuestionsForVerse(
          reference.bookId,
          reference.chapter,
          reference.verse,
          organization || "unfoldingWord",
          languageId || "en",
          customFilePath
        );

        console.log(`tQ: Loaded ${loadedQuestions.length} questions`);
        setQuestions(loadedQuestions);
      } catch (err) {
        console.error("Error loading translation questions:", err);
        // Provide more user-friendly error messages
        if (err.message.includes("Not Found") || err.message.includes("404")) {
          setError(
            `Translation questions are not available for ${reference.bookId.toUpperCase()} ${
              reference.chapter
            }:${
              reference.verse
            } in the selected language/organization. Try selecting a different verse or language.`
          );
        } else {
          setError(`Failed to load translation questions: ${err.message}`);
        }
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [reference, manifests.tq]);

  if (!reference?.verse) {
    return (
      <section data-testid='translation-questions-panel'>
        <p>Select a verse to view translation questions.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section data-testid='translation-questions-panel'>
        <p>Loading translation questions...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid='translation-questions-panel'>
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  return (
    <section data-testid='translation-questions-panel'>
      <h3>Translation Questions</h3>
      {questions.length === 0 ? (
        <p>No translation questions available for this verse.</p>
      ) : (
        <div>
          {questions.map((qa) => (
            <div
              key={qa.id}
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "8px", color: "#1976d2" }}>
                Q:{" "}
                {processRcLinks(qa.question, (rcUri) => {
                  if (handleRcLinkClick) {
                    handleRcLinkClick(rcUri, languageId, organization);
                  }
                })}
              </p>
              <p style={{ marginLeft: "16px" }}>
                A:{" "}
                {processRcLinks(qa.answer, (rcUri) => {
                  if (handleRcLinkClick) {
                    handleRcLinkClick(rcUri, languageId, organization);
                  }
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
