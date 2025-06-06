/**
 * OrganizationStep.jsx
 * First step of the wizard: Organization selection
 */

import React, { useState } from "react";
import { useOrganizations } from "../../../hooks/useOrganizations";
import { SearchableGrid } from "../components/SearchableGrid";
import { RecentSelections } from "../components/RecentSelections";
import { useNavigationHistory } from "../hooks/useNavigationHistory";

export function OrganizationStep({ onNext, onStepChange, wizardData, isDesktop }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { organizations, loading } = useOrganizations();
  const { getRecentOrganizations } = useNavigationHistory();

  const handleOrganizationSelect = (organizationId) => {
    onStepChange(1, { organization: organizationId });
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentOrganizations = getRecentOrganizations();

  const organizationOptions = filteredOrganizations.map((org) => ({
    id: org,
    title: org,
    subtitle: getOrganizationDescription(org),
    icon: getOrganizationIcon(org),
  }));

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "18px", color: "#6c757d", marginBottom: "16px" }}>
          Loading organizations...
        </div>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e9ecef",
            borderTop: "3px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: isDesktop ? "32px" : "16px",
        maxWidth: isDesktop ? "800px" : "100%",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: isDesktop ? "24px" : "20px",
            fontWeight: "600",
            color: "#212529",
            margin: "0 0 8px 0",
          }}
        >
          Choose Organization
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#6c757d",
            margin: 0,
          }}
        >
          Select the organization that provides the Bible translation resources you want to access.
        </p>
      </div>

      {recentOrganizations.length > 0 && (
        <RecentSelections
          title='Recent Organizations'
          items={recentOrganizations.map((org) => ({
            id: org.id,
            title: org.id,
            subtitle: "Recently accessed",
            icon: getOrganizationIcon(org.id),
          }))}
          onSelect={handleOrganizationSelect}
          isDesktop={isDesktop}
        />
      )}

      <SearchableGrid
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Search organizations...'
        items={organizationOptions}
        onSelect={handleOrganizationSelect}
        selectedId={wizardData.organization}
        isDesktop={isDesktop}
        emptyMessage='No organizations found.'
        columns={isDesktop ? 2 : 1}
      />
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
