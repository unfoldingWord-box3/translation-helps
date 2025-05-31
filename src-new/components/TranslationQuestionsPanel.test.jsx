import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourcesProvider } from '../context/ResourcesContext';
import { TranslationQuestionsPanel } from './TranslationQuestionsPanel';

describe('TranslationQuestionsPanel', () => {
  it('renders nothing without questions', () => {
    render(
      <ResourcesProvider resourceId="tq" reference={{ bookId: 'gen', chapter: '1', verse: '1' }}>
        <TranslationQuestionsPanel />
      </ResourcesProvider>
    );
    expect(screen.queryByText('Translation Questions')).toBeNull();
  });
});