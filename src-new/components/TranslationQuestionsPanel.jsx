/**
 * TranslationQuestionsPanel.jsx
 * tQ entries for comprehension.
 */

import React, { useEffect, useState } from 'react';

export function TranslationQuestionsPanel({ reference }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setQuestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch translation questions from DCS
        const url = `https://git.door43.org/unfoldingWord/en_tq/raw/branch/master/${reference.bookId}/${reference.chapter?.padStart(2, '0')}.md`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to load translation questions');
        }

        const content = await response.text();
        
        // Parse the markdown to extract Q&A pairs for the verse
        const verseSection = new RegExp(`^#+\\s*${reference.verse}\\s*$([\\s\\S]*?)(?=^#+\\s*\\d+\\s*$|$)`, 'gm');
        const match = content.match(verseSection);
        
        if (match && match[1]) {
          // Extract Q&A pairs
          const qaRegex = /^#+\s*(.+?)\s*\n+(.+?)$/gm;
          const qaMatches = [...match[1].matchAll(qaRegex)];
          
          const parsedQuestions = qaMatches.map((qa, index) => ({
            id: index,
            question: qa[1].trim(),
            answer: qa[2].trim()
          }));
          
          setQuestions(parsedQuestions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error('Error loading translation questions:', err);
        setError('Failed to load translation questions');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [reference]);

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