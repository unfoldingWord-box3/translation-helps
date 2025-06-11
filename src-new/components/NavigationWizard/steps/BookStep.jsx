/**
 * BookStep.jsx
 * Fourth step of the wizard: Book selection with Testament categorization
 */

import React, { useState, useMemo, useEffect } from "react";
import { SearchableGrid } from "../SearchableGrid";
import { fetchResourceManifest } from "../../../services/manifestService";
import styles from "../NavigationWizard.module.css";

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

// Helper function to get all books
function getAllBooks() {
  return [...BIBLE_BOOKS.old, ...BIBLE_BOOKS.new];
}

export function BookStep({ onNext, onPrevious, onStepChange, wizardData, isDesktop }) {
  const [selectedTestament, setSelectedTestament] = useState("all");
  const [availableBooks, setAvailableBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available books from manifest
  useEffect(() => {
    let isMounted = true;

    const loadAvailableBooks = async () => {
      if (!wizardData.organization || !wizardData.languageId || !wizardData.resourceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const manifest = await fetchResourceManifest(
          wizardData.organization,
          wizardData.languageId,
          wizardData.resourceId
        );

        if (isMounted && manifest && manifest.projects) {
          // Extract book information from manifest projects
          const manifestBooks = manifest.projects
            .filter((project) => project && project.identifier)
            .map((project) => {
              const bookId = project.identifier.toLowerCase();
              const fallbackBook = getAllBooks().find((b) => b.id === bookId);

              return {
                id: bookId,
                name: project.title || (fallbackBook ? fallbackBook.name : bookId.toUpperCase()),
                chapters: project.chapters?.length || (fallbackBook ? fallbackBook.chapters : 1),
                sort:
                  project.sort ||
                  (fallbackBook ? getAllBooks().findIndex((b) => b.id === bookId) : 999),
                categories: project.categories || [],
                versification: project.versification,
              };
            })
            .sort((a, b) => a.sort - b.sort);

          setAvailableBooks(manifestBooks);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.warn("Failed to load manifest books:", err);
          setAvailableBooks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAvailableBooks();

    return () => {
      isMounted = false;
    };
  }, [wizardData.organization, wizardData.languageId, wizardData.resourceId]);

  const handleBookSelect = (book) => {
    onStepChange(4, { bookId: book.id });
  };

  // Only use books from the manifest - no fallback to hardcoded books
  const currentBooks = availableBooks || [];
  const isUsingDynamicBooks = availableBooks !== null && availableBooks.length > 0;

  const { oldTestamentBooks, newTestamentBooks } = useMemo(() => {
    if (isUsingDynamicBooks) {
      // For dynamic books, categorize based on biblical order
      const oldIds = BIBLE_BOOKS.old.map((b) => b.id);
      return {
        oldTestamentBooks: currentBooks.filter((book) => oldIds.includes(book.id)),
        newTestamentBooks: currentBooks.filter((book) => !oldIds.includes(book.id)),
      };
    } else {
      return {
        oldTestamentBooks: BIBLE_BOOKS.old,
        newTestamentBooks: BIBLE_BOOKS.new,
      };
    }
  }, [currentBooks, isUsingDynamicBooks]);

  // Transform books data for SearchableGrid based on testament filter
  let booksToShow = currentBooks;
  if (selectedTestament === "old") {
    booksToShow = oldTestamentBooks;
  } else if (selectedTestament === "new") {
    booksToShow = newTestamentBooks;
  }

  const bookItems = booksToShow.map((book) => ({
    id: book.id,
    name: book.name,
    title: book.name,
    description: `${book.chapters} chapter${book.chapters !== 1 ? "s" : ""}`,
    subtitle: `${book.chapters} chapter${book.chapters !== 1 ? "s" : ""}`,
    icon: getBookIcon(book.id),
    badge: getTestamentBadge(book.id),
    metadata: {
      chapters: book.chapters,
      testament: getTestamentBadge(book.id),
    },
  }));

  // Find selected book
  const selectedBook = bookItems.find((book) => book.id === wizardData.bookId);

  const testamentTabs = [
    { id: "all", label: "All Books", icon: "📖", count: currentBooks.length },
    { id: "old", label: "Old Testament", icon: "📜", count: oldTestamentBooks.length },
    { id: "new", label: "New Testament", icon: "✝️", count: newTestamentBooks.length },
  ];

  return (
    <div className={`${styles.stepContainer} ${isDesktop ? styles.desktop : ""}`}>
      {/* Step header */}
      <div className={`${styles.stepHeader} ${isDesktop ? styles.desktop : ""}`}>
        <h2 className={`${styles.stepTitle} ${isDesktop ? styles.desktop : ""}`}>Choose Book</h2>
        <p className={`${styles.stepDescription} ${isDesktop ? styles.desktop : ""}`}>
          Select the Bible book you want to study.
        </p>
      </div>

      {/* Testament Tabs */}
      <div className={`${styles.tabContainer} ${isDesktop ? styles.desktop : ""}`}>
        {testamentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTestament(tab.id)}
            className={`${styles.tab} ${selectedTestament === tab.id ? styles.active : ""} ${
              isDesktop ? styles.desktop : ""
            }`}
            data-testid={`testament-tab-${tab.id}`}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>
              {isDesktop ? tab.label : tab.label.split(" ")[0]}
            </span>
            <span
              className={`${styles.tabBadge} ${selectedTestament === tab.id ? styles.active : ""}`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className={`${styles.stepContent} ${isDesktop ? styles.desktop : ""}`}>
        <SearchableGrid
          items={bookItems}
          selectedItem={selectedBook}
          onItemSelect={handleBookSelect}
          searchPlaceholder='Search books...'
          emptyMessage='No books found'
          emptyIcon='📖'
          isDesktop={isDesktop}
          isLoading={loading}
          error={error}
          getItemKey={(item) => item.id}
          getItemTitle={(item) => item.title}
          getItemSubtitle={(item) => item.description}
          getItemIcon={(item) => item.icon}
          columns={isDesktop ? 3 : 2}
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
          disabled={!wizardData.bookId}
        >
          Continue
        </button>
      </div>
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
