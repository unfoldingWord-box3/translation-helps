/**
 * twService.test.js
 * Unit tests for Translation Words service
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getArticle, getArticlesForLinks, clearCache, getCacheStats } from "./twService";

// Mock fetch globally
global.fetch = vi.fn();

describe("twService", () => {
  beforeEach(() => {
    clearCache();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getArticle", () => {
    it("should fetch and parse a valid tW article", async () => {
      const mockMarkdown = `---
aliases: []
---

# create

## Definition:

The term "create" means to make something exist that did not exist before.

## Translation Suggestions:

* The term "create" could be translated as "make" or "cause to exist" or "make from nothing."
* Make sure that the translation of this term can include the meaning of making something from nothing.

## Bible References:

* [Genesis 01:1](rc://en/ult/gen/01/01)
* [Genesis 01:27](rc://en/ult/gen/01/27)
* [Colossians 01:15-17](rc://en/ult/col/01/15)

## Word Data:

* Strong's: H1254, H1255, H3335, H6213, G2936, G4160
`;

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockMarkdown),
      });

      const result = await getArticle("rc://en/tw/dict/bible/kt/create");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md"
      );

      expect(result).toEqual({
        rcUri: "rc://en/tw/dict/bible/kt/create",
        title: "create",
        content: expect.stringContaining('The term "create" means to make something exist'),
        markdown: mockMarkdown,
        url: "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md",
        fetchedAt: expect.any(String),
      });

      expect(result.content).toContain("Definition:");
      expect(result.content).toContain("Translation Suggestions:");
    });

    it("should handle articles without front matter", async () => {
      const mockMarkdown = `# faith

## Definition:

In general, the term "faith" refers to a belief, trust, or confidence in someone or something.

* In the Bible, the terms "faith" and "believe" often refer to believing in Jesus Christ.
`;

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockMarkdown),
      });

      const result = await getArticle("rc://en/tw/dict/bible/kt/faith");

      expect(result.title).toBe("faith");
      expect(result.content).toContain('In general, the term "faith"');
    });

    it("should handle articles without title heading", async () => {
      const mockMarkdown = `## Definition:

Some content without a main title.
`;

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockMarkdown),
      });

      const result = await getArticle("rc://en/tw/dict/bible/kt/test");

      expect(result.title).toBe("Translation Word");
      expect(result.content).toContain("Some content without a main title");
    });

    it("should handle 404 errors gracefully", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await getArticle("rc://en/tw/dict/bible/kt/nonexistent");

      expect(result).toEqual({
        rcUri: "rc://en/tw/dict/bible/kt/nonexistent",
        title: "Article Not Found",
        content: "The requested article could not be found: rc://en/tw/dict/bible/kt/nonexistent",
        error: "not_found",
        url: "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/nonexistent.md",
      });
    });

    it("should handle network errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await getArticle("rc://en/tw/dict/bible/kt/test");

      expect(result.error).toBe("Network error");
      expect(result.title).toBe("Error Loading Article");
      expect(result.content).toContain("Failed to load article: Network error");
    });

    it("should cache successful results", async () => {
      const mockMarkdown = "# test\n\nTest content";

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockMarkdown),
      });

      // First call
      const result1 = await getArticle("rc://en/tw/dict/bible/kt/test");

      // Second call should use cache
      const result2 = await getArticle("rc://en/tw/dict/bible/kt/test");

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it("should cache error results", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // First call
      const result1 = await getArticle("rc://en/tw/dict/bible/kt/error");

      // Second call should use cached error
      const result2 = await getArticle("rc://en/tw/dict/bible/kt/error");

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
      expect(result2.error).toBe("Network error");
    });

    it("should throw error for invalid URI", async () => {
      await expect(getArticle("")).rejects.toThrow("RC URI is required");
      await expect(getArticle(null)).rejects.toThrow("RC URI is required");
    });

    it("should handle malformed rc:// URIs", async () => {
      const result = await getArticle("invalid-uri");
      expect(result.error).toContain("Invalid rc:// URI");
      expect(result.title).toBe("Error Loading Article");
    });
  });

  describe("getArticlesForLinks", () => {
    it("should fetch multiple articles in parallel", async () => {
      const mockMarkdown1 = "# create\n\nCreate content";
      const mockMarkdown2 = "# faith\n\nFaith content";

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockMarkdown1),
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockMarkdown2),
        });

      const uris = ["rc://en/tw/dict/bible/kt/create", "rc://en/tw/dict/bible/kt/faith"];

      const results = await getArticlesForLinks(uris);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(results).toHaveLength(2);
      expect(results[0].title).toBe("create");
      expect(results[1].title).toBe("faith");
    });

    it("should handle duplicate URIs", async () => {
      const mockMarkdown = "# create\n\nCreate content";

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockMarkdown),
      });

      const uris = [
        "rc://en/tw/dict/bible/kt/create",
        "rc://en/tw/dict/bible/kt/create", // duplicate
        "rc://en/tw/dict/bible/kt/create", // another duplicate
      ];

      const results = await getArticlesForLinks(uris);

      expect(fetch).toHaveBeenCalledTimes(1); // Only called once due to deduplication
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("create");
    });

    it("should filter out failed requests", async () => {
      const mockMarkdown = "# create\n\nCreate content";

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockMarkdown),
        })
        .mockRejectedValueOnce(new Error("Network error"));

      const uris = ["rc://en/tw/dict/bible/kt/create", "rc://en/tw/dict/bible/kt/error"];

      const results = await getArticlesForLinks(uris);

      expect(results).toHaveLength(1); // Only successful article
      expect(results[0].title).toBe("create");
    });

    it("should handle empty or invalid input", async () => {
      expect(await getArticlesForLinks([])).toEqual([]);
      expect(await getArticlesForLinks(null)).toEqual([]);
      expect(await getArticlesForLinks(undefined)).toEqual([]);
      expect(await getArticlesForLinks(["", null, undefined])).toEqual([]);
    });

    it("should handle Promise.all rejection gracefully", async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      fetch.mockRejectedValue(new Error("Catastrophic failure"));

      const uris = ["rc://en/tw/dict/bible/kt/create"];
      const results = await getArticlesForLinks(uris);

      expect(results).toEqual([]);
      // The error is logged at the individual article level, not at the Promise.all level
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching tW article rc://en/tw/dict/bible/kt/create:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("cache management", () => {
    it("should clear cache correctly", async () => {
      const mockMarkdown = "# test\n\nTest content";

      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockMarkdown),
      });

      // Populate cache
      await getArticle("rc://en/tw/dict/bible/kt/test");

      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(1);

      // Clear cache
      clearCache();

      stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);

      // Next call should fetch again
      await getArticle("rc://en/tw/dict/bible/kt/test");
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("should provide accurate cache statistics", async () => {
      const mockMarkdown = "# test\n\nTest content";

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockMarkdown),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        })
        .mockRejectedValueOnce(new Error("Network error"));

      // Add successful entry
      await getArticle("rc://en/tw/dict/bible/kt/success");

      // Add not found entry
      await getArticle("rc://en/tw/dict/bible/kt/notfound");

      // Add error entry
      await getArticle("rc://en/tw/dict/bible/kt/error");

      const stats = getCacheStats();

      expect(stats.totalEntries).toBe(3);
      expect(stats.successfulEntries).toBe(1);
      expect(stats.errorEntries).toBe(2);
      expect(stats.notFoundEntries).toBe(1);
    });
  });

  describe("URI parsing and URL generation", () => {
    it("should generate correct URLs for different URI formats", async () => {
      const testCases = [
        {
          uri: "rc://en/tw/dict/bible/kt/create",
          expectedUrl:
            "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md",
        },
        {
          uri: "rc://en/tw/dict/bible/names/abraham",
          expectedUrl:
            "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/names/abraham.md",
        },
        {
          uri: "rc://en/tw/dict/bible/other/tax",
          expectedUrl:
            "https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/other/tax.md",
        },
      ];

      for (const testCase of testCases) {
        fetch.mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve("# test\n\nContent"),
        });

        await getArticle(testCase.uri);

        expect(fetch).toHaveBeenCalledWith(testCase.expectedUrl);
        fetch.mockClear();
      }
    });
  });
});
