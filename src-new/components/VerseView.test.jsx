import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReferenceProvider } from '../context/ReferenceContext';
import { ReferenceSelector } from './ReferenceSelector';
import { VerseView } from './VerseView';

describe('VerseView', () => {
  it('renders and displays default reference from context', () => {
    render(
      <ReferenceProvider>
        <ReferenceSelector />
        <VerseView />
      </ReferenceProvider>
    );
    const view = screen.getByTestId('verse-view');
    // Default reference is Titus 1:1
    expect(view.textContent).toBe('tit:1:1');
    
    // Change the reference using the selector
    fireEvent.change(screen.getByTestId('book-selector'), { target: { value: 'gen' } });
    expect(view.textContent).toBe('gen:1:1');
  });
});