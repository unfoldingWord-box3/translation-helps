import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ScripturePanel } from './ScripturePanel';

describe('ScripturePanel', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders nothing when no bookId is provided', () => {
    render(<ScripturePanel reference={{ bookId: '', chapter: '1', verse: '1' }} />);
    expect(screen.queryByTestId('scripture-panel')).toBeNull();
  });

  it('loads and displays verse text when reference is provided', async () => {
    const usfm = '\\v 1 In the beginning God created the heavens and the earth.';
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(usfm) }));
    render(<ScripturePanel reference={{ bookId: 'gen', chapter: '1', verse: '1' }} />);
    await waitFor(() => expect(screen.getByTestId('scripture-panel')).toBeInTheDocument());
    expect(screen.getByText('In the beginning God created the heavens and the earth.')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://git.door43.org/unfoldingWord/en_ult/raw/branch/master/gen.usfm'
    );
  });
});