/**
 * NavigationBar.jsx
 * Application header with title and clickable navigation breadcrumbs
 */

import React, { useContext } from "react";
import { ReferenceContext } from "../context/ReferenceContext";
import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs";

export function NavigationBar({ onOpenWizard }) {
  const { reference } = useContext(ReferenceContext);

  return (
    <nav
      style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "24px", flexShrink: 0 }}>Translation Helps Viewer</h1>

      {/* Navigation Breadcrumbs */}
      <div style={{ flex: 1, minWidth: "300px" }}>
        <NavigationBreadcrumbs onOpenWizard={onOpenWizard} />
      </div>
    </nav>
  );
}
