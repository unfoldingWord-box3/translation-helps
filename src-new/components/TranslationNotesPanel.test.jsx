import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { TranslationNotesPanel } from "./TranslationNotesPanel";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { ReferenceContext } from "../context/ReferenceContext";
import { RcLinkContext } from "./MainView";
import * as tnService from "../services/tnService";

// Mock the tnService
vi.mock("../services/tnService", () => ({
  getNotesForVerse: vi.fn(),
}));

const mockManifests = {
  tn: {
    identifier: "tn",
    language: "en",
    version: "v1",
  },
};

const mockReferenceContext = {
  organization: "unfoldingWord",
  languageId: "en",
};

const mockRcLinkContext = {
  handleRcLinkClick: vi.fn(),
};

const renderWithContexts = (component, reference) => {
  return render(
    <ManifestsContext.Provider value={{ manifests: mockManifests }}>
      <ReferenceContext.Provider value={mockReferenceContext}>
        <RcLinkContext.Provider value={mockRcLinkContext}>
          {React.cloneElement(component, { reference })}
        </RcLinkContext.Provider>
      </ReferenceContext.Provider>
    </ManifestsContext.Provider>
  );
};

describe("TranslationNotesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders select verse message when no verse is selected", () => {
    renderWithContexts(<TranslationNotesPanel />, null);
    expect(screen.getByText("Select a verse to view translation notes.")).toBeInTheDocument();
  });

  it("renders loading state", async () => {
    tnService.getNotesForVerse.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    expect(screen.getByText("Loading translation notes...")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    tnService.getNotesForVerse.mockRejectedValue(new Error("Test error"));

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to load translation notes")).toBeInTheDocument();
    });
  });

  it("renders no notes message when no notes are available", async () => {
    tnService.getNotesForVerse.mockResolvedValue([]);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      expect(
        screen.getByText("No translation notes available for this verse.")
      ).toBeInTheDocument();
    });
  });

  it("renders translation notes with markdown formatting", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "This is **bold text** and *italic text* with `code`",
        quote: "test quote",
        occurrence: "1",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      expect(screen.getByText("Translation Notes")).toBeInTheDocument();
    });

    // Check that markdown is rendered as HTML elements
    expect(screen.getByText("bold text")).toBeInTheDocument();
    expect(screen.getByText("bold text").tagName).toBe("STRONG");
    expect(screen.getByText("italic text")).toBeInTheDocument();
    expect(screen.getByText("italic text").tagName).toBe("EM");
    expect(screen.getByText("code")).toBeInTheDocument();
    expect(screen.getByText("code").tagName).toBe("CODE");
  });

  it("renders RC links as clickable buttons", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "See rc://en/tn/help/gen/01/01 for more information",
        quote: "test quote",
        occurrence: "1",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      const rcLink = screen.getByRole("button", { name: /rc:\/\/en\/tn\/help\/gen\/01\/01/ });
      expect(rcLink).toBeInTheDocument();
    });
  });

  it("handles RC link clicks", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "See rc://en/tn/help/gen/01/01 for more information",
        quote: "test quote",
        occurrence: "1",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      const rcLink = screen.getByRole("button", { name: /rc:\/\/en\/tn\/help\/gen\/01\/01/ });
      fireEvent.click(rcLink);
    });

    expect(mockRcLinkContext.handleRcLinkClick).toHaveBeenCalledWith(
      "rc://en/tn/help/gen/01/01",
      "en",
      "unfoldingWord"
    );
  });

  it("renders support reference with markdown and RC links", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "Test note",
        quote: "test quote",
        occurrence: "1",
        supportReference: "See **bold reference** at rc://en/tw/dict/bible/kt/god",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      expect(screen.getByText("See also:")).toBeInTheDocument();
      expect(screen.getByText("bold reference")).toBeInTheDocument();
      expect(screen.getByText("bold reference").tagName).toBe("STRONG");

      const rcLink = screen.getByRole("button", { name: /rc:\/\/en\/tw\/dict\/bible\/kt\/god/ });
      expect(rcLink).toBeInTheDocument();
    });
  });

  it("renders note tags when present", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "Test note",
        quote: "test quote",
        occurrence: "1",
        tags: "metaphor, figure of speech",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      expect(screen.getByText("Tags: metaphor, figure of speech")).toBeInTheDocument();
    });
  });

  it("renders occurrence information when occurrence is not 1", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "Test note",
        quote: "test quote",
        occurrence: "2",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      expect(screen.getByText("(occurrence 2)")).toBeInTheDocument();
    });
  });

  it("combines markdown and RC links correctly", async () => {
    const mockNotes = [
      {
        id: "note1",
        text: "This **bold text** contains rc://en/tn/help/gen/01/01 and *italic text*",
        quote: "test quote",
        occurrence: "1",
      },
    ];

    tnService.getNotesForVerse.mockResolvedValue(mockNotes);

    renderWithContexts(<TranslationNotesPanel />, {
      bookId: "gen",
      chapter: "1",
      verse: "1",
    });

    await waitFor(() => {
      // Check markdown formatting
      expect(screen.getByText("bold text")).toBeInTheDocument();
      expect(screen.getByText("bold text").tagName).toBe("STRONG");
      expect(screen.getByText("italic text")).toBeInTheDocument();
      expect(screen.getByText("italic text").tagName).toBe("EM");

      // Check RC link
      const rcLink = screen.getByRole("button", { name: /rc:\/\/en\/tn\/help\/gen\/01\/01/ });
      expect(rcLink).toBeInTheDocument();
    });
  });
});
