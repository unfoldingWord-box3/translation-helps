/**
 * ResourceStep.jsx
 * Third step of the wizard: Resource selection
 */

import React, { useState } from "react";
import { useResources } from "../../../hooks/useResources";
import { SearchableGrid } from "../components/SearchableGrid";
import { RecentSelections } from "../components/RecentSelections";
import { useNavigationHistory } from "../hooks/useNavigationHistory";

export function ResourceStep({ onNext, onPrevious, onStepChange, wizardData, isDesktop }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { resources, loading } = useResources(wizardData.organization, wizardData.languageId);
  const { getRecentSelections } = useNavigationHistory();

  const handleResourceSelect = (resourceId) => {
    onStepChange(3, { resourceId });
  };

  const filteredResources = resources.filter(
    (resource) =>
      (resource.name && resource.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.id && resource.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.description &&
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.subject && resource.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const recentResources = getRecentSelections()
    .filter(
      (selection) =>
        selection.organization === wizardData.organization &&
        selection.languageId === wizardData.languageId &&
        selection.resourceId
    )
    .map((selection) => ({
      id: selection.resourceId,
      title: getResourceDisplayName(selection.resourceId, resources),
      subtitle: "Recently accessed",
      icon: getResourceIcon(selection.resourceId),
    }));

  const resourceOptions = filteredResources.map((resource) => ({
    id: resource.id,
    title: resource.name || resource.id,
    subtitle: resource.description || getResourceDescription(resource),
    icon: resource.avatarUrl || getResourceIcon(resource.id), // Use repository avatar if available
    fallbackIcon: getResourceIcon(resource.id), // Fallback emoji icon
    badge: getResourceBadge(resource),
  }));

  // Group resources by type for better organization
  const groupedResources = groupResourcesByType(resourceOptions);

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
          Loading resources...
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <button
            onClick={onPrevious}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
              color: "#007bff",
            }}
            data-testid='back-button'
          >
            ←
          </button>
          <h2
            style={{
              fontSize: isDesktop ? "24px" : "20px",
              fontWeight: "600",
              color: "#212529",
              margin: 0,
            }}
          >
            Choose Resource
          </h2>
        </div>
        <p
          style={{
            fontSize: "16px",
            color: "#6c757d",
            margin: 0,
            paddingLeft: "32px",
          }}
        >
          Select the Bible translation resource you want to access.
        </p>
      </div>

      {recentResources.length > 0 && (
        <RecentSelections
          title='Recent Resources'
          items={recentResources}
          onSelect={handleResourceSelect}
          isDesktop={isDesktop}
        />
      )}

      <SearchableGrid
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Search resources...'
        items={resourceOptions}
        onSelect={handleResourceSelect}
        selectedId={wizardData.resourceId}
        isDesktop={isDesktop}
        emptyMessage='No resources found for this language.'
        columns={isDesktop ? 2 : 1}
      />

      {/* Resource type sections for better organization */}
      {searchTerm === "" && Object.keys(groupedResources).length > 1 && (
        <div style={{ marginTop: "32px" }}>
          {Object.entries(groupedResources).map(([type, typeResources]) => (
            <div key={type} style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#495057",
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {getResourceTypeIcon(type)}
                {type}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isDesktop ? "repeat(2, 1fr)" : "1fr",
                  gap: isDesktop ? "16px" : "12px",
                }}
              >
                {typeResources.map((resource) => (
                  <div
                    key={resource.id}
                    onClick={() => handleResourceSelect(resource.id)}
                    style={{
                      padding: "16px",
                      border: `2px solid ${
                        wizardData.resourceId === resource.id ? "#007bff" : "#e1e5e9"
                      }`,
                      borderRadius: "8px",
                      backgroundColor:
                        wizardData.resourceId === resource.id ? "#f8fcff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                      {resource.icon} {resource.title}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6c757d" }}>{resource.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
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

function getResourceTypeIcon(type) {
  const icons = {
    "Bible Translation": "📖",
    "Study Notes": "📝",
    Questions: "❓",
    Words: "📋",
    Academy: "🎓",
    "Other Resources": "📄",
  };
  return icons[type] || "📄";
}

function groupResourcesByType(resources) {
  return resources.reduce((groups, resource) => {
    const type = getResourceType(resource.id);
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(resource);
    return groups;
  }, {});
}

function getResourceDisplayName(resourceId, resources) {
  const resource = resources.find((r) => r.id === resourceId);
  return resource ? resource.name || resource.id : resourceId.toUpperCase();
}
