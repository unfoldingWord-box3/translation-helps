/**
 * USFMRenderer.jsx
 * Component that wraps simple-text-editor-rcl for USFM rendering
 */
import React, { useRef, useEffect } from "react";
import { Editor } from "simple-text-editor-rcl";

/**
 * @param {object} props
 * @param {string} props.usfm - USFM content to render
 * @param {number} props.selectedVerse - Currently selected verse number
 * @param {function} props.onVerseClick - Callback when a verse is clicked
 */
export default function USFMRenderer({ usfm, selectedVerse, onVerseClick }) {
  const editorRef = useRef(null);

  // Handle verse click events by parsing the rendered output
  useEffect(() => {
    if (!editorRef.current || !onVerseClick) return;

    const handleClick = (event) => {
      // Try to find the verse number from the clicked element or its parents
      let element = event.target;
      let verseNumber = null;

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

        // Check for data attributes that might contain verse info
        if (element.dataset?.verse) {
          verseNumber = parseInt(element.dataset.verse);
          break;
        }

        // Check for verse number in class names
        const classMatch = element.className?.match(/verse-?(\d+)/);
        if (classMatch) {
          verseNumber = parseInt(classMatch[1]);
          break;
        }

        element = element.parentElement;
      }

      if (verseNumber && verseNumber !== selectedVerse) {
        onVerseClick(verseNumber);
      }
    };

    const editorElement = editorRef.current;
    editorElement.addEventListener("click", handleClick);

    return () => {
      editorElement.removeEventListener("click", handleClick);
    };
  }, [selectedVerse, onVerseClick]);

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
      `}</style>
      <div ref={editorRef}>
        <Editor
          input={usfm}
          outputStyle='readable'
          mode='view'
          preview={true}
          showLabels={false}
          showWordAtts={false}
          showRaw={false}
        />
      </div>
    </div>
  );
}
