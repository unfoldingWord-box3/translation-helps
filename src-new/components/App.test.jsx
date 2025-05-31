import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { App } from './App';
import { MemoryRouter } from 'react-router-dom';

// Mock the fetchManifest function
vi.mock('../services/dcsClient', () => ({
  fetchManifest: vi.fn(() => Promise.resolve({ projects: [] })),
  fetchResourceFile: vi.fn(() => Promise.resolve(''))
}));

describe('App', () => {
  it('renders NavigationBar and MainView with reference selector', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Check for the navigation bar
    expect(screen.getByText('Translation Helps Viewer')).toBeInTheDocument();
    
    // Check for the reference selector
    expect(screen.getByTestId('reference-selector')).toBeInTheDocument();
    expect(screen.getByTestId('book-selector')).toBeInTheDocument();
    expect(screen.getByTestId('chapter-selector')).toBeInTheDocument();
    expect(screen.getByTestId('verse-selector')).toBeInTheDocument();
    
    // Check for the main view
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
    
    // Check for the helps tabs
    expect(screen.getByTestId('helps-tabs')).toBeInTheDocument();
  });
});