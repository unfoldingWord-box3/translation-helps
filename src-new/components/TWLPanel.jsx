/**
 * TWLPanel.jsx
 * Translation Word Links panel
 */

import React, { useState, useEffect, useContext } from 'react';
import { ManifestsContext } from '../context/MultiManifestsContext';
import { fetchResourceFile } from '../services/dcsClient';
import { parseTsv } from '../utils/parseTsv';

export function TWLPanel({ reference }) {
  const [twlData, setTwlData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { manifests } = useContext(ManifestsContext);

  useEffect(() => {
    async function fetchTWL() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        setTwlData([]);
        return;
      }

      const twlManifest = manifests.twl;
      if (!twlManifest) {
        console.log('TWL manifest not loaded yet');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Find the project for this book in the manifest
        const project = twlManifest.projects?.find(p => p.identifier === reference.bookId);
        if (!project) {
          throw new Error(`Book ${reference.bookId} not found in TWL manifest`);
        }
        
        // Get the TSV file path from the manifest
        const filePath = project.path?.replace('./', '');
        if (!filePath) {
          throw new Error(`No file path found for ${reference.bookId} in manifest`);
        }
        
        // Fetch the TSV content
        const tsvContent = await fetchResourceFile('en', 'twl', filePath);
        
        // Parse the TSV data
        const allLinks = parseTsv(tsvContent);
        
        // Filter links for the specific chapter and verse
        const verseLinks = allLinks.filter(link => {
          return link.Chapter === reference.chapter && 
                 link.Verse === reference.verse;
        });
        
        // Transform links into display format
        const parsedLinks = verseLinks.map((link, index) => ({
          id: index,
          word: link.OrigWords || '',
          occurrence: link.Occurrence || '1',
          twLink: link.TWLink || ''
        })).filter(link => link.word && link.twLink);
        
        setTwlData(parsedLinks);
      } catch (err) {
        console.error('Failed to load TWL data:', err);
        setError('Failed to load Translation Word Links');
        setTwlData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTWL();
  }, [reference, manifests.twl]);

  if (!reference?.bookId) {
    return (
      <div className="twl-panel" data-testid="twl-panel">
        <p>Please select a verse to view Translation Word Links.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="twl-panel" data-testid="twl-panel">
        <p>Loading Translation Word Links...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="twl-panel" data-testid="twl-panel">
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!twlData || twlData.length === 0) {
    return (
      <div className="twl-panel" data-testid="twl-panel">
        <p>No Translation Word Links available for this verse.</p>
      </div>
    );
  }

  return (
    <div className="twl-panel" data-testid="twl-panel">
      <h3>Translation Word Links</h3>
      <div className="twl-content">
        {twlData.map((item) => (
          <div key={item.id} className="twl-item" style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
              {item.word} 
              {item.occurrence !== '1' && <span style={{ fontSize: '0.8em', color: '#666' }}> (occurrence {item.occurrence})</span>}
            </h4>
            <div className="twl-link">
              <a 
                href={`https://git.door43.org/unfoldingWord/en_tw/src/branch/master/bible/${item.twLink}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#1976d2' }}
              >
                View Translation Word Article →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}