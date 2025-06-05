/**
 * markdownUtils.test.jsx
 * Tests for markdown rendering utility functions with RC link support
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MarkdownWithRcLinks, processMarkdownWithRcLinks } from "./markdownUtils.jsx";

describe("MarkdownWithRcLinks", () => {
  const mockOnRcLinkClick = vi.fn();

  beforeEach(() => {
    mockOnRcLinkClick.mockClear();
  });

  test("renders plain text without markdown", () => {
    render(<MarkdownWithRcLinks content='Simple text' onRcLinkClick={mockOnRcLinkClick} />);
    expect(screen.getByText("Simple text")).toBeInTheDocument();
  });

  test("renders bold text correctly", () => {
    render(<MarkdownWithRcLinks content='**Bold text**' onRcLinkClick={mockOnRcLinkClick} />);
    const boldElement = screen.getByText("Bold text");
    expect(boldElement.tagName).toBe("STRONG");
  });

  test("renders italic text correctly", () => {
    render(<MarkdownWithRcLinks content='*Italic text*' onRcLinkClick={mockOnRcLinkClick} />);
    const italicElement = screen.getByText("Italic text");
    expect(italicElement.tagName).toBe("EM");
  });

  test("renders inline code correctly", () => {
    render(<MarkdownWithRcLinks content='`code snippet`' onRcLinkClick={mockOnRcLinkClick} />);
    const codeElement = screen.getByText("code snippet");
    expect(codeElement.tagName).toBe("CODE");
  });

  test("renders code blocks correctly", () => {
    const content = "```\nfunction test() {\n  return true;\n}\n```";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);
    const codeElement = screen.getByText((content, element) => {
      return element?.tagName === "CODE" && content.includes("function test()");
    });
    expect(codeElement.tagName).toBe("CODE");
  });

  test("renders lists correctly", () => {
    const content = "- Item 1\n- Item 2\n- Item 3";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();

    // Check that list structure is preserved
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });

  test("renders RC links as clickable buttons", () => {
    const content = "See rc://en/tn/help/gen/01/01 for more info";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);

    const rcLink = screen.getByText("rc://en/tn/help/gen/01/01");
    expect(rcLink).toBeInTheDocument();
    expect(rcLink.tagName).toBe("BUTTON");
    expect(rcLink).toHaveAttribute("title", "Navigate to rc://en/tn/help/gen/01/01");
  });

  test("handles RC link clicks correctly", () => {
    const content = "See rc://en/tn/help/gen/01/01 for more info";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);

    const rcLink = screen.getByText("rc://en/tn/help/gen/01/01");
    fireEvent.click(rcLink);

    expect(mockOnRcLinkClick).toHaveBeenCalledWith("rc://en/tn/help/gen/01/01");
  });

  test("handles multiple RC links in the same content", () => {
    const content = "See rc://en/tn/help/gen/01/01 and rc://en/tw/dict/bible/kt/god";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);

    const rcLink1 = screen.getByText("rc://en/tn/help/gen/01/01");
    const rcLink2 = screen.getByText("rc://en/tw/dict/bible/kt/god");

    expect(rcLink1.tagName).toBe("BUTTON");
    expect(rcLink2.tagName).toBe("BUTTON");

    fireEvent.click(rcLink1);
    expect(mockOnRcLinkClick).toHaveBeenCalledWith("rc://en/tn/help/gen/01/01");

    fireEvent.click(rcLink2);
    expect(mockOnRcLinkClick).toHaveBeenCalledWith("rc://en/tw/dict/bible/kt/god");
  });

  test("handles markdown with RC links combined", () => {
    const content = "This is **bold** text with rc://en/tn/help/gen/01/01 link";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);

    // Check bold text
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("bold").tagName).toBe("STRONG");

    // Check RC link
    const rcLink = screen.getByText("rc://en/tn/help/gen/01/01");
    expect(rcLink.tagName).toBe("BUTTON");
  });

  test("handles RC links within markdown code spans", () => {
    const content = "Use `rc://en/tn/help/gen/01/01` as reference";
    render(<MarkdownWithRcLinks content={content} onRcLinkClick={mockOnRcLinkClick} />);

    // In code spans, RC links should remain as text, not converted to buttons
    // The code element should contain the RC link as plain text
    const codeElement = screen.getByText((content, element) => {
      return element?.tagName === "CODE" && content.includes("rc://en/tn/help/gen/01/01");
    });
    expect(codeElement.tagName).toBe("CODE");

    // Verify no button was created for the RC link in code
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  test("handles empty or null content", () => {
    const { container: container1 } = render(
      <MarkdownWithRcLinks content='' onRcLinkClick={mockOnRcLinkClick} />
    );
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(
      <MarkdownWithRcLinks content={null} onRcLinkClick={mockOnRcLinkClick} />
    );
    expect(container2.firstChild).toBeNull();
  });

  test("handles non-string content gracefully", () => {
    const { container } = render(
      <MarkdownWithRcLinks content={123} onRcLinkClick={mockOnRcLinkClick} />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("processMarkdownWithRcLinks", () => {
  const mockOnRcLinkClick = vi.fn();

  beforeEach(() => {
    mockOnRcLinkClick.mockClear();
  });

  test("returns a React element", () => {
    const result = processMarkdownWithRcLinks("Test content", mockOnRcLinkClick);
    expect(React.isValidElement(result)).toBe(true);
  });

  test("processes markdown content correctly", () => {
    const content = "**Bold** and *italic* text";
    render(<div>{processMarkdownWithRcLinks(content, mockOnRcLinkClick)}</div>);

    expect(screen.getByText("Bold")).toBeInTheDocument();
    expect(screen.getByText("Bold").tagName).toBe("STRONG");
    expect(screen.getByText("italic")).toBeInTheDocument();
    expect(screen.getByText("italic").tagName).toBe("EM");
  });

  test("processes RC links correctly", () => {
    const content = "See rc://en/tn/help/gen/01/01 for details";
    render(<div>{processMarkdownWithRcLinks(content, mockOnRcLinkClick)}</div>);

    const rcLink = screen.getByText("rc://en/tn/help/gen/01/01");
    expect(rcLink.tagName).toBe("BUTTON");

    fireEvent.click(rcLink);
    expect(mockOnRcLinkClick).toHaveBeenCalledWith("rc://en/tn/help/gen/01/01");
  });
});
