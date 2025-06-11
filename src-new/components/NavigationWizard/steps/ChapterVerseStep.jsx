/**
 * ChapterVerseStep.jsx
 * Final step of the wizard: Chapter and verse selection
 */

import React, { useState, useMemo } from "react";
import styles from "../NavigationWizard.module.css";

export function ChapterVerseStep({
  onNext,
  onPrevious,
  onComplete,
  onStepChange,
  wizardData,
  isDesktop,
}) {
  const [selectedChapter, setSelectedChapter] = useState(wizardData.chapter || 1);
  const [selectedVerse, setSelectedVerse] = useState(wizardData.verse || 1);

  // Get chapter count from BIBLE_BOOKS data (simplified for demo)
  const getChapterCount = (bookId) => {
    const chapterCounts = {
      gen: 50,
      exo: 40,
      lev: 27,
      num: 36,
      deu: 34,
      jos: 24,
      jdg: 21,
      rut: 4,
      "1sa": 31,
      "2sa": 24,
      mat: 28,
      mrk: 16,
      luk: 24,
      jhn: 21,
      act: 28,
      rom: 16,
      "1co": 16,
      "2co": 13,
      gal: 6,
      eph: 6,
      tit: 3,
      phm: 1,
      rev: 22,
    };
    return chapterCounts[bookId] || 25; // Default fallback
  };

  // Simplified verse count (in reality this would come from Bible API)
  const getVerseCount = (bookId, chapter) => {
    // This is a simplified version - in practice, this would be fetched from an API
    return 30; // Default verse count for demo
  };

  const chapterCount = getChapterCount(wizardData.bookId);
  const verseCount = getVerseCount(wizardData.bookId, selectedChapter);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedVerse(1); // Reset verse when chapter changes
    onStepChange(4, {
      bookId: wizardData.bookId,
      chapter: chapter,
      verse: 1,
    });
  };

  const handleVerseSelect = (verse) => {
    setSelectedVerse(verse);
    onStepChange(4, {
      bookId: wizardData.bookId,
      chapter: selectedChapter,
      verse: verse,
    });
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const bookDisplayName = useMemo(() => {
    const bookNames = {
      gen: "Genesis",
      exo: "Exodus",
      mat: "Matthew",
      mrk: "Mark",
      luk: "Luke",
      jhn: "John",
      act: "Acts",
      rom: "Romans",
      tit: "Titus",
      phm: "Philemon",
      rev: "Revelation",
    };
    return bookNames[wizardData.bookId] || wizardData.bookId?.toUpperCase();
  }, [wizardData.bookId]);

  const renderNumberGrid = (count, selected, onSelect, label) => {
    const numbers = Array.from({ length: count }, (_, i) => i + 1);

    return (
      <div className={`${styles.numberGridSection} ${isDesktop ? styles.desktop : ""}`}>
        <h3 className={`${styles.numberGridTitle} ${isDesktop ? styles.desktop : ""}`}>{label}</h3>
        <div className={`${styles.numberGrid} ${isDesktop ? styles.desktop : ""}`}>
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onSelect(num)}
              className={`${styles.numberButton} ${selected === num ? styles.selected : ""} ${
                isDesktop ? styles.desktop : ""
              }`}
              data-testid={`${label.toLowerCase()}-${num}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.stepContainer} ${isDesktop ? styles.desktop : ""}`}>
      {/* Step header */}
      <div className={`${styles.stepHeader} ${isDesktop ? styles.desktop : ""}`}>
        <h2 className={`${styles.stepTitle} ${isDesktop ? styles.desktop : ""}`}>
          Choose Chapter & Verse
        </h2>
        <p className={`${styles.stepDescription} ${isDesktop ? styles.desktop : ""}`}>
          Select the chapter and verse in <strong>{bookDisplayName}</strong> you want to study.
        </p>
      </div>

      {/* Content area */}
      <div className={`${styles.stepContent} ${isDesktop ? styles.desktop : ""}`}>
        {/* Chapter Selection */}
        {renderNumberGrid(chapterCount, selectedChapter, handleChapterSelect, "Chapter")}

        {/* Verse Selection */}
        {renderNumberGrid(verseCount, selectedVerse, handleVerseSelect, "Verse")}

        {/* Summary */}
        <div className={`${styles.summarySection} ${isDesktop ? styles.desktop : ""}`}>
          <div className={`${styles.summaryTitle} ${isDesktop ? styles.desktop : ""}`}>
            Selected Reference
          </div>
          <div className={`${styles.summaryReference} ${isDesktop ? styles.desktop : ""}`}>
            {bookDisplayName} {selectedChapter}:{selectedVerse}
          </div>
        </div>
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
          className={`${styles.navigationButton} ${styles.primary} ${styles.complete} ${
            isDesktop ? styles.desktop : ""
          }`}
          onClick={handleComplete}
          data-testid='complete-button'
        >
          Complete Selection
        </button>
      </div>
    </div>
  );
}
