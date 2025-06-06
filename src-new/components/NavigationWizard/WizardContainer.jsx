/**
 * WizardContainer.jsx
 * Main container for the step-by-step navigation wizard
 * Manages state, step flow, and integrates with existing ReferenceContext
 */

import React, { useState, useContext, useEffect, useCallback } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { StepIndicator } from "./StepIndicator";
import { OrganizationStep } from "./steps/OrganizationStep";
import { LanguageStep } from "./steps/LanguageStep";
import { ResourceStep } from "./steps/ResourceStep";
import { BookStep } from "./steps/BookStep";
import { ChapterVerseStep } from "./steps/ChapterVerseStep";
import { useWizardState } from "./hooks/useWizardState";
import { useNavigationHistory } from "./hooks/useNavigationHistory";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

const WIZARD_STEPS = {
  ORGANIZATION: 0,
  LANGUAGE: 1,
  RESOURCE: 2,
  BOOK: 3,
  CHAPTER_VERSE: 4,
};

const STEP_NAMES = ["Organization", "Language", "Resource", "Book", "Chapter & Verse"];

export function WizardContainer({ onComplete, isDesktop = false, initialStep = null }) {
  const { organization, languageId, resourceId, reference, updateContext } =
    useContext(ReferenceContext);

  // Determine initial step
  const getInitialStep = () => {
    // If initialStep is explicitly provided, use it (from breadcrumb navigation)
    if (initialStep !== null) {
      return Math.max(0, Math.min(4, initialStep - 1));
    }

    // Otherwise determine step based on existing context
    if (organization && languageId && resourceId && reference?.bookId && reference?.chapter) {
      return WIZARD_STEPS.CHAPTER_VERSE;
    } else if (organization && languageId && resourceId && reference?.bookId) {
      return WIZARD_STEPS.BOOK;
    } else if (organization && languageId && resourceId) {
      return WIZARD_STEPS.RESOURCE;
    } else if (organization && languageId) {
      return WIZARD_STEPS.LANGUAGE;
    } else if (organization) {
      return WIZARD_STEPS.ORGANIZATION;
    }
    return WIZARD_STEPS.ORGANIZATION;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wizardData, setWizardData] = useState({
    organization: organization || null,
    languageId: languageId || null,
    resourceId: resourceId || null,
    bookId: reference?.bookId || null,
    chapter: reference?.chapter || null,
    verse: reference?.verse || null,
  });

  // Custom hooks
  const { saveSelection, getRecentSelections } = useNavigationHistory();
  const { validateStep, canProceed } = useWizardState(wizardData);

  // Only auto-determine step if no explicit initialStep was provided
  useEffect(() => {
    if (initialStep !== null) {
      // Don't auto-change step if explicitly set by breadcrumb
      return;
    }

    if (organization && languageId && resourceId && reference?.bookId && reference?.chapter) {
      setCurrentStep(WIZARD_STEPS.CHAPTER_VERSE);
    } else if (organization && languageId && resourceId && reference?.bookId) {
      setCurrentStep(WIZARD_STEPS.BOOK);
    } else if (organization && languageId && resourceId) {
      setCurrentStep(WIZARD_STEPS.RESOURCE);
    } else if (organization && languageId) {
      setCurrentStep(WIZARD_STEPS.LANGUAGE);
    } else if (organization) {
      setCurrentStep(WIZARD_STEPS.ORGANIZATION);
    }
  }, [organization, languageId, resourceId, reference, initialStep]);

  const handleStepChange = useCallback(
    (stepIndex, data = {}) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Update wizard data
      setWizardData((prev) => ({ ...prev, ...data }));

      // Update context if data provided
      if (Object.keys(data).length > 0) {
        const contextUpdate = {};

        if (data.organization !== undefined) {
          contextUpdate.organization = data.organization;
          // Reset downstream selections when organization changes
          contextUpdate.languageId = null;
          contextUpdate.resourceId = null;
          contextUpdate.reference = { bookId: null, chapter: null, verse: null };
        }

        if (data.languageId !== undefined) {
          contextUpdate.languageId = data.languageId;
          // Reset downstream selections when language changes
          if (!contextUpdate.resourceId === undefined) {
            contextUpdate.resourceId = null;
            contextUpdate.reference = { bookId: null, chapter: null, verse: null };
          }
        }

        if (data.resourceId !== undefined) {
          contextUpdate.resourceId = data.resourceId;
          // Reset downstream selections when resource changes
          if (!contextUpdate.reference) {
            contextUpdate.reference = { bookId: null, chapter: null, verse: null };
          }
        }

        if (data.bookId !== undefined || data.chapter !== undefined || data.verse !== undefined) {
          contextUpdate.reference = {
            bookId: data.bookId ?? reference?.bookId ?? null,
            chapter: data.chapter ?? reference?.chapter ?? null,
            verse: data.verse ?? reference?.verse ?? null,
          };
        }

        updateContext(contextUpdate);
      }

      // Change step with animation delay
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsTransitioning(false);
      }, 150);
    },
    [isTransitioning, updateContext, reference]
  );

  const handleNext = useCallback(() => {
    if (currentStep < WIZARD_STEPS.CHAPTER_VERSE && canProceed(currentStep)) {
      handleStepChange(currentStep + 1);
    }
  }, [currentStep, canProceed, handleStepChange]);

  const handlePrevious = useCallback(() => {
    if (currentStep > WIZARD_STEPS.ORGANIZATION) {
      handleStepChange(currentStep - 1);
    }
  }, [currentStep, handleStepChange]);

  const handleEscape = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  const isStepValid = useCallback(
    (stepIndex) => {
      // Allow navigation to any step that is at or before the current step
      if (stepIndex <= currentStep) {
        return true;
      }

      // For forward navigation, check if prerequisites are met
      switch (stepIndex) {
        case WIZARD_STEPS.ORGANIZATION:
          return true; // Organization step is always accessible
        case WIZARD_STEPS.LANGUAGE:
          return wizardData.organization !== null;
        case WIZARD_STEPS.RESOURCE:
          return wizardData.organization !== null && wizardData.languageId !== null;
        case WIZARD_STEPS.BOOK:
          return (
            wizardData.organization !== null &&
            wizardData.languageId !== null &&
            wizardData.resourceId !== null
          );
        case WIZARD_STEPS.CHAPTER_VERSE:
          return (
            wizardData.organization !== null &&
            wizardData.languageId !== null &&
            wizardData.resourceId !== null &&
            wizardData.bookId !== null
          );
        default:
          return false;
      }
    },
    [wizardData, currentStep]
  );

  const handleJumpToStep = useCallback(
    (stepIndex) => {
      if (isStepValid(stepIndex) && !isTransitioning) {
        handleStepChange(stepIndex);
      }
    },
    [isStepValid, isTransitioning, handleStepChange]
  );

  const handleWizardComplete = useCallback(() => {
    // Save to history
    saveSelection({
      organization: wizardData.organization,
      languageId: wizardData.languageId,
      resourceId: wizardData.resourceId,
      bookId: wizardData.bookId,
      chapter: wizardData.chapter,
      verse: wizardData.verse,
      timestamp: Date.now(),
    });

    if (onComplete) {
      onComplete(wizardData);
    }
  }, [wizardData, saveSelection, onComplete]);

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onEscape: handleEscape,
    enabled: !isTransitioning,
  });

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      onStepChange: handleStepChange,
      wizardData,
      isTransitioning,
      isDesktop,
    };

    switch (currentStep) {
      case WIZARD_STEPS.ORGANIZATION:
        return <OrganizationStep {...commonProps} />;
      case WIZARD_STEPS.LANGUAGE:
        return <LanguageStep {...commonProps} />;
      case WIZARD_STEPS.RESOURCE:
        return <ResourceStep {...commonProps} />;
      case WIZARD_STEPS.BOOK:
        return <BookStep {...commonProps} />;
      case WIZARD_STEPS.CHAPTER_VERSE:
        return <ChapterVerseStep {...commonProps} onComplete={handleWizardComplete} />;
      default:
        return <OrganizationStep {...commonProps} />;
    }
  };

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    height: isDesktop ? "auto" : "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const contentStyles = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: isTransitioning ? "opacity 0.15s ease-in-out" : "none",
    opacity: isTransitioning ? 0.7 : 1,
    overflow: "auto",
    minHeight: 0, // Allow flex shrinking
  };

  return (
    <div className='navigation-wizard' data-testid='navigation-wizard' style={containerStyles}>
      <StepIndicator
        currentStep={currentStep}
        stepNames={STEP_NAMES}
        onStepClick={handleJumpToStep}
        canJumpTo={isStepValid}
        isDesktop={isDesktop}
      />

      <div style={contentStyles}>{renderCurrentStep()}</div>
    </div>
  );
}

export { WIZARD_STEPS, STEP_NAMES };
