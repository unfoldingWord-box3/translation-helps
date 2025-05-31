/**
 * Tests for contextValidation.js
 */

import {
  validateContext,
  validateReference,
  shouldShowResources,
  shouldShowBooks,
  shouldShowChapters,
  shouldShowScripture,
} from "./contextValidation";

describe("contextValidation", () => {
  describe("validateContext", () => {
    it("should validate empty context (showing resources)", () => {
      const context = { resourceId: null, reference: null };
      expect(validateContext(context)).toBe(true);
    });

    it("should validate context with only resourceId (showing books)", () => {
      const context = {
        resourceId: "tn",
        reference: null,
      };
      expect(validateContext(context)).toBe(true);
    });

    it("should validate context with resourceId and valid reference", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen", chapter: "1", verse: "1" },
      };
      expect(validateContext(context)).toBe(true);
    });

    it("should invalidate context with resourceId and invalid reference", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: null, chapter: "1", verse: "1" },
      };
      expect(validateContext(context)).toBe(false);
    });
  });

  describe("validateReference", () => {
    it("should return false for null reference", () => {
      expect(validateReference({ reference: null })).toBe(false);
    });

    it("should return false for reference without bookId", () => {
      const reference = { bookId: null, chapter: "1", verse: "1" };
      expect(validateReference({ reference })).toBe(false);
    });

    it("should return true for reference with only bookId", () => {
      const reference = { bookId: "gen", chapter: null, verse: null };
      expect(validateReference({ reference })).toBe(true);
    });

    it("should return true for reference with bookId and valid chapter", () => {
      const reference = { bookId: "gen", chapter: "1", verse: null };
      expect(validateReference({ reference })).toBe(true);
    });

    it("should return false for reference with invalid chapter", () => {
      const reference = { bookId: "gen", chapter: "0", verse: null };
      expect(validateReference({ reference })).toBe(false);
    });

    it("should return false for reference with verse but no chapter", () => {
      const reference = { bookId: "gen", chapter: null, verse: "1" };
      expect(validateReference({ reference })).toBe(false);
    });

    it("should return true for complete valid reference", () => {
      const reference = { bookId: "gen", chapter: "1", verse: "1" };
      expect(validateReference({ reference })).toBe(true);
    });

    it("should return false for reference with invalid verse", () => {
      const reference = { bookId: "gen", chapter: "1", verse: "0" };
      expect(validateReference({ reference })).toBe(false);
    });
  });

  describe("shouldShowResources", () => {
    it("should return true when no resourceId", () => {
      const context = { resourceId: null };
      expect(shouldShowResources(context)).toBe(true);
    });

    it("should return false when resourceId is set", () => {
      const context = { resourceId: "tn" };
      expect(shouldShowResources(context)).toBe(false);
    });
  });

  describe("shouldShowBooks", () => {
    it("should return false when no resourceId", () => {
      const context = { resourceId: null, reference: null };
      expect(shouldShowBooks(context)).toBe(false);
    });

    it("should return true when resourceId but no bookId", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: null },
      };
      expect(shouldShowBooks(context)).toBe(true);
    });

    it("should return false when both resourceId and bookId are set", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen" },
      };
      expect(shouldShowBooks(context)).toBe(false);
    });
  });

  describe("shouldShowChapters", () => {
    it("should return false when no bookId", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: null },
      };
      expect(shouldShowChapters(context)).toBe(false);
    });

    it("should return true when bookId but no chapter", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen", chapter: null },
      };
      expect(shouldShowChapters(context)).toBe(true);
    });

    it("should return false when both bookId and chapter are set", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen", chapter: "1" },
      };
      expect(shouldShowChapters(context)).toBe(false);
    });
  });

  describe("shouldShowScripture", () => {
    it("should return false when no bookId", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: null },
      };
      expect(shouldShowScripture(context)).toBe(false);
    });

    it("should return false when bookId but no chapter", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen", chapter: null },
      };
      expect(shouldShowScripture(context)).toBe(false);
    });

    it("should return true when both bookId and chapter are set", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen", chapter: "1" },
      };
      expect(shouldShowScripture(context)).toBe(true);
    });

    it("should return true when bookId, chapter, and verse are set", () => {
      const context = {
        resourceId: "tn",
        reference: { bookId: "gen", chapter: "1", verse: "1" },
      };
      expect(shouldShowScripture(context)).toBe(true);
    });
  });
});
