/**
 * markdownUtils.jsx
 * Utility functions for rendering markdown content with RC link support
 */

import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * Preprocesses markdown content to convert plain text RC links to markdown links
 * @param {string} content - The content to preprocess
 * @returns {string} - Content with RC links converted to markdown links
 */
function preprocessRcLinks(content) {
  if (!content || typeof content !== "string") {
    return content;
  }

  // Convert plain text rc:// links to markdown links
  // First, protect existing markdown links from being processed
  const existingLinks = [];
  let protectedContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const placeholder = `__EXISTING_LINK_${existingLinks.length}__`;
    existingLinks.push(match);
    return placeholder;
  });

  // Now convert plain text rc:// links to markdown links
  const rcLinkRegex = /rc:\/\/[^\s)]+/g;
  protectedContent = protectedContent.replace(rcLinkRegex, (match) => {
    return `[${match}](${match})`;
  });

  // Restore existing markdown links
  existingLinks.forEach((link, index) => {
    const placeholder = `__EXISTING_LINK_${index}__`;
    protectedContent = protectedContent.replace(placeholder, link);
  });

  return protectedContent;
}

/**
 * Renders markdown content with RC link support
 * @param {string} content - The markdown content to render
 * @param {Function} onRcLinkClick - Callback function to handle rc:// link clicks
 * @param {Object} additionalComponents - Additional custom components for react-markdown
 * @returns {React.ReactElement} - Rendered markdown with RC links
 */
export function MarkdownWithRcLinks({ content, onRcLinkClick, additionalComponents = {} }) {
  if (!content || typeof content !== "string") {
    return null;
  }

  // Preprocess content to convert plain text RC links to markdown links
  const processedContent = preprocessRcLinks(content);

  const components = {
    // Handle anchor tags for RC links (both markdown-formatted and preprocessed plain text)
    a: ({ href, children, ...props }) => {
      // Get the original href from the AST node (ReactMarkdown sanitizes rc:// to javascript:void(0))
      const originalHref = props.node?.properties?.href || href;

      if (originalHref && originalHref.startsWith("rc://")) {
        return (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onRcLinkClick) {
                onRcLinkClick(originalHref);
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
              display: "inline",
            }}
            title={`Navigate to ${originalHref}`}
          >
            {children}
          </button>
        );
      }
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    // Override paragraph styling
    p: ({ children }) => <p style={{ margin: "0 0 8px 0", lineHeight: "1.5" }}>{children}</p>,
    // Override other text-containing elements
    strong: ({ children }) => (
      <strong style={{ fontWeight: "600", color: "#2c3e50" }}>{children}</strong>
    ),
    em: ({ children }) => <em style={{ fontStyle: "italic", color: "#34495e" }}>{children}</em>,
    li: ({ children }) => <li style={{ margin: "4px 0", lineHeight: "1.4" }}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        style={{
          margin: "8px 0",
          paddingLeft: "12px",
          borderLeft: "3px solid #bdc3c7",
          fontStyle: "italic",
          color: "#7f8c8d",
        }}
      >
        {children}
      </blockquote>
    ),
    // Style code elements consistently (RC links in code remain as plain text)
    code: ({ children, inline }) => (
      <code
        style={{
          backgroundColor: inline ? "#f5f5f5" : "#f8f8f8",
          padding: inline ? "2px 4px" : "8px 12px",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "0.9em",
          display: inline ? "inline" : "block",
          border: "1px solid #e0e0e0",
          ...(inline ? {} : { margin: "8px 0", whiteSpace: "pre-wrap" }),
        }}
      >
        {children}
      </code>
    ),
    // Style lists
    ul: ({ children }) => <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ margin: "8px 0", paddingLeft: "20px" }}>{children}</ol>,
    ...additionalComponents,
  };

  return <ReactMarkdown components={components}>{processedContent}</ReactMarkdown>;
}

/**
 * Processes text content to render markdown with RC link support
 * This is a convenience function that wraps MarkdownWithRcLinks for easier usage
 * @param {string} text - The text content to process
 * @param {Function} onRcLinkClick - Callback function to handle rc:// link clicks
 * @returns {React.ReactElement} - Rendered content
 */
export function processMarkdownWithRcLinks(text, onRcLinkClick) {
  return <MarkdownWithRcLinks content={text} onRcLinkClick={onRcLinkClick} />;
}
