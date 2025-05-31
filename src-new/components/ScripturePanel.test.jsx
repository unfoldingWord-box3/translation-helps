import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ScripturePanel } from './ScripturePanel';
import { ReferenceContext } from '../context/ReferenceContext';
import { ManifestsContext } from '../context/MultiManifestsContext';

// Mock the fetchResourceFile function
vi.mock('../services/dcsClient', () => ({
  fetchResourceFile: vi.fn()
}));

import { fetchResourceFile } from '../services/dcsClient';

describe('ScripturePanel', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders message when no bookId is provided', () => {
    const mockManifests = { ult: { projects: [] } };
    render(
      <ManifestsContext.Provider value={{ manifests: mockManifests, isLoading: false }}>
        <ReferenceContext.Provider value={{ reference: { bookId: '', chapter: '1', verse: '1' }, updateReference: vi.fn() }}>
          <ScripturePanel reference={{ bookId: '', chapter: '1', verse: '1' }} />
        </ReferenceContext.Provider>
      </ManifestsContext.Provider>
    );
    expect(screen.getByTestId('scripture-panel')).toBeInTheDocument();
    expect(screen.getByText('Please select a book and chapter to view scripture.')).toBeInTheDocument();
  });

  it('loads and displays chapter text when reference is provided', async () => {
    const usfm = '\\c 1\n\\v 1 In the beginning God created the heavens and the earth.\n\\v 2 The earth was without form and void.';
    fetchResourceFile.mockResolvedValue(usfm);
    
    const mockManifests = { 
      ult: { 
        projects: [
          { identifier: 'gen', path: './01-GEN.usfm' }
        ] 
      } 
    };
    const mockUpdateReference = vi.fn();
    
    render(
      <ManifestsContext.Provider value={{ manifests: mockManifests, isLoading: false }}>
        <ReferenceContext.Provider value={{ reference: { bookId: 'gen', chapter: '1', verse: '1' }, updateReference: mockUpdateReference }}>
          <ScripturePanel reference={{ bookId: 'gen', chapter: '1', verse: '1' }} />
        </ReferenceContext.Provider>
      </ManifestsContext.Provider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('GEN 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('In the beginning God created the heavens and the earth.')).toBeInTheDocument();
    });
    
    expect(fetchResourceFile).toHaveBeenCalledWith('en', 'ult', '01-GEN.usfm');
  });
});