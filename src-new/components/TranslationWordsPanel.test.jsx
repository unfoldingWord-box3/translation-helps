import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourcesContext } from '../context/ResourcesContext';
import { TranslationWordsPanel } from './TranslationWordsPanel';

describe('TranslationWordsPanel', () => {
  it('renders nothing when no bookId is provided', () => {
    render(<TranslationWordsPanel reference={{ bookId: '', chapter: '1', verse: '1' }} />);
    expect(screen.queryByText('Translation Words Links')).toBeNull();
  });

  it('renders links when provided in context', () => {
    const testLinks = ['http://example.com/article1', 'http://example.com/article2'];
    const contextValue = { resources: { twl: { data: { links: testLinks } } } };
    render(
      <ResourcesContext.Provider value={contextValue}>
        <TranslationWordsPanel reference={{ bookId: 'gen', chapter: '1', verse: '1' }} />
      </ResourcesContext.Provider>
    );
    expect(screen.getByText('Translation Words Links')).toBeInTheDocument();
    testLinks.forEach(link => {
      const anchor = screen.getByText(link);
      expect(anchor.closest('a')).toHaveAttribute('href', link);
    });
  });
});