/**
 * App.jsx
 * Root shell and provider wiring for clean-slate rewrite.
 */

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ReferenceProvider } from "../context/ReferenceContext";
import { MultiManifestsProvider } from "../context/MultiManifestsContext";
import { ResourcesProvider } from "../context/ResourcesContext";
import { NavigationBar } from "./NavigationBar";
import { MainView } from "./MainView";
import { NavigationWizard } from "./NavigationWizard/index.jsx";

export function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialStep, setWizardInitialStep] = useState(1);

  const handleOpenWizard = (initialStep = 1) => {
    setWizardInitialStep(initialStep);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  const handleWizardComplete = (selectedContext) => {
    console.log("Navigation wizard completed with:", selectedContext);
    setIsWizardOpen(false);
    // The context is automatically updated by the wizard via ReferenceContext
  };

  return (
    <ReferenceProvider>
      <MultiManifestsProvider>
        <ResourcesProvider>
          <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <NavigationBar onOpenWizard={handleOpenWizard} />
            <Routes>
              <Route path='/' element={<MainView />} />
              <Route path='*' element={<div style={{ padding: "20px" }}>Page Not Found</div>} />
            </Routes>

            {/* Navigation Wizard Modal */}
            {isWizardOpen && (
              <NavigationWizard
                onComplete={handleWizardComplete}
                onClose={handleCloseWizard}
                initialStep={wizardInitialStep}
              />
            )}
          </div>
        </ResourcesProvider>
      </MultiManifestsProvider>
    </ReferenceProvider>
  );
}
