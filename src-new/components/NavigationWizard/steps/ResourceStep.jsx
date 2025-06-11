/**
 * ResourceStep.jsx
 * Third step of the wizard: Resource selection
 */

import React from "react";
import { useResources } from "../../../hooks/useResources";
import { SearchableGrid } from "../SearchableGrid";
import styles from "../NavigationWizard.module.css";

export function ResourceStep({ onNext, onPrevious, onStepChange, wizardData, isDesktop }) {
  const { resources, loading, error } = useResources(
    wizardData.organization,
    wizardData.languageId
  );

  const handleResourceSelect = (resource) => {
    onStepChange(3, { resourceId: resource.id });
  };

  // Transform resources data for SearchableGrid
  const resourceItems =
    resources?.map((resource) => ({
      id: resource.id,
      name: resource.name || resource.id,
      title: resource.name || resource.id,
      description: resource.description || getResourceDescription(resource),
      subtitle: resource.description || getResourceDescription(resource),
      avatar: resource.avatarUrl,
      icon: getResourceIcon(resource.id),
      badge: getResourceBadge(resource),
      metadata: {
        type: getResourceType(resource.id),
        subject: resource.subject,
      },
    })) || [];

  // Find selected resource
  const selectedResource = resourceItems.find((resource) => resource.id === wizardData.resourceId);

  return (
    <div className={`${styles.stepContainer} ${isDesktop ? styles.desktop : ""}`}>
      {/* Step header */}
      <div className={`${styles.stepHeader} ${isDesktop ? styles.desktop : ""}`}>
        <h2 className={`${styles.stepTitle} ${isDesktop ? styles.desktop : ""}`}>
          Choose Resource
        </h2>
        <p className={`${styles.stepDescription} ${isDesktop ? styles.desktop : ""}`}>
          Select the Bible translation resource you want to access.
        </p>
      </div>

      {/* Content area */}
      <div className={`${styles.stepContent} ${isDesktop ? styles.desktop : ""}`}>
        <SearchableGrid
          items={resourceItems}
          selectedItem={selectedResource}
          onItemSelect={handleResourceSelect}
          searchPlaceholder='Search resources...'
          emptyMessage='No resources found for this language'
          emptyIcon='📄'
          isDesktop={isDesktop}
          isLoading={loading}
          error={error}
          getItemKey={(item) => item.id}
          getItemTitle={(item) => item.title}
          getItemSubtitle={(item) => item.description}
          getItemIcon={(item) => item.icon}
          getItemAvatar={(item) => item.avatar}
        />
      </div>

      {/* Navigation */}
      <div className={`${styles.stepNavigation} ${isDesktop ? styles.desktop : ""}`}>
        <button
          type='button'
          className={`${styles.navigationButton} ${styles.secondary} ${
            isDesktop ? styles.desktop : ""
          }`}
          onClick={onPrevious}
        >
          Back
        </button>
        <button
          type='button'
          className={`${styles.navigationButton} ${styles.primary} ${
            isDesktop ? styles.desktop : ""
          }`}
          onClick={onNext}
          disabled={!wizardData.resourceId}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function getResourceDescription(resource) {
  const descriptions = {
    "Bible Translation": `${resource.subject || "Bible"} • ${resource.id.toUpperCase()}`,
    "Study Notes": "Translation Notes",
    Questions: "Translation Questions",
    Words: "Translation Words",
    Academy: "Translation Academy",
  };

  const type = getResourceType(resource.id);
  return (
    descriptions[type] ||
    resource.description ||
    `${resource.subject || "Resource"} • ${resource.id.toUpperCase()}`
  );
}

function getResourceIcon(resourceId) {
  const icons = {
    ult: "📖",
    ust: "📚",
    utn: "📝",
    utq: "❓",
    utw: "📋",
    uta: "🎓",
    obs: "📚",
    bible: "📖",
    tn: "📝",
    tq: "❓",
    tw: "📋",
    ta: "🎓",
  };

  const id = resourceId.toLowerCase();
  return icons[id] || "📄";
}

function getResourceBadge(resource) {
  if (resource.id.toLowerCase().includes("ult")) return "Literal";
  if (resource.id.toLowerCase().includes("ust")) return "Simplified";
  if (resource.id.toLowerCase().includes("obs")) return "Stories";
  return null;
}

function getResourceType(resourceId) {
  const id = resourceId.toLowerCase();
  if (["ult", "ust", "bible", "obs"].includes(id)) return "Bible Translation";
  if (["utn", "tn"].includes(id)) return "Study Notes";
  if (["utq", "tq"].includes(id)) return "Questions";
  if (["utw", "tw"].includes(id)) return "Words";
  if (["uta", "ta"].includes(id)) return "Academy";
  return "Other Resources";
}
