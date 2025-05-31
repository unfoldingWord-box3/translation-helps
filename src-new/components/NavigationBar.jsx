/**
 * NavigationBar.jsx
 * Book/chapter/verse selectors.
 */

import React, { useContext } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';

export function NavigationBar() {
  const { reference, setReference } = useContext(ReferenceContext);

  const update = field => e => {
    setReference({ ...reference, [field]: e.target.value });
  };

  return (
    <nav>
      <input
        placeholder="Book"
        value={reference.bookId}
        onChange={update('bookId')}
        data-testid="book-input"
      />
      <input
        placeholder="Chapter"
        type="number"
        value={reference.chapter}
        onChange={update('chapter')}
        data-testid="chapter-input"
      />
      <input
        placeholder="Verse"
        type="number"
        value={reference.verse}
        onChange={update('verse')}
        data-testid="verse-input"
      />
    </nav>
  );
}