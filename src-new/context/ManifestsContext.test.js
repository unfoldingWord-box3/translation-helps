import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ManifestsProvider, ManifestsContext } from './ManifestsContext';
import * as dcsClient from '../services/dcsClient';

vi.mock('../services/dcsClient');

describe('ManifestsContext', () => {
  it('loads and provides manifest', async () => {
    dcsClient.fetchManifest.mockResolvedValue({ foo: 'bar' });
    let context;
    function Test() {
      context = React.useContext(ManifestsContext);
      return <div>{context.manifests.tn?.foo}</div>;
    }
    render(
      <ManifestsProvider languageId="en" resourceId="tn">
        <Test />
      </ManifestsProvider>
    );
    await waitFor(() => expect(screen.getByText('bar')).toBeInTheDocument());
  });
});