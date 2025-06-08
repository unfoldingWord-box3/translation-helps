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
    expect(screen.getByTestId("scripture-panel-rcl")).toBeInTheDocument();
    expect(
      screen.getByText("Please select a book and chapter to view scripture.")
    ).toBeInTheDocument();
  });

  it("loads and displays chapter text when reference is provided", async () => {
    const mockUSFM = `
\\id GEN - General
\\c 1
\\p
\\v 1 In the beginning God created the heavens and the earth.
\\v 2 The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.
`;
    fetchBook.mockResolvedValue(mockUSFM);

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
      const verseElements = screen.getAllByText(/In the beginning God created/);
      const verseElement = verseElements.find((el) => el.tagName.toLowerCase() === "v");
      expect(verseElement).toBeInTheDocument();
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
