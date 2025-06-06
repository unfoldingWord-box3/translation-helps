/**
 * SelectionCard.jsx
 * Card component for displaying selectable items in the wizard
 */

import React from "react";

export function SelectionCard({
  id,
  title,
  subtitle,
  icon,
  badge,
  isSelected = false,
  onClick,
  isDesktop = false,
}) {
  const cardStyles = {
    padding: isDesktop ? "20px" : "16px",
    border: `2px solid ${isSelected ? "#007bff" : "#e1e5e9"}`,
    borderRadius: "12px",
    backgroundColor: isSelected ? "#f8fcff" : "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: isDesktop ? "16px" : "12px",
    boxShadow: isSelected ? "0 4px 12px rgba(0, 123, 255, 0.1)" : "0 2px 4px rgba(0, 0, 0, 0.05)",
  };

  const iconStyles = {
    fontSize: isDesktop ? "32px" : "24px",
    minWidth: isDesktop ? "40px" : "32px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const contentStyles = {
    flex: 1,
    minWidth: 0, // Allows text to wrap
  };

  const titleStyles = {
    fontSize: isDesktop ? "16px" : "14px",
    fontWeight: "600",
    color: isSelected ? "#007bff" : "#212529",
    margin: "0 0 4px 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const subtitleStyles = {
    fontSize: isDesktop ? "14px" : "12px",
    color: isSelected ? "#0056b3" : "#6c757d",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const badgeStyles = {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "#28a745",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 6px",
    borderRadius: "12px",
    textTransform: "uppercase",
  };

  const checkmarkStyles = {
    position: "absolute",
    top: isDesktop ? "12px" : "8px",
    right: isDesktop ? "12px" : "8px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
  };

  const handleMouseEnter = (e) => {
    if (!isSelected) {
      e.target.style.borderColor = "#007bff";
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.15)";
    }
  };

  const handleMouseLeave = (e) => {
    if (!isSelected) {
      e.target.style.borderColor = "#e1e5e9";
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
    }
  };

  return (
    <div
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`selection-card-${id}`}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {icon && <div style={iconStyles}>{icon}</div>}

      <div style={contentStyles}>
        <h3 style={titleStyles}>{title}</h3>
        {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
      </div>

      {badge && <div style={badgeStyles}>{badge}</div>}

      {isSelected && <div style={checkmarkStyles}>✓</div>}
    </div>
  );
}
