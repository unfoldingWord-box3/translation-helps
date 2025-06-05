import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as twlService from '../../services/twlService';
import { useTwlLinks } from './hooks';

function createWrapper() {
  const client = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useTwlLinks', () => {
  beforeEach(() => {
    vi.spyOn(twlService, 'getLinksForVerse');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on success', async () => {
    (twlService.getLinksForVerse as unknown as vi.Mock).mockResolvedValue([ 'l1', 'l2' ]);
    function Test() {
      const { data, isLoading, isError } = useTwlLinks('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data:{data?.join(',')}</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Data:l1,l2')).toBeInTheDocument());
  });

  it('renders error state on failure', async () => {
    (twlService.getLinksForVerse as unknown as vi.Mock).mockRejectedValue(new Error('fail'));
    function Test() {
      const { isLoading, isError } = useTwlLinks('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
  });
});