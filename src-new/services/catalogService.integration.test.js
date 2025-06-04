/**
 * catalogService.integration.test.js
 * Integration tests to verify real API endpoints work correctly
 * These tests make actual API calls to prevent hardcoded fallback regressions
 */

import { describe, it, expect } from "vitest";
import {
  fetchOrganizations,
  fetchLanguages,
  fetchResources,
  clearCatalogCache,
} from "./catalogService.js";

// Mark as integration tests that require network access
const isCI = process.env.CI;
const skipIfCI = isCI ? describe.skip : describe;

skipIfCI("catalogService Integration Tests (requires network)", () => {
  beforeEach(() => {
    // Clear cache to ensure fresh API calls
    clearCatalogCache();
  });

  describe("Real API Endpoints", () => {
    it("should fetch real organizations from DCS API", async () => {
      const organizations = await fetchOrganizations();

      // Verify we got real data, not just fallback
      expect(organizations).toBeInstanceOf(Array);
      expect(organizations.length).toBeGreaterThan(4); // More than fallback data

      // Verify some known organizations exist
      expect(organizations).toContain("unfoldingWord");

      // Verify organizations are sorted
      const sortedOrgs = [...organizations].sort();
      expect(organizations).toEqual(sortedOrgs);

      console.log(`✅ Fetched ${organizations.length} organizations from API`);
    }, 10000); // 10 second timeout for network requests

    it("should fetch real languages for unfoldingWord with proper object structure", async () => {
      const languages = await fetchLanguages("unfoldingWord");

      // Verify we got real data, not just fallback
      expect(languages).toBeInstanceOf(Array);
      expect(languages.length).toBeGreaterThan(20); // More than fallback data

      // Verify some known languages exist as objects
      const englishLang = languages.find((lang) => lang.code === "en");
      const spanishLang = languages.find((lang) => lang.code === "es");
      expect(englishLang).toBeDefined();
      expect(spanishLang).toBeDefined();

      // Verify all languages have proper object structure
      languages.forEach((lang) => {
        expect(typeof lang).toBe("object");
        expect(typeof lang.code).toBe("string");
        expect(typeof lang.name).toBe("string");
        expect(typeof lang.direction).toBe("string");
        expect(lang.raw).toBeDefined();
      });

      // Verify languages are sorted by name
      const sortedLangs = [...languages].sort((a, b) =>
        (a.name || a.code).localeCompare(b.name || b.code)
      );
      expect(languages).toEqual(sortedLangs);

      console.log(`✅ Fetched ${languages.length} languages for unfoldingWord from API`);
    }, 10000);

    it("should fetch real resources for unfoldingWord/en", async () => {
      const resources = await fetchResources("unfoldingWord", "en");

      // Verify we got real data, not just fallback
      expect(resources).toBeInstanceOf(Array);
      expect(resources.length).toBeGreaterThan(7); // More than fallback data

      // Verify some known resources exist
      expect(resources.some((r) => r.toLowerCase().includes("bible"))).toBe(true);
      expect(resources.some((r) => r.toLowerCase().includes("translation"))).toBe(true);

      // Verify resources are sorted
      const sortedResources = [...resources].sort();
      expect(resources).toEqual(sortedResources);

      console.log(`✅ Fetched ${resources.length} resources for unfoldingWord/en from API`);
    }, 10000);

    it("should fetch languages for Door43-Catalog and include English", async () => {
      const languages = await fetchLanguages("door43-catalog");

      // Verify we got data
      expect(languages).toBeInstanceOf(Array);
      expect(languages.length).toBeGreaterThan(0);

      // Check if English is included in the language objects (this was the main issue)
      const englishLang = languages.find((lang) => lang.code === "en");
      expect(englishLang).toBeDefined();
      expect(englishLang.name).toBeTruthy();
      expect(englishLang.direction).toBe("ltr");

      console.log(`✅ Door43-Catalog has ${languages.length} languages including English`);
      console.log(`✅ English language object:`, englishLang);
    }, 10000);
  });

  describe("API Response Validation", () => {
    it("should validate organizations response structure", async () => {
      // Make a raw API call to verify response structure
      const response = await fetch("https://git.door43.org/api/v1/catalog/list/owners");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("ok");
      expect(Array.isArray(data.data)).toBe(true);

      // Verify organization structure
      if (data.data.length > 0) {
        const org = data.data[0];
        expect(org).toHaveProperty("login");
        expect(typeof org.login).toBe("string");
      }

      console.log("✅ Organizations API response structure validated");
    }, 10000);

    it("should validate languages response structure", async () => {
      const response = await fetch(
        "https://git.door43.org/api/v1/catalog/list/languages?owner=unfoldingWord"
      );
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("ok");
      expect(Array.isArray(data.data)).toBe(true);

      // Verify language structure
      if (data.data.length > 0) {
        const lang = data.data[0];
        expect(lang).toHaveProperty("lc");
        expect(typeof lang.lc).toBe("string");
      }

      console.log("✅ Languages API response structure validated");
    }, 10000);

    it("should validate resources response structure", async () => {
      const response = await fetch(
        "https://git.door43.org/api/v1/catalog/list/subjects?owner=unfoldingWord&lang=en"
      );
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("ok");
      expect(Array.isArray(data.data)).toBe(true);

      // Verify resources are strings
      data.data.forEach((resource) => {
        expect(typeof resource).toBe("string");
      });

      console.log("✅ Resources API response structure validated");
    }, 10000);
  });

  describe("URL Construction Validation", () => {
    it("should use correct URL format for languages endpoint", async () => {
      // Spy on fetch to verify URL construction
      const originalFetch = global.fetch;
      let capturedUrl = "";

      global.fetch = vi.fn(async (url) => {
        capturedUrl = url;
        return originalFetch(url);
      });

      await fetchLanguages("test-org");

      expect(capturedUrl).toBe(
        "https://git.door43.org/api/v1/catalog/list/languages?owner=test-org"
      );

      global.fetch = originalFetch;
    });

    it("should use correct URL format for resources endpoint", async () => {
      const originalFetch = global.fetch;
      let capturedUrl = "";

      global.fetch = vi.fn(async (url) => {
        capturedUrl = url;
        return originalFetch(url);
      });

      await fetchResources("test-org", "en");

      expect(capturedUrl).toBe(
        "https://git.door43.org/api/v1/catalog/list/subjects?owner=test-org&lang=en"
      );

      global.fetch = originalFetch;
    });

    it("should properly encode special characters in URLs", async () => {
      const originalFetch = global.fetch;
      let capturedUrl = "";

      global.fetch = vi.fn(async (url) => {
        capturedUrl = url;
        return originalFetch(url);
      });

      await fetchLanguages("test org with spaces");

      expect(capturedUrl).toBe(
        "https://git.door43.org/api/v1/catalog/list/languages?owner=test%20org%20with%20spaces"
      );

      global.fetch = originalFetch;
    });
  });

  describe("Regression Prevention", () => {
    it("should NOT use hardcoded data when API is available", async () => {
      const organizations = await fetchOrganizations();

      // Fallback data is exactly 4 items: ["unfoldingWord", "door43-catalog", "STR", "WA"]
      // If we get exactly this, we might be using fallback instead of real API
      const fallbackData = ["unfoldingWord", "door43-catalog", "STR", "WA"];

      expect(organizations).not.toEqual(fallbackData);
      expect(organizations.length).toBeGreaterThan(fallbackData.length);

      console.log("✅ Confirmed using real API data, not hardcoded fallback");
    }, 10000);

    it("should NOT use hardcoded languages when API is available", async () => {
      const languages = await fetchLanguages("unfoldingWord");

      // Fallback languages are exactly 20 items as objects
      const fallbackLanguages = [
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

      expect(languages).not.toEqual(fallbackLanguages);
      expect(languages.length).toBeGreaterThan(fallbackLanguages.length);

      console.log("✅ Confirmed using real API language data, not hardcoded fallback");
    }, 10000);

    it("should NOT use hardcoded resources when API is available", async () => {
      const resources = await fetchResources("unfoldingWord", "en");

      // Fallback resources are exactly 7 items
      const fallbackResources = ["ult", "ust", "tn", "tq", "tw", "twl", "ta"];

      expect(resources).not.toEqual(fallbackResources);
      expect(resources.length).toBeGreaterThan(fallbackResources.length);

      console.log("✅ Confirmed using real API resource data, not hardcoded fallback");
    }, 10000);
  });
});

// Export helper function for manual testing
export async function validateApiIntegration() {
  console.log("🔍 Validating DCS Catalog API Integration...");

  try {
    clearCatalogCache();

    const orgs = await fetchOrganizations();
    console.log(`✅ Organizations: ${orgs.length} (should be > 4)`);

    const langs = await fetchLanguages("unfoldingWord");
    console.log(`✅ Languages: ${langs.length} (should be > 20)`);

    const resources = await fetchResources("unfoldingWord", "en");
    console.log(`✅ Resources: ${resources.length} (should be > 7)`);

    console.log("🎉 API Integration validation successful!");
    return true;
  } catch (error) {
    console.error("❌ API Integration validation failed:", error);
    return false;
  }
}
