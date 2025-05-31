import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReferenceContext } from '../context/ReferenceContext';
import { ResourcesContext } from '../context/ResourcesContext';
import { MainView } from './MainView';

describe('MainView', () => {
  it('renders verse tabs, scripture panel, and helps panels', () => {
    const testReference = { bookId: 'gen', chapter: '1', verse: '1' };
    const testResources = {
      tn: { data: [{ Note: 'sample note' }] },
      tq: { data: [{ Question: 'sample question' }] },
      twl: { data: { links: ['http://example.com'] } },
    };
    render(
      <ReferenceContext.Provider value={{ reference: testReference, setReference: () => {} }}>
        <ResourcesContext.Provider value={{ resources: testResources }}>
          <MainView />
        </ResourcesContext.Provider>
      </ReferenceContext.Provider>
    );
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
    expect(screen.getByTestId('verse-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('scripture-panel')).toBeInTheDocument();
    expect(screen.getByText('Translation Notes')).toBeInTheDocument();
    expect(screen.getByText('Translation Questions')).toBeInTheDocument();
    expect(screen.getByText('Translation Words Links')).toBeInTheDocument();
  });
});