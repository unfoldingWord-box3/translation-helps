/**
 * catalogService.bible.test.js
 * Unit tests for Bible resource search functionality
 */

import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { fetchBibleResources, clearCatalogCache } from "./catalogService.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("fetchBibleResources", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCatalogCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearCatalogCache();
  });

  it("should fetch Bible resources using search API", async () => {
    const mockResponse = {
      data: [
        {
          name: "en_ult",
          full_name: "unfoldingWord/en_ult",
          subject: "Aligned Bible",
          description: "unfoldingWord Literal Text",
          html_url: "https://git.door43.org/unfoldingWord/en_ult",
        },
        {
          name: "en_ust",
          full_name: "unfoldingWord/en_ust",
          subject: "Aligned Bible",
          description: "unfoldingWord Simplified Text",
          html_url: "https://git.door43.org/unfoldingWord/en_ust",
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    // Verify API call was made to search endpoint
    expect(fetch).toHaveBeenCalledTimes(1);
    const callUrl = fetch.mock.calls[0][0];
    expect(callUrl).toContain("/api/v1/repos/search");
    expect(callUrl).toContain("owner=unfoldingWord");
    expect(callUrl).toContain("lang=en");
    expect(callUrl).toContain("subject=Bible");

    expect(resources).toHaveLength(2);
    expect(resources[0]).toEqual({
      id: "en_ult",
      name: "en_ult",
      fullName: "unfoldingWord/en_ult",
      description: "unfoldingWord Literal Text",
      subject: "Aligned Bible",
      repoUrl: "https://git.door43.org/unfoldingWord/en_ult",
    });
  });

  it("should filter out non-Bible subjects", async () => {
    const mockResponse = {
      data: [
        {
          name: "en_ult",
          subject: "Aligned Bible",
          description: "unfoldingWord Literal Text",
        },
        {
          name: "en_tn",
          subject: "Translation Notes",
          description: "Translation Notes",
        }, // Should be filtered out
        {
          name: "en_bible",
          subject: "Bible",
          description: "English Bible",
        },
        {
          name: "en_tq",
          subject: "Translation Questions",
          description: "Translation Questions",
        }, // Should be filtered out
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources).toHaveLength(2);
    expect(resources.map((r) => r.name)).toEqual(["en_bible", "en_ult"]);
    expect(resources.every((r) => ["Bible", "Aligned Bible"].includes(r.subject))).toBe(true);
  });

  it("should handle language object parameter", async () => {
    const mockResponse = {
      data: [
        {
          name: "en_ult",
          subject: "Aligned Bible",
          description: "unfoldingWord Literal Text",
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const languageObject = { code: "en", name: "English" };
    const resources = await fetchBibleResources("unfoldingWord", languageObject);

    expect(fetch).toHaveBeenCalledTimes(1);
    const callUrl = fetch.mock.calls[0][0];
    expect(callUrl).toContain("lang=en");
    expect(resources).toHaveLength(1);
  });

  it("should return fallback data when API fails", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources).toHaveLength(2);
    expect(resources[0]).toEqual({
      id: "ult",
      name: "ult",
      description: "unfoldingWord Literal Text",
      subject: "Aligned Bible",
    });
    expect(resources[1]).toEqual({
      id: "ust",
      name: "ust",
      description: "unfoldingWord Simplified Text",
      subject: "Aligned Bible",
    });
  });

  it("should return fallback data when API returns empty results", async () => {
    const mockResponse = {
      data: [],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources).toHaveLength(2);
    expect(resources[0].id).toBe("ult");
    expect(resources[1].id).toBe("ust");
  });

  it("should return empty array for missing parameters", async () => {
    expect(await fetchBibleResources(null, "en")).toEqual([]);
    expect(await fetchBibleResources("unfoldingWord", null)).toEqual([]);
    expect(await fetchBibleResources("unfoldingWord", { code: null })).toEqual([]);
  });

  it("should handle HTTP errors gracefully", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources).toHaveLength(2);
    expect(resources[0].id).toBe("ult");
    expect(resources[1].id).toBe("ust");
  });

  it("should sort resources alphabetically", async () => {
    const mockResponse = {
      data: [
        {
          name: "zh_ult",
          subject: "Aligned Bible",
          description: "Chinese ULT",
        },
        {
          name: "en_ult",
          subject: "Aligned Bible",
          description: "English ULT",
        },
        {
          name: "ar_bible",
          subject: "Bible",
          description: "Arabic Bible",
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources.map((r) => r.name)).toEqual(["ar_bible", "en_ult", "zh_ult"]);
  });

  it("should use description fallback when description is missing", async () => {
    const mockResponse = {
      data: [
        {
          name: "en_ult",
          subject: "Aligned Bible",
          // description missing
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources[0].description).toBe("en_ult");
  });

  it("should handle repo_url vs html_url differences", async () => {
    const mockResponse = {
      data: [
        {
          name: "en_ult",
          subject: "Aligned Bible",
          description: "ULT",
          repo_url: "https://git.door43.org/unfoldingWord/en_ult",
        },
        {
          name: "en_ust",
          subject: "Aligned Bible",
          description: "UST",
          html_url: "https://git.door43.org/unfoldingWord/en_ust",
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(resources[0].repoUrl).toBe("https://git.door43.org/unfoldingWord/en_ult");
    expect(resources[1].repoUrl).toBe("https://git.door43.org/unfoldingWord/en_ust");
  });
});
