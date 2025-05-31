import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReferenceContext } from '../context/ReferenceContext';
import { ResourcesContext } from '../context/ResourcesContext';
import { MainView } from './MainView';

describe('MainView', () => {
  it('renders reference selector, scripture panel, and helps tabs', () => {
    const testReference = { bookId: 'gen', chapter: '1', verse: '1' };
    const testResources = {
      tn: { data: [{ Note: 'sample note' }] },
      tq: { data: [{ Question: 'sample question' }] },
      twl: { data: { links: ['http://example.com'] } },
    };
    render(
      <ReferenceContext.Provider value={{ reference: testReference, setReference: () => {}, updateReference: () => {} }}>
        <ResourcesContext.Provider value={{ resources: testResources, loadResource: () => {}, isLoading: false }}>
          <MainView />
        </ResourcesContext.Provider>
      </ReferenceContext.Provider>
    );
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
    expect(screen.getByTestId('reference-selector')).toBeInTheDocument();
    expect(screen.getByTestId('scripture-panel')).toBeInTheDocument();
    expect(screen.getByTestId('helps-tabs')).toBeInTheDocument();
    
    // Check for tab buttons
    expect(screen.getByTestId('tab-tn')).toBeInTheDocument();
    expect(screen.getByTestId('tab-tq')).toBeInTheDocument();
    expect(screen.getByTestId('tab-tw')).toBeInTheDocument();
    expect(screen.getByTestId('tab-twl')).toBeInTheDocument();
  });
});