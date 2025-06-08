import React from "react";
import { render, screen } from "@testing-library/react";
import { ReferenceProvider } from "../context/ReferenceContext";
import { NavigationBar } from "./NavigationBar";

describe("NavigationBar", () => {
  it("renders title and current reference", () => {
    render(
      <ReferenceProvider>
        <NavigationBar />
      </ReferenceProvider>
    );
    expect(screen.getByText("Translation Helps Viewer")).toBeInTheDocument();
    // The default reference is Titus 1:1, which is now displayed in breadcrumbs
    expect(screen.getByText("Titus")).toBeInTheDocument();
    expect(screen.getByText("1:1")).toBeInTheDocument();
  });
});
