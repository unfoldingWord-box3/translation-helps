/**
 * Tests for useAppState.js
 */

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useAppState } from "./useAppState";
import { ReferenceContext } from "../context/ReferenceContext";
import { ManifestsContext } from "../context/ManifestsContext";
import { ResourcesContext } from "../context/ResourcesContext";

// Mock the contexts
const mockSetReference = vi.fn();
const mockUpdateReference = vi.fn();
const mockLoadResource = vi.fn();

const createWrapper = (contextValues = {}) => {
  const {
    reference: initialReference = { bookId: null, chapter: null, verse: null },
    manifests = {},
    resources = {},
    isLoading = false,
  } = contextValues;

  return ({ children }) => {
    const [reference, setReference] = React.useState(initialReference);

    const wrappedSetReference = vi.fn((newRef) => {
      setReference(newRef);
      mockSetReference(newRef);
    });

    return (
      <ReferenceContext.Provider
        value={{
          reference,
          setReference: wrappedSetReference,
          updateReference: mockUpdateReference,
        }}
      >
        <ManifestsContext.Provider value={{ manifests }}>
          <ResourcesContext.Provider
            value={{
              resources,
              loadResource: mockLoadResource,
              isLoading,
            }}
          >
            {children}
          </ResourcesContext.Provider>
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );
  };
};

// Mock URL and localStorage
Object.defineProperty(window, "location", {
  value: {
    pathname: "/",
    search: "",
  },
  writable: true,
});

Object.defineProperty(window, "history", {
  value: {
    pushState: vi.fn(),
  },
  writable: true,
});

const mockScrollTo = vi.fn();
Object.defineProperty(window, "scrollTo", {
  value: mockScrollTo,
  writable: true,
});

describe("useAppState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.search = "";
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      expect(result.current.organization).toBe("door43-catalog");
      expect(result.current.languageId).toBe("en");
      expect(result.current.resourceId).toBeNull();
      expect(result.current.reference).toEqual({
        bookId: null,
        chapter: null,
        verse: null,
      });
    });

    it("should initialize from URL parameters", () => {
      window.location.search = "?owner=test-org&rc=/en/tn/gen/1/1";

      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      expect(mockSetReference).toHaveBeenCalledWith({
        bookId: "gen",
        chapter: "1",
        verse: "1",
      });
    });
  });

  describe("context management", () => {
    it("should create unified context object", () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper({
          reference: { bookId: null, chapter: null, verse: null },
        }),
      });

      act(() => {
        result.current.setResourceIdAndClear("tn");
      });

      expect(result.current.context).toEqual({
        organization: "door43-catalog",
        languageId: "en",
        resourceId: "tn",
        reference: { bookId: null, chapter: null, verse: null },
      });
    });
  });

  describe("updateContext", () => {
    it("should update resourceId when provided", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.updateContext({ resourceId: "tn" });
      });

      expect(result.current.resourceId).toBe("tn");
    });

    it("should update reference when provided", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      const newReference = { bookId: "gen", chapter: "1", verse: "1" };

      await act(async () => {
        await result.current.updateContext({ reference: newReference });
      });

      expect(mockSetReference).toHaveBeenCalledWith(newReference);
    });

    it("should validate context before updating", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      // Invalid context (verse without chapter)
      const invalidReference = { bookId: "gen", chapter: null, verse: "1" };

      await act(async () => {
        await result.current.updateContext({
          resourceId: "tn",
          reference: invalidReference,
        });
      });

      // Should not update with invalid context
      expect(mockSetReference).not.toHaveBeenCalledWith(invalidReference);
    });
  });

  describe("simplified update methods", () => {
    it("should set resourceId and clear reference", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.setResourceIdAndClear("tn");
      });

      expect(result.current.resourceId).toBe("tn");
      expect(mockSetReference).toHaveBeenCalledWith({
        bookId: null,
        chapter: null,
        verse: null,
      });
    });

    it("should set bookId and clear chapter/verse", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.setBookIdAndClear("gen");
      });

      expect(mockSetReference).toHaveBeenCalledWith({
        bookId: "gen",
        chapter: null,
        verse: null,
      });
    });

    it("should set chapter and clear verse", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper({
          reference: { bookId: "gen", chapter: null, verse: null },
        }),
      });

      await act(async () => {
        result.current.setChapterAndClear("1");
      });

      expect(mockSetReference).toHaveBeenCalledWith({
        bookId: "gen",
        chapter: "1",
        verse: null,
      });
    });

    it("should set verse", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper({
          reference: { bookId: "gen", chapter: "1", verse: null },
        }),
      });

      await act(async () => {
        result.current.setVerse("1");
      });

      expect(mockSetReference).toHaveBeenCalledWith({
        bookId: "gen",
        chapter: "1",
        verse: "1",
      });
    });
  });

  describe("navigation workflow", () => {
    it("should determine current step correctly", () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      expect(result.current.getCurrentStep()).toBe("resources");

      act(() => {
        result.current.setResourceIdAndClear("tn");
      });

      expect(result.current.getCurrentStep()).toBe("books");
    });

    it("should check navigation permissions", () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canNavigateTo("resources")).toBe(true);
      expect(result.current.canNavigateTo("books")).toBe(false); // No resourceId

      act(() => {
        result.current.setResourceIdAndClear("tn");
      });

      expect(result.current.canNavigateTo("books")).toBe(true);
      expect(result.current.canNavigateTo("chapters")).toBe(false); // No bookId
    });

    it("should clear context", async () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper({
          reference: { bookId: "gen", chapter: "1", verse: "1" },
        }),
      });

      // First set a resourceId
      act(() => {
        result.current.setResourceIdAndClear("tn");
      });

      // Then clear everything
      await act(async () => {
        result.current.clearContext();
      });

      expect(result.current.resourceId).toBeNull();
      expect(mockSetReference).toHaveBeenLastCalledWith({
        bookId: null,
        chapter: null,
        verse: null,
      });
    });
  });

  describe("state check methods", () => {
    it("should correctly identify what to show", () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      // Initially should show resources
      expect(result.current.shouldShowResources()).toBe(true);
      expect(result.current.shouldShowBooks()).toBe(false);
      expect(result.current.shouldShowChapters()).toBe(false);
      expect(result.current.shouldShowScripture()).toBe(false);
    });
  });

  describe("breadcrumbs", () => {
    it("should generate correct breadcrumbs", () => {
      // Start with empty state
      const { result } = renderHook(() => useAppState(), {
        wrapper: createWrapper(),
      });

      // Set resource - should show Resources, TN
      act(() => {
        result.current.setResourceIdAndClear("tn");
      });

      let breadcrumbs = result.current.getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(2); // Resources, TN
      expect(breadcrumbs[0].name).toBe("Resources");
      expect(breadcrumbs[1].name).toBe("TN");

      // Set book - should show Resources, TN, GEN
      act(() => {
        result.current.setBookIdAndClear("gen");
      });

      breadcrumbs = result.current.getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(3); // Resources, TN, GEN
      expect(breadcrumbs[0].name).toBe("Resources");
      expect(breadcrumbs[1].name).toBe("TN");
      expect(breadcrumbs[2].name).toBe("GEN");
    });
  });
});
