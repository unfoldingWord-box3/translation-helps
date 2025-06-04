/**
 * rcLinkUtils.js
 * Utility functions for handling rc:// links in translation resources
 * Provides functionality to make resource links clickable and navigate to related content
 */

import React from "react";

/**
 * Creates a clickable link component for rc:// URIs that switches internal tabs
 * @param {string} rcUri - The rc:// URI to link to
 * @param {React.ReactNode} children - The content to render as the link
 * @param {Function} onRcLinkClick - Callback function to handle rc:// link clicks
 * @returns {React.ReactElement} - A clickable link component
 */
export function RcLink({ rcUri, children, onRcLinkClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onRcLinkClick) {
      onRcLinkClick(rcUri);
    }
  };

  return (
    <button
      onClick={handleClick}
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
      title={`Navigate to ${rcUri}`}
    >
      {children}
    </button>
  );
}

/**
 * Processes text content and converts rc:// links to clickable components
 * @param {string} text - The text content to process
 * @param {Function} onRcLinkClick - Callback function to handle rc:// link clicks
 * @returns {React.ReactNode[]} - Array of text and RcLink components
 */
export function processRcLinks(text, onRcLinkClick) {
  if (!text || typeof text !== "string") {
    return [text];
  }

  // Regex to match rc:// URIs
  const rcLinkRegex = /rc:\/\/[^\s)]+/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = rcLinkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the clickable link
    const rcUri = match[0];
    parts.push(
      <RcLink key={`rc-${match.index}`} rcUri={rcUri} onRcLinkClick={onRcLinkClick}>
        {rcUri}
      </RcLink>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Converts an rc:// URI to a browsable URL (for external access if needed)
 * @param {string} rcUri - The rc:// URI to convert
 * @param {string} defaultLanguage - Default language code to use if URI has wildcard
 * @param {string} defaultOrganization - Default organization to use
 * @returns {string|null} - The converted URL or null if conversion fails
 */
export function convertRcUriToUrl(
  rcUri,
  defaultLanguage = "en",
  defaultOrganization = "unfoldingWord"
) {
  if (!rcUri || !rcUri.startsWith("rc://")) {
    return null;
  }

  try {
    // Parse the rc:// URI
    // Format: rc://language/resource/version/path
    const parts = rcUri.split("/");
    if (parts.length < 4) {
      return null;
    }

    let language = parts[2];
    const resource = parts[3];
    const version = parts[4] || "latest";
    const path = parts.slice(5).join("/");

    // Handle wildcard language
    if (language === "*") {
      language = defaultLanguage;
    }

    // Construct DCS URL
    // This is a basic implementation - in practice you'd want to use the actual DCS API
    const baseUrl = "https://git.door43.org";
    const repoPath = `${language}_${resource}`;

    if (path) {
      return `${baseUrl}/${defaultOrganization}/${repoPath}/src/branch/master/${path}`;
    } else {
      return `${baseUrl}/${defaultOrganization}/${repoPath}`;
    }
  } catch (error) {
    console.error("Error converting rc:// URI to URL:", error);
    return null;
  }
}
