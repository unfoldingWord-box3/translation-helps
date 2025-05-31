import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReferenceProvider } from '../context/ReferenceContext';
import { VerseView } from './VerseView';

describe('VerseView', () => {
  it('renders reference from context', () => {
    render(
      <ReferenceProvider>
        <VerseView />
      </ReferenceProvider>
    );
    expect(screen.getByTestId('verse-view').textContent).toBe(': :');
  });
});