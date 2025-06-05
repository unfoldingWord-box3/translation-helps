import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as dcsClient from '../../services/dcsClient';
import * as twlHooks from '../twl/hooks';
import { useTranslationWords } from './hooks';

function createWrapper() {
  const client = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useTranslationWords', () => {
  beforeEach(() => {
    vi.spyOn(twlHooks, 'useTwlLinks');
    vi.spyOn(dcsClient, 'fetchResourceFile');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and returns article contents', async () => {
    const links = ['rc://en/tw/dict/bible/kt/create', 'rc://en/tw/dict/bible/kt/begin'];
    (twlHooks.useTwlLinks as unknown as vi.Mock).mockReturnValue({
      data: links,
      isLoading: false,
      isError: false,
    });
    (dcsClient.fetchResourceFile as unknown as vi.Mock).mockImplementation((_, __, filePath) => Promise.resolve(filePath));
    function Test() {
      const { data, isLoading, isError } = useTranslationWords('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data:{data.join('|')}</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() =>
      expect(
        screen.getByText('Data:dict/bible/kt/create.md|dict/bible/kt/begin.md')
      ).toBeInTheDocument()
    );
  });

  it('renders error when links error', async () => {
    (twlHooks.useTwlLinks as unknown as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error('fail'),
    });
    function Test() {
      const { isLoading, isError } = useTranslationWords('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
  });
});