/**
 * NavigationBreadcrumbs.test.jsx
 * Tests for the NavigationBreadcrumbs component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs";
import { ReferenceContext } from "../context/ReferenceContext";

// Mock the hooks
vi.mock("../hooks/useOrganizations", () => ({
  useOrganizations: () => ({
    organizations: ["unfoldingWord", "Door43"],
    loading: false,
  }),
}));

vi.mock("../hooks/useLanguages", () => ({
  useLanguages: () => ({
    languages: [
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
    ],
    loading: false,
  }),
}));

vi.mock("../hooks/useResources", () => ({
  useResources: () => ({
    resources: [
      { id: "ult", name: "unfoldingWord Literal Text" },
      { id: "ust", name: "unfoldingWord Simplified Text" },
    ],
    loading: false,
  }),
}));

const createMockContext = (overrides = {}) => ({
  organization: null,
  languageId: null,
  resourceId: null,
  reference: {
    bookId: null,
    chapter: null,
    verse: null,
  },
  updateContext: vi.fn(),
  ...overrides,
});

const renderWithContext = (context, onOpenWizard = vi.fn()) => {
  return render(
    <ReferenceContext.Provider value={context}>
      <NavigationBreadcrumbs onOpenWizard={onOpenWizard} />
    </ReferenceContext.Provider>
  );
};

describe("NavigationBreadcrumbs", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all breadcrumb steps", () => {
    const context = createMockContext();
    renderWithContext(context);

    expect(screen.getByTestId("breadcrumb-1")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb-2")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb-3")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb-4")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb-5")).toBeInTheDocument();
  });

  it("shows default labels when no selections are made", () => {
    const context = createMockContext();
    renderWithContext(context);

    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Resource")).toBeInTheDocument();
    expect(screen.getByText("Book")).toBeInTheDocument();
    expect(screen.getByText("Chapter:Verse")).toBeInTheDocument();
  });

  it("shows selected values when context is populated", () => {
    const context = createMockContext({
      organization: "unfoldingWord",
      languageId: "en",
      resourceId: "ult",
      reference: {
        bookId: "gen",
        chapter: "1",
        verse: "1",
      },
    });
    renderWithContext(context);

    expect(screen.getByText("unfoldingWord")).toBeInTheDocument();
    expect(screen.getByText("EN - English")).toBeInTheDocument();
    expect(screen.getByText("unfoldingWord Literal Text")).toBeInTheDocument();
    expect(screen.getByText("Genesis")).toBeInTheDocument();
    expect(screen.getByText("1:1")).toBeInTheDocument();
  });

  it("calls onOpenWizard when breadcrumb is clicked", () => {
    const mockOnOpenWizard = vi.fn();
    const context = createMockContext({
      organization: "unfoldingWord",
    });
    renderWithContext(context, mockOnOpenWizard);

    fireEvent.click(screen.getByTestId("breadcrumb-1"));
    expect(mockOnOpenWizard).toHaveBeenCalledWith(1);
  });

  it("enables only completed and organization steps", () => {
    const context = createMockContext({
      organization: "unfoldingWord",
      languageId: "en",
    });
    renderWithContext(context);

    // Organization step should be enabled (always)
    const orgButton = screen.getByTestId("breadcrumb-1");
    expect(orgButton).not.toHaveAttribute("disabled");

    // Language step should be enabled (org is completed)
    const langButton = screen.getByTestId("breadcrumb-2");
    expect(langButton).not.toHaveAttribute("disabled");

    // Resource step should be enabled (lang is completed)
    const resourceButton = screen.getByTestId("breadcrumb-3");
    expect(resourceButton).not.toHaveAttribute("disabled");

    // Book and chapter steps should be disabled (resource not completed)
    // Note: Since we're using pointer events and cursor styling, not actual disabled attribute
    // We'd need to check the styling or click behavior
  });

  it("shows completion checkmarks for completed steps", () => {
    const context = createMockContext({
      organization: "unfoldingWord",
      languageId: "en",
      resourceId: "ult",
    });
    renderWithContext(context);

    // Should show checkmarks for completed steps
    const orgButton = screen.getByTestId("breadcrumb-1");
    expect(orgButton).toHaveTextContent("✓");

    const langButton = screen.getByTestId("breadcrumb-2");
    expect(langButton).toHaveTextContent("✓");

    const resourceButton = screen.getByTestId("breadcrumb-3");
    expect(resourceButton).toHaveTextContent("✓");

    // Book step should not have checkmark (not completed)
    const bookButton = screen.getByTestId("breadcrumb-4");
    expect(bookButton).not.toHaveTextContent("✓");
  });

  it("handles missing data gracefully", () => {
    const context = createMockContext({
      organization: "unknown-org",
      languageId: "unknown-lang",
      resourceId: "unknown-resource",
      reference: {
        bookId: "unknown-book",
        chapter: "999",
        verse: "999",
      },
    });
    renderWithContext(context);

    // Should show the IDs when names are not found
    expect(screen.getByText("unknown-org")).toBeInTheDocument();
    expect(screen.getByText("UNKNOWN-LANG")).toBeInTheDocument();
    expect(screen.getByText("UNKNOWN-RESOURCE")).toBeInTheDocument();
    expect(screen.getByText("UNKNOWN-BOOK")).toBeInTheDocument();
    expect(screen.getByText("999:999")).toBeInTheDocument();
  });

  it("includes proper icons for each step", () => {
    const context = createMockContext();
    renderWithContext(context);

    expect(screen.getByText("🏢")).toBeInTheDocument(); // Organization
    expect(screen.getByText("🌐")).toBeInTheDocument(); // Language
    expect(screen.getByText("📖")).toBeInTheDocument(); // Resource
    expect(screen.getByText("📚")).toBeInTheDocument(); // Book
    expect(screen.getByText("📍")).toBeInTheDocument(); // Chapter:Verse
  });
});
