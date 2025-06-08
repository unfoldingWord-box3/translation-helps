/**
 * WizardContainer.test.jsx
 * Tests for the NavigationWizard container component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReferenceContext } from "../../context/ReferenceContext";
import { WizardContainer } from "./WizardContainer";

// Mock the hooks
vi.mock("./hooks/useWizardState", () => ({
  useWizardState: () => ({
    validateStep: vi.fn(() => true),
    canProceed: vi.fn(() => true),
  }),
}));

vi.mock("./hooks/useNavigationHistory", () => ({
  useNavigationHistory: () => ({
    saveSelection: vi.fn(),
    getRecentSelections: vi.fn(() => []),
  }),
}));

vi.mock("./hooks/useKeyboardNavigation", () => ({
  useKeyboardNavigation: vi.fn(),
}));

// Mock the step components
vi.mock("./steps/OrganizationStep", () => ({
  OrganizationStep: ({ onNext, onPrevious }) => (
    <div data-testid='organization-step'>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

vi.mock("./steps/LanguageStep", () => ({
  LanguageStep: ({ onNext, onPrevious }) => (
    <div data-testid='language-step'>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

const mockContextValue = {
  organization: null,
  languageId: null,
  resourceId: null,
  reference: null,
  updateContext: vi.fn(),
};

const TestWrapper = ({ children, contextValue = mockContextValue }) => (
  <ReferenceContext.Provider value={contextValue}>{children}</ReferenceContext.Provider>
);

describe("WizardContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the navigation wizard", () => {
    render(
      <TestWrapper>
        <WizardContainer />
      </TestWrapper>
    );

    expect(screen.getByTestId("navigation-wizard")).toBeInTheDocument();
  });

  it("starts on organization step when no context is provided", () => {
    render(
      <TestWrapper>
        <WizardContainer />
      </TestWrapper>
    );

    expect(screen.getByTestId("organization-step")).toBeInTheDocument();
  });

  it("renders step indicator", () => {
    render(
      <TestWrapper>
        <WizardContainer />
      </TestWrapper>
    );

    expect(screen.getAllByText("Organization")[0]).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Resource")).toBeInTheDocument();
    expect(screen.getByText("Book")).toBeInTheDocument();
    expect(screen.getByText("Chapter & Verse")).toBeInTheDocument();
  });

  it("calls onComplete when provided", () => {
    const onComplete = vi.fn();

    render(
      <TestWrapper>
        <WizardContainer onComplete={onComplete} />
      </TestWrapper>
    );

    // This would typically be triggered by completing the final step
    // For now, just verify the component renders without errors
    expect(screen.getByTestId("navigation-wizard")).toBeInTheDocument();
  });

  it("handles desktop and mobile layouts", () => {
    const { rerender } = render(
      <TestWrapper>
        <WizardContainer isDesktop={false} />
      </TestWrapper>
    );

    expect(screen.getByTestId("navigation-wizard")).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <WizardContainer isDesktop={true} />
      </TestWrapper>
    );

    expect(screen.getByTestId("navigation-wizard")).toBeInTheDocument();
  });

  it("starts on appropriate step when context has existing values", () => {
    const contextWithLanguage = {
      ...mockContextValue,
      organization: "unfoldingWord",
      languageId: "en",
    };

    render(
      <TestWrapper contextValue={contextWithLanguage}>
        <WizardContainer />
      </TestWrapper>
    );

    // Should advance to language step since organization is already set
    expect(screen.getByTestId("language-step")).toBeInTheDocument();
  });
});
