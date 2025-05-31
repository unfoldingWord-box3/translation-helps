import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as tnService from '../../services/tnService';
import { useTranslationNotes } from './hooks';

function createWrapper() {
  const client = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useTranslationNotes', () => {
  beforeEach(() => {
    vi.spyOn(tnService, 'getNotesForVerse');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on success', async () => {
    (tnService.getNotesForVerse as unknown as vi.Mock).mockResolvedValue([ { Reference: 'gen/1/1', Note: 'a' } ]);
    function Test() {
      const { data, isLoading, isError } = useTranslationNotes('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data:{data && data.length}</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Data:1')).toBeInTheDocument());
  });

  it('renders error state on failure', async () => {
    (tnService.getNotesForVerse as unknown as vi.Mock).mockRejectedValue(new Error('fail'));
    function Test() {
      const { isLoading, isError } = useTranslationNotes('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
  });
});