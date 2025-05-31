import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as tqService from '../../services/tqService';
import { useTranslationQuestions } from './hooks';

function createWrapper() {
  const client = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useTranslationQuestions', () => {
  beforeEach(() => {
    vi.spyOn(tqService, 'getQuestionsForVerse');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on success', async () => {
    (tqService.getQuestionsForVerse as unknown as vi.Mock).mockResolvedValue([
      { Reference: 'gen/1/1', Question: 'q1' },
    ]);
    function Test() {
      const { data, isLoading, isError } = useTranslationQuestions('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data:{data && data.length}</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Data:1')).toBeInTheDocument());
  });

  it('renders error state on failure', async () => {
    (tqService.getQuestionsForVerse as unknown as vi.Mock).mockRejectedValue(new Error('fail'));
    function Test() {
      const { isLoading, isError } = useTranslationQuestions('gen', '1', '1');
      if (isLoading) return <div>Loading</div>;
      if (isError) return <div>Error</div>;
      return <div>Data</div>;
    }
    render(<Test />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
  });
});