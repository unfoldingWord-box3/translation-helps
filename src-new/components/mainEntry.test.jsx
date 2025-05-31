import { vi, describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

vi.mock('js-yaml', () => ({ load: () => ({}) }));
vi.mock('../services/dcsClient', () => ({ fetchManifest: async () => ({}), fetchResourceFile: async () => '' }));
import { afterAll } from 'vitest';
afterAll(() => {
  vi.resetModules();
});

describe('main entrypoint', () => {
  it('renders main view and reference selector by default', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import('../main.jsx');
    await waitFor(() => {
      expect(screen.getByTestId('main-view')).toBeInTheDocument();
      expect(screen.getByTestId('reference-selector')).toBeInTheDocument();
      expect(screen.getByTestId('book-selector')).toBeInTheDocument();
    });
  });
});