/**
 * HelpsTabs.jsx
 * Tabbed interface for translation helps (tN, tQ, tW, TWL)
 * Supports dynamic tabs for individual articles
 */

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { TranslationNotesPanel } from "./TranslationNotesPanel";
import { TranslationQuestionsPanel } from "./TranslationQuestionsPanel";
import { TranslationWordsPanel } from "./TranslationWordsPanel";
import { ArticlePanel } from "./ArticlePanel";

const STATIC_TABS = [
  { id: "tn", label: "Translation Notes", component: TranslationNotesPanel, isStatic: true },
  {
    id: "tq",
    label: "Translation Questions",
    component: TranslationQuestionsPanel,
    isStatic: true,
  },
  { id: "tw", label: "Translation Words", component: TranslationWordsPanel, isStatic: true },
];

export const HelpsTabs = forwardRef(function HelpsTabs({ reference }, ref) {
  const [activeTab, setActiveTab] = useState("tn");
  const [dynamicTabs, setDynamicTabs] = useState([]);

  // Combine static and dynamic tabs
  const allTabs = [...STATIC_TABS, ...dynamicTabs];

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    switchToTab: (tabId) => {
      if (allTabs.find((tab) => tab.id === tabId)) {
        setActiveTab(tabId);
      }
    },
    getActiveTab: () => activeTab,
    openArticleTab: (article) => {
      // Check if tab already exists by rcUri
      const existingTab = dynamicTabs.find((tab) => tab.articleData?.rcUri === article.rcUri);
      if (existingTab) {
        setActiveTab(existingTab.id);
        return;
      }

      // Use provided id or generate one from rcUri
      const tabId = article.id || article.rcUri.replace(/[^a-zA-Z0-9]/g, "_");

      // Create new dynamic tab
      const newTab = {
        id: tabId,
        label: article.title || "Article",
        component: ArticlePanel,
        isStatic: false,
        articleData: article,
      };

      setDynamicTabs((prev) => [...prev, newTab]);
      setActiveTab(tabId);
    },
    closeTab: (tabId) => {
      // Only allow closing dynamic tabs
      const tabToClose = dynamicTabs.find((tab) => tab.id === tabId);
      if (tabToClose) {
        setDynamicTabs((prev) => prev.filter((tab) => tab.id !== tabId));

        // If closing active tab, switch to first available tab
        if (activeTab === tabId) {
          const remainingTabs = allTabs.filter((tab) => tab.id !== tabId);
          if (remainingTabs.length > 0) {
            setActiveTab(remainingTabs[0].id);
          }
        }
      }
    },
  }));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const activeTabData = allTabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component || TranslationNotesPanel;

  const handleCloseTab = (tabId, event) => {
    event.stopPropagation();
    const tabToClose = dynamicTabs.find((tab) => tab.id === tabId);
    if (tabToClose) {
      setDynamicTabs((prev) => prev.filter((tab) => tab.id !== tabId));

      // If closing active tab, switch to first available tab
      if (activeTab === tabId) {
        const remainingTabs = allTabs.filter((tab) => tab.id !== tabId);
        if (remainingTabs.length > 0) {
          setActiveTab(remainingTabs[0].id);
        }
      }
    }
  };

  return (
    <div className='helps-tabs' data-testid='helps-tabs'>
      <div
        className='tabs-header'
        style={{
          display: "flex",
          borderBottom: "2px solid #e0e0e0",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {allTabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: activeTab === tab.id ? "#1976d2" : "transparent",
              borderRadius: "4px 4px 0 0",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => handleTabChange(tab.id)}
              data-testid={`tab-${tab.id}`}
              style={{
                padding: "8px 12px",
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? "white" : "#666",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
                transition: "all 0.3s ease",
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={tab.label}
            >
              {tab.label}
            </button>
            {!tab.isStatic && (
              <button
                onClick={(e) => handleCloseTab(tab.id, e)}
                style={{
                  padding: "4px 8px",
                  border: "none",
                  background: "transparent",
                  color: activeTab === tab.id ? "white" : "#666",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft:
                    activeTab === tab.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid #e0e0e0",
                }}
                title='Close tab'
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <div className='tab-content' data-testid={`tab-content-${activeTab}`}>
        {activeTabData?.articleData ? (
          <ActiveComponent reference={reference} article={activeTabData.articleData} />
        ) : (
          <ActiveComponent reference={reference} />
        )}
      </div>
    </div>
  );
});
