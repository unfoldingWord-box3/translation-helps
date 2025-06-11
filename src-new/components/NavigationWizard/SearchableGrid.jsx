/**
 * SearchableGrid.jsx
 * Reusable component for displaying searchable grids of selectable items
 */

import React, { useState, useMemo, useCallback } from "react";
import { SelectionCard } from "./SelectionCard";
import styles from "./SearchableGrid.module.css";

export function SearchableGrid({
  items = [],
  selectedItem = null,
  onItemSelect,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  emptyIcon = "📭",
  isDesktop = false,
  columns = "auto",
  showRecent = false,
  recentItems = [],
  isLoading = false,
  error = null,
  getItemKey = (item) => item.id || item.name || JSON.stringify(item),
  getItemTitle = (item) => item.name || item.title || "Untitled",
  getItemSubtitle = (item) => item.description || item.subtitle || "",
  getItemIcon = (item) => item.icon || item.emoji || "",
  getItemAvatar = (item) => item.avatar || item.image || "",
  filterItems = (items, searchTerm) => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        getItemTitle(item).toLowerCase().includes(term) ||
        getItemSubtitle(item).toLowerCase().includes(term)
    );
  },
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    return filterItems(items, searchTerm);
  }, [items, searchTerm, filterItems]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Handle item selection
  const handleItemClick = useCallback(
    (item) => {
      if (onItemSelect) {
        onItemSelect(item);
      }
    },
    [onItemSelect]
  );

  // Render recent items section
  const renderRecentSection = () => {
    if (!showRecent || !recentItems?.length || searchTerm.trim()) return null;

    return (
      <div className={styles.recentSection}>
        <h3 className={`${styles.sectionTitle} ${isDesktop ? styles.desktop : ""}`}>
          Recent Selections
        </h3>
        <div className={`${styles.grid} ${isDesktop ? styles.desktop : ""}`}>
          {recentItems.slice(0, isDesktop ? 6 : 3).map((item) => (
            <div key={`recent-${getItemKey(item)}`} className={styles.gridItem}>
              <SelectionCard
                title={getItemTitle(item)}
                subtitle={getItemSubtitle(item)}
                icon={getItemIcon(item)}
                avatar={getItemAvatar(item)}
                selected={selectedItem && getItemKey(selectedItem) === getItemKey(item)}
                onClick={() => handleItemClick(item)}
                isDesktop={isDesktop}
                variant='compact'
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className={`${styles.loadingState} ${isDesktop ? styles.desktop : ""}`}>
      <div className={`${styles.loadingSpinner} ${isDesktop ? styles.desktop : ""}`} />
      <span className={`${styles.loadingText} ${isDesktop ? styles.desktop : ""}`}>Loading...</span>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className={`${styles.errorState} ${isDesktop ? styles.desktop : ""}`}>
      <div className={`${styles.errorIcon} ${isDesktop ? styles.desktop : ""}`}>⚠️</div>
      <h3 className={`${styles.errorTitle} ${isDesktop ? styles.desktop : ""}`}>
        Something went wrong
      </h3>
      <p className={`${styles.errorDescription} ${isDesktop ? styles.desktop : ""}`}>
        {error || "Unable to load items. Please try again."}
      </p>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className={`${styles.emptyState} ${isDesktop ? styles.desktop : ""}`}>
      <div className={`${styles.emptyIcon} ${isDesktop ? styles.desktop : ""}`}>{emptyIcon}</div>
      <h3 className={`${styles.emptyTitle} ${isDesktop ? styles.desktop : ""}`}>
        {searchTerm.trim() ? "No matches found" : "No items available"}
      </h3>
      <p className={`${styles.emptyDescription} ${isDesktop ? styles.desktop : ""}`}>
        {searchTerm.trim()
          ? `No items match "${searchTerm}". Try a different search term.`
          : emptyMessage}
      </p>
    </div>
  );

  // Render grid content
  const renderGridContent = () => {
    if (error) {
      return renderErrorState();
    }

    if (isLoading) {
      return renderLoadingState();
    }

    if (filteredItems.length === 0) {
      return renderEmptyState();
    }

    return (
      <>
        {/* Results count */}
        {searchTerm.trim() && (
          <div className={`${styles.resultsCount} ${isDesktop ? styles.desktop : ""}`}>
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for "{searchTerm}"
          </div>
        )}

        {/* Items grid */}
        <div className={`${styles.grid} ${isDesktop ? styles.desktop : ""}`}>
          {filteredItems.map((item) => (
            <div key={getItemKey(item)} className={styles.gridItem}>
              <SelectionCard
                title={getItemTitle(item)}
                subtitle={getItemSubtitle(item)}
                icon={getItemIcon(item)}
                avatar={getItemAvatar(item)}
                selected={selectedItem && getItemKey(selectedItem) === getItemKey(item)}
                onClick={() => handleItemClick(item)}
                isDesktop={isDesktop}
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.searchableGrid}>
      {/* Search section */}
      <div className={`${styles.searchSection} ${isDesktop ? styles.desktop : ""}`}>
        <div className={styles.searchContainer}>
          {/* Search icon */}
          <div className={`${styles.searchIcon} ${isDesktop ? styles.desktop : ""}`}>🔍</div>

          {/* Search input */}
          <input
            type='text'
            className={`${styles.searchInput} ${isDesktop ? styles.desktop : ""}`}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus={isDesktop}
            aria-label={searchPlaceholder}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              type='button'
              className={`${styles.clearButton} ${isDesktop ? styles.desktop : ""}`}
              onClick={handleClearSearch}
              aria-label='Clear search'
              title='Clear search'
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Recent items section */}
      {renderRecentSection()}

      {/* Grid container - scrollable area */}
      <div className={`${styles.gridContainer} ${isDesktop ? styles.desktop : ""}`}>
        {renderGridContent()}
      </div>
    </div>
  );
}
