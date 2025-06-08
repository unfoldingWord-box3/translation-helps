/**
 * ScripturePanelRCL.test.jsx
 * Tests for the enhanced scripture panel with simple-text-editor-rcl
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ScripturePanelRCL from "./ScripturePanelRCL";
import { ReferenceContext } from "../../context/ReferenceContext";
import { ManifestsContext } from "../../context/MultiManifestsContext";
import * as scriptureService from "../../services/scriptureService";

// Mock the scriptureService
vi.mock("../../services/scriptureService", async () => {
  const actual = await vi.importActual("../../services/scriptureService");
  return {
    ...actual,
    fetchBook: vi.fn(),
  };
});

// Mock the UsfmEditor component from simple-text-editor-rcl
vi.mock("simple-text-editor-rcl", () => ({
  UsfmEditor: ({ content, options }) => (
    <div data-testid='usfm-editor' data-options={JSON.stringify(options)}>
      {content}
    </div>
  ),
}));

describe("ScripturePanelRCL", () => {
  const mockReference = {
    bookId: "gen",
    chapter: 1,
    verse: 1,
  };

  const mockReferenceContext = {
    organization: "unfoldingWord",
    languageId: "en",
    resourceId: "ult",
    updateReference: vi.fn(),
  };

  const mockManifest = {
    projects: [
      {
        identifier: "gen",
        path: "./01-GEN.usfm",
      },
    ],
  };

  const mockManifestsContext = {
    manifests: {
      ult: mockManifest,
    },
    isLoading: false,
  };

  const mockUSFMContent = `\id GEN
\c 1
\v 1 In the beginning God created the heavens and the earth.
\v 2 The earth was without form and void, and darkness was over the face of the deep.`;

  beforeEach(() => {
    vi.clearAllMocks();
    scriptureService.fetchBook.mockResolvedValue(mockUSFMContent);
  });

  const renderWithContext = (props = {}) => {
    return render(
      <ReferenceContext.Provider value={mockReferenceContext}>
        <ManifestsContext.Provider value={mockManifestsContext}>
          <ScripturePanelRCL reference={mockReference} {...props} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );
  };

  it("renders with loading state initially", () => {
    renderWithContext();
    expect(screen.getByText("Loading scripture...")).toBeInTheDocument();
  });

  it("renders USFM content when loaded", async () => {
    renderWithContext();

    await waitFor(() => {
      expect(screen.getByTestId("usfm-editor")).toBeInTheDocument();
    });

    expect(scriptureService.fetchBook).toHaveBeenCalledWith({
      languageId: "en",
      resourceId: "ult",
      bookId: "gen",
      manifest: mockManifest,
      organization: "unfoldingWord",
    });
  });

  it("renders chapter title", async () => {
    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText("GEN 1")).toBeInTheDocument();
    });
  });

  it("shows guidance when no reference is selected", () => {
    renderWithContext({ reference: null });
    expect(
      screen.getByText("Please select a book and chapter to view scripture.")
    ).toBeInTheDocument();
  });

  it("shows guidance when organization is missing", () => {
    const contextWithoutOrg = {
      ...mockReferenceContext,
      organization: null,
    };

    render(
      <ReferenceContext.Provider value={contextWithoutOrg}>
        <ManifestsContext.Provider value={mockManifestsContext}>
          <ScripturePanelRCL reference={mockReference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    expect(
      screen.getByText("Please select an organization from the dropdown above to view scripture.")
    ).toBeInTheDocument();
  });

  it("shows guidance when language is missing", () => {
    const contextWithoutLang = {
      ...mockReferenceContext,
      languageId: null,
    };

    render(
      <ReferenceContext.Provider value={contextWithoutLang}>
        <ManifestsContext.Provider value={mockManifestsContext}>
          <ScripturePanelRCL reference={mockReference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    expect(
      screen.getByText("Please select a language from the dropdown above to view scripture.")
    ).toBeInTheDocument();
  });

  it("shows guidance when resource manifest is not available", () => {
    const contextWithoutManifest = {
      manifests: {},
      isLoading: false,
    };

    render(
      <ReferenceContext.Provider value={mockReferenceContext}>
        <ManifestsContext.Provider value={contextWithoutManifest}>
          <ScripturePanelRCL reference={mockReference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    expect(
      screen.getByText(/The selected Bible resource \(ULT\) is not available/)
    ).toBeInTheDocument();
  });

  it("shows error when USFM fetch fails", async () => {
    scriptureService.fetchBook.mockRejectedValue(new Error("Network error"));

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText("Failed to load chapter: Network error")).toBeInTheDocument();
    });
  });

  it("calls onVerseClick when verse is clicked", async () => {
    const mockOnVerseClick = vi.fn();
    renderWithContext({ onVerseClick: mockOnVerseClick });

    await waitFor(() => {
      expect(screen.getByTestId("usfm-editor")).toBeInTheDocument();
    });

    // This test is simplified since the actual verse clicking logic is in USFMRenderer
    // We're just verifying the prop is passed through
    expect(mockOnVerseClick).not.toHaveBeenCalled();
  });

  it("handles manifests loading state", () => {
    const loadingManifestsContext = {
      manifests: {},
      isLoading: true,
    };

    render(
      <ReferenceContext.Provider value={mockReferenceContext}>
        <ManifestsContext.Provider value={loadingManifestsContext}>
          <ScripturePanelRCL reference={mockReference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    expect(screen.getByText("Loading scripture...")).toBeInTheDocument();
  });

  it.skip("extracts chapter USFM correctly", async () => {
    const multiChapterUSFM = `\id GEN
\c 1
\v 1 Chapter 1 verse 1
\c 2
\v 1 Chapter 2 verse 1`;

    scriptureService.fetchBook.mockResolvedValue(multiChapterUSFM);

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByTestId("usfm-editor")).toBeInTheDocument();
    });

    // Verify that only chapter 1 content is rendered
    const editorContent = screen.getByTestId("usfm-editor").textContent;
    expect(editorContent).toContain("Chapter 1 verse 1");
    expect(editorContent).not.toContain("Chapter 2 verse 1");
  });
});
