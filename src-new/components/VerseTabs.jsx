/**
 * VerseTabs.jsx
 * Unified tabs across helps.
 */

import React, { useState, useContext } from "react";
import { ReferenceContext } from "../context/ReferenceContext";

export function VerseTabs() {
  const { setReference } = useContext(ReferenceContext);
  const [activeTab, setActiveTab] = useState("scripture");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "scripture") {
      setReference((prev) => prev);
    }
  };

  return (
    <div data-testid="verse-tabs">
      <button data-testid='scripture-tab' onClick={() => handleTabClick("scripture")}>
        Scripture
      </button>
      <button data-testid='helps-tab' onClick={() => handleTabClick("helps")}>
        Helps
      </button>
      {activeTab === "scripture" ? (
        <div data-testid='scripture-content'>Scripture Content</div>
      ) : (
        <div data-testid='helps-content'>Helps Content</div>
      )}
    </div>
  );
}
