import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourcesProvider } from '../context/ResourcesContext';
import { TranslationNotesPanel } from './TranslationNotesPanel';

describe('TranslationNotesPanel', () => {
  it('renders nothing without notes', () => {
    render(
      <ResourcesProvider resourceId="tn" reference={{ bookId: 'gen', chapter: '1', verse: '1' }}>
        <TranslationNotesPanel />
      </ResourcesProvider>
    );
    expect(screen.queryByText('Translation Notes')).toBeNull();
  });
});