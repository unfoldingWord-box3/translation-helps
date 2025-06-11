/**
 * LanguageStep.jsx
 * Second step of the wizard: Language selection
 */

import React from "react";
import { useLanguages } from "../../../hooks/useLanguages";
import { SearchableGrid } from "../SearchableGrid";
import { getLanguageDisplay, hasMultipleFlags } from "../../../utils/languageMapping";
import styles from "../NavigationWizard.module.css";

export function LanguageStep({ onNext, onPrevious, onStepChange, wizardData, isDesktop }) {
  const { languages, loading, error } = useLanguages(wizardData.organization);

  const handleLanguageSelect = (language) => {
    onStepChange(2, { languageId: language.id });
  };

  // Transform languages data for SearchableGrid
  const languageItems =
    languages?.map((lang) => {
      const languageDisplay = getLanguageDisplay(lang.code, lang.name, {
        showAllFlags: hasMultipleFlags(lang.code),
        showDirection: true,
      });

      return {
        id: lang.code,
        name: lang.name,
        title: lang.name,
        description: `${lang.code} • ${
          languageDisplay.direction === "rtl" ? "Right-to-Left" : "Left-to-Right"
        }`,
        subtitle: `${lang.code} • ${
          languageDisplay.direction === "rtl" ? "Right-to-Left" : "Left-to-Right"
        }`,
        icon: languageDisplay.flag,
        badge: languageDisplay.isRTL ? "RTL" : null,
        metadata: {
          direction: languageDisplay.direction,
          isRTL: languageDisplay.isRTL,
          tooltip: languageDisplay.flagsTooltip,
        },
      };
    }) || [];

  // Find selected language
  const selectedLanguage = languageItems.find((lang) => lang.id === wizardData.languageId);

  return (
    <div className={`${styles.stepContainer} ${isDesktop ? styles.desktop : ""}`}>
      {/* Step header */}
      <div className={`${styles.stepHeader} ${isDesktop ? styles.desktop : ""}`}>
        <h2 className={`${styles.stepTitle} ${isDesktop ? styles.desktop : ""}`}>
          Choose Language
        </h2>
        <p className={`${styles.stepDescription} ${isDesktop ? styles.desktop : ""}`}>
          Select the language for Bible translation resources from{" "}
          <strong>{wizardData.organization}</strong>.
        </p>
      </div>

      {/* Content area */}
      <div className={`${styles.stepContent} ${isDesktop ? styles.desktop : ""}`}>
        <SearchableGrid
          items={languageItems}
          selectedItem={selectedLanguage}
          onItemSelect={handleLanguageSelect}
          searchPlaceholder='Search languages...'
          emptyMessage='No languages found for this organization'
          emptyIcon='🌐'
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
          disabled={!wizardData.languageId}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
