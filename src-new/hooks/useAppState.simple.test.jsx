/**
 * Simplified test for useAppState to identify memory issues
 */

import React from "react";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useAppState } from "./useAppState";
import { ReferenceContext } from "../context/ReferenceContext";
import { ManifestsContext } from "../context/ManifestsContext";
import { ResourcesContext } from "../context/ResourcesContext";

// Mock minimal contexts
const mockSetReference = vi.fn();
const mockUpdateReference = vi.fn();
const mockLoadResource = vi.fn();

const SimpleWrapper = ({ children }) => {
  const [reference] = React.useState({ bookId: null, chapter: null, verse: null });

  return (
    <ReferenceContext.Provider
      value={{
        reference,
        setReference: mockSetReference,
        updateReference: mockUpdateReference,
      }}
    >
      <ManifestsContext.Provider value={{ manifests: {} }}>
        <ResourcesContext.Provider
          value={{
            resources: {},
            loadResource: mockLoadResource,
            isLoading: false,
          }}
        >
          {children}
        </ResourcesContext.Provider>
      </ManifestsContext.Provider>
    </ReferenceContext.Provider>
  );
};

// Mock URL and localStorage to prevent side effects
Object.defineProperty(window, "location", {
  value: { pathname: "/", search: "" },
  writable: true,
});

Object.defineProperty(window, "history", {
  value: { pushState: vi.fn() },
  writable: true,
});

Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

describe("useAppState simple test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.search = "";
  });

  it("should initialize without memory leak", () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: SimpleWrapper,
    });

    expect(result.current.organization).toBe("door43-catalog");
    expect(result.current.languageId).toBe("en");
    expect(result.current.resourceId).toBeNull();
  });
});
