import React from 'react';
import { render } from '@testing-library/react';
import { ReferenceProvider, ReferenceContext } from './ReferenceContext';

describe('ReferenceContext', () => {
  it('provides default reference and setReference', () => {
    let context;
    function Test() {
      context = React.useContext(ReferenceContext);
      return null;
    }
    render(
      <ReferenceProvider>
        <Test />
      </ReferenceProvider>
    );
    expect(context.reference).toEqual({ bookId: '', chapter: '', verse: '' });
    expect(typeof context.setReference).toBe('function');
  });
});