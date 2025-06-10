/**
 * USFMRenderer.jsx
 * Component that wraps simple-text-editor-rcl for USFM rendering
 *
 * All custom component overrides and handlers for UsfmEditor are defined here.
 * CustomUsfmEditor is a thin wrapper only.
 */
import React, { useState, useContext } from "react";
import UsfmEditor from "./CustomUsfmEditor";
import { ReferenceContext } from "../../context/ReferenceContext";
import { createUsfmDecorators } from "../../utils/usfmDecorators";
import { segmenter } from "../../utils/segmenter";
import "../../components/AlignedWord/usfm-custom-tags.css";

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
    sectionable: false,
    blockable: true,
    editable: false,
    preview: true, // Enable preview mode for readable text rendering
    verse: true,
    chapter: true,
    showWordAtts: false, // Keep this false for default behavior
    showTitles: true,
    showHeadings: false,
    showIntroductions: true,
    showChapterLabels: true,
    showVerseLabels: true,
  });

  // Create the decorators
  const usfmDecorators = createUsfmDecorators();

  // Custom block component to override default styles
  const components = {
    // _props may include event handlers such as onClick
    block: (props) => <div className='block' {...props} style={{ width: "100%" }} />,
  };

  // Handle selection clicks (for chapter navigation)
  // Now expects { content, index }
  const onSectionClick = ({ content, index }) => {
    console.log("📖 Section clicked:", { content, index });
    // Try to extract chapter from content (string or object)
    let chapterNum;
    if (typeof content === "object" && content?.chapter) {
      chapterNum = parseInt(content.chapter);
    } else if (typeof content === "string") {
      // Try to extract chapter number from string (e.g., "\c 1")
      const match = content.match(/\\c\s+(\d+)/);
      if (match) {
        chapterNum = parseInt(match[1]);
      }
    }
    if (chapterNum) {
      updateReference({ chapter: chapterNum });
    }
  };

  // Handle block clicks (for verse navigation)
  // Now expects { content, index }
  const onBlockClick = ({ content, index }) => {
    console.log("🟢 VERSE CLICKED:", { content, index });
    // Try to extract verse and chapter from content (string or object)
    let verseNum, chapterNum;
    if (typeof content === "object") {
      if (content.verse) verseNum = parseInt(content.verse);
      if (content.chapter) chapterNum = parseInt(content.chapter);
    } else if (typeof content === "string") {
      // Try to extract verse number from string (e.g., "\v 1 ...")
      const verseMatch = content.match(/\\v\s+(\d+)/);
      if (verseMatch) verseNum = parseInt(verseMatch[1]);
      const chapterMatch = content.match(/\\c\s+(\d+)/);
      if (chapterMatch) chapterNum = parseInt(chapterMatch[1]);
    }
    console.log("🔄 Updating reference to:", { chapter: chapterNum, verse: verseNum });
    if (verseNum) {
      updateReference({ chapter: chapterNum, verse: verseNum });
      if (onVerseClick) {
        console.log("📞 Calling onVerseClick with:", verseNum, chapterNum);
        onVerseClick(verseNum, chapterNum);
      }
    } else {
      console.log("⚠️ Block click did not contain a verse number:", { content, index });
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

  // Custom parsers and joiners for USFM segmentation
  const parsers = {
    section: (_content) =>
      segmenter({ content: _content, regex: /(^|\\c +\d+)(\n|.)+?(\n|$)?(?=(\\c +\d+|$))/g }),
    block: (_content) =>
      segmenter({ content: _content, regex: /(^|\\[cspv])(\n|.)+?(\n|$)?(?=(\\[cspv]|$))/g }),
  };
  const joiners = {
    section: "",
    block: "",
  };

  const editor = (
    <div data-testid='usfm-renderer'>
      <UsfmEditor
        content={usfm}
        options={options}
        sectionIndex={-1} // Show all content
        decorators={usfmDecorators}
        components={components}
        handlers={{
          onSectionClick,
          onBlockClick,
        }}
        parsers={parsers}
        joiners={joiners}
      />
    </div>
  );

  return (
    <>
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
        <div className='control-group'>
          <input
            type='checkbox'
            id='sectionable'
            checked={options.sectionable}
            onChange={() => toggleOption("sectionable")}
          />
          <label htmlFor='sectionable'>Sectionable</label>
        </div>
        <div className='control-group'>
          <input
            type='checkbox'
            id='blockable'
            checked={options.blockable}
            onChange={() => toggleOption("blockable")}
          />
          <label htmlFor='blockable'>Blockable</label>
        </div>
      </div>

      {editor}
    </>
  );
}
