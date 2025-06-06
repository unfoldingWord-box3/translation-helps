/**
 * ChapterVerseStep.jsx
 * Final step of the wizard: Chapter and verse selection
 */

import React, { useState, useMemo } from "react";
import { useNavigationHistory } from "../hooks/useNavigationHistory";

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
  const { getRecentSelections } = useNavigationHistory();

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

  const recentChapters = getRecentSelections()
    .filter(
      (selection) =>
        selection.organization === wizardData.organization &&
        selection.languageId === wizardData.languageId &&
        selection.resourceId === wizardData.resourceId &&
        selection.bookId === wizardData.bookId
    )
    .slice(0, 5);

  const renderNumberGrid = (count, selected, onSelect, label) => {
    const numbers = Array.from({ length: count }, (_, i) => i + 1);
    const maxCols = isDesktop ? 10 : 5;

    return (
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: isDesktop ? "18px" : "16px",
            fontWeight: "600",
            color: "#495057",
            margin: "0 0 16px 0",
          }}
        >
          {label}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(count, maxCols)}, 1fr)`,
            gap: isDesktop ? "8px" : "6px",
            maxHeight: isDesktop ? "200px" : "150px",
            overflowY: "auto",
            padding: "4px",
          }}
        >
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onSelect(num)}
              style={{
                padding: isDesktop ? "8px" : "6px",
                border: `2px solid ${selected === num ? "#007bff" : "#e1e5e9"}`,
                borderRadius: "6px",
                backgroundColor: selected === num ? "#007bff" : "#ffffff",
                color: selected === num ? "#ffffff" : "#495057",
                cursor: "pointer",
                fontSize: isDesktop ? "14px" : "12px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                minHeight: isDesktop ? "36px" : "32px",
              }}
              onMouseEnter={(e) => {
                if (selected !== num) {
                  e.target.style.borderColor = "#007bff";
                  e.target.style.backgroundColor = "#f8fcff";
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== num) {
                  e.target.style.borderColor = "#e1e5e9";
                  e.target.style.backgroundColor = "#ffffff";
                }
              }}
              data-testid={`${label.toLowerCase()}-${num}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
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
            Choose Chapter & Verse
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
          Select the chapter and verse in <strong>{bookDisplayName}</strong> you want to study.
        </p>
      </div>

      {/* Recent Selections */}
      {recentChapters.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: isDesktop ? "18px" : "16px",
              fontWeight: "600",
              color: "#495057",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⏱️</span>
            Recent References
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "repeat(auto-fit, minmax(200px, 1fr))" : "1fr",
              gap: isDesktop ? "12px" : "8px",
            }}
          >
            {recentChapters.map((recent, index) => (
              <button
                key={index}
                onClick={() => {
                  handleChapterSelect(recent.chapter);
                  handleVerseSelect(recent.verse || 1);
                }}
                style={{
                  padding: "12px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#007bff";
                  e.target.style.backgroundColor = "#f8fcff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#e1e5e9";
                  e.target.style.backgroundColor = "#ffffff";
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {bookDisplayName} {recent.chapter}:{recent.verse || 1}
                </div>
                <div style={{ fontSize: "12px", color: "#6c757d" }}>Recently accessed</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Selection */}
      {renderNumberGrid(chapterCount, selectedChapter, handleChapterSelect, "Chapter")}

      {/* Verse Selection */}
      {renderNumberGrid(verseCount, selectedVerse, handleVerseSelect, "Verse")}

      {/* Summary and Complete Button */}
      <div
        style={{
          marginTop: "32px",
          padding: isDesktop ? "24px" : "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          border: "2px solid #e1e5e9",
        }}
      >
        <div
          style={{
            fontSize: isDesktop ? "18px" : "16px",
            fontWeight: "600",
            color: "#212529",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Selected Reference
        </div>
        <div
          style={{
            fontSize: isDesktop ? "24px" : "20px",
            fontWeight: "700",
            color: "#007bff",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {bookDisplayName} {selectedChapter}:{selectedVerse}
        </div>
        <button
          onClick={handleComplete}
          style={{
            width: "100%",
            padding: isDesktop ? "16px 24px" : "12px 16px",
            backgroundColor: "#28a745",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: isDesktop ? "16px" : "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#218838";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#28a745";
            e.target.style.transform = "translateY(0)";
          }}
          data-testid='complete-button'
        >
          ✅ Complete Selection
        </button>
      </div>
    </div>
  );
}
