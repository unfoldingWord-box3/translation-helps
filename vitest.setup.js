import { vi } from 'vitest';

vi.mock('yaml', () => ({ parse: () => ({}) }));
vi.mock('./src-new/services/dcsClient', () => ({ fetchManifest: async () => ({}), fetchResourceFile: async () => '' }));
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});