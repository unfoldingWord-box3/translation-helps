/**
 * LanguageStep.jsx
 * Second step of the wizard: Language selection
 */

import React, { useState } from "react";
import { useLanguages } from "../../../hooks/useLanguages";
import { SearchableGrid } from "../components/SearchableGrid";
import { RecentSelections } from "../components/RecentSelections";
import { useNavigationHistory } from "../hooks/useNavigationHistory";

export function LanguageStep({ onNext, onPrevious, onStepChange, wizardData, isDesktop }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { languages, loading } = useLanguages(wizardData.organization);
  const { getRecentLanguages } = useNavigationHistory();

  const handleLanguageSelect = (languageId) => {
    onStepChange(2, { languageId });
  };

  const filteredLanguages = languages.filter(
    (lang) =>
      (lang.name && lang.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lang.code && lang.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lang.direction && lang.direction.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const recentLanguages = getRecentLanguages().filter(
    (lang) => lang.organization === wizardData.organization
  );

  const languageOptions = filteredLanguages.map((lang) => ({
    id: lang.code,
    title: lang.name,
    subtitle: `${lang.code} • ${getLanguageDirection(lang.direction)}`,
    icon: getLanguageIcon(lang.direction),
    badge: lang.direction === "rtl" ? "RTL" : null,
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
          Loading languages for {wizardData.organization}...
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
            Choose Language
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
          Select the language for Bible translation resources from{" "}
          <strong>{wizardData.organization}</strong>.
        </p>
      </div>

      {recentLanguages.length > 0 && (
        <RecentSelections
          title='Recent Languages'
          items={recentLanguages.map((lang) => ({
            id: lang.id,
            title: getLanguageDisplayName(lang.id, languages),
            subtitle: "Recently accessed",
            icon: "🗣️",
          }))}
          onSelect={handleLanguageSelect}
          isDesktop={isDesktop}
        />
      )}

      <SearchableGrid
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Search languages...'
        items={languageOptions}
        onSelect={handleLanguageSelect}
        selectedId={wizardData.languageId}
        isDesktop={isDesktop}
        emptyMessage='No languages found for this organization.'
        columns={isDesktop ? 2 : 1}
      />
    </div>
  );
}

function getLanguageDirection(direction) {
  switch (direction) {
    case "rtl":
      return "Right-to-Left";
    case "ltr":
      return "Left-to-Right";
    default:
      return "Left-to-Right";
  }
}

function getLanguageIcon(direction) {
  return direction === "rtl" ? "🔄" : "🗣️";
}

function getLanguageDisplayName(languageId, languages) {
  const language = languages.find((lang) => lang.code === languageId);
  return language ? language.name : languageId;
}
