import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { ReferenceContext } from "../context/ReferenceContext";
import { TranslationQuestionsPanel } from "./TranslationQuestionsPanel";
import { RcLinkContext } from "./MainView";
import * as tqService from "../services/tqService";

// Mock the tqService
vi.mock("../services/tqService");

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockManifestsContext = {
  manifests: {
    tq: {
      projects: [
        {
          identifier: "gen",
          path: "./gen.tsv",
        },
      ],
    },
  },
  isLoading: false,
};

const mockReferenceContext = {
  organization: "unfoldingWord",
  languageId: "en",
  resourceId: "ult",
};

const mockRcLinkContext = {
  handleRcLinkClick: vi.fn(),
};

const renderWithContext = (component, manifests = mockManifestsContext) => {
  return render(
    <ManifestsContext.Provider value={manifests}>
      <ReferenceContext.Provider value={mockReferenceContext}>
        <RcLinkContext.Provider value={mockRcLinkContext}>{component}</RcLinkContext.Provider>
      </ReferenceContext.Provider>
    </ManifestsContext.Provider>
  );
};

describe("TranslationQuestionsPanel", () => {
  it("shows message when no reference is provided", () => {
    renderWithContext(<TranslationQuestionsPanel reference={null} />);
    expect(screen.getByText("Select a verse to view translation questions.")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    // Mock a delayed response
    vi.mocked(tqService.getQuestionsForVerse).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    renderWithContext(
      <TranslationQuestionsPanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />
    );

    expect(screen.getByText("Loading translation questions...")).toBeInTheDocument();
  });

  it("displays questions when available", async () => {
    const mockQuestions = [
      {
        id: 0,
        question: "Why was the earth without form?",
        answer: "Because God had not yet formed it.",
      },
      {
        id: 1,
        question: "What did God create first?",
        answer: "Light.",
      },
    ];

    vi.mocked(tqService.getQuestionsForVerse).mockResolvedValue(mockQuestions);

    renderWithContext(
      <TranslationQuestionsPanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />
    );

    await waitFor(() => {
      expect(screen.getByText("Translation Questions")).toBeInTheDocument();
      expect(screen.getByText("Q: Why was the earth without form?")).toBeInTheDocument();
      expect(screen.getByText("A: Because God had not yet formed it.")).toBeInTheDocument();
      expect(screen.getByText("Q: What did God create first?")).toBeInTheDocument();
      expect(screen.getByText("A: Light.")).toBeInTheDocument();
    });
  });

  it("shows no questions message when none are available", async () => {
    vi.mocked(tqService.getQuestionsForVerse).mockResolvedValue([]);

    renderWithContext(
      <TranslationQuestionsPanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No translation questions available for this verse.")
      ).toBeInTheDocument();
    });
  });

  it("handles error state", async () => {
    vi.mocked(tqService.getQuestionsForVerse).mockRejectedValue(
      new Error("Failed to fetch questions")
    );

    renderWithContext(
      <TranslationQuestionsPanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load translation questions/)).toBeInTheDocument();
    });
  });

  it("passes custom file path from manifest to service", async () => {
    vi.mocked(tqService.getQuestionsForVerse).mockResolvedValue([]);

    renderWithContext(
      <TranslationQuestionsPanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />
    );

    await waitFor(() => {
      expect(tqService.getQuestionsForVerse).toHaveBeenCalledWith(
        "gen",
        "1",
        "1",
        "unfoldingWord",
        "en",
        "gen.tsv"
      );
    });
  });

  it("falls back to default when manifest is not available", async () => {
    vi.mocked(tqService.getQuestionsForVerse).mockResolvedValue([]);

    const emptyContext = {
      manifests: {},
      isLoading: false,
    };

    renderWithContext(
      <TranslationQuestionsPanel reference={{ bookId: "gen", chapter: "1", verse: "1" }} />,
      emptyContext
    );

    await waitFor(() => {
      expect(tqService.getQuestionsForVerse).toHaveBeenCalledWith(
        "gen",
        "1",
        "1",
        "unfoldingWord",
        "en",
        null
      );
    });
  });
});
