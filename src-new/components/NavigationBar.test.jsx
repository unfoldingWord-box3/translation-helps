import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReferenceProvider } from '../context/ReferenceContext';
import { NavigationBar } from './NavigationBar';

describe('NavigationBar', () => {
  it('renders input fields', () => {
    render(
      <ReferenceProvider>
        <NavigationBar />
      </ReferenceProvider>
    );
    expect(screen.getByTestId('book-input')).toBeInTheDocument();
    expect(screen.getByTestId('chapter-input')).toBeInTheDocument();
    expect(screen.getByTestId('verse-input')).toBeInTheDocument();
  });
});