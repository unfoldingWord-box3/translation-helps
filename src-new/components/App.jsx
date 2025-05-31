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
        <ResourcesProvider>
          <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<MainView />} />
              <Route path="*" element={<div style={{ padding: '20px' }}>Page Not Found</div>} />
            </Routes>
          </div>
        </ResourcesProvider>
      </ManifestsProvider>
    </ReferenceProvider>
  );
}