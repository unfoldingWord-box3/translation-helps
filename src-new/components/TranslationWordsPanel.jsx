/**
 * TranslationWordsPanel.jsx
 * Responsible for displaying linked translation words articles from TWL.
 */
import React, { useEffect, useState } from 'react';

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 */
export function TranslationWordsPanel({ reference }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWords() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setWords([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // For now, we'll show a placeholder since tW integration requires more complex parsing
        // In a full implementation, this would fetch and parse tW articles based on the verse content
        setWords([
          {
            id: 'placeholder',
            title: 'Translation Words',
            content: 'Translation Words integration is being implemented. This will show relevant word articles based on the selected verse.'
          }
        ]);
      } catch (err) {
        console.error('Error loading translation words:', err);
        setError('Failed to load translation words');
        setWords([]);
      } finally {
        setLoading(false);
      }
    }

    loadWords();
  }, [reference]);

  if (!reference?.verse) {
    return (
      <section data-testid="translation-words-panel">
        <p>Select a verse to view translation words.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section data-testid="translation-words-panel">
        <p>Loading translation words...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid="translation-words-panel">
        <p style={{ color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section data-testid="translation-words-panel">
      <h3>Translation Words</h3>
      {words.length === 0 ? (
        <p>No translation words available for this verse.</p>
      ) : (
        <div>
          {words.map((word) => (
            <div key={word.id} style={{ 
              marginBottom: '16px', 
              padding: '12px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>{word.title}</h4>
              <p style={{ margin: 0 }}>{word.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}