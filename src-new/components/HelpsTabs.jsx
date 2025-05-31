/**
 * HelpsTabs.jsx
 * Tabbed interface for translation helps (tN, tQ, tW, TWL)
 */

import React, { useState } from "react";
import { TranslationNotesPanel } from "./TranslationNotesPanel";
import { TranslationQuestionsPanel } from "./TranslationQuestionsPanel";
import { TranslationWordsPanel } from "./TranslationWordsPanel";

const TABS = [
  { id: "tn", label: "Translation Notes", component: TranslationNotesPanel },
  { id: "tq", label: "Translation Questions", component: TranslationQuestionsPanel },
  { id: "tw", label: "Translation Words", component: TranslationWordsPanel },
];

export function HelpsTabs({ reference }) {
  const [activeTab, setActiveTab] = useState("tn");

  const ActiveComponent =
    TABS.find((tab) => tab.id === activeTab)?.component || TranslationNotesPanel;

  return (
    <div className='helps-tabs' data-testid='helps-tabs'>
      <div
        className='tabs-header'
        style={{
          display: "flex",
          borderBottom: "2px solid #e0e0e0",
          marginBottom: "16px",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-${tab.id}`}
            style={{
              padding: "8px 16px",
              border: "none",
              background: activeTab === tab.id ? "#1976d2" : "transparent",
              color: activeTab === tab.id ? "white" : "#666",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              borderBottom: activeTab === tab.id ? "2px solid #1976d2" : "none",
              marginBottom: activeTab === tab.id ? "-2px" : "0",
              transition: "all 0.3s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='tab-content' data-testid={`tab-content-${activeTab}`}>
        <ActiveComponent reference={reference} />
      </div>
    </div>
  );
}
