/**
 * USFMRenderer.jsx
 * Component that wraps simple-text-editor-rcl for USFM rendering
 */
import React, { useRef, useEffect, useState, useContext } from "react";
import { UsfmEditor } from "simple-text-editor-rcl";
import { ReferenceContext } from "../../context/ReferenceContext";

/**
 * @param {object} props
 * @param {string} props.usfm - USFM content to render
 * @param {number} props.selectedVerse - Currently selected verse number
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export default function USFMRenderer({ usfm, selectedVerse, onVerseClick }) {
  const editorRef = useRef(null);
  const { updateReference } = useContext(ReferenceContext);

  // UI controls for simple-text-editor-rcl options
  const [options, setOptions] = useState({
    sectionable: true,
    blockable: true,
    editable: false,
    preview: true, // Enable preview mode for readable text rendering
    verse: true,
    chapter: true,
    // Additional options for alignment data processing
    showWordAtts: false, // Hide word attributes for cleaner display
    showTitles: true,
    showHeadings: true,
    showIntroductions: true,
    showChapterLabels: true,
    showVerseLabels: true,
  });

  // Debug logging
  console.log("USFMRenderer received USFM:", usfm?.substring(0, 500) + "...");

  // Handle selection clicks (for chapter navigation)
  const handleSelectionClick = (selection) => {
    console.log("📖 Selection clicked:", selection);

    // Check for chapter information in various ways
    if (selection?.content) {
      // Look for chapter markers in raw content
      const chapterMatch = selection.content.match(/\\c\s+(\d+)/);
      if (chapterMatch) {
        const chapterNum = parseInt(chapterMatch[1]);
        console.log(`🔄 Navigating to chapter ${chapterNum}`);
        updateReference({ chapter: chapterNum });
        return;
      }
    }

    // Check for chapter data in selection metadata
    if (selection?.chapter) {
      const chapterNum = parseInt(selection.chapter);
      console.log(`🔄 Navigating to chapter ${chapterNum} from selection metadata`);
      updateReference({ chapter: chapterNum });
    }
  };

  // Handle block clicks (for verse navigation)
  const handleBlockClick = (block) => {
    console.log("📝 Block clicked:", block);

    // Check for verse information in various ways
    if (block?.content) {
      // Look for verse markers in raw content
      const verseMatch = block.content.match(/\\v\s+(\d+)/);
      if (verseMatch) {
        const verseNum = parseInt(verseMatch[1]);
        console.log(`🔄 Navigating to verse ${verseNum}`);
        updateReference({ verse: verseNum });
        if (onVerseClick) {
          onVerseClick(verseNum);
        }
        return;
      }
    }

    // Check for verse data in block metadata
    if (block?.verse) {
      const verseNum = parseInt(block.verse);
      console.log(`🔄 Navigating to verse ${verseNum} from block metadata`);
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

  // Handle verse click events by parsing the rendered output
  useEffect(() => {
    if (!editorRef.current) return;

    const handleClick = (event) => {
      // Try to find the verse number from the clicked element or its parents
      let element = event.target;
      let verseNumber = null;
      let chapterNumber = null;

      // Look up the DOM tree for verse markers
      while (element && element !== editorRef.current) {
        // Check for verse markers in various formats
        if (element.classList?.contains("v")) {
          // Look for verse number in the element or its children
          const verseMatch = element.textContent?.match(/^(\d+)/);
          if (verseMatch) {
            verseNumber = parseInt(verseMatch[1]);
            break;
          }
        }

        // Check for chapter markers
        if (element.classList?.contains("c")) {
          const chapterMatch = element.textContent?.match(/^(\d+)/);
          if (chapterMatch) {
            chapterNumber = parseInt(chapterMatch[1]);
            break;
          }
        }

        // Check for data attributes that might contain verse/chapter info
        if (element.dataset?.verse) {
          verseNumber = parseInt(element.dataset.verse);
          break;
        }

        if (element.dataset?.chapter) {
          chapterNumber = parseInt(element.dataset.chapter);
          break;
        }

        // Check for verse/chapter number in class names
        const verseClassMatch = element.className?.match(/verse-?(\d+)/);
        if (verseClassMatch) {
          verseNumber = parseInt(verseClassMatch[1]);
          break;
        }

        const chapterClassMatch = element.className?.match(/chapter-?(\d+)/);
        if (chapterClassMatch) {
          chapterNumber = parseInt(chapterClassMatch[1]);
          break;
        }

        // Check for generic number elements that might be verses
        if (element.tagName === "SPAN" && /^\d+$/.test(element.textContent?.trim())) {
          const possibleVerse = parseInt(element.textContent.trim());
          if (possibleVerse > 0 && possibleVerse <= 200) {
            // reasonable verse range
            verseNumber = possibleVerse;
            break;
          }
        }

        element = element.parentElement;
      }

      // Handle navigation
      if (chapterNumber) {
        console.log(`🔄 DOM click: Navigating to chapter ${chapterNumber}`);
        updateReference({ chapter: chapterNumber });
      } else if (verseNumber && verseNumber !== selectedVerse) {
        console.log(`🔄 DOM click: Navigating to verse ${verseNumber}`);
        updateReference({ verse: verseNumber });
        if (onVerseClick) {
          onVerseClick(verseNumber);
        }
      }
    };

    const editorElement = editorRef.current;
    editorElement.addEventListener("click", handleClick);

    return () => {
      editorElement.removeEventListener("click", handleClick);
    };
  }, [selectedVerse, onVerseClick, updateReference]);

  // Highlight selected verse
  useEffect(() => {
    if (!editorRef.current || !selectedVerse) return;

    const highlightVerse = () => {
      const editorElement = editorRef.current;

      // Remove previous highlights
      const prevHighlighted = editorElement.querySelectorAll(".verse-highlighted");
      prevHighlighted.forEach((el) => el.classList.remove("verse-highlighted"));

      // Find and highlight the selected verse
      const verseElements = editorElement.querySelectorAll(".v, [data-verse]");
      for (const element of verseElements) {
        let elementVerseNum = null;

        if (element.classList.contains("v")) {
          const verseMatch = element.textContent?.match(/^(\d+)/);
          if (verseMatch) {
            elementVerseNum = parseInt(verseMatch[1]);
          }
        } else if (element.dataset?.verse) {
          elementVerseNum = parseInt(element.dataset.verse);
        }

        if (elementVerseNum === selectedVerse) {
          element.classList.add("verse-highlighted");
          // Scroll into view if needed
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
          break;
        }
      }
    };

    // Delay highlighting to ensure DOM is updated
    setTimeout(highlightVerse, 100);
  }, [selectedVerse, usfm]);

  if (!usfm) {
    return (
      <div style={{ padding: "20px", fontStyle: "italic", color: "#666" }}>
        No scripture content available for this chapter.
      </div>
    );
  }

  return (
    <div className='usfm-renderer-container'>
      <style>{`
        .verse-highlighted {
          background-color: #e3f2fd !important;
          border-left: 4px solid #1976d2 !important;
          padding-left: 8px !important;
          margin-left: -12px !important;
        }
        
        .usfm-renderer-container .v {
          cursor: pointer;
          transition: background-color 0.2s ease;
          padding: 4px 0;
          border-radius: 2px;
        }
        
        .usfm-renderer-container .v:hover {
          background-color: #f5f5f5;
        }
        
        .usfm-renderer-container {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.6;
          font-size: 16px;
        }
        
        .usfm-renderer-container h1,
        .usfm-renderer-container h2,
        .usfm-renderer-container h3 {
          color: #333;
          margin: 1em 0 0.5em 0;
        }
        
        .usfm-renderer-container .q,
        .usfm-renderer-container .q1 {
          margin-left: 20px;
          font-style: italic;
        }
        
        .usfm-renderer-container .q2 {
          margin-left: 40px;
          font-style: italic;
        }
        
        .usfm-renderer-container .q3 {
          margin-left: 60px;
          font-style: italic;
        }
        
        .usfm-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
          border: 1px solid #e9ecef;
          flex-wrap: wrap;
        }
        
        .control-group {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .control-group label {
          font-size: 14px;
          color: #495057;
          cursor: pointer;
          user-select: none;
        }
        
        .control-group input[type="checkbox"] {
          cursor: pointer;
        }
        
        .controls-title {
          color: #6c757d;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-right: 15px;
          display: flex;
          align-items: center;
        }
      `}</style>

      {/* UI Controls for simple-text-editor-rcl options */}
      <div className='usfm-controls'>
        <div className='controls-title'>Rendering Options:</div>

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

        <div className='control-group'>
          <input
            type='checkbox'
            id='editable'
            checked={options.editable}
            onChange={() => toggleOption("editable")}
          />
          <label htmlFor='editable'>Editable</label>
        </div>

        <div className='control-group'>
          <input
            type='checkbox'
            id='preview'
            checked={options.preview}
            onChange={() => toggleOption("preview")}
          />
          <label htmlFor='preview'>Preview</label>
        </div>
      </div>

      <div ref={editorRef}>
        <UsfmEditor
          content={usfm}
          options={options}
          onSelectionClick={handleSelectionClick}
          onBlockClick={handleBlockClick}
          sectionIndex={-1}
        />
      </div>
    </div>
  );
}
