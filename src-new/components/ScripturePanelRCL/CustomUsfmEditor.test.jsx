import { render, screen } from "@testing-library/react";
import React from "react";
import CustomUsfmEditor from "./CustomUsfmEditor";
import { createMilestoneDecorators } from "../../utils/milestoneDecorators";

describe("CustomUsfmEditor", () => {
  it("should render the USFM content with custom tags", () => {
    const usfm = "\\id GEN\n\\c 1\n\\v 1 \\w In|in\\w* \\w the|the\\w* \\w beginning|beginning\\w*";
    const milestoneDecorators = createMilestoneDecorators();
    const { container } = render(
      <CustomUsfmEditor content={usfm} decorators={milestoneDecorators} />
    );

    // Debug: print the actual HTML output
    // eslint-disable-next-line no-console
    console.log(container.innerHTML);

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
