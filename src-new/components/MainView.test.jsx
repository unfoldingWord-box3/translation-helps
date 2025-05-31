import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReferenceProvider } from '../context/ReferenceContext';
import { ManifestsProvider } from '../context/ManifestsContext';
import { ResourcesProvider } from '../context/ResourcesContext';
import { MainView } from './MainView';

describe('MainView', () => {
  it('renders verse tabs, scripture panel, and helps panels', () => {
    render(
      <ReferenceProvider>
        <ManifestsProvider languageId="en" resourceId="twl">
          <ResourcesProvider resourceId="twl" reference={{ bookId: 'gen', chapter: '1', verse: '1' }}>
            <MainView />
          </ResourcesProvider>
        </ManifestsProvider>
      </ReferenceProvider>
    );
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
    expect(screen.getByTestId('verse-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('scripture-panel')).toBeInTheDocument();
    expect(screen.getByText('Translation Notes')).toBeInTheDocument();
    expect(screen.getByText('Translation Questions')).toBeInTheDocument();
    expect(screen.getByText('Translation Words Links')).toBeInTheDocument();
  });
});