/**
 * MainView.jsx
 * Orchestrates the main content area including scripture text, navigation tabs, and helps panels.
 */

import React, { useContext, useState, useRef, createContext } from "react";
import { ReferenceContext } from "../context/ReferenceContext";
import { ManifestsContext } from "../context/MultiManifestsContext";
import { ReferenceSelector } from "./ReferenceSelector";
import { ScripturePanel } from "./ScripturePanel";
import { HelpsTabs } from "./HelpsTabs";
import { convertRcUriToUrl } from "../utils/rcLinkUtils.jsx";
import { getArticle } from "../services/twService";
import { getArticle as getTaArticle } from "../services/taService";

// Context for rc:// link handling
export const RcLinkContext = createContext();

export function MainView() {
  const { reference, organization, languageId } = useContext(ReferenceContext);
  const { manifests } = useContext(ManifestsContext);
  const [activeHelpsTab, setActiveHelpsTab] = useState("tn");
  const helpsTabsRef = useRef();

  const handleVerseClick = (verseNum) => {
    // When a verse is clicked, it automatically updates the reference context
    // which triggers the helps panels to update
    console.log("Verse clicked:", verseNum);
  };

  // Handle rc:// link clicks to open article tabs or switch to appropriate internal tabs
  const handleRcLinkClick = async (rcUri, contextLanguageId, contextOrganization) => {
    if (!rcUri || !rcUri.startsWith("rc://")) {
      console.warn("Invalid rc:// URI:", rcUri);
      return;
    }

    // Use provided context or fall back to default context
    const effectiveLanguageId = contextLanguageId || languageId || "en";
    const effectiveOrganization = contextOrganization || organization || "unfoldingWord";

    // Parse the rc:// URI to determine the appropriate tab
    const uriParts = rcUri.split("/");
    if (uriParts.length < 4) {
      console.warn("Malformed rc:// URI:", rcUri);
      return;
    }

    const resourceType = uriParts[3]; // tw, tn, tq, etc.

    switch (resourceType) {
      case "tw":
        // For translation words, fetch the full article and open in new tab
        try {
          const article = await getArticle(rcUri, effectiveLanguageId, effectiveOrganization);
          if (article && helpsTabsRef.current) {
            helpsTabsRef.current.openArticleTab({
              id: rcUri.replace(/[^a-zA-Z0-9]/g, "_"),
              title: article.title,
              content: article.content,
              rcUri: rcUri,
              error: article.error,
            });
          } else {
            console.warn("Could not fetch article for rc:// URI:", rcUri);
            // Fallback to switching to tw tab
            if (helpsTabsRef.current) {
              helpsTabsRef.current.switchToTab("tw");
            }
          }
        } catch (error) {
          console.error("Error fetching article:", error);
          // Fallback to switching to tw tab
          if (helpsTabsRef.current) {
            helpsTabsRef.current.switchToTab("tw");
          }
        }
        break;
      case "tn":
        // For translation notes, switch to tn tab
        if (helpsTabsRef.current) {
          helpsTabsRef.current.switchToTab("tn");
        }
        break;
      case "tq":
        // For translation questions, switch to tq tab
        if (helpsTabsRef.current) {
          helpsTabsRef.current.switchToTab("tq");
        }
        break;
      case "ta":
        // For Translation Academy, fetch the actual article and open in new tab
        try {
          const article = await getTaArticle(rcUri, effectiveLanguageId, effectiveOrganization);
          if (article && helpsTabsRef.current) {
            helpsTabsRef.current.openArticleTab({
              id: rcUri.replace(/[^a-zA-Z0-9]/g, "_"),
              title: article.title,
              content: article.content,
              rcUri: rcUri,
              error: article.error,
            });
          } else {
            console.warn("Could not fetch Translation Academy article for rc:// URI:", rcUri);
            // Fallback to external link
            const externalUrl = convertRcUriToUrl(
              rcUri,
              effectiveLanguageId,
              effectiveOrganization
            );
            if (externalUrl) {
              console.log("Opening external resource:", externalUrl);
              window.open(externalUrl, "_blank", "noopener,noreferrer");
            }
          }
        } catch (error) {
          console.error("Error fetching Translation Academy article:", error);
          // Fallback to external link
          const externalUrl = convertRcUriToUrl(rcUri, effectiveLanguageId, effectiveOrganization);
          if (externalUrl) {
            console.log("Opening external resource:", externalUrl);
            window.open(externalUrl, "_blank", "noopener,noreferrer");
          }
        }
        break;
      default:
        // For other external resources, open in new tab
        const externalUrl = convertRcUriToUrl(rcUri, effectiveLanguageId, effectiveOrganization);
        if (externalUrl) {
          console.log("Opening external resource:", externalUrl);
          window.open(externalUrl, "_blank", "noopener,noreferrer");
        } else {
          console.warn("Could not convert rc:// URI to external URL:", rcUri);
        }
        break;
    }
  };

  return (
    <main
      data-testid='main-view'
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Reference Selector */}
      <ReferenceSelector />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          gap: "16px",
          padding: "16px",
        }}
      >
        {/* Scripture Panel - Left Side */}
        <div
          style={{
            flex: "1",
            overflow: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <ScripturePanel reference={reference} onVerseClick={handleVerseClick} />
        </div>

        {/* Translation Helps - Right Side */}
        <div
          style={{
            flex: "1",
            overflow: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          <RcLinkContext.Provider value={{ handleRcLinkClick }}>
            <HelpsTabs ref={helpsTabsRef} reference={reference} />
          </RcLinkContext.Provider>
        </div>
      </div>
    </main>
  );
}
