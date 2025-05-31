/**
 * App.jsx
 * Root shell and provider wiring for clean-slate rewrite.
 */

import React from 'react';
import { ReferenceProvider } from '../context/ReferenceContext';
import { ManifestsProvider } from '../context/ManifestsContext';
import { ResourcesProvider } from '../context/ResourcesContext';
import { NavigationBar } from './NavigationBar';
import { VerseTabs } from './VerseTabs';
import { VerseView } from './VerseView';

export function App() {
  return (
    <ReferenceProvider>
      <ManifestsProvider languageId="en" resourceId="twl">
        <ResourcesProvider resourceId="twl" reference={{ bookId: '', chapter: '', verse: '' }}>
          <NavigationBar />
          <VerseTabs />
          <VerseView />
        </ResourcesProvider>
      </ManifestsProvider>
    </ReferenceProvider>
  );
}