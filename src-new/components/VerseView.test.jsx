import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReferenceProvider } from '../context/ReferenceContext';
import { NavigationBar } from './NavigationBar';
import { VerseView } from './VerseView';

describe('VerseView', () => {
  it('renders and updates reference from context', () => {
    render(
      <ReferenceProvider>
        <NavigationBar />
        <VerseView />
      </ReferenceProvider>
    );
    const view = screen.getByTestId('verse-view');
    expect(view.textContent).toBe(': :');
    fireEvent.change(screen.getByTestId('book-input'), { target: { value: 'gen' } });
    fireEvent.change(screen.getByTestId('chapter-input'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('verse-input'), { target: { value: '1' } });
    expect(view.textContent).toBe('gen:1:1');
  });
});