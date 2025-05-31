/**
 * TranslationNotesPanel.jsx
 * Table of tN entries.
 */

import React, { useContext, useEffect, useState } from 'react';
import { ManifestsContext } from '../context/MultiManifestsContext';
import { fetchResourceFile } from '../services/dcsClient';
import { parseTsv } from '../utils/parseTsv';

export function TranslationNotesPanel({ reference }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadNotes() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setNotes([]);
        return;
      }

      const tnManifest = manifests.tn;
      if (!tnManifest) {
        console.log('tN manifest not loaded yet');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Find the project for this book in the manifest
        const project = tnManifest.projects?.find(p => p.identifier === reference.bookId);
        if (!project) {
          throw new Error(`Book ${reference.bookId} not found in tN manifest`);
        }
        
        // Get the TSV file path from the manifest
        const filePath = project.path?.replace('./', '');
        if (!filePath) {
          throw new Error(`No file path found for ${reference.bookId} in manifest`);
        }
        
        // Fetch the TSV content
        const tsvContent = await fetchResourceFile('en', 'tn', filePath);
        
        // Parse the TSV data
        const allNotes = parseTsv(tsvContent);
        
        // Filter notes for the specific chapter and verse
        const verseNotes = allNotes.filter(note => {
          return note.Chapter === reference.chapter && 
                 note.Verse === reference.verse;
        });
        
        // Transform notes into display format
        const parsedNotes = verseNotes.map((note, index) => ({
          id: index,
          text: note.Note || '',
          quote: note.Quote || '',
          occurrence: note.Occurrence || '1'
        })).filter(note => note.text);
        
        setNotes(parsedNotes);
      } catch (err) {
        console.error('Error loading translation notes:', err);
        setError('Failed to load translation notes');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [reference, manifests.tn]);

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