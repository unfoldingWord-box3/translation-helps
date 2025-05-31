import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  it('renders NavigationBar, VerseTabs and MainView', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('book-input')).toBeInTheDocument();
    expect(screen.getByTestId('verse-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
  });
});