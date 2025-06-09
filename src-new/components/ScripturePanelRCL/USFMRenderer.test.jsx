import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import USFMRenderer from "./USFMRenderer";
import { ReferenceContext } from "../../context/ReferenceContext";

describe("USFMRenderer", () => {
  it("should render the USFM content with custom tags", () => {
    const usfm =
      '\\id TIT\n\\c 1\n\\v 1 \\zaln-s "lemma=\\"Προσευχή\\""\\*\\w Paul|Paul\\w*\\zaln-e\\*';
    const reference = {
      bookId: "tit",
      chapter: 1,
      verse: 1,
    };

    const { container } = render(
      <ReferenceContext.Provider value={{ reference, updateReference: () => {} }}>
        <USFMRenderer usfm={usfm} selectedVerse={1} onVerseClick={() => {}} />
      </ReferenceContext.Provider>
    );

    // Check for the custom tags
    const verse = container.querySelector("v");
    expect(verse).toBeInTheDocument();
    const zaln = verse.querySelector("zaln");
    expect(zaln).toBeInTheDocument();
    const word = zaln.querySelector("w");
    expect(word).toBeInTheDocument();

    // Check for the text content
    expect(word).toHaveTextContent("Paul");
  });
});
