/**
 * OrganizationStep.jsx
 * First step of the wizard: Organization selection
 */

import React from "react";
import { useOrganizations } from "../../../hooks/useOrganizations";
import { SearchableGrid } from "../SearchableGrid";
import styles from "../NavigationWizard.module.css";

export function OrganizationStep({ onNext, onStepChange, wizardData, isDesktop }) {
  const { organizations, loading, error } = useOrganizations();

  const handleOrganizationSelect = (organization) => {
    onStepChange(1, { organization: organization.id });
  };

  // Transform organizations data for SearchableGrid
  const organizationItems =
    organizations?.map((org) => ({
      id: org.login,
      name: org.full_name || org.login,
      title: org.full_name || org.login,
      description: org.description || getOrganizationDescription(org.login),
      subtitle: org.description || getOrganizationDescription(org.login),
      avatar: org.avatar_url,
      icon: getOrganizationIcon(org.login),
      badge: org.repo_count > 0 ? `${org.repo_count} repos` : null,
      metadata: {
        website: org.website,
        location: org.location,
        visibility: org.visibility,
        repoCount: org.repo_count,
      },
    })) || [];

  // Find selected organization
  const selectedOrganization = organizationItems.find((org) => org.id === wizardData.organization);

  return (
    <div className={`${styles.stepContainer} ${isDesktop ? styles.desktop : ""}`}>
      {/* Step header */}
      <div className={`${styles.stepHeader} ${isDesktop ? styles.desktop : ""}`}>
        <h2 className={`${styles.stepTitle} ${isDesktop ? styles.desktop : ""}`}>
          Choose Organization
        </h2>
        <p className={`${styles.stepDescription} ${isDesktop ? styles.desktop : ""}`}>
          Select the organization that provides the Bible translation resources you want to access.
        </p>
      </div>

      {/* Content area */}
      <div className={`${styles.stepContent} ${isDesktop ? styles.desktop : ""}`}>
        <SearchableGrid
          items={organizationItems}
          selectedItem={selectedOrganization}
          onItemSelect={handleOrganizationSelect}
          searchPlaceholder='Search organizations...'
          emptyMessage='No organizations found'
          emptyIcon='🏢'
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
          className={`${styles.navigationButton} ${styles.primary} ${
            isDesktop ? styles.desktop : ""
          }`}
          onClick={onNext}
          disabled={!wizardData.organization}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function getOrganizationDescription(org) {
  const descriptions = {
    Door43: "Community-driven translation hub",
    unfoldingWord: "Open Bible resources",
    Wycliffe: "Global Bible translation",
    BibleSociety: "Worldwide Bible distribution",
  };
  return descriptions[org] || "Bible translation organization";
}

function getOrganizationIcon(org) {
  const icons = {
    Door43: "🏛️",
    unfoldingWord: "📚",
    Wycliffe: "⛪",
    BibleSociety: "📖",
  };
  return icons[org] || "🏢";
}
