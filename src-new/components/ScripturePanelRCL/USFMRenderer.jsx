/**
 * USFMRenderer.jsx
 * Component that wraps simple-text-editor-rcl for USFM rendering
 */
import React, { useState, useContext } from "react";
import { UsfmEditor } from "simple-text-editor-rcl";
import { ReferenceContext } from "../../context/ReferenceContext";
import { createMilestoneDecorators } from "../../utils/milestoneDecorators";
import "../../components/AlignedWord/MilestoneMarkers.css";

/**
 * @param {object} props
 * @param {string} props.usfm - USFM content to render
 * @param {number} props.selectedVerse - Currently selected verse number
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export default function USFMRenderer({ usfm, selectedVerse, onVerseClick }) {
  const { updateReference } = useContext(ReferenceContext);

  // UI controls for simple-text-editor-rcl options
  const [options, setOptions] = useState({
    sectionable: true,
    blockable: true,
    editable: false,
    preview: true, // Enable preview mode for readable text rendering
    verse: true,
    chapter: true,
    showWordAtts: false, // Keep this false for default behavior
    showTitles: true,
    showHeadings: true,
    showIntroductions: true,
    showChapterLabels: true,
    showVerseLabels: true,
  });

  // Create the decorators
  const milestoneDecorators = createMilestoneDecorators();

  // Custom block component to override default styles
  const components = {
    block: ({ ...props }) => <div {...props} style={{ whiteSpace: "normal" }} />,
  };

  // Handle selection clicks (for chapter navigation)
  const handleSelectionClick = (selection) => {
    console.log("📖 Selection clicked:", selection);
    if (selection?.chapter) {
      const chapterNum = parseInt(selection.chapter);
      updateReference({ chapter: chapterNum });
    }
  };

  // Handle block clicks (for verse navigation)
  const handleBlockClick = (block) => {
    console.log("📝 Block clicked:", block);
    if (block?.verse) {
      const verseNum = parseInt(block.verse);
      updateReference({ verse: verseNum });
      if (onVerseClick) {
        onVerseClick(verseNum);
      }
    }
  };

  // Toggle option handler
  const toggleOption = (optionName) => {
    setOptions((prev) => ({
      ...prev,
      [optionName]: !prev[optionName],
    }));
  };

  if (!usfm) {
    return (
      <div style={{ padding: "20px", fontStyle: "italic", color: "#666" }}>
        No scripture content available for this chapter.
      </div>
    );
  }

  const editor = (
    <UsfmEditor
      content={usfm}
      options={options}
      sectionIndex={-1} // Show all content
      decorators={milestoneDecorators}
      components={components}
      handlers={{
        onSectionClick: handleSelectionClick,
        onBlockClick: handleBlockClick,
      }}
    />
  );

  return (
    <usfm>
      {/* UI Controls for simple-text-editor-rcl options */}
      <div className='usfm-controls'>
        <div className='controls-title'>Rendering Options:</div>
        <div className='control-group'>
          <input
            type='checkbox'
            id='preview'
            checked={options.preview}
            onChange={() => toggleOption("preview")}
          />
          <label htmlFor='preview'>Preview Mode</label>
        </div>
      </div>

      {options.preview ? <preview>{editor}</preview> : editor}
    </usfm>
  );
}
