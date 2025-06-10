import React from "react";
import { EditableContent } from "simple-text-editor-rcl";

/**
 * Thin wrapper for EditableContent.
 * All custom component overrides and handlers should be defined in the parent (e.g., USFMRenderer).
 */
const UsfmEditor = (props) => (
  <usfm>
    <EditableContent {...props} />
  </usfm>
);

export default UsfmEditor;
