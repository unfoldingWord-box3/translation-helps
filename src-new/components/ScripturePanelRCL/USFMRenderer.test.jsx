import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import USFMRenderer from "./USFMRenderer";
import { ReferenceContext } from "../../context/ReferenceContext";
import { readFileSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

describe("USFMRenderer", () => {
  it("should render the verse chunk correctly", () => {
    const testCasePath = resolve(__dirname, "../../../docs/verse-1-test-case.md");
    const testCaseContent = readFileSync(testCasePath, "utf-8");
    const usfm = testCaseContent
      .split("## Source USFM")[1]
      .split("```usfm")[1]
      .split("```")[0]
      .trim();
    const expectedHtmlRaw = testCaseContent
      .split("## Desired HTML Output")[1]
      .split("```html")[1]
      .split("```")[0]
      .trim();

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

    const renderedHtml = container.querySelector("usfm");
    console.log("Rendered HTML:", renderedHtml.innerHTML);
    const dom = new JSDOM(expectedHtmlRaw);
    const expectedDocument = dom.window.document;

    // Compare the structure of the rendered output with the expected output.
    const renderedZaln = renderedHtml.querySelectorAll("zaln");
    const expectedZaln = expectedDocument.querySelectorAll("zaln");
    expect(renderedZaln.length).toBe(expectedZaln.length);

    const renderedWords = renderedHtml.querySelectorAll("word > content");
    const expectedWords = expectedDocument.querySelectorAll("word > content");
    expect(renderedWords.length).toBe(expectedWords.length);

    for (let i = 0; i < renderedWords.length; i++) {
      expect(renderedWords[i].textContent).toBe(expectedWords[i].textContent);
    }

    const renderedText = renderedHtml.textContent;
    expect(renderedText).toContain("Paul");
    expect(renderedText).toContain("a");
    expect(renderedText).toContain("servant");
  });
});
