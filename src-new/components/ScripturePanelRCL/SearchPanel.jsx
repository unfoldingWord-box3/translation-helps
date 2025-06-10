/**
 * SearchPanel.jsx
 * Scripture search component using proskomma-react-hooks useSearchForPassages
 */
import React, { useState, useContext } from "react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { useProskomma, useImport, useSearchForPassages } from "proskomma-react-hooks";

/**
 * @param {object} props
 * @param {string} props.org - Organization
 * @param {string} props.lang - Language code
 * @param {string} props.abbr - Book abbreviation
 * @param {string} props.usfm - USFM content
 * @param {function} props.onResultClick - Callback when a search result is clicked
 */
export default function SearchPanel({ org, lang, abbr, usfm, onResultClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { updateReference } = useContext(ReferenceContext);

  // Initialize Proskomma and import document
  const proskommaHook = useProskomma({ verbose: true });
  console.log("🔍 SearchPanel proskommaHook:", proskommaHook);

  const document = React.useMemo(() => {
    if (!usfm || !org || !lang || !abbr) return null;
    return [
      {
        selectors: { org, lang, abbr },
        data: usfm,
        bookCode: abbr,
      },
    ];
  }, [usfm, org, lang, abbr]);
  console.log("📄 SearchPanel document:", document);

  const importHook = useImport({
    ...proskommaHook,
    documents: document,
  });
  console.log("📥 SearchPanel importHook:", importHook);

  // Search for passages containing the search term
  const searchHook = useSearchForPassages({
    ...proskommaHook,
    text: searchTerm,
    docSetId: importHook.done && proskommaHook.state?.docSetIds?.[0],
    blocks: false, // Search verses, not blocks
    tokens: false, // Don't return token details
  });
  console.log("🔍 SearchPanel searchHook:", searchHook);
  console.log("🔍 SearchPanel searchTerm:", searchTerm);
  console.log("🔍 SearchPanel docSetId:", importHook.done && proskommaHook.state?.docSetIds?.[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    // The hook will automatically trigger when searchTerm changes
    setTimeout(() => setIsSearching(false), 1000); // Reset after delay
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

      {/* Search Results */}
      {searchHook.passages && searchHook.passages.length > 0 && (
        <div className='search-results'>
          <h4 style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>
            Found {searchHook.passages.length} result(s) for "{searchTerm}"
          </h4>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {searchHook.passages.map((result, index) => {
              // Extract chapter and verse info
              const chapterMatch = result.scopeLabels?.find((label) =>
                label.startsWith("chapter/")
              );
              const verseMatch = result.scopeLabels?.find((label) => label.startsWith("verse/"));
              const chapter = chapterMatch ? parseInt(chapterMatch.split("/")[1]) : "?";
              const verse = verseMatch ? verseMatch.split("/")[1] : "?";

              return (
                <div
                  key={index}
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
          </div>
        </div>
      )}

      {/* No Results */}
      {searchTerm && searchHook.passages && searchHook.passages.length === 0 && (
        <div style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>
          No results found for "{searchTerm}"
        </div>
      )}

      {/* Search Errors */}
      {searchHook.errors && searchHook.errors.length > 0 && (
        <div style={{ padding: "10px", color: "red" }}>Search error: {searchHook.errors[0]}</div>
      )}
    </div>
  );
}
