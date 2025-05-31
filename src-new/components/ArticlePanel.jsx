/**
 * ArticlePanel.jsx
 * Displays individual translation word articles in their own tab
 */

import React, { useContext } from "react";
import { RcLinkContext } from "./MainView";
import { processRcLinks } from "../utils/rcLinkUtils.jsx";

/**
 * Panel component for displaying a single article
 * @param {object} props
 * @param {object} props.article - Article data with title, content, rcUri
 * @param {object} props.reference - Current reference context (optional, for consistency)
 */
export function ArticlePanel({ article, reference }) {
  const { handleRcLinkClick } = useContext(RcLinkContext) || {};

  if (!article) {
    return (
      <div data-testid='article-panel-empty'>
        <p>No article selected.</p>
      </div>
    );
  }

  return (
    <article data-testid='article-panel' style={{ lineHeight: "1.6" }}>
      <header
        style={{ marginBottom: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "16px" }}
      >
        <h2 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>{article.title}</h2>
        {article.rcUri && (
          <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
            Source: <code>{article.rcUri}</code>
          </p>
        )}
      </header>

      <div style={{ fontSize: "16px", color: "#333" }}>
        {article.content ? (
          <div>
            {/* Process content line by line to handle markdown-like formatting */}
            {article.content.split("\n").map((line, index) => {
              const trimmedLine = line.trim();

              // Handle headers
              if (trimmedLine.startsWith("## ")) {
                return (
                  <h3
                    key={index}
                    style={{ margin: "24px 0 12px 0", color: "#1976d2", fontSize: "18px" }}
                  >
                    {processRcLinks(trimmedLine.substring(3), handleRcLinkClick)}
                  </h3>
                );
              } else if (trimmedLine.startsWith("# ")) {
                return (
                  <h2
                    key={index}
                    style={{ margin: "20px 0 16px 0", color: "#1976d2", fontSize: "20px" }}
                  >
                    {processRcLinks(trimmedLine.substring(2), handleRcLinkClick)}
                  </h2>
                );
              }

              // Handle empty lines
              if (!trimmedLine) {
                return <br key={index} />;
              }

              // Handle regular paragraphs
              return (
                <p key={index} style={{ margin: "0 0 12px 0" }}>
                  {processRcLinks(trimmedLine, handleRcLinkClick)}
                </p>
              );
            })}
          </div>
        ) : (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            No content available for this article.
          </p>
        )}
      </div>

      {article.error && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "4px",
            color: "#856404",
          }}
        >
          <strong>Error loading content:</strong> {article.error}
        </div>
      )}
    </article>
  );
}
