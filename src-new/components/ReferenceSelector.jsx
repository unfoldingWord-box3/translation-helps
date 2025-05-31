/**
 * ReferenceSelector.jsx
 * Component for selecting Bible reference (book, chapter, verse)
 */

import React, { useContext, useState, useEffect } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';
import { AVAILABLE_BOOKS } from '../utils/defaultReference';

export function ReferenceSelector() {
  const { reference, updateReference } = useContext(ReferenceContext);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);

  // Book chapter counts (simplified - in production this would come from a data source)
  const CHAPTER_COUNTS = {
    gen: 50, exo: 40, lev: 27, num: 36, deu: 34, jos: 24, jdg: 21, rut: 4,
    '1sa': 31, '2sa': 24, '1ki': 22, '2ki': 25, '1ch': 29, '2ch': 36,
    ezr: 10, neh: 13, est: 10, job: 42, psa: 150, pro: 31, ecc: 12, sng: 8,
    isa: 66, jer: 52, lam: 5, ezk: 48, dan: 12, hos: 14, jol: 3, amo: 9,
    oba: 1, jon: 4, mic: 7, nam: 3, hab: 3, zep: 3, hag: 2, zec: 14, mal: 4,
    mat: 28, mrk: 16, luk: 24, jhn: 21, act: 28, rom: 16, '1co': 16, '2co': 13,
    gal: 6, eph: 6, php: 4, col: 4, '1th': 5, '2th': 3, '1ti': 6, '2ti': 4,
    tit: 3, phm: 1, heb: 13, jas: 5, '1pe': 5, '2pe': 3, '1jn': 5, '2jn': 1,
    '3jn': 1, jud: 1, rev: 22
  };

  // Update chapters when book changes
  useEffect(() => {
    if (reference.bookId && CHAPTER_COUNTS[reference.bookId]) {
      const chapterCount = CHAPTER_COUNTS[reference.bookId];
      const chapterList = Array.from({ length: chapterCount }, (_, i) => i + 1);
      setChapters(chapterList);
    }
  }, [reference.bookId]);

  // Update verses when chapter changes (simplified - assumes max 31 verses)
  useEffect(() => {
    if (reference.chapter) {
      // In production, this would be based on actual verse counts per chapter
      const verseCount = 31; // Simplified
      const verseList = Array.from({ length: verseCount }, (_, i) => i + 1);
      setVerses(verseList);
    }
  }, [reference.chapter]);

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    updateReference({ bookId, chapter: '1', verse: '1' });
  };

  const handleChapterChange = (e) => {
    const chapter = e.target.value;
    updateReference({ chapter, verse: '1' });
  };

  const handleVerseChange = (e) => {
    const verse = e.target.value;
    updateReference({ verse });
  };

  return (
    <div className="reference-selector" data-testid="reference-selector" style={{
      display: 'flex',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      alignItems: 'center'
    }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Book</span>
        <select
          value={reference.bookId}
          onChange={handleBookChange}
          data-testid="book-selector"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            fontSize: '14px'
          }}
        >
          {AVAILABLE_BOOKS.map(book => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Chapter</span>
        <select
          value={reference.chapter}
          onChange={handleChapterChange}
          data-testid="chapter-selector"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            fontSize: '14px',
            minWidth: '80px'
          }}
        >
          {chapters.map(ch => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Verse</span>
        <select
          value={reference.verse}
          onChange={handleVerseChange}
          data-testid="verse-selector"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            fontSize: '14px',
            minWidth: '80px'
          }}
        >
          {verses.map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#666' }}>
        {reference.bookId.toUpperCase()} {reference.chapter}:{reference.verse}
      </div>
    </div>
  );
}