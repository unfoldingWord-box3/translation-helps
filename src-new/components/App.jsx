/**
 * App.jsx
 * Root shell and provider wiring for clean-slate rewrite.
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReferenceProvider } from '../context/ReferenceContext';
import { ManifestsProvider } from '../context/ManifestsContext';
import { ResourcesProvider } from '../context/ResourcesContext';
import { NavigationBar } from './NavigationBar';
import { MainView } from './MainView';

export function App() {
  return (
    <ReferenceProvider>
      <ManifestsProvider languageId="en" resourceId="twl">
        <ResourcesProvider resourceId="twl" reference={{ bookId: '', chapter: '', verse: '' }}>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<MainView />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </ResourcesProvider>
      </ManifestsProvider>
    </ReferenceProvider>
  );
}