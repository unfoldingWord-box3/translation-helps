/**
 * TranslationWordsPanel.test.jsx
 * Unit tests for TranslationWordsPanel component
 */
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { TranslationWordsPanel } from "./TranslationWordsPanel";
import * as twlService from "../services/twlService";
import * as twService from "../services/twService";

// Mock the services
vi.mock("../services/twlService");
vi.mock("../services/twService");

describe("TranslationWordsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show select verse message when no reference provided", () => {
    render(<TranslationWordsPanel reference={null} />);

    expect(screen.getByText("Select a verse to view translation words.")).toBeInTheDocument();
  });

  it("should show select verse message when reference is incomplete", () => {
    render(<TranslationWordsPanel reference={{ bookId: "gen" }} />);

    expect(screen.getByText("Select a verse to view translation words.")).toBeInTheDocument();
  });

  it("should show loading state while fetching data", async () => {
    // Mock services to return pending promises
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    mockGetLinksForVerse.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    expect(screen.getByText("Loading translation words...")).toBeInTheDocument();
  });

  it("should show no words message when TWL returns no links", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);

    mockGetLinksForVerse.mockResolvedValue([]);
    mockGetArticlesForLinks.mockResolvedValue([]);

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    await waitFor(() => {
      expect(
        screen.getByText("No translation words available for this verse.")
      ).toBeInTheDocument();
    });

    expect(mockGetLinksForVerse).toHaveBeenCalledWith("gen", 1, 1);
  });

  it("should display translation words when data is available", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);

    const mockLinks = ["rc://en/tw/dict/bible/kt/create", "rc://en/tw/dict/bible/kt/heaven"];

    const mockArticles = [
      {
        rcUri: "rc://en/tw/dict/bible/kt/create",
        title: "create",
        content:
          '# create\n\n## Definition:\n\nThe term "create" means to make something exist that did not exist before.\n\n## Translation Suggestions:\n\n* The term "create" could be translated as "make" or "cause to exist".',
        markdown:
          '# create\n\n## Definition:\n\nThe term "create" means to make something exist that did not exist before.',
        url: "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md",
        fetchedAt: "2023-01-01T00:00:00.000Z",
      },
      {
        rcUri: "rc://en/tw/dict/bible/kt/heaven",
        title: "heaven",
        content: '# heaven\n\n## Definition:\n\nThe term "heaven" refers to where God lives.',
        markdown: '# heaven\n\n## Definition:\n\nThe term "heaven" refers to where God lives.',
        url: "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/heaven.md",
        fetchedAt: "2023-01-01T00:00:00.000Z",
      },
    ];

    mockGetLinksForVerse.mockResolvedValue(mockLinks);
    mockGetArticlesForLinks.mockResolvedValue(mockArticles);

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText("Translation Words")).toBeInTheDocument();
      expect(screen.getByText("create")).toBeInTheDocument();
      expect(screen.getByText("heaven")).toBeInTheDocument();
    });

    // Check that article summaries are displayed
    expect(screen.getByText(/The term "create" means to make something exist/)).toBeInTheDocument();
    expect(screen.getByText(/The term "heaven" refers to where God lives/)).toBeInTheDocument();

    // Check that RC URIs are displayed
    expect(screen.getByText("rc://en/tw/dict/bible/kt/create")).toBeInTheDocument();
    expect(screen.getByText("rc://en/tw/dict/bible/kt/heaven")).toBeInTheDocument();

    expect(mockGetLinksForVerse).toHaveBeenCalledWith("gen", 1, 1);
    expect(mockGetArticlesForLinks).toHaveBeenCalledWith(mockLinks);
  });

  it("should show error state when service fails", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);

    mockGetLinksForVerse.mockRejectedValue(new Error("Network error"));

    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load translation words")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("should show debug info in error state when TWL links exist but articles fail", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);

    const mockLinks = ["rc://en/tw/dict/bible/kt/create"];

    mockGetLinksForVerse.mockResolvedValue(mockLinks);
    mockGetArticlesForLinks.mockRejectedValue(new Error("Article fetch failed"));

    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load translation words")).toBeInTheDocument();
      expect(screen.getByText("Debug Info")).toBeInTheDocument();
      expect(screen.getByText("Found 1 TWL link(s) for this verse:")).toBeInTheDocument();
      expect(screen.getByText("rc://en/tw/dict/bible/kt/create")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("should show debug info when TWL links exist but no articles are loaded", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);

    const mockLinks = ["rc://en/tw/dict/bible/kt/nonexistent"];

    mockGetLinksForVerse.mockResolvedValue(mockLinks);
    mockGetArticlesForLinks.mockResolvedValue([]); // No articles successfully loaded

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    await waitFor(() => {
      expect(
        screen.getByText("No translation words available for this verse.")
      ).toBeInTheDocument();
      expect(screen.getByText("Debug Info")).toBeInTheDocument();
      expect(screen.getByText("Found 1 TWL link(s) but no articles loaded.")).toBeInTheDocument();
    });
  });

  it("should call onWordClick when word is clicked and callback is provided", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);
    const mockOnWordClick = vi.fn();

    const mockLinks = ["rc://en/tw/dict/bible/kt/create"];
    const mockArticles = [
      {
        rcUri: "rc://en/tw/dict/bible/kt/create",
        title: "create",
        content: 'The term "create" means to make something exist that did not exist before.',
        markdown:
          '# create\n\nThe term "create" means to make something exist that did not exist before.',
        url: "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md",
        fetchedAt: "2023-01-01T00:00:00.000Z",
      },
    ];

    mockGetLinksForVerse.mockResolvedValue(mockLinks);
    mockGetArticlesForLinks.mockResolvedValue(mockArticles);

    render(
      <TranslationWordsPanel
        reference={{ bookId: "gen", chapter: 1, verse: 1 }}
        onWordClick={mockOnWordClick}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("create")).toBeInTheDocument();
    });

    // Look for the clickable indicator
    expect(screen.getByText("Click to view full article →")).toBeInTheDocument();

    // Click on the word element
    const wordElement = screen.getByText("create").closest("div");
    wordElement.click();

    expect(mockOnWordClick).toHaveBeenCalledWith({
      id: "rc://en/tw/dict/bible/kt/create",
      title: "create",
      content: 'The term "create" means to make something exist that did not exist before.',
      rcUri: "rc://en/tw/dict/bible/kt/create",
      summary: 'The term "create" means to make something exist that did not exist before.',
      error: undefined,
    });
  });

  it("should show tip about TWL when words are displayed", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);

    const mockLinks = ["rc://en/tw/dict/bible/kt/create"];
    const mockArticles = [
      {
        rcUri: "rc://en/tw/dict/bible/kt/create",
        title: "create",
        content: 'The term "create" means to make something exist that did not exist before.',
        markdown:
          '# create\n\nThe term "create" means to make something exist that did not exist before.',
        url: "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md",
        fetchedAt: "2023-01-01T00:00:00.000Z",
      },
    ];

    mockGetLinksForVerse.mockResolvedValue(mockLinks);
    mockGetArticlesForLinks.mockResolvedValue(mockArticles);

    render(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /These words are linked to this verse through Translation Words Links \(TWL\)/
        )
      ).toBeInTheDocument();
    });
  });

  it("should update when reference changes", async () => {
    const mockGetLinksForVerse = vi.mocked(twlService.getLinksForVerse);
    const mockGetArticlesForLinks = vi.mocked(twService.getArticlesForLinks);

    mockGetLinksForVerse.mockResolvedValue([]);
    mockGetArticlesForLinks.mockResolvedValue([]);

    const { rerender } = render(
      <TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No translation words available for this verse.")
      ).toBeInTheDocument();
    });

    expect(mockGetLinksForVerse).toHaveBeenCalledWith("gen", 1, 1);

    // Change reference
    rerender(<TranslationWordsPanel reference={{ bookId: "gen", chapter: 1, verse: 2 }} />);

    await waitFor(() => {
      expect(mockGetLinksForVerse).toHaveBeenCalledWith("gen", 1, 2);
    });

    expect(mockGetLinksForVerse).toHaveBeenCalledTimes(2);
  });
});
