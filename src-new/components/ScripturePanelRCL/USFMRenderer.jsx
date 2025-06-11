/**
 * USFMRenderer.jsx
 * Enhanced USFM renderer using proskomma-react-hooks for optimized verse-by-verse rendering
 * Uses usePassage with individual verse queries for precise verse-level control
 */
import React, { useContext, useMemo, useEffect, useState } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { useProskomma, useImport, usePassage } from "proskomma-react-hooks";

// Timeout constants
const IMPORT_TIMEOUT = 5000; // 5 seconds for import
const PASSAGE_TIMEOUT = 3000; // 3 seconds for passage queries

// Custom hook for managing multiple verse queries
function useVerseQueries(proskommaHook, abbr, chapter, maxVerses = 16) {
  const verseQueries = useMemo(() => {
    if (!abbr || !chapter) return [];
    const queries = [];
    for (let verse = 1; verse <= maxVerses; verse++) {
      queries.push({
        verse,
        reference: `${abbr.toUpperCase()} ${chapter}:${verse}`,
      });
    }
    return queries;
  }, [abbr, chapter, maxVerses]);

  // Create individual usePassage hooks for each verse
  const verseHooks = verseQueries.map(({ verse, reference }) =>
    usePassage({
      ...proskommaHook,
      reference,
      verbose: false, // Reduce logging noise
    })
  );

  // Process results into a clean verses object
  const verses = useMemo(() => {
    const result = {};
    verseHooks.forEach((hook, index) => {
      const verse = verseQueries[index]?.verse;
      if (hook.passages && hook.passages.length > 0 && verse) {
        const passage = hook.passages[0];
        if (passage.text && passage.text.trim()) {
          result[verse] = {
            text: passage.text.trim(),
            reference: passage.reference,
            verse: verse,
          };
        }
      }
    });
    return result;
  }, [verseHooks, verseQueries]);

  return {
    verses,
    loading: verseHooks.some((hook) => !hook.passages || hook.passages.length === 0),
    errors: verseHooks.flatMap((hook) => hook.errors || []),
  };
}

/**
 * @param {object} props
 * @param {number} props.selectedVerse - Currently selected verse number
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 * @param {string} props.org - Organization
 * @param {string} props.lang - Language code
 * @param {string} props.abbr - Book abbreviation
 * @param {string} props.usfm - USFM content
 * @param {number} props.chapter - Current chapter to display
 */
export default function USFMRenderer({
  selectedVerse,
  onVerseClick,
  org,
  lang,
  abbr,
  usfm,
  chapter,
}) {
  const { updateReference } = useContext(ReferenceContext);
  const [importTimedOut, setImportTimedOut] = useState(false);
  const [passageTimedOut, setPassageTimedOut] = useState(false);

  // Create proskomma instance
  const proskommaHook = useProskomma({ verbose: false });

  // Create document configuration for import
  const document = useMemo(() => {
    if (!usfm || !org || !lang || !abbr) return null;
    return [
      {
        selectors: { org, lang, abbr },
        data: usfm,
        bookCode: abbr,
      },
    ];
  }, [usfm, org, lang, abbr]);

  // Import document
  const importHook = useImport({
    ...proskommaHook,
    documents: document || [],
    verbose: false,
  });

  // Set up import timeout
  useEffect(() => {
    if (importHook.importing && !importHook.done) {
      const timeoutId = setTimeout(() => {
        if (importHook.importing && !importHook.done) {
          setImportTimedOut(true);
        }
      }, IMPORT_TIMEOUT);

      return () => clearTimeout(timeoutId);
    } else {
      setImportTimedOut(false);
    }
  }, [importHook.importing, importHook.done]);

  // Use our custom verse queries hook with proskomma instance
  const {
    verses,
    loading: versesLoading,
    errors: verseErrors,
  } = useVerseQueries(
    proskommaHook,
    abbr,
    chapter,
    16 // Max verses for Titus 1
  );

  // Set up passage query timeout
  useEffect(() => {
    if (versesLoading && Object.keys(verses).length === 0) {
      const timeoutId = setTimeout(() => {
        if (versesLoading && Object.keys(verses).length === 0) {
          setPassageTimedOut(true);
        }
      }, PASSAGE_TIMEOUT);

      return () => clearTimeout(timeoutId);
    } else {
      setPassageTimedOut(false);
    }
  }, [versesLoading, verses]);

  // Handle loading states
  if (!usfm || !org || !lang || !abbr) {
    return (
      <div data-testid='usfm-renderer' style={{ padding: "20px", color: "red" }}>
        Missing scripture context.
      </div>
    );
  }

  if (importTimedOut) {
    return (
      <div data-testid='usfm-renderer' style={{ padding: "20px", color: "red" }}>
        Scripture import timed out. Please try again.
      </div>
    );
  }

  if (importHook.importing || !importHook.done) {
    return (
      <div
        data-testid='usfm-renderer'
        style={{ padding: "20px", fontStyle: "italic", color: "#666" }}
      >
        Loading scripture...
      </div>
    );
  }

  if (importHook.errors && importHook.errors.length > 0) {
    return (
      <div data-testid='usfm-renderer' style={{ padding: "20px", color: "red" }}>
        Error importing scripture: {importHook.errors[0].message || String(importHook.errors[0])}
      </div>
    );
  }

  if (passageTimedOut) {
    return (
      <div data-testid='usfm-renderer' style={{ padding: "20px", color: "red" }}>
        Loading chapter timed out. Please try again.
      </div>
    );
  }

  if (versesLoading && Object.keys(verses).length === 0) {
    return (
      <div
        data-testid='usfm-renderer'
        style={{ padding: "20px", fontStyle: "italic", color: "#666" }}
      >
        Loading chapter {chapter}...
      </div>
    );
  }

  if (verseErrors.length > 0) {
    return (
      <div data-testid='usfm-renderer' style={{ padding: "20px", color: "red" }}>
        Error loading verses: {verseErrors[0]}
      </div>
    );
  }

  // Render verse-by-verse using proskomma-react-hooks data
  return (
    <div className='usfm-renderer' data-testid='usfm-renderer'>
      {chapter && Object.keys(verses).length > 0 ? (
        <div className='chapter' key={chapter}>
          <div className='chapter-header'>Chapter {chapter}</div>
          <div className='verses'>
            {Object.values(verses)
              .sort((a, b) => a.verse - b.verse)
              .map((verseData) => (
                <span
                  className={`verse${verseData.verse === selectedVerse ? " selected" : ""}`}
                  key={verseData.verse}
                  style={{
                    cursor: "pointer",
                    background: verseData.verse === selectedVerse ? "#e0f7fa" : undefined,
                    padding: "2px 4px",
                    margin: "0 2px",
                    borderRadius: "3px",
                    display: "inline-block",
                  }}
                  onClick={() => {
                    updateReference({ chapter: chapter, verse: verseData.verse });
                    if (onVerseClick) onVerseClick(verseData.verse, chapter);
                  }}
                >
                  <span className='verse-number'>{verseData.verse}</span>{" "}
                  <span className='verse-text'>{verseData.text}</span>
                </span>
              ))}
          </div>
          {versesLoading && (
            <div style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>
              Loading additional verses...
            </div>
          )}
        </div>
      ) : (
        <div
          data-testid='usfm-renderer'
          style={{ padding: "20px", fontStyle: "italic", color: "#666" }}
        >
          {chapter ? `No verses found for chapter ${chapter}` : "Please select a chapter to view"}
        </div>
      )}
    </div>
  );
}
