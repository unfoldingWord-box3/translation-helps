/**
 * SearchPanel.jsx
 * Scripture search component with fallback to direct USFM text search
 */
import React, { useState, useContext, useRef, useCallback, useMemo, useEffect } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { useProskomma, useImport, useSearchForPassages } from "proskomma-react-hooks";

/**
 * @param {object} props
 * @param {string} props.org - Organization
 * @param {string} props.lang - Language code
 * @param {string} props.abbr - Book abbreviation
 * @param {string} props.usfm - USFM content
 * @param {function} props.onResultClick - Callback when a search result is clicked
 * @param {object} props.proskommaHook - Shared proskomma hook from parent
 * @param {object} props.importHook - Shared import hook from parent
 */
export default function SearchPanel({
  org,
  lang,
  abbr,
  usfm,
  onResultClick,
  proskommaHook,
  importHook,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [timeoutError, setTimeoutError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const { updateReference } = useContext(ReferenceContext);

  // Debounce search term to prevent search on every keystroke
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Get docSetId directly from proskomma instance (workaround for state issue)
  const docSetId = React.useMemo(() => {
    if (!proskommaHook.proskomma || !importHook.done) return null;
    try {
      const docSets = proskommaHook.proskomma.docSetList();
      return docSets.length > 0 ? docSets[0].id : null;
    } catch (e) {
      console.error("Error getting docSetId:", e);
      return null;
    }
  }, [proskommaHook.proskomma, importHook.done]);

  // Only search if we have a debounced search term and import is complete
  const shouldSearch = !!(debouncedSearchTerm && importHook.done && docSetId);

  // Search for passages containing the search term
  const searchHook = useSearchForPassages({
    ...proskommaHook,
    text: shouldSearch ? debouncedSearchTerm : "",
    docSetId: shouldSearch ? docSetId : null,
    blocks: false, // Search verses, not blocks
    tokens: false, // Don't return token details
  });

  // Fallback: Direct USFM text search when proskomma search returns no results
  const fallbackSearchResults = useMemo(() => {
    if (!searchTerm || !usfm || (searchHook.passages && searchHook.passages.length > 0)) {
      return [];
    }

    console.log("🔍 Using fallback search for:", searchTerm);
    const results = [];

    // Split USFM into verses, handling multi-line verse content
    const verseBlocks = [];
    const lines = usfm.split("\n");
    let currentChapter = null;
    let currentVerse = null;
    let currentVerseContent = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track chapter
      const chapterMatch = line.match(/^\\c (\d+)/);
      if (chapterMatch) {
        // Save previous verse if we have one
        if (currentChapter && currentVerse && currentVerseContent) {
          verseBlocks.push({
            chapter: currentChapter,
            verse: currentVerse,
            content: currentVerseContent.trim(),
          });
        }
        currentChapter = parseInt(chapterMatch[1]);
        currentVerse = null;
        currentVerseContent = "";
        continue;
      }

      // Track verse start
      const verseMatch = line.match(/^\\v (\d+)(.*)$/);
      if (verseMatch && currentChapter) {
        // Save previous verse if we have one
        if (currentVerse && currentVerseContent) {
          verseBlocks.push({
            chapter: currentChapter,
            verse: currentVerse,
            content: currentVerseContent.trim(),
          });
        }

        currentVerse = parseInt(verseMatch[1]);
        currentVerseContent = verseMatch[2] || "";
        continue;
      }

      // Accumulate verse content from subsequent lines
      if (currentVerse && currentChapter) {
        // Skip lines that start with backslash (USFM tags) unless they're part of verse content
        if (!line.startsWith("\\") || line.includes("\\w ")) {
          currentVerseContent += " " + line;
        }
      }
    }

    // Don't forget the last verse
    if (currentChapter && currentVerse && currentVerseContent) {
      verseBlocks.push({
        chapter: currentChapter,
        verse: currentVerse,
        content: currentVerseContent.trim(),
      });
    }

    // Now search through the verses
    for (const verseBlock of verseBlocks) {
      // Clean up USFM markup to get readable text
      let cleanText = verseBlock.content;

      // Extract text from \w tags more carefully - handle both formats:
      // \w word|attributes\w* and \w word \w*
      cleanText = cleanText.replace(/\\w\s+([^\\]*?)(?:\|[^\\]*?)?\\w\*/g, (match, word) => {
        return word.trim();
      });

      // Remove alignment markers and other USFM tags
      cleanText = cleanText.replace(/\\zaln-s[^\\]*?\\?\*/g, " ");
      cleanText = cleanText.replace(/\\zaln-e\\?\*/g, " ");

      // Remove any remaining USFM tags
      cleanText = cleanText.replace(/\\[a-z]+[-\w]*\s*[^\\]*?\*/g, " ");
      cleanText = cleanText.replace(/\\[a-z]+[-\w]*\s*/g, " ");

      // Remove pipe-separated attributes
      cleanText = cleanText.replace(/\|[^|]*?\*/g, "");

      // Normalize whitespace and punctuation
      cleanText = cleanText
        .replace(/\s*,\s*/g, ", ") // Fix comma spacing
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      console.log(`🔍 Verse ${verseBlock.chapter}:${verseBlock.verse} clean text:`, cleanText);

      // Case-insensitive search
      if (cleanText.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          text: cleanText,
          chapter: verseBlock.chapter,
          verse: verseBlock.verse,
          reference: `${abbr.toUpperCase()} ${verseBlock.chapter}:${verseBlock.verse}`,
          scopeLabels: [`chapter/${verseBlock.chapter}`, `verse/${verseBlock.verse}`],
        });
      }
    }

    console.log("🔍 Fallback search found:", results.length, "results");
    return results;
  }, [searchTerm, usfm, abbr, searchHook.passages]);

  // Debug logging for search
  React.useEffect(() => {
    if (shouldSearch) {
      console.log("🔍 SearchPanel Search Debug:");
      console.log("  searchTerm:", searchTerm);
      console.log("  docSetId:", docSetId);
      console.log("  searchHook.loading:", searchHook.loading);
      console.log("  searchHook.passages:", searchHook.passages);
      console.log("  searchHook.errors:", searchHook.errors);

      // Try to get document info
      if (proskommaHook.proskomma && docSetId) {
        try {
          const docSet = proskommaHook.proskomma.processor.docSets[docSetId];
          console.log("  docSet info:", docSet ? Object.keys(docSet) : "not found");

          // Try a direct query to see what's in proskomma
          const query = `{
            docSet(id: "${docSetId}") {
              documents {
                id
                bookCode: header(id: "bookCode")
              }
            }
          }`;

          const result = proskommaHook.proskomma.gqlQuery(query);
          console.log("  proskomma query result:", result);
        } catch (e) {
          console.log("  Error querying proskomma:", e);
        }
      }
    }
  }, [
    shouldSearch,
    searchTerm,
    docSetId,
    searchHook.loading,
    searchHook.passages,
    searchHook.errors,
    proskommaHook.proskomma,
  ]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle search timeout with proper cleanup
  React.useEffect(() => {
    if (searchHook.loading && shouldSearch) {
      setIsSearching(true);
      setTimeoutError("");

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        setTimeoutError("Search timed out. Please try a different search term.");
        setIsSearching(false);
      }, 5000);
    } else {
      setIsSearching(false);
      setTimeoutError("");

      // Clear timeout when search completes
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }
  }, [searchHook.loading, shouldSearch]);

  // Reset error when search term changes
  React.useEffect(() => {
    setTimeoutError("");
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    // The search will automatically trigger when searchTerm changes
    // isSearching state is managed by our useEffect hooks
  };

  const handleResultClick = (result) => {
    // Extract chapter and verse from the result's scope labels
    if (result.scopeLabels && Array.isArray(result.scopeLabels)) {
      const chapterMatch = result.scopeLabels.find((label) => label.startsWith("chapter/"));
      const verseMatch = result.scopeLabels.find((label) => label.startsWith("verse/"));

      if (chapterMatch && verseMatch) {
        const chapter = parseInt(chapterMatch.split("/")[1]);
        const verse = parseInt(verseMatch.split("/")[1]);

        updateReference({ chapter, verse });
        if (onResultClick) {
          onResultClick(verse, chapter, result);
        }
      }
    }
  };

  // Don't show search if import isn't complete
  if (!importHook.done) {
    return (
      <div style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>Preparing search...</div>
    );
  }

  return (
    <div className='search-panel' style={{ padding: "10px", borderTop: "1px solid #eee" }}>
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search scripture text...'
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            type='submit'
            disabled={!searchTerm.trim() || isSearching}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: searchTerm.trim() && !isSearching ? "pointer" : "not-allowed",
              opacity: searchTerm.trim() && !isSearching ? 1 : 0.6,
            }}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Timeout Error */}
      {timeoutError && <div style={{ padding: "10px", color: "red" }}>{timeoutError}</div>}

      {/* Search Results - proskomma or fallback */}
      {((searchHook.passages && searchHook.passages.length > 0) ||
        fallbackSearchResults.length > 0) &&
        !timeoutError && (
          <div className='search-results'>
            <h4 style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>
              Found {(searchHook.passages?.length || 0) + fallbackSearchResults.length} result(s)
              for "{searchTerm}"
              {fallbackSearchResults.length > 0 && !searchHook.passages?.length && (
                <span style={{ fontSize: "12px", color: "#999" }}> (direct text search)</span>
              )}
            </h4>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {/* Proskomma results first */}
              {searchHook.passages &&
                searchHook.passages.map((result, index) => {
                  // Extract chapter and verse info
                  const chapterMatch = result.scopeLabels?.find((label) =>
                    label.startsWith("chapter/")
                  );
                  const verseMatch = result.scopeLabels?.find((label) =>
                    label.startsWith("verse/")
                  );
                  const chapter = chapterMatch ? parseInt(chapterMatch.split("/")[1]) : "?";
                  const verse = verseMatch ? verseMatch.split("/")[1] : "?";

                  return (
                    <div
                      key={`proskomma-${index}`}
                      onClick={() => handleResultClick(result)}
                      style={{
                        padding: "8px",
                        margin: "4px 0",
                        border: "1px solid #eee",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "#f9f9f9",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#e0f7fa")}
                      onMouseLeave={(e) => (e.target.style.background = "#f9f9f9")}
                    >
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                        {abbr.toUpperCase()} {chapter}:{verse}
                      </div>
                      <div style={{ fontSize: "14px" }}>{result.text || "No text available"}</div>
                    </div>
                  );
                })}

              {/* Fallback results */}
              {fallbackSearchResults.map((result, index) => (
                <div
                  key={`fallback-${index}`}
                  onClick={() => handleResultClick(result)}
                  style={{
                    padding: "8px",
                    margin: "4px 0",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: "#f9f9f9",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#e0f7fa")}
                  onMouseLeave={(e) => (e.target.style.background = "#f9f9f9")}
                >
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                    {result.reference}
                  </div>
                  <div style={{ fontSize: "14px" }}>{result.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* No Results */}
      {searchTerm &&
        (!searchHook.passages || searchHook.passages.length === 0) &&
        fallbackSearchResults.length === 0 &&
        !timeoutError && (
          <div style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>
            No results found for "{searchTerm}"
          </div>
        )}

      {/* Search Errors */}
      {searchHook.errors && searchHook.errors.length > 0 && !timeoutError && (
        <div style={{ padding: "10px", color: "red" }}>Search error: {searchHook.errors[0]}</div>
      )}
    </div>
  );
}
