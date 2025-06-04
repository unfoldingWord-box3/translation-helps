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
        ok: true,
      };
      const expectedOrganizations = ["door43-catalog", "test-org", "unfoldingWord"];

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

      expect(result).toEqual(["unfoldingWord", "door43-catalog", "STR", "WA"]);
    });

    it("should return fallback organizations if API returns invalid structure", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: "Invalid response" }),
      });

      const result = await fetchOrganizations();

      expect(result).toEqual(["unfoldingWord", "door43-catalog", "STR", "WA"]);
    });

    it("should handle missing login field in organization data", async () => {
      const mockApiResponse = {
        data: [
          { login: "valid-org", full_name: "Valid Org" },
          { full_name: "Invalid Org - No Login" }, // Missing login field
          { login: "", full_name: "Empty Login" }, // Empty login field
        ],
        ok: true,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchOrganizations();

      expect(result).toEqual(["valid-org"]);
    });

    it("should cache results and not call API on second request", async () => {
      const mockApiResponse = {
        data: [
          { login: "unfoldingWord", full_name: "unfoldingWord" },
          { login: "door43-catalog", full_name: "Door43 Catalog" },
        ],
        ok: true,
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
        ok: true,
      };
      const expectedLanguages = ["en", "es", "fr"];

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
        "en",
        "es",
        "fr",
        "pt",
        "hi",
        "ar",
        "sw",
        "zh",
        "ru",
        "de",
        "it",
        "ja",
        "ko",
        "nl",
        "pl",
        "tr",
        "vi",
        "th",
        "id",
        "ms",
      ];
      expect(result).toEqual(expectedFallback);
    });

    it("should handle special characters in owner name with URL encoding", async () => {
      const mockApiResponse = {
        data: [{ lc: "en", ln: "English" }],
        ok: true,
      };

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
        ok: true,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchLanguages("unfoldingWord");

      expect(result).toEqual(["en"]);
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
        ok: true,
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
        ok: true,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchResources("unfoldingWord", "en");

      expect(result).toEqual(["Aligned Bible", "Bible", "Translation Notes", "Translation Words"]);
    });

    it("should handle special characters in parameters with URL encoding", async () => {
      const mockApiResponse = {
        data: ["Translation Notes"],
        ok: true,
      };

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
        ok: true,
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
        ok: true,
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
        ok: true,
      };
      const mockLangResponse = {
        data: [{ lc: "en", ln: "English" }],
        ok: true,
      };

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
        ok: true,
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
        ok: true,
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

      expect(result).toEqual(["unfoldingWord", "door43-catalog", "STR", "WA"]);
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchLanguages("unfoldingWord");

      const expectedFallback = [
        "en",
        "es",
        "fr",
        "pt",
        "hi",
        "ar",
        "sw",
        "zh",
        "ru",
        "de",
        "it",
        "ja",
        "ko",
        "nl",
        "pl",
        "tr",
        "vi",
        "th",
        "id",
        "ms",
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

      expect(result).toEqual(["unfoldingWord", "door43-catalog", "STR", "WA"]);
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
      expect(result).toEqual(["unfoldingWord", "door43-catalog", "STR", "WA"]);

      // Test with missing data field
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      result = await fetchOrganizations();
      expect(result).toEqual(["unfoldingWord", "door43-catalog", "STR", "WA"]);
    });

    it("should validate languages API response structure", async () => {
      // Test with null data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null, ok: true }),
      });

      let result = await fetchLanguages("unfoldingWord");
      expect(result).toEqual([
        "en",
        "es",
        "fr",
        "pt",
        "hi",
        "ar",
        "sw",
        "zh",
        "ru",
        "de",
        "it",
        "ja",
        "ko",
        "nl",
        "pl",
        "tr",
        "vi",
        "th",
        "id",
        "ms",
      ]);

      // Test with missing data field
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      result = await fetchLanguages("unfoldingWord");
      expect(result).toEqual([
        "en",
        "es",
        "fr",
        "pt",
        "hi",
        "ar",
        "sw",
        "zh",
        "ru",
        "de",
        "it",
        "ja",
        "ko",
        "nl",
        "pl",
        "tr",
        "vi",
        "th",
        "id",
        "ms",
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
