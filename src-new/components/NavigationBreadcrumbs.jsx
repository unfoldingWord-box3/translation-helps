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
    if (!reference.chapter && !reference.verse) return "Chapter:Verse";
    if (reference.chapter && reference.verse) return `${reference.chapter}:${reference.verse}`;
    if (reference.chapter && !reference.verse) return `${reference.chapter}:_`;
    if (!reference.chapter && reference.verse) return `_:${reference.verse}`;
    return "Chapter:Verse";
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
      completed: !!reference.chapter, // Chapter is enough for scripture rendering
      enabled: !!reference.bookId,
      icon: "📍",
    },
  ];

  const handleBreadcrumbClick = (stepId) => {
    onOpenWizard(stepId);
  };

  const getStepClass = (step) => {
    if (!step.enabled) return "breadcrumb-button breadcrumb-disabled";
    if (step.completed) return "breadcrumb-button breadcrumb-completed";
    return "breadcrumb-button breadcrumb-default";
  };

  return (
    <>
      <style>
        {`
          .breadcrumb-button {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            text-decoration: none;
            user-select: none;
            background: none;
          }
          
          .breadcrumb-disabled {
            color: rgba(255, 255, 255, 0.5);
            cursor: not-allowed;
          }
          
          .breadcrumb-completed {
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
          }
          
          .breadcrumb-default {
            background-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
          }
          
          .breadcrumb-completed:hover,
          .breadcrumb-default:hover {
            background-color: rgba(255, 255, 255, 0.3) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .breadcrumb-disabled:hover {
            transform: none;
            box-shadow: none;
          }
        `}
      </style>
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
              className={getStepClass(step)}
              title={
                step.enabled ? `Click to change ${step.label}` : `Complete previous steps first`
              }
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
    </>
  );
}
