/**
 * RecentSelections.jsx
 * Component for displaying recent selections with quick access
 */

import React from "react";
import { SelectionCard } from "./SelectionCard";

export function RecentSelections({
  title = "Recent Selections",
  items = [],
  onSelect,
  isDesktop = false,
  maxItems = 3,
}) {
  if (items.length === 0) {
    return null;
  }

  const containerStyles = {
    marginBottom: "32px",
  };

  const titleStyles = {
    fontSize: isDesktop ? "18px" : "16px",
    fontWeight: "600",
    color: "#495057",
    margin: "0 0 16px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr",
    gap: isDesktop ? "12px" : "8px",
  };

  const displayItems = items.slice(0, maxItems);

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>
        <span>⏱️</span>
        {title}
      </h3>

      <div style={gridStyles}>
        {displayItems.map((item) => (
          <SelectionCard
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            badge='Recent'
            isSelected={false}
            onClick={() => onSelect(item.id)}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </div>
  );
}
