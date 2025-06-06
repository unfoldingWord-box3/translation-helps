/**
 * useKeyboardNavigation.js
 * Hook for handling keyboard navigation in the wizard
 */

import { useEffect } from "react";

export function useKeyboardNavigation({ onNext, onPrevious, onEscape, enabled = true }) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Don't interfere with form inputs
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.tagName === "SELECT"
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "Enter":
          if (onNext) {
            event.preventDefault();
            onNext();
          }
          break;
        case "ArrowLeft":
          if (onPrevious) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrevious, onEscape, enabled]);
}
