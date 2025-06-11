/**
 * StepIndicator.jsx
 * Progress indicator showing current wizard step and allowing navigation to valid steps
 */

import React, { useState } from "react";
import styles from "./StepIndicator.module.css";

export function StepIndicator({
  currentStep,
  stepNames,
  onStepClick,
  canJumpTo,
  isDesktop = false,
}) {
  const [hoveredStep, setHoveredStep] = useState(null);

  const renderStep = (stepName, index) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;
    const canClick = canJumpTo && canJumpTo(index);
    const isHovered = hoveredStep === index;

    const stepClasses = [
      styles.step,
      isDesktop ? styles.desktop : "",
      canClick && !isActive ? styles.clickable : "",
      !canClick ? styles.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    const dotClasses = [
      styles.stepDot,
      isDesktop ? styles.desktop : "",
      isActive ? styles.active : "",
      isCompleted ? styles.completed : "",
      !isActive && !isCompleted ? styles.inactive : "",
      canClick ? styles.clickable : "",
    ]
      .filter(Boolean)
      .join(" ");

    const labelClasses = [
      styles.stepLabel,
      isDesktop ? styles.desktop : "",
      isActive ? styles.active : "",
      isCompleted ? styles.completed : "",
      canClick ? styles.clickable : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={stepClasses}
        onClick={canClick ? () => onStepClick(index) : undefined}
        onMouseEnter={canClick ? () => setHoveredStep(index) : undefined}
        onMouseLeave={canClick ? () => setHoveredStep(null) : undefined}
        data-testid={`step-indicator-${index}`}
        role='tab'
        tabIndex={canClick ? 0 : -1}
        aria-selected={isActive}
        aria-label={`Step ${index + 1}: ${stepName}${
          isCompleted ? " (completed)" : isActive ? " (current)" : ""
        }`}
      >
        <div className={dotClasses}>{isCompleted ? "✓" : index + 1}</div>
        <span className={labelClasses}>{stepName}</span>
      </div>
    );
  };

  const renderConnector = (index) => {
    if (index >= stepNames.length - 1) return null;

    const connectorClasses = [
      styles.stepConnector,
      isDesktop ? styles.desktop : styles.mobile,
      index < currentStep ? styles.completed : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        key={`connector-${index}`}
        className={connectorClasses}
        data-testid={`step-connector-${index}`}
      />
    );
  };

  const containerClasses = [styles.stepIndicator, isDesktop ? styles.desktop : ""]
    .filter(Boolean)
    .join(" ");

  // Mobile compact view shows only dots with current step name
  if (!isDesktop) {
    return (
      <div className={containerClasses} data-testid='step-indicator' role='tablist'>
        <div className={styles.progressContainer}>
          {stepNames.map((stepName, index) => (
            <React.Fragment key={index}>
              {renderStep(stepName, index)}
              {renderConnector(index)}
            </React.Fragment>
          ))}
        </div>

        {/* Current step name for mobile */}
        <div className={styles.currentStepName}>{stepNames[currentStep]}</div>
      </div>
    );
  }

  // Desktop view with full labels
  return (
    <div className={containerClasses} data-testid='step-indicator' role='tablist'>
      <div className={`${styles.progressContainer} ${styles.desktop}`}>
        {stepNames.map((stepName, index) => (
          <React.Fragment key={index}>
            {renderStep(stepName, index)}
            {renderConnector(index)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
