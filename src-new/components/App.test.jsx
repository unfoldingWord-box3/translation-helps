import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { App } from "./App";
import { MemoryRouter } from "react-router-dom";

// Mock the fetchManifest function
vi.mock("../services/dcsClient", () => ({
  fetchManifest: vi.fn(() => Promise.resolve({ projects: [] })),
  fetchResourceFile: vi.fn(() => Promise.resolve("")),
}));

describe("App", () => {
  it("renders NavigationBar and MainView", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Check for the navigation bar
    expect(screen.getByText("Translation Helps Viewer")).toBeInTheDocument();

    // Check for the main view
    expect(screen.getByTestId("main-view")).toBeInTheDocument();
  });
});
