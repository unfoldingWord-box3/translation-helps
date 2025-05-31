/**
 * TranslationNotesPanel.jsx
 * Table of tN entries.
 */

import React, { useContext } from 'react';
import { ResourcesContext } from '../context/ResourcesContext';

export function TranslationNotesPanel() {
  const { resources } = useContext(ResourcesContext);
  const notes = resources.tn?.data || [];
  if (!notes.length) return null;
  return (
    <section>
      <h3>Translation Notes</h3>
      <ul>
        {notes.map((note, i) => (
          <li key={i}>{note.Note || JSON.stringify(note)}</li>
        ))}
      </ul>
    </section>
  );
}