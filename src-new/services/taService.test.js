/**
 * taService.test.js
 * Tests for Translation Academy service module
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getArticle, getArticlesForLinks, clearCache, getCacheStats } from "./taService";

// Mock fetch globally
global.fetch = vi.fn();

describe("taService", () => {
  beforeEach(() => {
    // Clear mocks and cache before each test
    vi.clearAllMocks();
    clearCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getArticle", () => {
    it("should fetch and parse a Translation Academy article successfully", async () => {
      const mockTitleMd = "# How to Translate Names";
      const mockSubtitleMd = "## Translation Strategies for Names";
      const mockContentMd = `Sometimes translators may not know what a name refers to, or readers may not understand what a name refers to. If a name creates a problem for understanding the message or translation, here are some strategies you can use.

1. If readers would understand the name, then use it.
2. If readers would not understand the name, then use a general word instead.
3. If readers would not understand the name and it is important to understanding the passage, then explain the name in a footnote.`;

      // Mock the three file fetches
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockTitleMd,
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockSubtitleMd,
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockContentMd,
        });

      const rcUri = "rc://en/ta/man/translate/translate-names";
      const article = await getArticle(rcUri);

      // Should fetch all three files
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/title.md"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/sub-title.md"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/01.md"
      );

      expect(article).toEqual({
        rcUri,
        title: "How to Translate Names",
        content: expect.stringContaining("Sometimes translators may not know"),
        sections: {
          title: mockTitleMd,
          subtitle: mockSubtitleMd,
          main: mockContentMd,
        },
        urls: {
          title:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/title.md",
          subtitle:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/sub-title.md",
          content:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/01.md",
        },
        fetchedAt: expect.any(String),
      });
    });

    it("should handle 404 errors gracefully", async () => {
      // Mock all three files returning 404
      fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        });

      const rcUri = "rc://en/ta/man/translate/nonexistent";
      const article = await getArticle(rcUri);

      expect(article).toEqual({
        rcUri,
        title: "Translation Academy Article Not Found",
        content: expect.stringContaining("could not be found"),
        error: "not_found",
        urls: {
          title:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/nonexistent/title.md",
          subtitle:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/nonexistent/sub-title.md",
          content:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/nonexistent/01.md",
        },
      });
    });

    it("should handle network errors", async () => {
      // Mock all three fetch calls to reject with network error
      fetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"));

      const rcUri = "rc://en/ta/man/translate/test";
      const article = await getArticle(rcUri);

      expect(article).toEqual({
        rcUri,
        title: "Error Loading Translation Academy Article",
        content: expect.stringContaining("Network error"),
        error: "Network error",
        urls: {
          title:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/test/title.md",
          subtitle:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/test/sub-title.md",
          content:
            "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/test/01.md",
        },
      });
    });

    it("should handle wildcard language codes", async () => {
      const mockTitleMd = "# Test Article";
      const mockSubtitleMd = "## Test Subtitle";
      const mockContentMd = "Content here.";

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockTitleMd,
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockSubtitleMd,
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockContentMd,
        });

      const rcUri = "rc://*/ta/man/translate/test";
      await getArticle(rcUri);

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/test/title.md"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/test/sub-title.md"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/test/01.md"
      );
    });

    it("should cache articles to avoid duplicate requests", async () => {
      const mockTitleMd = "# Test Article";
      const mockSubtitleMd = "## Test Subtitle";
      const mockContentMd = "Content here.";

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockTitleMd,
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockSubtitleMd,
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => mockContentMd,
        });

      const rcUri = "rc://en/ta/man/translate/test";

      // First call
      const article1 = await getArticle(rcUri);
      // Second call
      const article2 = await getArticle(rcUri);

      expect(fetch).toHaveBeenCalledTimes(3); // Only called once for the three files
      expect(article1).toBe(article2); // Should be the same cached object
    });

    it("should handle invalid RC URIs", async () => {
      await expect(getArticle("")).rejects.toThrow("RC URI is required");

      const invalidUriResult = await getArticle("invalid://uri");
      expect(invalidUriResult.error).toContain("Invalid rc:// URI");
      expect(invalidUriResult.title).toBe("Error Loading Translation Academy Article");

      const malformedUriResult = await getArticle("rc://en");
      expect(malformedUriResult.error).toContain("Invalid rc:// URI format");
      expect(malformedUriResult.title).toBe("Error Loading Translation Academy Article");
    });
  });

  describe("getArticlesForLinks", () => {
    it("should fetch multiple articles in parallel", async () => {
      const mockTitle1 = "# Article 1";
      const mockSubtitle1 = "## Subtitle 1";
      const mockContent1 = "Content 1.";
      const mockTitle2 = "# Article 2";
      const mockSubtitle2 = "## Subtitle 2";
      const mockContent2 = "Content 2.";

      // Mock 6 fetches: 3 for each article
      fetch
        .mockResolvedValueOnce({ ok: true, text: async () => mockTitle1 })
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubtitle1 })
        .mockResolvedValueOnce({ ok: true, text: async () => mockContent1 })
        .mockResolvedValueOnce({ ok: true, text: async () => mockTitle2 })
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubtitle2 })
        .mockResolvedValueOnce({ ok: true, text: async () => mockContent2 });

      const rcUris = ["rc://en/ta/man/translate/article1", "rc://en/ta/man/translate/article2"];

      const articles = await getArticlesForLinks(rcUris);

      expect(fetch).toHaveBeenCalledTimes(6); // 3 files per article
      expect(articles).toHaveLength(2);
      expect(articles[0].title).toBe("Article 1");
      expect(articles[1].title).toBe("Article 2");
    });

    it("should return articles even if some have errors (TA content is educational)", async () => {
      const mockTitle = "# Good Article";
      const mockSubtitle = "## Good Subtitle";
      const mockContent = "Content here.";

      // Mock 3 successful fetches for good article, 3 failed for missing
      fetch
        .mockResolvedValueOnce({ ok: true, text: async () => mockTitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubtitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockContent })
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: false, status: 404 });

      const rcUris = ["rc://en/ta/man/translate/good", "rc://en/ta/man/translate/missing"];

      const articles = await getArticlesForLinks(rcUris);

      expect(articles).toHaveLength(2);
      expect(articles[0].title).toBe("Good Article");
      expect(articles[1].error).toBe("not_found");
    });

    it("should handle empty or invalid input", async () => {
      expect(await getArticlesForLinks([])).toEqual([]);
      expect(await getArticlesForLinks(null)).toEqual([]);
      expect(await getArticlesForLinks(undefined)).toEqual([]);
      expect(await getArticlesForLinks("not-an-array")).toEqual([]);
    });

    it("should deduplicate URIs", async () => {
      const mockTitle = "# Test Article";
      const mockSubtitle = "## Test Subtitle";
      const mockContent = "Content here.";

      // Mock 3 fetches for the single unique article
      fetch
        .mockResolvedValueOnce({ ok: true, text: async () => mockTitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubtitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockContent });

      const rcUris = [
        "rc://en/ta/man/translate/test",
        "rc://en/ta/man/translate/test", // duplicate
        "rc://en/ta/man/translate/test", // duplicate
      ];

      const articles = await getArticlesForLinks(rcUris);

      expect(fetch).toHaveBeenCalledTimes(3); // Only 3 calls for the unique article
      expect(articles).toHaveLength(1);
    });
  });

  describe("cache management", () => {
    it("should provide cache statistics", async () => {
      const mockTitle = "# Test Article";
      const mockSubtitle = "## Test Subtitle";
      const mockContent = "Content here.";

      // Mock 3 successful fetches for success article, 3 failed for missing
      fetch
        .mockResolvedValueOnce({ ok: true, text: async () => mockTitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubtitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockContent })
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: false, status: 404 });

      await getArticle("rc://en/ta/man/translate/success");
      await getArticle("rc://en/ta/man/translate/missing");

      const stats = getCacheStats();
      expect(stats).toEqual({
        totalEntries: 2,
        successfulEntries: 1,
        errorEntries: 1,
        notFoundEntries: 1,
      });
    });

    it("should clear cache correctly", async () => {
      const mockTitle = "# Test Article";
      const mockSubtitle = "## Test Subtitle";
      const mockContent = "Content here.";

      fetch
        .mockResolvedValueOnce({ ok: true, text: async () => mockTitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubtitle })
        .mockResolvedValueOnce({ ok: true, text: async () => mockContent });

      await getArticle("rc://en/ta/man/translate/test");

      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(1);

      clearCache();

      stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });
  });
});
