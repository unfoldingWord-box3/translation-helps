import { vi } from 'vitest';

vi.mock('js-yaml', () => ({ load: () => ({}) }));
vi.mock('./src-new/services/dcsClient', () => ({ fetchManifest: async () => ({}), fetchResourceFile: async () => '' }));
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});