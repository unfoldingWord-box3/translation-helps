import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ScripturePanel } from './ScripturePanel';
import { ReferenceContext } from '../context/ReferenceContext';

describe('ScripturePanel', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders message when no bookId is provided', () => {
    render(
      <ReferenceContext.Provider value={{ reference: { bookId: '', chapter: '1', verse: '1' }, updateReference: vi.fn() }}>
        <ScripturePanel reference={{ bookId: '', chapter: '1', verse: '1' }} />
      </ReferenceContext.Provider>
    );
    expect(screen.getByTestId('scripture-panel')).toBeInTheDocument();
    expect(screen.getByText('Please select a book and chapter to view scripture.')).toBeInTheDocument();
  });

  it('loads and displays chapter text when reference is provided', async () => {
    const usfm = '\\c 1\n\\v 1 In the beginning God created the heavens and the earth.\n\\v 2 The earth was without form and void.';
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(usfm) }));
    const mockUpdateReference = vi.fn();
    
    render(
      <ReferenceContext.Provider value={{ reference: { bookId: 'gen', chapter: '1', verse: '1' }, updateReference: mockUpdateReference }}>
        <ScripturePanel reference={{ bookId: 'gen', chapter: '1', verse: '1' }} />
      </ReferenceContext.Provider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('GEN 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('In the beginning God created the heavens and the earth.')).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://git.door43.org/unfoldingWord/en_ult/raw/branch/master/gen.usfm'
    );
  });
});