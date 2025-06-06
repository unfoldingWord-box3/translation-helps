/**
 * NavigationBreadcrumbs.jsx
 * Clickable breadcrumbs showing current navigation path
 * Replaces dropdowns and wizard button with intuitive navigation
 */

import React, { useContext } from "react";
import { ReferenceContext } from "../context/ReferenceContext";
import { AVAILABLE_BOOKS } from "../utils/defaultReference";
import { useOrganizations } from "../hooks/useOrganizations";
import { useLanguages } from "../hooks/useLanguages";
import { useResources } from "../hooks/useResources";

export function NavigationBreadcrumbs({ onOpenWizard }) {
  const { organization, languageId, resourceId, reference } = useContext(ReferenceContext);

  // Use hooks to get display names
  const { organizations } = useOrganizations();
  const { languages } = useLanguages(organization);
  const { resources } = useResources(organization, languageId);

  // Helper functions to get display names
  const getOrganizationName = () => {
    return organization || "Organization";
  };

  const getLanguageName = () => {
    if (!languageId) return "Language";
    const lang = languages.find((l) => l.code === languageId);
    return lang ? `${lang.code.toUpperCase()} - ${lang.name}` : languageId.toUpperCase();
  };

  const getResourceName = () => {
    if (!resourceId) return "Resource";
    const resource = resources.find((r) => r.id === resourceId);
    return resource ? resource.name || resource.id.toUpperCase() : resourceId.toUpperCase();
  };

  const getBookName = () => {
    if (!reference.bookId) return "Book";
    const book = AVAILABLE_BOOKS.find((b) => b.id === reference.bookId);
    return book ? book.name : reference.bookId.toUpperCase();
  };

  const getChapterVerse = () => {
    if (!reference.chapter || !reference.verse) return "Chapter:Verse";
    return `${reference.chapter}:${reference.verse}`;
  };

  // Navigation steps configuration
  const breadcrumbSteps = [
    {
      id: 1,
      label: getOrganizationName(),
      completed: !!organization,
      enabled: true,
      icon: "🏢",
    },
    {
      id: 2,
      label: getLanguageName(),
      completed: !!languageId,
      enabled: !!organization,
      icon: "🌐",
    },
    {
      id: 3,
      label: getResourceName(),
      completed: !!resourceId,
      enabled: !!organization && !!languageId,
      icon: "📖",
    },
    {
      id: 4,
      label: getBookName(),
      completed: !!reference.bookId,
      enabled: !!resourceId,
      icon: "📚",
    },
    {
      id: 5,
      label: getChapterVerse(),
      completed: !!reference.chapter && !!reference.verse,
      enabled: !!reference.bookId,
      icon: "📍",
    },
  ];

  const handleBreadcrumbClick = (stepId) => {
    onOpenWizard(stepId);
  };

  const getStepStyle = (step) => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: step.enabled ? "pointer" : "default",
      transition: "all 0.2s ease",
      border: "1px solid transparent",
      textDecoration: "none",
      userSelect: "none",
    };

    if (!step.enabled) {
      return {
        ...baseStyle,
        color: "rgba(255, 255, 255, 0.5)",
        cursor: "not-allowed",
      };
    }

    if (step.completed) {
      return {
        ...baseStyle,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      };
    }

    return {
      ...baseStyle,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    };
  };

  const getHoverStyle = (step) => {
    if (!step.enabled) return {};

    return {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {breadcrumbSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          <button
            onClick={() => step.enabled && handleBreadcrumbClick(step.id)}
            style={getStepStyle(step)}
            onMouseEnter={(e) => {
              if (step.enabled) {
                Object.assign(e.target.style, getHoverStyle(step));
              }
            }}
            onMouseLeave={(e) => {
              if (step.enabled) {
                Object.assign(e.target.style, getStepStyle(step));
              }
            }}
            title={step.enabled ? `Click to change ${step.label}` : `Complete previous steps first`}
            data-testid={`breadcrumb-${step.id}`}
          >
            <span style={{ fontSize: "16px" }}>{step.icon}</span>
            <span>{step.label}</span>
            {step.completed && <span style={{ fontSize: "12px", marginLeft: "4px" }}>✓</span>}
          </button>

          {/* Separator Arrow */}
          {index < breadcrumbSteps.length - 1 && (
            <span
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "12px",
                userSelect: "none",
              }}
            >
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
