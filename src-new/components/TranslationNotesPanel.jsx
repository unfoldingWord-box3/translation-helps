/**
 * TranslationNotesPanel.jsx
 * Table of tN entries.
 */

import React, { useContext, useEffect, useState } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';

export function TranslationNotesPanel({ reference }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNotes() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setNotes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch translation notes from DCS
        const url = `https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/${reference.bookId}/${reference.chapter?.padStart(2, '0')}.md`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to load translation notes');
        }

        const content = await response.text();
        
        // Parse the markdown content to extract notes for the specific verse
        const verseSection = new RegExp(`^#+\\s*${reference.verse}\\s*$([\\s\\S]*?)(?=^#+\\s*\\d+\\s*$|$)`, 'gm');
        const match = content.match(verseSection);
        
        if (match && match[1]) {
          // Extract individual notes from the verse section
          const noteLines = match[1].trim().split('\n').filter(line => line.trim());
          const parsedNotes = noteLines.map((line, index) => ({
            id: index,
            text: line.replace(/^[-*]\s*/, '').trim()
          })).filter(note => note.text);
          
          setNotes(parsedNotes);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.error('Error loading translation notes:', err);
        setError('Failed to load translation notes');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [reference]);

  if (!reference?.verse) {
    return (
      <section data-testid="translation-notes-panel">
        <p>Select a verse to view translation notes.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section data-testid="translation-notes-panel">
        <p>Loading translation notes...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid="translation-notes-panel">
        <p style={{ color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section data-testid="translation-notes-panel">
      <h3>Translation Notes</h3>
      {notes.length === 0 ? (
        <p>No translation notes available for this verse.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map((note) => (
            <li key={note.id} style={{ 
              marginBottom: '12px', 
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              borderLeft: '4px solid #1976d2'
            }}>
              {note.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}