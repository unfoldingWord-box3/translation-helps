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
    it("should fetch and return organizations from API", async () => {
      const mockOrganizations = ["unfoldingWord", "door43-catalog", "test-org"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrganizations,
      });

      const result = await fetchOrganizations();

      expect(fetch).toHaveBeenCalledWith("https://git.door43.org/api/v1/catalog/list/owners");
      expect(result).toEqual(mockOrganizations);
    });

    it("should return fallback organizations when API fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchOrganizations();

      expect(result).toEqual(["unfoldingWord", "door43-catalog"]);
    });

    it("should return empty array if API returns non-array", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: "Invalid response" }),
      });

      const result = await fetchOrganizations();

      expect(result).toEqual([]);
    });

    it("should cache results and not call API on second request", async () => {
      const mockOrganizations = ["unfoldingWord", "door43-catalog"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrganizations,
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
    it("should fetch and return languages for organization", async () => {
      const mockLanguages = ["en", "es", "fr"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLanguages,
      });

      const result = await fetchLanguages("unfoldingWord");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/languages/unfoldingWord"
      );
      expect(result).toEqual(mockLanguages);
    });

    it("should return empty array when no owner provided", async () => {
      const result = await fetchLanguages("");

      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return fallback languages when API fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchLanguages("unfoldingWord");

      expect(result).toEqual(["en"]);
    });

    it("should handle special characters in owner name", async () => {
      const mockLanguages = ["en"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLanguages,
      });

      await fetchLanguages("test-org with spaces");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/languages/test-org%20with%20spaces"
      );
    });
  });

  describe("fetchResources", () => {
    it("should fetch and return filtered resources", async () => {
      const mockResources = ["tn", "tq", "tw", "twl", "ult", "ust", "other-resource"];
      const expectedResources = ["tn", "tq", "tw", "twl", "ult", "ust"];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResources,
      });

      const result = await fetchResources("unfoldingWord", "en");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/subjects/unfoldingWord/en"
      );
      expect(result).toEqual(expectedResources);
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

      expect(result).toEqual(["tn", "tq", "tw", "twl"]);
    });

    it("should filter out unsupported resources", async () => {
      const mockResources = ["tn", "unsupported", "tw", "another-unsupported"];
      const expectedResources = ["tn", "tw"];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResources,
      });

      const result = await fetchResources("unfoldingWord", "en");

      expect(result).toEqual(expectedResources);
    });

    it("should handle special characters in parameters", async () => {
      const mockResources = ["tn"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResources,
      });

      await fetchResources("test-org with spaces", "en-US");

      expect(fetch).toHaveBeenCalledWith(
        "https://git.door43.org/api/v1/catalog/list/subjects/test-org%20with%20spaces/en-US"
      );
    });
  });

  describe("preloadCatalogData", () => {
    it("should preload organizations", async () => {
      const mockOrganizations = ["unfoldingWord"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrganizations,
      });

      await preloadCatalogData();

      expect(fetch).toHaveBeenCalledWith("https://git.door43.org/api/v1/catalog/list/owners");
    });

    it("should preload organizations and languages when owner provided", async () => {
      const mockOrganizations = ["unfoldingWord"];
      const mockLanguages = ["en"];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockOrganizations,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLanguages,
        });

      await preloadCatalogData("unfoldingWord");

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, "https://git.door43.org/api/v1/catalog/list/owners");
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        "https://git.door43.org/api/v1/catalog/list/languages/unfoldingWord"
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
      const mockOrganizations = ["unfoldingWord"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrganizations,
      });

      // First call should hit API
      await fetchOrganizations();
      // Second call should use cache
      await fetchOrganizations();

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should clear cache when clearCatalogCache is called", async () => {
      const mockOrganizations = ["unfoldingWord"];
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockOrganizations,
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

      expect(result).toEqual(["unfoldingWord", "door43-catalog"]);
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchLanguages("unfoldingWord");

      expect(result).toEqual(["en"]);
    });
  });
});
