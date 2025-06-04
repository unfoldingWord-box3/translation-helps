/**
 * ReferenceSelector.jsx
 * Enhanced component for hierarchical navigation: Organization → Language → Resource → Book → Chapter → Verse
 */

import React, { useContext, useState, useEffect } from "react";
import { ReferenceContext } from "../context/ReferenceContext";
import { AVAILABLE_BOOKS } from "../utils/defaultReference";
import { useOrganizations } from "../hooks/useOrganizations";
import { useLanguages } from "../hooks/useLanguages";
import { useResources } from "../hooks/useResources";

export function ReferenceSelector() {
  const { organization, languageId, resourceId, reference, updateContext } =
    useContext(ReferenceContext);

  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);

  // Use hooks for dynamic data fetching
  const { organizations, loading: orgsLoading } = useOrganizations();
  const { languages, loading: langsLoading } = useLanguages(organization);
  const { resources, loading: resourcesLoading } = useResources(organization, languageId);

  // Book chapter counts (simplified - in production this would come from a data source)
  const CHAPTER_COUNTS = {
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
    "1ki": 22,
    "2ki": 25,
    "1ch": 29,
    "2ch": 36,
    ezr: 10,
    neh: 13,
    est: 10,
    job: 42,
    psa: 150,
    pro: 31,
    ecc: 12,
    sng: 8,
    isa: 66,
    jer: 52,
    lam: 5,
    ezk: 48,
    dan: 12,
    hos: 14,
    jol: 3,
    amo: 9,
    oba: 1,
    jon: 4,
    mic: 7,
    nam: 3,
    hab: 3,
    zep: 3,
    hag: 2,
    zec: 14,
    mal: 4,
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
    php: 4,
    col: 4,
    "1th": 5,
    "2th": 3,
    "1ti": 6,
    "2ti": 4,
    tit: 3,
    phm: 1,
    heb: 13,
    jas: 5,
    "1pe": 5,
    "2pe": 3,
    "1jn": 5,
    "2jn": 1,
    "3jn": 1,
    jud: 1,
    rev: 22,
  };

  // Update chapters when book changes
  useEffect(() => {
    if (reference.bookId && CHAPTER_COUNTS[reference.bookId]) {
      const chapterCount = CHAPTER_COUNTS[reference.bookId];
      const chapterList = Array.from({ length: chapterCount }, (_, i) => i + 1);
      setChapters(chapterList);
    } else {
      setChapters([]);
    }
  }, [reference.bookId]);

  // Update verses when chapter changes (simplified - assumes max 31 verses)
  useEffect(() => {
    if (reference.chapter) {
      // In production, this would be based on actual verse counts per chapter
      const verseCount = 31; // Simplified
      const verseList = Array.from({ length: verseCount }, (_, i) => i + 1);
      setVerses(verseList);
    } else {
      setVerses([]);
    }
  }, [reference.chapter]);

  // Event handlers with cascading logic
  const handleOrganizationChange = (e) => {
    const newOrganization = e.target.value;
    updateContext({ organization: newOrganization });
  };

  const handleLanguageChange = (e) => {
    const newLanguageId = e.target.value;
    updateContext({ languageId: newLanguageId });
  };

  const handleResourceChange = (e) => {
    const newResourceId = e.target.value;
    updateContext({ resourceId: newResourceId });
  };

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    if (bookId) {
      updateContext({
        reference: {
          ...reference,
          bookId,
          chapter: "1",
          verse: "1",
        },
      });
    } else {
      updateContext({
        reference: {
          ...reference,
          bookId: null,
          chapter: null,
          verse: null,
        },
      });
    }
  };

  const handleChapterChange = (e) => {
    const chapter = e.target.value;
    updateContext({
      reference: {
        ...reference,
        chapter,
        verse: "1",
      },
    });
  };

  const handleVerseChange = (e) => {
    const verse = e.target.value;
    updateContext({
      reference: {
        ...reference,
        verse,
      },
    });
  };

  // Common select styles
  const selectStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    fontSize: "14px",
    minWidth: "120px",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelTextStyle = {
    fontSize: "12px",
    color: "#666",
    fontWeight: "500",
  };

  return (
    <div
      className='reference-selector'
      data-testid='reference-selector'
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Organization Dropdown */}
      <label style={labelStyle}>
        <span style={labelTextStyle}>Organization</span>
        <select
          value={organization || ""}
          onChange={handleOrganizationChange}
          data-testid='organization-selector'
          style={selectStyle}
          disabled={orgsLoading}
        >
          {orgsLoading ? (
            <option>Loading...</option>
          ) : (
            organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))
          )}
        </select>
      </label>

      {/* Language Dropdown */}
      <label style={labelStyle}>
        <span style={labelTextStyle}>Language</span>
        <select
          value={languageId || ""}
          onChange={handleLanguageChange}
          data-testid='language-selector'
          style={selectStyle}
          disabled={!organization || langsLoading}
        >
          {!organization ? (
            <option value=''>Select Organization</option>
          ) : langsLoading ? (
            <option>Loading...</option>
          ) : (
            <>
              <option value=''>Select Language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </>
          )}
        </select>
      </label>

      {/* Resource Dropdown */}
      <label style={labelStyle}>
        <span style={labelTextStyle}>Resource</span>
        <select
          value={resourceId || ""}
          onChange={handleResourceChange}
          data-testid='resource-selector'
          style={selectStyle}
          disabled={!organization || !languageId || resourcesLoading}
        >
          {!organization || !languageId ? (
            <option value=''>Select Language</option>
          ) : resourcesLoading ? (
            <option>Loading...</option>
          ) : (
            <>
              <option value=''>Select Resource</option>
              {resources.map((resource) => (
                <option key={resource} value={resource}>
                  {resource.toUpperCase()}
                </option>
              ))}
            </>
          )}
        </select>
      </label>

      {/* Book Dropdown */}
      <label style={labelStyle}>
        <span style={labelTextStyle}>Book</span>
        <select
          value={reference.bookId || ""}
          onChange={handleBookChange}
          data-testid='book-selector'
          style={selectStyle}
          disabled={!resourceId}
        >
          {!resourceId ? (
            <option value=''>Select Resource</option>
          ) : (
            <>
              <option value=''>Select Book</option>
              {AVAILABLE_BOOKS.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </>
          )}
        </select>
      </label>

      {/* Chapter Dropdown */}
      <label style={labelStyle}>
        <span style={labelTextStyle}>Chapter</span>
        <select
          value={reference.chapter || ""}
          onChange={handleChapterChange}
          data-testid='chapter-selector'
          style={{ ...selectStyle, minWidth: "80px" }}
          disabled={!reference.bookId}
        >
          {!reference.bookId ? (
            <option value=''>Select Book</option>
          ) : chapters.length === 0 ? (
            <option value=''>Loading...</option>
          ) : (
            chapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))
          )}
        </select>
      </label>

      {/* Verse Dropdown */}
      <label style={labelStyle}>
        <span style={labelTextStyle}>Verse</span>
        <select
          value={reference.verse || ""}
          onChange={handleVerseChange}
          data-testid='verse-selector'
          style={{ ...selectStyle, minWidth: "80px" }}
          disabled={!reference.chapter}
        >
          {!reference.chapter ? (
            <option value=''>Select Chapter</option>
          ) : verses.length === 0 ? (
            <option value=''>Loading...</option>
          ) : (
            verses.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))
          )}
        </select>
      </label>

      {/* Current Context Display */}
      <div
        style={{
          marginLeft: "auto",
          fontSize: "14px",
          color: "#666",
          padding: "8px 12px",
          backgroundColor: "white",
          borderRadius: "4px",
          border: "1px solid #e0e0e0",
        }}
      >
        {organization &&
        languageId &&
        resourceId &&
        reference.bookId &&
        reference.chapter &&
        reference.verse
          ? `${organization}/${languageId}/${resourceId}/${reference.bookId.toUpperCase()} ${
              reference.chapter
            }:${reference.verse}`
          : "Select complete context..."}
      </div>
    </div>
  );
}
