import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ScripturePanel } from "./ScripturePanel";
import { ReferenceContext } from "../context/ReferenceContext";
import { ManifestsContext } from "../context/MultiManifestsContext";

// Mock the scripture service
vi.mock("../services/scriptureService", () => ({
  fetchBook: vi.fn(),
}));

import { fetchBook } from "../services/scriptureService";

describe("ScripturePanel", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders message when no bookId is provided", () => {
    const mockManifests = { ult: { projects: [] } };
    render(
      <ManifestsContext.Provider value={{ manifests: mockManifests, isLoading: false }}>
        <ReferenceContext.Provider
          value={{
            reference: { bookId: "", chapter: "1", verse: "1" },
            updateReference: vi.fn(),
            organization: "unfoldingWord",
            languageId: "en",
          }}
        >
          <ScripturePanel reference={{ bookId: "", chapter: "1", verse: "1" }} />
        </ReferenceContext.Provider>
      </ManifestsContext.Provider>
    );
    expect(screen.getByTestId("scripture-panel")).toBeInTheDocument();
    expect(
      screen.getByText("Please select a book and chapter to view scripture.")
    ).toBeInTheDocument();
  });

  it("loads and displays chapter text when reference is provided", async () => {
    // Mock the parsed chapters data that would come from usfm-js
    const mockChapters = {
      1: {
        1: {
          verseObjects: [
            { type: "text", text: "In the beginning God created the heavens and the earth." },
          ],
        },
        2: {
          verseObjects: [{ type: "text", text: "The earth was without form and void." }],
        },
      },
    };

    fetchBook.mockResolvedValue(mockChapters);

    const mockManifests = {
      ult: {
        projects: [{ identifier: "gen", path: "./01-GEN.usfm" }],
      },
    };
    const mockUpdateReference = vi.fn();

    render(
      <ManifestsContext.Provider value={{ manifests: mockManifests, isLoading: false }}>
        <ReferenceContext.Provider
          value={{
            reference: { bookId: "gen", chapter: "1", verse: "1" },
            updateReference: mockUpdateReference,
            organization: "unfoldingWord",
            languageId: "en",
          }}
        >
          <ScripturePanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />
        </ReferenceContext.Provider>
      </ManifestsContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("GEN 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("In the beginning God created the heavens and the earth.")
      ).toBeInTheDocument();
    });

    expect(fetchBook).toHaveBeenCalledWith({
      languageId: "en",
      resourceId: "ult",
      bookId: "gen",
      organization: "unfoldingWord",
      manifest: mockManifests.ult,
    });
  });
});
