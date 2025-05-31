import React from 'react';
import { render, screen } from '@testing-library/react';
import { VerseTabs } from './VerseTabs';

describe('VerseTabs', () => {
  it('renders tabs container', () => {
    render(<VerseTabs />);
    expect(screen.getByTestId('verse-tabs')).toBeInTheDocument();
  });
});