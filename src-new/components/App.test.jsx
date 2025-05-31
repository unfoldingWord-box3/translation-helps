import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders NavigationBar, VerseTabs and VerseView', () => {
    render(<App />);
    expect(screen.getByTestId('book-input')).toBeInTheDocument();
    expect(screen.getByTestId('verse-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('verse-view')).toBeInTheDocument();
  });
});