import { render } from "@testing-library/react";
import React from "react";
import CustomUsfmEditor from "./CustomUsfmEditor";
import { createUsfmDecorators } from "../../utils/usfmDecorators";

describe("CustomUsfmEditor", () => {
  it("should render the USFM content with custom tags (with full app props)", () => {
    const usfm = "\\id GEN\n\\c 1\n\\v 1 \\w In|in\\w* \\w the|the\\w* \\w beginning|beginning\\w*";
    const usfmDecorators = createUsfmDecorators();
    const options = {
      sectionable: false,
      blockable: true,
      editable: false,
      preview: true,
      verse: true,
      chapter: true,
      showWordAtts: false,
      showTitles: true,
      showHeadings: false,
      showIntroductions: true,
      showChapterLabels: true,
      showVerseLabels: true,
    };
    const components = {
      block: ({ content, ...props }) => (
        <div {...props} style={{ whiteSpace: "normal" }}>
          {content}
        </div>
      ),
    };
    const handlers = {
      onSectionClick: () => {},
      onBlockClick: () => {},
    };
    const sectionIndex = -1;

    const { container } = render(
      <CustomUsfmEditor
        content={usfm}
        options={options}
        sectionIndex={sectionIndex}
        decorators={usfmDecorators}
        components={components}
        handlers={handlers}
      />
    );

    // Check for the custom tags
    const verse = container.querySelector("v");
    expect(verse).toBeInTheDocument();
    const words = verse.querySelectorAll("word");
    expect(words.length).toBe(3);

    // Check for the text content
    expect(words[0]).toHaveTextContent("In");
    expect(words[1]).toHaveTextContent("the");
    expect(words[2]).toHaveTextContent("beginning");
  });
});
