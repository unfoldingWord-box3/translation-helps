/**
 * App.jsx
 * Root shell and provider wiring for clean-slate rewrite.
 */

import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ReferenceProvider, ReferenceContext } from "../context/ReferenceContext";
import { MultiManifestsProvider } from "../context/MultiManifestsContext";
import { ResourcesProvider } from "../context/ResourcesContext";
import { NavigationBar } from "./NavigationBar";
import { MainView } from "./MainView";

/**
 * Wrapper component that provides manifests with dynamic organization and languageId
 */
function ManifestsWrapper({ children }) {
  const { organization, languageId } = useContext(ReferenceContext);

  return (
    <MultiManifestsProvider languageId={languageId} organization={organization}>
      {children}
    </MultiManifestsProvider>
  );
}

export function App() {
  return (
    <ReferenceProvider>
      <ManifestsWrapper>
        <ResourcesProvider>
          <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <NavigationBar />
            <Routes>
              <Route path='/' element={<MainView />} />
              <Route path='*' element={<div style={{ padding: "20px" }}>Page Not Found</div>} />
            </Routes>
          </div>
        </ResourcesProvider>
      </ManifestsWrapper>
    </ReferenceProvider>
  );
}
