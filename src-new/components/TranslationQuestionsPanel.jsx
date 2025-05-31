/**
 * TranslationQuestionsPanel.jsx
 * tQ entries for comprehension.
 */

import React, { useContext, useEffect, useState } from 'react';
import { ManifestsContext } from '../context/MultiManifestsContext';
import { fetchResourceFile } from '../services/dcsClient';
import { parseTsv } from '../utils/parseTsv';

export function TranslationQuestionsPanel({ reference }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadQuestions() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setQuestions([]);
        return;
      }

      const tqManifest = manifests.tq;
      if (!tqManifest) {
        console.log('tQ manifest not loaded yet');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Find the project for this book in the manifest
        const project = tqManifest.projects?.find(p => p.identifier === reference.bookId);
        if (!project) {
          throw new Error(`Book ${reference.bookId} not found in tQ manifest`);
        }
        
        // Get the TSV file path from the manifest
        const filePath = project.path?.replace('./', '');
        if (!filePath) {
          throw new Error(`No file path found for ${reference.bookId} in manifest`);
        }
        
        // Fetch the TSV content
        const tsvContent = await fetchResourceFile('en', 'tq', filePath);
        
        // Parse the TSV data
        const allQuestions = parseTsv(tsvContent);
        
        // Filter questions for the specific chapter and verse
        const verseQuestions = allQuestions.filter(q => {
          return q.Chapter === reference.chapter && 
                 q.Verse === reference.verse;
        });
        
        // Transform questions into display format
        const parsedQuestions = verseQuestions.map((q, index) => ({
          id: index,
          question: q.Question || '',
          answer: q.Response || q.Answer || ''
        })).filter(q => q.question);
        
        setQuestions(parsedQuestions);
      } catch (err) {
        console.error('Error loading translation questions:', err);
        setError('Failed to load translation questions');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [reference, manifests.tq]);

  if (!reference?.verse) {
    return (
      <section data-testid="translation-questions-panel">
        <p>Select a verse to view translation questions.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section data-testid="translation-questions-panel">
        <p>Loading translation questions...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid="translation-questions-panel">
        <p style={{ color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section data-testid="translation-questions-panel">
      <h3>Translation Questions</h3>
      {questions.length === 0 ? (
        <p>No translation questions available for this verse.</p>
      ) : (
        <div>
          {questions.map((qa) => (
            <div key={qa.id} style={{ 
              marginBottom: '16px', 
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1976d2' }}>
                Q: {qa.question}
              </p>
              <p style={{ marginLeft: '16px' }}>
                A: {qa.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}