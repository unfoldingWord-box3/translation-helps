/**
 * catalogService.test.js
 * Tests for DCS catalog API integration service
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchOrganizations,
  fetchLanguages,
  fetchResources,
  clearCatalogCache,
  preloadCatalogData,
} from "./catalogService.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("catalogService", () => {
  beforeEach(() => {
    // Clear all mocks and cache before each test
    vi.clearAllMocks();
    clearCatalogCache();
  });

  describe("fetchOrganizations", () => {
    it("should fetch and return organizations from API with correct response structure", async () => {
      const mockApiResponse = {
        data: [
          { login: "unfoldingWord", full_name: "unfoldingWord" },
          { login: "door43-catalog", full_name: "Door43 Catalog" },
          { login: "test-org", full_name: "Test Organization" },
        ],
      };
      const expectedOrganizations = [
        {
          login: "door43-catalog",
          full_name: "Door43 Catalog",
          description: "Organization: Door43 Catalog",
          avatar_url: null,
          website: null,
          location: null,
          repo_count: 0,
          visibility: "public",
        },
        {
          login: "test-org",
          full_name: "Test Organization",
          description: "Organization: Test Organization",
          avatar_url: null,
          website: null,
          location: null,
          repo_count: 0,
          visibility: "public",
        },
        {
          login: "unfoldingWord",
          full_name: "unfoldingWord",
          description: "Organization: unfoldingWord",
          avatar_url: null,
          website: null,
          location: null,
          repo_count: 0,
          visibility: "public",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchOrganizations();

      expect(fetch).toHaveBeenCalledWith("https://git.door43.org/api/v1/catalog/list/owners");
      expect(result).toEqual(expectedOrganizations);
    });

    it("should return fallback organizations when API fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchOrganizations();
      const fallbackOrganizations = [
        {
          login: "unfoldingWord",
          full_name: "unfoldingWord",
          description: "Open Bible resources for every language",
          avatar_url: null,
          website: "https://unfoldingword.org",
        },
        {
          login: "door43-catalog",
          full_name: "Door43 Catalog",
          description: "Community-driven translation hub",
          avatar_url: null,
          website: "https://door43.org",
        },
        {
          login: "STR",
          full_name: "STR",
          description: "Scripture Translation Resources",
          avatar_url: null,
          website: null,
        },
        {
          login: "WA",
          full_name: "WA",
          description: "Wycliffe Associates",
          avatar_url: null,
          website: null,
        },
      ];
      expect(result).toEqual(fallbackOrganizations);
    });

    it("should return fallback organizations if API returns invalid structure", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: "Invalid response" }),
      });

      const result = await fetchOrganizations();
      const fallbackOrganizations = [
        {
          login: "unfoldingWord",
          full_name: "unfoldingWord",
          description: "Open Bible resources for every language",
          avatar_url: null,
          website: "https://unfoldingword.org",
        },
        {
          login: "door43-catalog",
          full_name: "Door43 Catalog",
          description: "Community-driven translation hub",
          avatar_url: null,
          website: "https://door43.org",
        },
        {
          login: "STR",
          full_name: "STR",
          description: "Scripture Translation Resources",
          avatar_url: null,
          website: null,
        },
        {
          login: "WA",
          full_name: "WA",
          description: "Wycliffe Associates",
          avatar_url: null,
          website: null,
        },
      ];
      expect(result).toEqual(fallbackOrganizations);
    });

    it("should handle missing login field in organization data", async () => {
      const mockApiResponse = {
        data: [
          { login: "valid-org", full_name: "Valid Org" },
          { full_name: "Invalid Org - No Login" }, // Missing login field
          { login: "", full_name: "Empty Login" }, // Empty login field
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchOrganizations();

      expect(result).toEqual([
        {
          login: "valid-org",
          full_name: "Valid Org",
          description: "Organization: Valid Org",
          avatar_url: null,
          website: null,
          location: null,
          repo_count: 0,
          visibility: "public",
        },
      ]);
    });

    it("should cache results and not call API on second request", async () => {
      const mockApiResponse = {
        data: [
          { login: "unfoldingWord", full_name: "unfoldingWord" },
          { login: "door43-catalog", full_name: "Door43 Catalog" },
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // First call
      const result1 = await fetchOrganizations();
      // Second call
      const result2 = await fetchOrganizations();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });
  });

  describe("fetchLanguages", () => {
    it("should fetch and return languages for organization with correct URL and response structure", async () => {
      const mockApiResponse = {
        data: [
          { lc: "en", ln: "English", ang: "English" },
          { lc: "es", ln: "español", ang: "Spanish" },
          { lc: "fr", ln: "français", ang: "French" },
        ],
      };
      const expectedLanguages = [
        {
          code: "en",
          name: "English",
          direction: "ltr",
          raw: { lc: "en", ln: "English", ang: "English" },
        },
        {
          code: "es",
          name: "español",
          direction: "ltr",
          raw: { lc: "es", ln: "español", ang: "Spanish" },
        },
        {
          code: "fr",
          name: "français",
          direction: "ltr",
          raw: { lc: "fr", ln: "français", ang: "French" },
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchLanguages("unfoldingWord");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/languages?owner=unfoldingWord"
      );
      expect(result).toEqual(expectedLanguages);
    });

    it("should return empty array when no owner provided", async () => {
      const result = await fetchLanguages("");

      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return fallback languages when API fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchLanguages("unfoldingWord");

      const expectedFallback = [
        { code: "en", name: "English", direction: "ltr" },
        { code: "es", name: "Spanish", direction: "ltr" },
        { code: "fr", name: "French", direction: "ltr" },
        { code: "pt", name: "Portuguese", direction: "ltr" },
        { code: "hi", name: "Hindi", direction: "ltr" },
        { code: "ar", name: "Arabic", direction: "rtl" },
        { code: "sw", name: "Swahili", direction: "ltr" },
        { code: "zh", name: "Chinese", direction: "ltr" },
        { code: "ru", name: "Russian", direction: "ltr" },
        { code: "de", name: "German", direction: "ltr" },
        { code: "it", name: "Italian", direction: "ltr" },
        { code: "ja", name: "Japanese", direction: "ltr" },
        { code: "ko", name: "Korean", direction: "ltr" },
        { code: "nl", name: "Dutch", direction: "ltr" },
        { code: "pl", name: "Polish", direction: "ltr" },
        { code: "tr", name: "Turkish", direction: "ltr" },
        { code: "vi", name: "Vietnamese", direction: "ltr" },
        { code: "th", name: "Thai", direction: "ltr" },
        { code: "id", name: "Indonesian", direction: "ltr" },
        { code: "ms", name: "Malay", direction: "ltr" },
      ];
      expect(result).toEqual(expectedFallback);
    });

    it("should handle special characters in owner name with URL encoding", async () => {
      const mockApiResponse = { data: [{ lc: "en", ln: "English" }] };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await fetchLanguages("test-org with spaces");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/languages?owner=test-org%20with%20spaces"
      );
    });

    it("should handle missing lc field in language data", async () => {
      const mockApiResponse = {
        data: [
          { lc: "en", ln: "English" },
          { ln: "Invalid - No lc field" }, // Missing lc field
          { lc: "", ln: "Empty lc field" }, // Empty lc field
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchLanguages("unfoldingWord");

      expect(result).toEqual([
        {
          code: "en",
          name: "English",
          direction: "ltr",
          raw: { lc: "en", ln: "English" },
        },
      ]);
    });
  });

  describe("fetchResources", () => {
    it("should fetch and return resources from API with correct URL and response structure", async () => {
      const mockApiResponse = {
        data: [
          "Aligned Bible",
          "Translation Academy",
          "Translation Notes",
          "Translation Questions",
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchResources("unfoldingWord", "en");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/subjects?owner=unfoldingWord&lang=en"
      );
      expect(result).toEqual([
        "Aligned Bible",
        "Translation Academy",
        "Translation Notes",
        "Translation Questions",
      ]);
    });

    it("should return empty array when owner or language missing", async () => {
      expect(await fetchResources("", "en")).toEqual([]);
      expect(await fetchResources("unfoldingWord", "")).toEqual([]);
      expect(await fetchResources("", "")).toEqual([]);

      expect(fetch).not.toHaveBeenCalled();
    });

    it("should return fallback resources when API fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchResources("unfoldingWord", "en");

      expect(result).toEqual(["ult", "ust", "tn", "tq", "tw", "twl", "ta"]);
    });

    it("should sort resources alphabetically", async () => {
      const mockApiResponse = {
        data: ["Translation Words", "Bible", "Aligned Bible", "Translation Notes"],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchResources("unfoldingWord", "en");

      expect(result).toEqual(["Aligned Bible", "Bible", "Translation Notes", "Translation Words"]);
    });

    it("should handle special characters in parameters with URL encoding", async () => {
      const mockApiResponse = { data: ["Translation Notes"] };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await fetchResources("test-org with spaces", "en-US");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/subjects?owner=test-org%20with%20spaces&lang=en-US"
      );
    });

    it("should filter out non-string resources", async () => {
      const mockApiResponse = {
        data: ["Translation Notes", null, undefined, "", "Translation Words", 123],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchResources("unfoldingWord", "en");

      expect(result).toEqual(["Translation Notes", "Translation Words"]);
    });
  });

  describe("preloadCatalogData", () => {
    it("should preload organizations", async () => {
      const mockApiResponse = {
        data: [{ login: "unfoldingWord", full_name: "unfoldingWord" }],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await preloadCatalogData();

      expect(fetch).toHaveBeenCalledWith("https://git.door43.org/api/v1/catalog/list/owners");
    });

    it("should preload organizations and languages when owner provided", async () => {
      const mockOrgResponse = {
        data: [{ login: "unfoldingWord", full_name: "unfoldingWord" }],
      };
      const mockLangResponse = { data: [{ lc: "en", ln: "English" }] };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockOrgResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLangResponse,
        });

      await preloadCatalogData("unfoldingWord");

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, "https://git.door43.org/api/v1/catalog/list/owners");
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        "https://git.door43.org/api/v1/catalog/list/languages?owner=unfoldingWord"
      );
    });

    it("should handle errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      // Should not throw
      await expect(preloadCatalogData()).resolves.toBeUndefined();
    });
  });

  describe("caching behavior", () => {
    it("should use cached data on subsequent calls", async () => {
      const mockApiResponse = {
        data: [{ login: "unfoldingWord", full_name: "unfoldingWord" }],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // First call should hit API
      await fetchOrganizations();
      // Second call should use cache
      await fetchOrganizations();

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should clear cache when clearCatalogCache is called", async () => {
      const mockApiResponse = {
        data: [{ login: "unfoldingWord", full_name: "unfoldingWord" }],
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      // First call
      await fetchOrganizations();
      clearCatalogCache();
      // Second call after cache clear
      await fetchOrganizations();

      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("error handling", () => {
    it("should handle HTTP error responses", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await fetchOrganizations();
      const fallbackOrganizations = [
        {
          login: "unfoldingWord",
          full_name: "unfoldingWord",
          description: "Open Bible resources for every language",
          avatar_url: null,
          website: "https://unfoldingword.org",
        },
        {
          login: "door43-catalog",
          full_name: "Door43 Catalog",
          description: "Community-driven translation hub",
          avatar_url: null,
          website: "https://door43.org",
        },
        {
          login: "STR",
          full_name: "STR",
          description: "Scripture Translation Resources",
          avatar_url: null,
          website: null,
        },
        {
          login: "WA",
          full_name: "WA",
          description: "Wycliffe Associates",
          avatar_url: null,
          website: null,
        },
      ];
      expect(result).toEqual(fallbackOrganizations);
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchLanguages("unfoldingWord");

      const expectedFallback = [
        { code: "en", name: "English", direction: "ltr" },
        { code: "es", name: "Spanish", direction: "ltr" },
        { code: "fr", name: "French", direction: "ltr" },
        { code: "pt", name: "Portuguese", direction: "ltr" },
        { code: "hi", name: "Hindi", direction: "ltr" },
        { code: "ar", name: "Arabic", direction: "rtl" },
        { code: "sw", name: "Swahili", direction: "ltr" },
        { code: "zh", name: "Chinese", direction: "ltr" },
        { code: "ru", name: "Russian", direction: "ltr" },
        { code: "de", name: "German", direction: "ltr" },
        { code: "it", name: "Italian", direction: "ltr" },
        { code: "ja", name: "Japanese", direction: "ltr" },
        { code: "ko", name: "Korean", direction: "ltr" },
        { code: "nl", name: "Dutch", direction: "ltr" },
        { code: "pl", name: "Polish", direction: "ltr" },
        { code: "tr", name: "Turkish", direction: "ltr" },
        { code: "vi", name: "Vietnamese", direction: "ltr" },
        { code: "th", name: "Thai", direction: "ltr" },
        { code: "id", name: "Indonesian", direction: "ltr" },
        { code: "ms", name: "Malay", direction: "ltr" },
      ];
      expect(result).toEqual(expectedFallback);
    });

    it("should handle JSON parsing errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const result = await fetchOrganizations();
      const fallbackOrganizations = [
        {
          login: "unfoldingWord",
          full_name: "unfoldingWord",
          description: "Open Bible resources for every language",
          avatar_url: null,
          website: "https://unfoldingword.org",
        },
        {
          login: "door43-catalog",
          full_name: "Door43 Catalog",
          description: "Community-driven translation hub",
          avatar_url: null,
          website: "https://door43.org",
        },
        {
          login: "STR",
          full_name: "STR",
          description: "Scripture Translation Resources",
          avatar_url: null,
          website: null,
        },
        {
          login: "WA",
          full_name: "WA",
          description: "Wycliffe Associates",
          avatar_url: null,
          website: null,
        },
      ];
      expect(result).toEqual(fallbackOrganizations);
    });
  });

  describe("API response validation tests", () => {
    it("should validate organizations API response structure", async () => {
      // Test with null data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null, ok: true }),
      });

      let result = await fetchOrganizations();
      const fallbackOrganizations = [
        {
          login: "unfoldingWord",
          full_name: "unfoldingWord",
          description: "Open Bible resources for every language",
          avatar_url: null,
          website: "https://unfoldingword.org",
        },
        {
          login: "door43-catalog",
          full_name: "Door43 Catalog",
          description: "Community-driven translation hub",
          avatar_url: null,
          website: "https://door43.org",
        },
        {
          login: "STR",
          full_name: "STR",
          description: "Scripture Translation Resources",
          avatar_url: null,
          website: null,
        },
        {
          login: "WA",
          full_name: "WA",
          description: "Wycliffe Associates",
          avatar_url: null,
          website: null,
        },
      ];
      expect(result).toEqual(fallbackOrganizations);

      // Test with missing data field
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      result = await fetchOrganizations();
      expect(result).toEqual(fallbackOrganizations);
    });

    it("should validate languages API response structure", async () => {
      // Test with null data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null, ok: true }),
      });

      let result = await fetchLanguages("unfoldingWord");
      expect(result).toEqual([
        { code: "en", name: "English", direction: "ltr" },
        { code: "es", name: "Spanish", direction: "ltr" },
        { code: "fr", name: "French", direction: "ltr" },
        { code: "pt", name: "Portuguese", direction: "ltr" },
        { code: "hi", name: "Hindi", direction: "ltr" },
        { code: "ar", name: "Arabic", direction: "rtl" },
        { code: "sw", name: "Swahili", direction: "ltr" },
        { code: "zh", name: "Chinese", direction: "ltr" },
        { code: "ru", name: "Russian", direction: "ltr" },
        { code: "de", name: "German", direction: "ltr" },
        { code: "it", name: "Italian", direction: "ltr" },
        { code: "ja", name: "Japanese", direction: "ltr" },
        { code: "ko", name: "Korean", direction: "ltr" },
        { code: "nl", name: "Dutch", direction: "ltr" },
        { code: "pl", name: "Polish", direction: "ltr" },
        { code: "tr", name: "Turkish", direction: "ltr" },
        { code: "vi", name: "Vietnamese", direction: "ltr" },
        { code: "th", name: "Thai", direction: "ltr" },
        { code: "id", name: "Indonesian", direction: "ltr" },
        { code: "ms", name: "Malay", direction: "ltr" },
      ]);

      // Test with missing data field
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      result = await fetchLanguages("unfoldingWord");
      expect(result).toEqual([
        { code: "en", name: "English", direction: "ltr" },
        { code: "es", name: "Spanish", direction: "ltr" },
        { code: "fr", name: "French", direction: "ltr" },
        { code: "pt", name: "Portuguese", direction: "ltr" },
        { code: "hi", name: "Hindi", direction: "ltr" },
        { code: "ar", name: "Arabic", direction: "rtl" },
        { code: "sw", name: "Swahili", direction: "ltr" },
        { code: "zh", name: "Chinese", direction: "ltr" },
        { code: "ru", name: "Russian", direction: "ltr" },
        { code: "de", name: "German", direction: "ltr" },
        { code: "it", name: "Italian", direction: "ltr" },
        { code: "ja", name: "Japanese", direction: "ltr" },
        { code: "ko", name: "Korean", direction: "ltr" },
        { code: "nl", name: "Dutch", direction: "ltr" },
        { code: "pl", name: "Polish", direction: "ltr" },
        { code: "tr", name: "Turkish", direction: "ltr" },
        { code: "vi", name: "Vietnamese", direction: "ltr" },
        { code: "th", name: "Thai", direction: "ltr" },
        { code: "id", name: "Indonesian", direction: "ltr" },
        { code: "ms", name: "Malay", direction: "ltr" },
      ]);
    });

    it("should validate resources API response structure", async () => {
      // Test with null data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null, ok: true }),
      });

      let result = await fetchResources("unfoldingWord", "en");
      expect(result).toEqual(["ult", "ust", "tn", "tq", "tw", "twl", "ta"]);

      // Test with missing data field
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      result = await fetchResources("unfoldingWord", "en");
      expect(result).toEqual(["ult", "ust", "tn", "tq", "tw", "twl", "ta"]);
    });
  });
});
