/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ReferenceSelector } from "./ReferenceSelector";
import { ReferenceContext } from "../context/ReferenceContext";

// Mock the hooks
vi.mock("../hooks/useOrganizations", () => ({
  useOrganizations: () => ({
    organizations: ["unfoldingWord", "Door43-Catalog"],
    loading: false,
  }),
}));

vi.mock("../hooks/useLanguages", () => ({
  useLanguages: (organization) => ({
    languages: organization
      ? [
          { code: "en", name: "English" },
          { code: "es", name: "Spanish" },
        ]
      : [],
    loading: false,
  }),
}));

vi.mock("../hooks/useResources", () => ({
  useResources: (organization, languageId) => ({
    resources:
      organization && languageId
        ? [
            { id: "ult", name: "ULT", description: "Unlocked Literal Text" },
            { id: "tn", name: "TN", description: "Translation Notes" },
          ]
        : [],
    loading: false,
  }),
}));

// Mock console.log to avoid test output noise
vi.spyOn(console, "log").mockImplementation(() => {});

describe("ReferenceSelector", () => {
  let mockUpdateContext;
  let mockContextValue;

  beforeEach(() => {
    mockUpdateContext = vi.fn();
    mockContextValue = {
      organization: null,
      languageId: null,
      resourceId: null,
      reference: {
        bookId: null,
        chapter: null,
        verse: null,
      },
      updateContext: mockUpdateContext,
    };
  });

  const renderWithContext = (contextOverrides = {}) => {
    const contextValue = { ...mockContextValue, ...contextOverrides };
    return render(
      <ReferenceContext.Provider value={contextValue}>
        <ReferenceSelector />
      </ReferenceContext.Provider>
    );
  };

  describe("Basic Rendering", () => {
    it("renders all dropdown elements", () => {
      renderWithContext();

      expect(screen.getByTestId("organization-selector")).toBeInTheDocument();
      expect(screen.getByTestId("language-selector")).toBeInTheDocument();
      expect(screen.getByTestId("resource-selector")).toBeInTheDocument();
      expect(screen.getByTestId("book-selector")).toBeInTheDocument();
      expect(screen.getByTestId("chapter-selector")).toBeInTheDocument();
      expect(screen.getByTestId("verse-selector")).toBeInTheDocument();
    });

    it("shows correct placeholder text when no organization selected", () => {
      renderWithContext();

      expect(screen.getByDisplayValue("Select Organization")).toBeInTheDocument();
    });

    it("displays current context when fully selected", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
        resourceId: "ult",
        reference: {
          bookId: "gen",
          chapter: "1",
          verse: "1",
        },
      });

      expect(screen.getByText("unfoldingWord/en/ult/GEN 1:1")).toBeInTheDocument();
    });
  });

  describe("Cascading Behavior", () => {
    describe("Organization Change", () => {
      it("resets all downstream selections when organization changes", () => {
        renderWithContext({
          organization: "unfoldingWord",
          languageId: "en",
          resourceId: "ult",
          reference: {
            bookId: "gen",
            chapter: "1",
            verse: "1",
          },
        });

        const orgSelector = screen.getByTestId("organization-selector");
        fireEvent.change(orgSelector, { target: { value: "Door43-Catalog" } });

        expect(mockUpdateContext).toHaveBeenCalledWith({
          organization: "Door43-Catalog",
          languageId: null,
          resourceId: null,
          reference: {
            bookId: null,
            chapter: null,
            verse: null,
          },
        });
      });

      it("handles empty organization selection", () => {
        renderWithContext({
          organization: "unfoldingWord",
          languageId: "en",
          resourceId: "ult",
        });

        const orgSelector = screen.getByTestId("organization-selector");
        fireEvent.change(orgSelector, { target: { value: "" } });

        expect(mockUpdateContext).toHaveBeenCalledWith({
          organization: "",
          languageId: null,
          resourceId: null,
          reference: {
            bookId: null,
            chapter: null,
            verse: null,
          },
        });
      });
    });

    describe("Language Change", () => {
      it("resets resource and reference selections when language changes", () => {
        renderWithContext({
          organization: "unfoldingWord",
          languageId: "en",
          resourceId: "ult",
          reference: {
            bookId: "gen",
            chapter: "1",
            verse: "1",
          },
        });

        const langSelector = screen.getByTestId("language-selector");
        fireEvent.change(langSelector, { target: { value: "es" } });

        expect(mockUpdateContext).toHaveBeenCalledWith({
          languageId: "es",
          resourceId: null,
          reference: {
            bookId: null,
            chapter: null,
            verse: null,
          },
        });
      });

      it("preserves organization when language changes", () => {
        renderWithContext({
          organization: "unfoldingWord",
          languageId: "en",
          resourceId: "ult",
        });

        const langSelector = screen.getByTestId("language-selector");
        fireEvent.change(langSelector, { target: { value: "es" } });

        // Verify organization is not included in the update (preserved)
        expect(mockUpdateContext).toHaveBeenCalledWith({
          languageId: "es",
          resourceId: null,
          reference: {
            bookId: null,
            chapter: null,
            verse: null,
          },
        });
      });
    });

    describe("Resource Change", () => {
      it("resets reference selections when resource changes", () => {
        renderWithContext({
          organization: "unfoldingWord",
          languageId: "en",
          resourceId: "ult",
          reference: {
            bookId: "gen",
            chapter: "1",
            verse: "1",
          },
        });

        const resourceSelector = screen.getByTestId("resource-selector");
        fireEvent.change(resourceSelector, { target: { value: "tn" } });

        expect(mockUpdateContext).toHaveBeenCalledWith({
          resourceId: "tn",
          reference: {
            bookId: null,
            chapter: null,
            verse: null,
          },
        });
      });

      it("preserves organization and language when resource changes", () => {
        renderWithContext({
          organization: "unfoldingWord",
          languageId: "en",
          resourceId: "ult",
          reference: {
            bookId: "gen",
            chapter: "1",
            verse: "1",
          },
        });

        const resourceSelector = screen.getByTestId("resource-selector");
        fireEvent.change(resourceSelector, { target: { value: "tn" } });

        // Verify only resourceId and reference are updated
        expect(mockUpdateContext).toHaveBeenCalledWith({
          resourceId: "tn",
          reference: {
            bookId: null,
            chapter: null,
            verse: null,
          },
        });
      });
    });
  });

  describe("Disabled States", () => {
    it("disables language selector when no organization selected", () => {
      renderWithContext();

      const langSelector = screen.getByTestId("language-selector");
      expect(langSelector).toBeDisabled();
    });

    it("enables language selector when organization is selected", () => {
      renderWithContext({ organization: "unfoldingWord" });

      const langSelector = screen.getByTestId("language-selector");
      expect(langSelector).not.toBeDisabled();
    });

    it("disables resource selector when no language selected", () => {
      renderWithContext({ organization: "unfoldingWord" });

      const resourceSelector = screen.getByTestId("resource-selector");
      expect(resourceSelector).toBeDisabled();
    });

    it("enables resource selector when both organization and language selected", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
      });

      const resourceSelector = screen.getByTestId("resource-selector");
      expect(resourceSelector).not.toBeDisabled();
    });

    it("disables book selector when no resource selected", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
      });

      const bookSelector = screen.getByTestId("book-selector");
      expect(bookSelector).toBeDisabled();
    });

    it("enables book selector when resource is selected", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
        resourceId: "ult",
      });

      const bookSelector = screen.getByTestId("book-selector");
      expect(bookSelector).not.toBeDisabled();
    });
  });

  describe("Existing Book/Chapter/Verse Logic", () => {
    it("preserves existing book change logic with chapter/verse reset", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
        resourceId: "ult",
        reference: {
          bookId: "gen",
          chapter: "5",
          verse: "10",
        },
      });

      const bookSelector = screen.getByTestId("book-selector");
      fireEvent.change(bookSelector, { target: { value: "exo" } });

      expect(mockUpdateContext).toHaveBeenCalledWith({
        reference: {
          bookId: "exo",
          chapter: "1",
          verse: "1",
        },
      });
    });

    it("preserves existing chapter change logic with verse reset", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
        resourceId: "ult",
        reference: {
          bookId: "gen",
          chapter: "1",
          verse: "10",
        },
      });

      const chapterSelector = screen.getByTestId("chapter-selector");
      fireEvent.change(chapterSelector, { target: { value: "2" } });

      expect(mockUpdateContext).toHaveBeenCalledWith({
        reference: {
          bookId: "gen",
          chapter: "2",
          verse: "1",
        },
      });
    });

    it("preserves existing verse change logic", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
        resourceId: "ult",
        reference: {
          bookId: "gen",
          chapter: "1",
          verse: "1",
        },
      });

      const verseSelector = screen.getByTestId("verse-selector");
      fireEvent.change(verseSelector, { target: { value: "5" } });

      expect(mockUpdateContext).toHaveBeenCalledWith({
        reference: {
          bookId: "gen",
          chapter: "1",
          verse: "5",
        },
      });
    });
  });

  describe("Placeholder Text Behavior", () => {
    it("shows appropriate placeholder when no organization selected", () => {
      renderWithContext();

      expect(screen.getByDisplayValue("Select Organization")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Select Language")).toBeInTheDocument();
    });

    it("updates placeholders appropriately as selections are made", () => {
      renderWithContext({ organization: "unfoldingWord" });

      // Language selector should show "Select Language"
      const languageSelector = screen.getByTestId("language-selector");
      expect(languageSelector).toHaveDisplayValue("Select Language");

      // Resource selector should show "Select Language" when no language is selected
      const resourceSelector = screen.getByTestId("resource-selector");
      expect(resourceSelector).toHaveDisplayValue("Select Language");
    });

    it("shows proper placeholder for book selector when no resource selected", () => {
      renderWithContext({
        organization: "unfoldingWord",
        languageId: "en",
      });

      expect(screen.getByDisplayValue("Select Resource")).toBeInTheDocument();
    });
  });
});
