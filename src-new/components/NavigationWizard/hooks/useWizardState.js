/**
 * useWizardState.js
 * Hook for managing wizard validation and state logic
 */

import { useMemo } from "react";

export function useWizardState(wizardData) {
  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Organization
        return !!wizardData.organization;
      case 1: // Language
        return !!wizardData.organization && !!wizardData.languageId;
      case 2: // Resource
        return !!wizardData.organization && !!wizardData.languageId && !!wizardData.resourceId;
      case 3: // Book
        return (
          !!wizardData.organization &&
          !!wizardData.languageId &&
          !!wizardData.resourceId &&
          !!wizardData.bookId
        );
      case 4: // Chapter & Verse
        return (
          !!wizardData.organization &&
          !!wizardData.languageId &&
          !!wizardData.resourceId &&
          !!wizardData.bookId &&
          !!wizardData.chapter
        );
      default:
        return false;
    }
  };

  const canProceed = (currentStep) => {
    return validateStep(currentStep);
  };

  const isComplete = useMemo(() => {
    return validateStep(4); // All steps complete
  }, [wizardData]);

  const completionPercentage = useMemo(() => {
    let completed = 0;
    for (let i = 0; i <= 4; i++) {
      if (validateStep(i)) completed++;
    }
    return Math.round((completed / 5) * 100);
  }, [wizardData]);

  return {
    validateStep,
    canProceed,
    isComplete,
    completionPercentage,
  };
}
