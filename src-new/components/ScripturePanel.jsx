/**
 * ScripturePanel.jsx
 * Responsible for displaying scripture text aligned with the selected verse.
 */
import React, { useState, useEffect, useContext } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';
import { ManifestsContext } from '../context/MultiManifestsContext';
import { fetchResourceFile } from '../services/dcsClient';

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export function ScripturePanel({ reference, onVerseClick }) {
  const [chapterText, setChapterText] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateReference } = useContext(ReferenceContext);
  const { manifests } = useContext(ManifestsContext);

  useEffect(() => {
    async function loadChapter() {
      if (!reference?.bookId || !reference.chapter) return;
      
      const ultManifest = manifests.ult;
      if (!ultManifest) {
        console.log('ULT manifest not loaded yet');
        return;
      }
      
      setLoading(true);
      const { bookId, chapter } = reference;
      
      try {
        // Find the project for this book in the manifest
        const project = ultManifest.projects?.find(p => p.identifier === bookId);
        if (!project) {
          throw new Error(`Book ${bookId} not found in ULT manifest`);
        }
        
        // Get the USFM file path from the manifest
        const filePath = project.path?.replace('./', '');
        if (!filePath) {
          throw new Error(`No file path found for ${bookId} in manifest`);
        }
        
        // Fetch the USFM content using the manifest path
        const usfm = await fetchResourceFile('en', 'ult', filePath);
        
        // Parse chapter text
        const chapterRegex = new RegExp(`\\\\c ${chapter}\\s([\\s\\S]*?)(?=\\\\c|$)`);
        const chapterMatch = usfm.match(chapterRegex);
        
        if (chapterMatch) {
          const chapterContent = chapterMatch[1];
          const verseRegex = /\\v\s+(\d+)\s+([^\\]+)/g;
          const verses = [];
          let match;
          
          while ((match = verseRegex.exec(chapterContent)) !== null) {
            verses.push({
              verse: match[1],
              text: match[2].trim()
            });
          }
          
          setChapterText(verses);
        } else {
          setChapterText([]);
        }
      } catch (e) {
        console.error('Failed to load chapter:', e);
        setChapterText([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadChapter();
  }, [reference?.bookId, reference?.chapter, manifests.ult]);

  const handleVerseClick = (verseNum) => {
    updateReference({ verse: verseNum });
    if (onVerseClick) {
      onVerseClick(verseNum);
    }
  };

  if (!reference?.bookId) {
    return (
      <section data-testid="scripture-panel" style={{ padding: '20px' }}>
        <p>Please select a book and chapter to view scripture.</p>
      </section>
    );
  }

  return (
    <section data-testid="scripture-panel" style={{ padding: '20px' }}>
      <h2>{`${reference.bookId.toUpperCase()} ${reference.chapter}`}</h2>
      
      {loading ? (
        <p>Loading scripture...</p>
      ) : (
        <div className="verses-container">
          {chapterText.length === 0 ? (
            <p>No verses available for this chapter.</p>
          ) : (
            chapterText.map(({ verse, text }) => (
              <div
                key={verse}
                className="verse"
                onClick={() => handleVerseClick(verse)}
                style={{
                  padding: '8px',
                  margin: '4px 0',
                  cursor: 'pointer',
                  backgroundColor: reference.verse === verse ? '#e3f2fd' : 'transparent',
                  borderLeft: reference.verse === verse ? '4px solid #1976d2' : '4px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (reference.verse !== verse) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (reference.verse !== verse) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <strong style={{ marginRight: '8px', color: '#666' }}>{verse}</strong>
                <span>{text}</span>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}