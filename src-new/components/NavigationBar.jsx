/**
 * NavigationBar.jsx
 * Application header with title and reference display
 */

import React, { useContext } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';
import { AVAILABLE_BOOKS } from '../utils/defaultReference';

export function NavigationBar() {
  const { reference } = useContext(ReferenceContext);
  
  const currentBook = AVAILABLE_BOOKS.find(book => book.id === reference.bookId);

  return (
    <nav style={{
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>Translation Helps Viewer</h1>
      
      <div style={{ 
        fontSize: '16px',
        fontWeight: '500'
      }}>
        {currentBook && reference.chapter && reference.verse && (
          <span>
            {currentBook.name} {reference.chapter}:{reference.verse}
          </span>
        )}
      </div>
    </nav>
  );
}