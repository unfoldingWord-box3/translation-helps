/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import USFMRenderer from "./USFMRenderer";
import { ReferenceContext } from "../../context/ReferenceContext";

// Real proskomma-react-hooks (no mocking)

const mockContextValue = {
  updateReference: vi.fn(),
};

const defaultProps = {
  selectedVerse: 1,
  onVerseClick: vi.fn(),
  org: "unfoldingword",
  lang: "en",
  abbr: "tit",
  usfm: `\\id TIT
\\c 1
\\v 1 Paul, a servant of God and an apostle of Jesus Christ
\\v 2 in hope of eternal life`,
  chapter: 1,
};

const renderWithContext = (component, contextValue = mockContextValue) => {
  return render(
    <ReferenceContext.Provider value={contextValue}>{component}</ReferenceContext.Provider>
  );
};

describe("USFMRenderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithContext(<USFMRenderer {...defaultProps} />);
    expect(screen.getByTestId("usfm-renderer")).toBeInTheDocument();
  });

  it("shows error when required props are missing", () => {
    renderWithContext(
      <USFMRenderer
        selectedVerse={1}
        onVerseClick={vi.fn()}
        org=''
        lang=''
        abbr=''
        usfm=''
        chapter={1}
      />
    );
    expect(screen.getByText("Missing scripture context.")).toBeInTheDocument();
  });

  it("shows loading state when no passage data is available", async () => {
    renderWithContext(<USFMRenderer {...defaultProps} chapter={99} />);

    await waitFor(() => {
      expect(screen.getByText("Loading chapter 99...")).toBeInTheDocument();
    });
  });

  it("renders chapter header and verses", async () => {
    renderWithContext(<USFMRenderer {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Chapter 1")).toBeInTheDocument();
      expect(
        screen.getByText("Paul, a servant of God and an apostle of Jesus Christ")
      ).toBeInTheDocument();
      expect(screen.getByText("in hope of eternal life")).toBeInTheDocument();
    });
  });

  it("highlights selected verse", async () => {
    renderWithContext(<USFMRenderer {...defaultProps} selectedVerse={1} />);

    await waitFor(() => {
      const verseElements = screen.getAllByClassName("verse");
      const selectedVerse = verseElements.find((el) => el.classList.contains("selected"));
      expect(selectedVerse).toBeInTheDocument();
    });
  });

  it("calls onVerseClick when verse is clicked", async () => {
    const onVerseClick = vi.fn();
    renderWithContext(<USFMRenderer {...defaultProps} onVerseClick={onVerseClick} />);

    await waitFor(() => {
      const verseElement = screen
        .getByText("Paul, a servant of God and an apostle of Jesus Christ")
        .closest(".verse");
      if (verseElement) {
        verseElement.click();
        expect(onVerseClick).toHaveBeenCalledWith(1, 1);
      }
    });
  });

  it("updates reference context when verse is clicked", async () => {
    const updateReference = vi.fn();
    renderWithContext(<USFMRenderer {...defaultProps} />, { updateReference });

    await waitFor(() => {
      const verseElement = screen
        .getByText("Paul, a servant of God and an apostle of Jesus Christ")
        .closest(".verse");
      if (verseElement) {
        verseElement.click();
        expect(updateReference).toHaveBeenCalledWith({ chapter: 1, verse: 1 });
      }
    });
  });
});
