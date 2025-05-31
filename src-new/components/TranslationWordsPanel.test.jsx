import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ResourcesContext } from '../context/ResourcesContext';
import { TranslationWordsPanel } from './TranslationWordsPanel';

describe('TranslationWordsPanel', () => {
  it('renders message when no verse is selected', () => {
    render(<TranslationWordsPanel reference={{ bookId: 'gen', chapter: '1', verse: '' }} />);
    expect(screen.getByTestId('translation-words-panel')).toBeInTheDocument();
    expect(screen.getByText('Select a verse to view translation words.')).toBeInTheDocument();
  });

  it('renders translation words placeholder when reference is provided', () => {
    render(
      <ResourcesContext.Provider value={{ resources: {}, loadResource: vi.fn(), isLoading: false }}>
        <TranslationWordsPanel reference={{ bookId: 'gen', chapter: '1', verse: '1' }} />
      </ResourcesContext.Provider>
    );
    expect(screen.getByTestId('translation-words-panel')).toBeInTheDocument();
    // Check for the h3 heading specifically
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Translation Words');
    // Since we're using a placeholder implementation, check for the placeholder text
    expect(screen.getByText(/Translation Words integration is being implemented/)).toBeInTheDocument();
  });
});