/**
 * ScripturePanel.jsx
 * Responsible for displaying scripture text aligned with the selected verse.
 */
import React, { useState, useEffect } from 'react';

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 */
export function ScripturePanel({ reference }) {
  const [verseText, setVerseText] = useState('');

  useEffect(() => {
    async function loadVerse() {
      if (!reference?.bookId || !reference.chapter || !reference.verse) return;
      const { bookId, verse } = reference;
      const url = `https://git.door43.org/unfoldingWord/en_ult/raw/branch/master/${bookId}.usfm`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load scripture for ${bookId}`);
        }
        const usfm = await res.text();
        const match = usfm.match(new RegExp(`\\\\v ${verse}\\s+(.+)`));
        setVerseText(match ? match[1] : '');
      } catch (e) {
        setVerseText('');
      }
    }
    loadVerse();
  }, [reference]);

  if (!reference?.bookId) {
    return null;
  }

  return (
    <section>
      <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}:${reference.verse}`}</h2>
      <p>{verseText || 'Verse text not available.'}</p>
    </section>
  );
}