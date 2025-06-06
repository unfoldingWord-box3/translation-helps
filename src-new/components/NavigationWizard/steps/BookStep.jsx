/**
 * BookStep.jsx
 * Fourth step of the wizard: Book selection with Testament categorization
 */

import React, { useState, useMemo } from "react";
import { SearchableGrid } from "../components/SearchableGrid";
import { RecentSelections } from "../components/RecentSelections";
import { useNavigationHistory } from "../hooks/useNavigationHistory";

// Bible book data with testament categorization
const BIBLE_BOOKS = {
  old: [
    { id: "gen", name: "Genesis", chapters: 50 },
    { id: "exo", name: "Exodus", chapters: 40 },
    { id: "lev", name: "Leviticus", chapters: 27 },
    { id: "num", name: "Numbers", chapters: 36 },
    { id: "deu", name: "Deuteronomy", chapters: 34 },
    { id: "jos", name: "Joshua", chapters: 24 },
    { id: "jdg", name: "Judges", chapters: 21 },
    { id: "rut", name: "Ruth", chapters: 4 },
    { id: "1sa", name: "1 Samuel", chapters: 31 },
    { id: "2sa", name: "2 Samuel", chapters: 24 },
    { id: "1ki", name: "1 Kings", chapters: 22 },
    { id: "2ki", name: "2 Kings", chapters: 25 },
    { id: "1ch", name: "1 Chronicles", chapters: 29 },
    { id: "2ch", name: "2 Chronicles", chapters: 36 },
    { id: "ezr", name: "Ezra", chapters: 10 },
    { id: "neh", name: "Nehemiah", chapters: 13 },
    { id: "est", name: "Esther", chapters: 10 },
    { id: "job", name: "Job", chapters: 42 },
    { id: "psa", name: "Psalms", chapters: 150 },
    { id: "pro", name: "Proverbs", chapters: 31 },
    { id: "ecc", name: "Ecclesiastes", chapters: 12 },
    { id: "sng", name: "Song of Songs", chapters: 8 },
    { id: "isa", name: "Isaiah", chapters: 66 },
    { id: "jer", name: "Jeremiah", chapters: 52 },
    { id: "lam", name: "Lamentations", chapters: 5 },
    { id: "ezk", name: "Ezekiel", chapters: 48 },
    { id: "dan", name: "Daniel", chapters: 12 },
    { id: "hos", name: "Hosea", chapters: 14 },
    { id: "jol", name: "Joel", chapters: 3 },
    { id: "amo", name: "Amos", chapters: 9 },
    { id: "oba", name: "Obadiah", chapters: 1 },
    { id: "jon", name: "Jonah", chapters: 4 },
    { id: "mic", name: "Micah", chapters: 7 },
    { id: "nam", name: "Nahum", chapters: 3 },
    { id: "hab", name: "Habakkuk", chapters: 3 },
    { id: "zep", name: "Zephaniah", chapters: 3 },
    { id: "hag", name: "Haggai", chapters: 2 },
    { id: "zec", name: "Zechariah", chapters: 14 },
    { id: "mal", name: "Malachi", chapters: 4 },
  ],
  new: [
    { id: "mat", name: "Matthew", chapters: 28 },
    { id: "mrk", name: "Mark", chapters: 16 },
    { id: "luk", name: "Luke", chapters: 24 },
    { id: "jhn", name: "John", chapters: 21 },
    { id: "act", name: "Acts", chapters: 28 },
    { id: "rom", name: "Romans", chapters: 16 },
    { id: "1co", name: "1 Corinthians", chapters: 16 },
    { id: "2co", name: "2 Corinthians", chapters: 13 },
    { id: "gal", name: "Galatians", chapters: 6 },
    { id: "eph", name: "Ephesians", chapters: 6 },
    { id: "php", name: "Philippians", chapters: 4 },
    { id: "col", name: "Colossians", chapters: 4 },
    { id: "1th", name: "1 Thessalonians", chapters: 5 },
    { id: "2th", name: "2 Thessalonians", chapters: 3 },
    { id: "1ti", name: "1 Timothy", chapters: 6 },
    { id: "2ti", name: "2 Timothy", chapters: 4 },
    { id: "tit", name: "Titus", chapters: 3 },
    { id: "phm", name: "Philemon", chapters: 1 },
    { id: "heb", name: "Hebrews", chapters: 13 },
    { id: "jas", name: "James", chapters: 5 },
    { id: "1pe", name: "1 Peter", chapters: 5 },
    { id: "2pe", name: "2 Peter", chapters: 3 },
    { id: "1jn", name: "1 John", chapters: 5 },
    { id: "2jn", name: "2 John", chapters: 1 },
    { id: "3jn", name: "3 John", chapters: 1 },
    { id: "jud", name: "Jude", chapters: 1 },
    { id: "rev", name: "Revelation", chapters: 22 },
  ],
};

export function BookStep({ onNext, onPrevious, onStepChange, wizardData, isDesktop }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestament, setSelectedTestament] = useState("all");
  const { getRecentBooks } = useNavigationHistory();

  const handleBookSelect = (bookId) => {
    onStepChange(4, { bookId });
  };

  const allBooks = [...BIBLE_BOOKS.old, ...BIBLE_BOOKS.new];

  const filteredBooks = useMemo(() => {
    let books = allBooks;

    // Filter by testament
    if (selectedTestament === "old") {
      books = BIBLE_BOOKS.old;
    } else if (selectedTestament === "new") {
      books = BIBLE_BOOKS.new;
    }

    // Filter by search term
    if (searchTerm) {
      books = books.filter(
        (book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return books;
  }, [searchTerm, selectedTestament]);

  const recentBooks = getRecentBooks().filter(
    (book) =>
      book.organization === wizardData.organization &&
      book.languageId === wizardData.languageId &&
      book.resourceId === wizardData.resourceId
  );

  const bookOptions = filteredBooks.map((book) => ({
    id: book.id,
    title: book.name,
    subtitle: `${book.chapters} chapter${book.chapters !== 1 ? "s" : ""}`,
    icon: getBookIcon(book.id),
    badge: getTestamentBadge(book.id),
  }));

  const testamentTabs = [
    { id: "all", label: "All Books", icon: "📖", count: allBooks.length },
    { id: "old", label: "Old Testament", icon: "📜", count: BIBLE_BOOKS.old.length },
    { id: "new", label: "New Testament", icon: "✝️", count: BIBLE_BOOKS.new.length },
  ];

  const tabStyles = (isActive) => ({
    padding: isDesktop ? "12px 20px" : "8px 12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: isActive ? "#007bff" : "#f8f9fa",
    color: isActive ? "#ffffff" : "#495057",
    cursor: "pointer",
    fontSize: isDesktop ? "14px" : "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flex: isDesktop ? "0 0 auto" : "1",
    minWidth: 0,
  });

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
            Choose Book
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
          Select the Bible book you want to study.
        </p>
      </div>

      {recentBooks.length > 0 && (
        <RecentSelections
          title='Recent Books'
          items={recentBooks.map((book) => ({
            id: book.id,
            title: getBookDisplayName(book.id),
            subtitle: "Recently accessed",
            icon: getBookIcon(book.id),
          }))}
          onSelect={handleBookSelect}
          isDesktop={isDesktop}
        />
      )}

      {/* Testament Tabs */}
      <div
        style={{
          display: "flex",
          gap: isDesktop ? "12px" : "8px",
          marginBottom: "24px",
          padding: "4px",
          backgroundColor: "#f1f3f4",
          borderRadius: "12px",
        }}
      >
        {testamentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTestament(tab.id)}
            style={tabStyles(selectedTestament === tab.id)}
            data-testid={`testament-tab-${tab.id}`}
          >
            <span>{tab.icon}</span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {isDesktop ? tab.label : tab.label.split(" ")[0]}
            </span>
            <span
              style={{
                backgroundColor: selectedTestament === tab.id ? "rgba(255,255,255,0.2)" : "#dee2e6",
                color: selectedTestament === tab.id ? "#ffffff" : "#6c757d",
                padding: "2px 6px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <SearchableGrid
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Search books...'
        items={bookOptions}
        onSelect={handleBookSelect}
        selectedId={wizardData.bookId}
        isDesktop={isDesktop}
        emptyMessage='No books found.'
        columns={isDesktop ? 3 : 2}
      />
    </div>
  );
}

function getBookIcon(bookId) {
  // Map book IDs to appropriate icons
  const icons = {
    // Old Testament - Law
    gen: "🌅",
    exo: "🏔️",
    lev: "🕊️",
    num: "🔢",
    deu: "📜",
    // Old Testament - History
    jos: "⚔️",
    jdg: "⚖️",
    rut: "🌾",
    "1sa": "👑",
    "2sa": "👑",
    "1ki": "🏰",
    "2ki": "🏰",
    "1ch": "📊",
    "2ch": "📊",
    ezr: "🔨",
    neh: "🧱",
    est: "👸",
    // Old Testament - Wisdom/Poetry
    job: "💭",
    psa: "🎵",
    pro: "💡",
    ecc: "🤔",
    sng: "💕",
    // Old Testament - Prophets
    isa: "📢",
    jer: "😢",
    lam: "😭",
    ezk: "👁️",
    dan: "🦁",
    hos: "💔",
    jol: "🦗",
    amo: "⚖️",
    oba: "⚡",
    jon: "🐋",
    mic: "🎤",
    nam: "⚡",
    hab: "🤲",
    zep: "🔥",
    hag: "🏗️",
    zec: "🔮",
    mal: "💌",
    // New Testament - Gospels
    mat: "👤",
    mrk: "🦁",
    luk: "🐂",
    jhn: "🦅",
    // New Testament - History
    act: "🔥",
    // New Testament - Paul's Letters
    rom: "🏛️",
    "1co": "⛪",
    "2co": "⛪",
    gal: "⛓️",
    eph: "🏰",
    php: "😊",
    col: "👑",
    "1th": "⏰",
    "2th": "⏰",
    "1ti": "👨‍🏫",
    "2ti": "👨‍🏫",
    tit: "🏝️",
    phm: "🤝",
    // New Testament - General Letters
    heb: "⛪",
    jas: "⚖️",
    "1pe": "🗿",
    "2pe": "🗿",
    "1jn": "💝",
    "2jn": "💝",
    "3jn": "💝",
    jud: "⚠️",
    // New Testament - Prophecy
    rev: "🌟",
  };
  return icons[bookId] || "📖";
}

function getTestamentBadge(bookId) {
  if (BIBLE_BOOKS.old.find((book) => book.id === bookId)) {
    return "OT";
  }
  if (BIBLE_BOOKS.new.find((book) => book.id === bookId)) {
    return "NT";
  }
  return null;
}

function getBookDisplayName(bookId) {
  const allBooks = [...BIBLE_BOOKS.old, ...BIBLE_BOOKS.new];
  const book = allBooks.find((b) => b.id === bookId);
  return book ? book.name : bookId.toUpperCase();
}
