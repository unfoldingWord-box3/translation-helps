/**
 * Test for duplicate import prevention in ScripturePanelRCL
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ScripturePanelRCL from "./ScripturePanelRCL";
import { ReferenceContext } from "../../context/ReferenceContext";
import { ManifestsContext } from "../../context/MultiManifestsContext";
import { waitForOptions, testCleanup, TEST_TIMEOUT } from "./test-utils";

// Mock proskomma-react-hooks
vi.mock("proskomma-react-hooks", () => ({
  useProskomma: vi.fn(() => ({
    proskomma: { mockProskomma: true },
    stateId: "mock-state-id",
  })),
  useImport: vi.fn(() => ({
    done: true,
    errors: [],
    importing: false,
  })),
  useCatalog: vi.fn(() => ({
    catalog: {
      docSets: [],
    },
    data: {
      nDocSets: 0,
      nDocuments: 0,
    },
  })),
}));

// Mock scripture service
vi.mock("../../services/scriptureService", () => ({
  fetchBook: vi.fn(),
}));

// Mock child components
vi.mock("./USFMRenderer", () => ({
  default: ({ usfm, chapter, onVerseClick }) => (
    <div data-testid='usfm-renderer'>
      Mock USFMRenderer - Chapter: {chapter}, Content Length: {usfm?.length || 0}
    </div>
  ),
}));

vi.mock("./SearchPanel", () => ({
  default: ({ usfm }) => (
    <div data-testid='search-panel'>Mock SearchPanel - Content Length: {usfm?.length || 0}</div>
  ),
}));

const { useProskomma, useImport, useCatalog } = await import("proskomma-react-hooks");
const { fetchBook } = await import("../../services/scriptureService");

describe("ScripturePanelRCL - Duplicate Import Prevention", () => {
  const mockUpdateReference = vi.fn();
  const mockManifests = {
    ult: {
      dublin_core: {
        title: "unfoldingWord Literal Text",
        language: { identifier: "en", title: "English" },
      },
      projects: [
        {
          identifier: "mrk",
          path: "./projects/MRK",
          categories: ["bible-nt"],
        },
      ],
    },
  };

  beforeEach(() => {
    vi.setConfig({ testTimeout: TEST_TIMEOUT });
  });

  const defaultReferenceContext = {
    organization: "unfoldingWord",
    languageId: "en",
    resourceId: "ult",
    updateReference: mockUpdateReference,
  };

  const defaultManifestsContext = {
    manifests: mockManifests,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock implementations
    useCatalog.mockReturnValue({
      catalog: { docSets: [] },
      data: { nDocSets: 0, nDocuments: 0 },
    });
    fetchBook.mockResolvedValue("\\id MRK\n\\c 1\n\\v 1 Sample verse");
  });

  afterEach(async () => {
    await testCleanup();
  });

  it("should skip import when book is already in Proskomma catalog", async () => {
    // Mock catalog to show book is already imported
    useCatalog.mockReturnValue({
      catalog: {
        docSets: [
          {
            id: "unfoldingWord/en_mrk",
            nDocuments: 1,
          },
        ],
      },
      data: { nDocSets: 1, nDocuments: 1 },
    });

    // Mock useImport to track if it's called with documents
    const mockImportHook = { done: true, errors: [], importing: false };
    useImport.mockReturnValue(mockImportHook);

    const reference = { bookId: "mrk", chapter: 1, verse: 1 };

    render(
      <ReferenceContext.Provider value={defaultReferenceContext}>
        <ManifestsContext.Provider value={defaultManifestsContext}>
          <ScripturePanelRCL reference={reference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("usfm-renderer")).toBeInTheDocument();
    }, waitForOptions);

    // Should still fetch USFM content for rendering, but not create import documents
    expect(fetchBook).toHaveBeenCalledWith({
      languageId: "en",
      resourceId: "ult",
      bookId: "mrk",
      manifest: mockManifests.ult,
      organization: "unfoldingWord",
    });

    // Verify useImport was called with empty documents array since book is already imported
    expect(useImport).toHaveBeenCalledWith(
      expect.objectContaining({
        documents: [],
        verbose: false,
      })
    );
  });

  it("should import when book is not yet imported", async () => {
    // Mock catalog to show no books imported
    useCatalog.mockReturnValue({
      catalog: { docSets: [] },
      data: { nDocSets: 0, nDocuments: 0 },
    });

    const mockUSFM = "\\id MRK\n\\c 1\n\\v 1 Sample verse";
    fetchBook.mockResolvedValue(mockUSFM);

    const reference = { bookId: "mrk", chapter: 1, verse: 1 };

    render(
      <ReferenceContext.Provider value={defaultReferenceContext}>
        <ManifestsContext.Provider value={defaultManifestsContext}>
          <ScripturePanelRCL reference={reference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    await waitFor(() => {
      expect(fetchBook).toHaveBeenCalledWith({
        languageId: "en",
        resourceId: "ult",
        bookId: "mrk",
        manifest: mockManifests.ult,
        organization: "unfoldingWord",
      });
    }, waitForOptions);

    // Verify useImport was eventually called with the document configuration
    await waitFor(() => {
      expect(useImport).toHaveBeenCalledWith(
        expect.objectContaining({
          documents: [
            {
              selectors: { org: "unfoldingWord", lang: "en", abbr: "mrk" },
              data: mockUSFM,
              bookCode: "mrk",
            },
          ],
          verbose: false,
        })
      );
    }, waitForOptions);
  });

  it("should use existing USFM content when changing chapters within same book", async () => {
    // Mock catalog to show book is already imported
    useCatalog.mockReturnValue({
      catalog: {
        docSets: [
          {
            id: "unfoldingWord/en_mrk",
            nDocuments: 1,
          },
        ],
      },
      data: { nDocSets: 1, nDocuments: 1 },
    });

    const reference1 = { bookId: "mrk", chapter: 1, verse: 1 };

    const { rerender } = render(
      <ReferenceContext.Provider value={defaultReferenceContext}>
        <ManifestsContext.Provider value={defaultManifestsContext}>
          <ScripturePanelRCL reference={reference1} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("usfm-renderer")).toBeInTheDocument();
    }, waitForOptions);

    // Clear fetchBook calls from initial render
    fetchBook.mockClear();

    // Change to chapter 2 of the same book
    const reference2 = { bookId: "mrk", chapter: 2, verse: 1 };

    rerender(
      <ReferenceContext.Provider value={defaultReferenceContext}>
        <ManifestsContext.Provider value={defaultManifestsContext}>
          <ScripturePanelRCL reference={reference2} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    // Should not re-fetch when changing chapters within same imported book
    expect(fetchBook).not.toHaveBeenCalled();
  });

  it("should log appropriate messages when preventing duplicate imports", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Mock catalog to show book is already imported
    useCatalog.mockReturnValue({
      catalog: {
        docSets: [
          {
            id: "unfoldingWord/en_mrk",
            nDocuments: 1,
          },
        ],
      },
      data: { nDocSets: 1, nDocuments: 1 },
    });

    const reference = { bookId: "mrk", chapter: 1, verse: 1 };

    render(
      <ReferenceContext.Provider value={defaultReferenceContext}>
        <ManifestsContext.Provider value={defaultManifestsContext}>
          <ScripturePanelRCL reference={reference} />
        </ManifestsContext.Provider>
      </ReferenceContext.Provider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "✅ ScripturePanelRCL: Loaded full USFM for mrk (30 characters)"
      );
    }, waitForOptions);

    consoleSpy.mockRestore();
  });
});
