/**
 * VerseView.jsx
 * Wrapper for content per verse.
 */

import React, { useContext } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';

export function VerseView() {
  const { reference } = useContext(ReferenceContext);
  return (
    <div data-testid="verse-view">
      {reference.bookId}:{reference.chapter}:{reference.verse}
    </div>
  );
}