/**
 * TWLPanel.jsx
 * Translation Word Links panel
 */

import React, { useState, useEffect, useContext } from 'react';
import { ResourcesContext } from '../context/ResourcesContext';
import { useTWL } from '../hooks/useTWL';

export function TWLPanel({ reference }) {
  const { resources } = useContext(ResourcesContext);
  const { loadTWLData } = useTWL();
  const [twlData, setTwlData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTWL() {
      if (!reference?.bookId || !reference?.chapter || !reference?.verse) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await loadTWLData(reference);
        setTwlData(data);
      } catch (err) {
        console.error('Failed to load TWL data:', err);
        setError('Failed to load Translation Word Links');
      } finally {
        setLoading(false);
      }
    }

    fetchTWL();
  }, [reference, loadTWLData]);

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
        {twlData.map((item, index) => (
          <div key={index} className="twl-item" style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>{item.word}</h4>
            {item.definition && <p style={{ margin: '4px 0' }}>{item.definition}</p>}
            {item.links && item.links.length > 0 && (
              <div className="twl-links">
                <strong>Related articles:</strong>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {item.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}