/**
 * SelectionCard.jsx
 * Individual card component for selectable items in grids
 */

import React from "react";
import styles from "./SelectionCard.module.css";

export function SelectionCard({
  title = "",
  subtitle = "",
  description = "",
  icon = "",
  avatar = "",
  badge = "",
  selected = false,
  onClick,
  isDesktop = false,
  variant = "default", // default, compact
  disabled = false,
  loading = false,
  "data-testid": testId,
}) {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (!disabled && !loading && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  };

  // Use description if provided, fallback to subtitle for backwards compatibility
  const displayDescription = description || subtitle;

  // Build CSS classes
  const cardClasses = [
    styles.selectionCard,
    isDesktop ? styles.desktop : "",
    selected ? styles.selected : "",
    disabled ? styles.disabled : "",
    loading ? styles.loading : "",
    variant === "compact" ? styles.compact : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconClasses = [styles.iconContainer, isDesktop ? styles.desktop : ""]
    .filter(Boolean)
    .join(" ");

  const fallbackIconClasses = [styles.fallbackIcon, isDesktop ? styles.desktop : ""]
    .filter(Boolean)
    .join(" ");

  const contentClasses = [styles.content, isDesktop ? styles.desktop : ""]
    .filter(Boolean)
    .join(" ");

  const titleClasses = [styles.title, isDesktop ? styles.desktop : ""].filter(Boolean).join(" ");

  const descriptionClasses = [styles.description, isDesktop ? styles.desktop : ""]
    .filter(Boolean)
    .join(" ");

  const badgeClasses = [
    styles.badge,
    isDesktop ? styles.desktop : "",
    badge?.type ? styles[badge.type] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selectionIndicatorClasses = [styles.selectionIndicator, isDesktop ? styles.desktop : ""]
    .filter(Boolean)
    .join(" ");

  // Render icon/avatar
  const renderIcon = () => {
    if (loading) {
      return (
        <div className={styles.loadingContent}>
          <div className={`${styles.loadingSpinner} ${isDesktop ? styles.desktop : ""}`} />
        </div>
      );
    }

    if (avatar) {
      return (
        <img
          src={avatar}
          alt={title}
          className={styles.iconImage}
          onError={(e) => {
            // Hide broken image and show fallback
            e.target.style.display = "none";
            const fallback = e.target.nextElementSibling;
            if (fallback) {
              fallback.style.display = "flex";
            }
          }}
        />
      );
    }

    if (icon) {
      return <div className={fallbackIconClasses}>{icon}</div>;
    }

    // Default placeholder
    return <div className={fallbackIconClasses}>📄</div>;
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={disabled || loading ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      data-testid={testId}
    >
      {/* Icon/Avatar container */}
      <div className={iconClasses}>
        {renderIcon()}
        {/* Fallback icon (hidden by default, shown if image fails) */}
        {avatar && (
          <div className={fallbackIconClasses} style={{ display: "none" }}>
            {icon || "📄"}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className={contentClasses}>
        <h4 className={titleClasses}>{title}</h4>
        {displayDescription && <p className={descriptionClasses}>{displayDescription}</p>}

        {/* Badge (if provided) */}
        {badge && (
          <div className={badgeClasses}>
            {typeof badge === "string" ? badge : badge.label || badge.text}
          </div>
        )}
      </div>

      {/* Selection indicator */}
      <div className={selectionIndicatorClasses}>
        <span className={styles.checkIcon}>✓</span>
      </div>
    </div>
  );
}
