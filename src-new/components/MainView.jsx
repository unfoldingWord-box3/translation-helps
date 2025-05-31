/**
 * MainView.jsx
 * Orchestrates the main content area including scripture text, navigation tabs, and helps panels.
 */

import React, { useContext, useState } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';
import { ReferenceSelector } from './ReferenceSelector';
import { ScripturePanel } from './ScripturePanel';
import { HelpsTabs } from './HelpsTabs';

export function MainView() {
  const { reference } = useContext(ReferenceContext);
  const [activeHelpsTab, setActiveHelpsTab] = useState('tn');

  const handleVerseClick = (verseNum) => {
    // When a verse is clicked, it automatically updates the reference context
    // which triggers the helps panels to update
    console.log('Verse clicked:', verseNum);
  };

  return (
    <main data-testid="main-view" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Reference Selector */}
      <ReferenceSelector />
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
        gap: '16px',
        padding: '16px'
      }}>
        {/* Scripture Panel - Left Side */}
        <div style={{ 
          flex: '1', 
          overflow: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <ScripturePanel 
            reference={reference} 
            onVerseClick={handleVerseClick}
          />
        </div>
        
        {/* Translation Helps - Right Side */}
        <div style={{ 
          flex: '1', 
          overflow: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          <HelpsTabs reference={reference} />
        </div>
      </div>
    </main>
  );
}