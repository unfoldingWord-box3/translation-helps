/**
 * NavigationWizard/index.js
 * Main export for the Navigation Wizard module
 */

import React, { useEffect } from "react";
import { WizardContainer } from "./WizardContainer";

// Modal wrapper component
export function NavigationWizard({ onComplete, onClose, initialStep = 1 }) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const modalOverlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const modalContentStyles = {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    position: "relative",
  };

  const closeButtonStyles = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(0, 0, 0, 0.1)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#666",
    zIndex: 10,
    transition: "all 0.2s ease",
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleWizardComplete = (data) => {
    if (onComplete) {
      onComplete(data);
    }
  };

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div style={modalOverlayStyles} onClick={handleOverlayClick}>
      <div style={modalContentStyles}>
        <button
          style={closeButtonStyles}
          onClick={handleCloseClick}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
          }}
          title='Close Navigation Wizard'
        >
          ×
        </button>
        <WizardContainer
          onComplete={handleWizardComplete}
          isDesktop={true}
          initialStep={initialStep}
        />
      </div>
    </div>
  );
}

// Export the wizard container for direct use
export { WizardContainer } from "./WizardContainer";
export { StepIndicator } from "./StepIndicator";

// Export step components
export { OrganizationStep, LanguageStep, ResourceStep, BookStep, ChapterVerseStep } from "./steps";

// Export hooks
export { useWizardState } from "./hooks/useWizardState";
export { useNavigationHistory } from "./hooks/useNavigationHistory";
export { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

// Export shared components
export { SearchableGrid } from "./components/SearchableGrid";
export { SelectionCard } from "./components/SelectionCard";
export { RecentSelections } from "./components/RecentSelections";
