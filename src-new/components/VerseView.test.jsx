import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReferenceProvider } from "../context/ReferenceContext";
import { ReferenceSelector } from "./ReferenceSelector";
import { VerseView } from "./VerseView";

// Mock window.location to simulate fresh open with no URL parameters
Object.defineProperty(window, "location", {
  value: {
    search: "", // No URL parameters
    pathname: "/",
  },
  writable: true,
});

describe("VerseView", () => {
  it("renders and displays default reference from context", () => {
    render(
      <ReferenceProvider>
        <ReferenceSelector />
        <VerseView />
      </ReferenceProvider>
    );
    const view = screen.getByTestId("verse-view");
    // Fresh open with no URL params should use defaults (unfoldingWord, en)
    // Default reference is Titus 1:1
    expect(view.textContent).toBe("tit:1:1");

    // To change books, we need to select a resource first since book selector is disabled without resource
    // This test confirms the defaults are applied correctly in the fresh open case
  });
});
