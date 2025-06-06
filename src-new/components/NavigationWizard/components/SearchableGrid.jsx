/**
 * SearchableGrid.jsx
 * Reusable component for displaying searchable grid of selectable items
 */

import React from "react";
import { SelectionCard } from "./SelectionCard";

export function SearchableGrid({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  items = [],
  onSelect,
  selectedId,
  isDesktop = false,
  emptyMessage = "No items found.",
  columns = 2,
}) {
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  const searchStyles = {
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    marginBottom: "24px",
    outline: "none",
    transition: "border-color 0.2s ease",
    backgroundColor: "#ffffff",
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: isDesktop ? `repeat(${columns}, 1fr)` : "1fr",
    gap: isDesktop ? "16px" : "12px",
    flex: 1,
  };

  const emptyStyles = {
    textAlign: "center",
    color: "#6c757d",
    fontSize: "16px",
    padding: "48px 16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "2px dashed #dee2e6",
  };

  const handleSearchFocus = (e) => {
    e.target.style.borderColor = "#007bff";
  };

  const handleSearchBlur = (e) => {
    e.target.style.borderColor = "#e1e5e9";
  };

  return (
    <div style={containerStyles}>
      <input
        type='text'
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        style={searchStyles}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        data-testid='search-input'
      />

      {items.length === 0 ? (
        <div style={emptyStyles} data-testid='empty-message'>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          {searchTerm ? `No results found for "${searchTerm}"` : emptyMessage}
        </div>
      ) : (
        <div style={gridStyles} data-testid='items-grid'>
          {items.map((item) => (
            <SelectionCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              badge={item.badge}
              isSelected={selectedId === item.id}
              onClick={() => onSelect(item.id)}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      )}
    </div>
  );
}
