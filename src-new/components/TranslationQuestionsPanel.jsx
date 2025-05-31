/**
 * TranslationQuestionsPanel.jsx
 * tQ entries for comprehension.
 */

import React, { useContext, useEffect, useState } from "react";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { getQuestionsForVerse } from "../services/tqService";

export function TranslationQuestionsPanel({ reference }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadQuestions() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        console.log("tQ: Missing reference data", reference);
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
          customFilePath
        );

        console.log(`tQ: Loaded ${loadedQuestions.length} questions`);
        setQuestions(loadedQuestions);
      } catch (err) {
        console.error("Error loading translation questions:", err);
        setError(`Failed to load translation questions: ${err.message}`);
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
                Q: {qa.question}
              </p>
              <p style={{ marginLeft: "16px" }}>A: {qa.answer}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
