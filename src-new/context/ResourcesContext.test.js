import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ResourcesProvider, ResourcesContext } from './ResourcesContext';
import * as twlService from '../services/twlService';

vi.mock('../services/twlService');

describe('ResourcesContext', () => {
  it('loads twl resources when resourceId is twl', async () => {
    twlService.getLinksForVerse.mockResolvedValue(['link1']);
    function Test() {
      const { resources } = React.useContext(ResourcesContext);
      return <div>{resources.twl?.data?.links[0]}</div>;
    }
    render(
      <ResourcesProvider resourceId="twl" reference={{ bookId: 'gen', chapter: '1', verse: '1' }}>
        <Test />
      </ResourcesProvider>
    );
    await waitFor(() => expect(screen.getByText('link1')).toBeInTheDocument());
  });
});