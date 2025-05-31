/**
 * rcLinkUtils.test.js
 * Tests for the rc:// link utilities with internal tab switching
 */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RcLink, processRcLinks, convertRcUriToUrl } from "./rcLinkUtils.jsx";

describe("rcLinkUtils", () => {
  describe("RcLink", () => {
    it("should render a clickable button with correct styling", () => {
      const mockOnClick = vi.fn();
      const rcUri = "rc://en/tw/dict/kt/god";

      render(
        <RcLink rcUri={rcUri} onRcLinkClick={mockOnClick}>
          Test Link
        </RcLink>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Test Link");
      expect(button).toHaveAttribute("title", `Navigate to ${rcUri}`);
    });

    it("should call onRcLinkClick when clicked", () => {
      const mockOnClick = vi.fn();
      const rcUri = "rc://en/tw/dict/kt/god";

      render(
        <RcLink rcUri={rcUri} onRcLinkClick={mockOnClick}>
          Test Link
        </RcLink>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledWith(rcUri);
    });

    it("should prevent default behavior when clicked", () => {
      const mockOnClick = vi.fn();
      const rcUri = "rc://en/tw/dict/kt/god";

      render(
        <RcLink rcUri={rcUri} onRcLinkClick={mockOnClick}>
          Test Link
        </RcLink>
      );

      const button = screen.getByRole("button");
      const clickEvent = new MouseEvent("click", { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

      fireEvent(button, clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("processRcLinks", () => {
    it("should return text as-is when no rc:// links present", () => {
      const text = "This is plain text without links";
      const result = processRcLinks(text, vi.fn());

      expect(result).toEqual([text]);
    });

    it("should return original value for non-string input", () => {
      const mockOnClick = vi.fn();

      expect(processRcLinks(null, mockOnClick)).toEqual([null]);
      expect(processRcLinks(undefined, mockOnClick)).toEqual([undefined]);
      expect(processRcLinks(123, mockOnClick)).toEqual([123]);
    });

    it("should convert rc:// links to clickable components", () => {
      const text = "See rc://en/tw/dict/kt/god for more info";
      const mockOnClick = vi.fn();

      const result = processRcLinks(text, mockOnClick);

      expect(result).toHaveLength(3); // 'See ', <RcLink>, ' for more info'
      expect(result[0]).toBe("See ");
      expect(result[2]).toBe(" for more info");
      expect(React.isValidElement(result[1])).toBe(true);
    });

    it("should handle multiple rc:// links in text", () => {
      const text = "See rc://en/tw/dict/kt/god and rc://en/tw/dict/kt/jesus";
      const mockOnClick = vi.fn();

      const result = processRcLinks(text, mockOnClick);

      expect(result).toHaveLength(4); // text, link, text, link
      expect(result[0]).toBe("See ");
      expect(result[2]).toBe(" and ");
      expect(React.isValidElement(result[1])).toBe(true);
      expect(React.isValidElement(result[3])).toBe(true);
    });

    it("should handle text with no remaining content after links", () => {
      const text = "rc://en/tw/dict/kt/god";
      const mockOnClick = vi.fn();

      const result = processRcLinks(text, mockOnClick);

      expect(result).toHaveLength(1);
      expect(React.isValidElement(result[0])).toBe(true);
    });

    it("should handle text starting and ending with links", () => {
      const text = "rc://en/tw/dict/kt/god middle text rc://en/tw/dict/kt/jesus";
      const mockOnClick = vi.fn();

      const result = processRcLinks(text, mockOnClick);

      expect(result).toHaveLength(3); // link, text, link
      expect(React.isValidElement(result[0])).toBe(true);
      expect(result[1]).toBe(" middle text ");
      expect(React.isValidElement(result[2])).toBe(true);
    });
  });

  describe("convertRcUriToUrl", () => {
    it("should convert valid rc:// URI to DCS URL", () => {
      const rcUri = "rc://en/tw/dict/kt/god";
      const result = convertRcUriToUrl(rcUri);

      expect(result).toBe("https://git.door43.org/unfoldingWord/en_tw/src/branch/master/kt/god");
    });

    it("should convert rc:// URI without path", () => {
      const rcUri = "rc://en/tw/latest";
      const result = convertRcUriToUrl(rcUri);

      expect(result).toBe("https://git.door43.org/unfoldingWord/en_tw");
    });

    it("should handle rc:// URI with version", () => {
      const rcUri = "rc://en/tw/v1.0/dict/kt/god";
      const result = convertRcUriToUrl(rcUri);

      expect(result).toBe(
        "https://git.door43.org/unfoldingWord/en_tw/src/branch/master/dict/kt/god"
      );
    });

    it("should return null for invalid URI", () => {
      expect(convertRcUriToUrl("invalid-uri")).toBeNull();
      expect(convertRcUriToUrl("http://example.com")).toBeNull();
      expect(convertRcUriToUrl(null)).toBeNull();
      expect(convertRcUriToUrl(undefined)).toBeNull();
    });

    it("should return null for malformed rc:// URI", () => {
      expect(convertRcUriToUrl("rc://")).toBeNull();
      expect(convertRcUriToUrl("rc://en")).toBeNull();
      expect(convertRcUriToUrl("rc://en/tw")).toBe("https://git.door43.org/unfoldingWord/en_tw");
      expect(convertRcUriToUrl("rc://en/tw/version")).toBe(
        "https://git.door43.org/unfoldingWord/en_tw"
      );
    });

    it("should handle errors gracefully", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Test with a URI that might cause an error during processing
      const result = convertRcUriToUrl("rc://en/tw/version/");

      // Should still return a URL even with empty path
      expect(result).toBe("https://git.door43.org/unfoldingWord/en_tw");

      consoleSpy.mockRestore();
    });
  });
});
