/**
 * ScripturePanel.jsx
 * Responsible for displaying scripture text using the enhanced RCL component.
 */
import React from "react";
import ScripturePanelRCL from "./ScripturePanelRCL";

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export function ScripturePanel({ reference, onVerseClick }) {
  return <ScripturePanelRCL reference={reference} onVerseClick={onVerseClick} />;
}
