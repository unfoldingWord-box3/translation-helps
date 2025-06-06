/**
 * StepIndicator.jsx
 * Progress indicator showing current wizard step and allowing navigation to valid steps
 */

import React, { useState } from "react";

export function StepIndicator({
  currentStep,
  stepNames,
  onStepClick,
  canJumpTo,
  isDesktop = false,
}) {
  const [hoveredStep, setHoveredStep] = useState(null);
  const containerStyles = {
    display: "flex",
    alignItems: "center",
    padding: isDesktop ? "16px 24px" : "12px 16px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e1e5e9",
    overflowX: "auto",
    gap: isDesktop ? "24px" : "12px",
  };

  const stepStyles = {
    display: "flex",
    alignItems: "center",
    gap: isDesktop ? "12px" : "8px",
    flex: "0 0 auto",
  };

  const renderStep = (stepName, index) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;
    const canClick = canJumpTo && canJumpTo(index);
    const isHovered = hoveredStep === index;

    // Base styles for the dot
    let dotBackgroundColor = "#e9ecef";
    let dotColor = "#6c757d";
    let dotBorder = "none";

    if (isActive) {
      dotBackgroundColor = "#007bff";
      dotColor = "#ffffff";
      dotBorder = "2px solid #0056b3";
    } else if (isCompleted) {
      dotBackgroundColor = "#28a745";
      dotColor = "#ffffff";
    } else if (isHovered && canClick) {
      dotBackgroundColor = "#f8f9fa";
      dotColor = "#007bff";
      dotBorder = "2px solid #007bff";
    }

    const dotStyles = {
      width: isDesktop ? "32px" : "24px",
      height: isDesktop ? "32px" : "24px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isDesktop ? "14px" : "12px",
      fontWeight: "600",
      cursor: canClick ? "pointer" : "default",
      transition: "all 0.2s ease",
      backgroundColor: dotBackgroundColor,
      color: dotColor,
      border: dotBorder,
      transform: isHovered && canClick ? "scale(1.05)" : "scale(1)",
    };

    // Base styles for the label
    let labelColor = "#6c757d";
    if (isActive) {
      labelColor = "#007bff";
    } else if (isCompleted) {
      labelColor = "#28a745";
    } else if (isHovered && canClick) {
      labelColor = "#007bff";
    }

    const labelStyles = {
      fontSize: isDesktop ? "14px" : "12px",
      fontWeight: isActive ? "600" : "400",
      color: labelColor,
      cursor: canClick ? "pointer" : "default",
      whiteSpace: "nowrap",
      display: isDesktop ? "block" : "none", // Hide labels on mobile to save space
      transition: "color 0.2s ease",
    };

    const stepContent = (
      <div
        style={stepStyles}
        onClick={canClick ? () => onStepClick(index) : undefined}
        onMouseEnter={canClick ? () => setHoveredStep(index) : undefined}
        onMouseLeave={canClick ? () => setHoveredStep(null) : undefined}
        data-testid={`step-indicator-${index}`}
      >
        <div style={dotStyles}>{isCompleted ? "✓" : index + 1}</div>
        <span style={labelStyles}>{stepName}</span>
      </div>
    );

    return stepContent;
  };

  const renderConnector = (index) => {
    if (index >= stepNames.length - 1) return null;

    const connectorStyles = {
      height: "2px",
      flex: isDesktop ? "1" : "0 0 16px",
      backgroundColor: index < currentStep ? "#28a745" : "#e9ecef",
      transition: "background-color 0.2s ease",
      margin: isDesktop ? "0 8px" : "0",
    };

    return (
      <div
        key={`connector-${index}`}
        style={connectorStyles}
        data-testid={`step-connector-${index}`}
      />
    );
  };

  // Mobile compact view shows only dots with current step name
  if (!isDesktop) {
    return (
      <div style={containerStyles} data-testid='step-indicator'>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
          {stepNames.map((stepName, index) => (
            <React.Fragment key={index}>
              {renderStep(stepName, index)}
              {renderConnector(index)}
            </React.Fragment>
          ))}
        </div>

        {/* Current step name for mobile */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#007bff",
            flex: "0 0 auto",
            marginLeft: "auto",
          }}
        >
          {stepNames[currentStep]}
        </div>
      </div>
    );
  }

  // Desktop view with full labels
  return (
    <div style={containerStyles} data-testid='step-indicator'>
      {stepNames.map((stepName, index) => (
        <React.Fragment key={index}>
          {renderStep(stepName, index)}
          {renderConnector(index)}
        </React.Fragment>
      ))}
    </div>
  );
}
