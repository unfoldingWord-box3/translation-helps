import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { VerseTabs } from "./VerseTabs";
import { ReferenceContext } from "../context/ReferenceContext";

describe("VerseTabs", () => {
  it("renders tabs container", () => {
    const mockReferenceContext = {
      reference: { bookId: "gen", chapter: "1", verse: "1" },
      setReference: vi.fn(),
      organization: "unfoldingWord",
      languageId: "en",
    };

    render(
      <ReferenceContext.Provider value={mockReferenceContext}>
        <VerseTabs />
      </ReferenceContext.Provider>
    );
    expect(screen.getByTestId("verse-tabs")).toBeInTheDocument();
  });
});
