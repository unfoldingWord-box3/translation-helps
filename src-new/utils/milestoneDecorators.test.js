/**
 * milestoneDecorators.test.js
 * Tests for granular decorators that solve the alignment rendering problem.
 * See docs/usfm-alignment-rendering-solution.md for detailed explanation.
 */

import { describe, it, expect } from "vitest";
import { createMilestoneDecorators, parseAlignmentData } from "./milestoneDecorators";

describe("milestoneDecorators - Granular Approach", () => {
  describe("Granular Separation - All Modes", () => {
    // CRITICAL: Both preview and non-preview modes use identical decorators
    const previewDecorators = createMilestoneDecorators(true);
    const sourceDecorators = createMilestoneDecorators(false);

    // Use preview decorators for testing (they're identical anyway)
    const decorators = previewDecorators;

    it("should return identical decorators for both preview and source modes", () => {
      // CRITICAL TEST: Both modes must return the same decorators
      expect(previewDecorators).toEqual(sourceDecorators);
    });

    it("should separate alignment start markers granularly", () => {
      const input = '\\zaln-s |x-strong="G39720" x-lemma="Παῦλος"\\*';
      const [pattern, replacement] = decorators.alignmentStart;
      const result = input.replace(pattern, replacement);

      // Should create granular structure
      expect(result).toContain('<span class="milestone">');
      expect(result).toContain('<span class="marker">\\zaln-s </span>');
      expect(result).toContain(
        '<span class="attributes">|x-strong="G39720" x-lemma="Παῦλος"</span>'
      );
      expect(result).toContain('<span class="marker">\\*</span>');
    });

    it("should separate word markers granularly - CRITICAL TEST", () => {
      const input = '\\w Paul|x-occurrence="1" x-occurrences="1"\\w*';
      const [pattern, replacement] = decorators.wordMarker;
      const result = input.replace(pattern, replacement);

      // Should create granular structure that preserves content
      expect(result).toContain('<span class="word">');
      expect(result).toContain('<span class="marker">\\w </span>');
      expect(result).toContain('<span class="content">Paul</span>'); // CRITICAL: Content preserved
      expect(result).toContain(
        '<span class="attributes">|x-occurrence="1" x-occurrences="1"</span>'
      );
      expect(result).toContain('<span class="marker">\\w*</span>');
    });

    it("should separate alignment end markers", () => {
      const input = "\\zaln-e\\*";
      const [pattern, replacement] = decorators.alignmentEnd;
      const result = input.replace(pattern, replacement);

      expect(result).toContain('<span class="marker">\\zaln-e\\*</span></span>');
    });

    it("should process full alignment milestone with granular separation", () => {
      const input = '\\zaln-s |x-strong="G39720"\\*\\w Paul|x-occurrence="1"\\w*\\zaln-e\\*';

      // Apply decorators in sequence (like the library would)
      let result = input;
      result = result.replace(decorators.alignmentStart[0], decorators.alignmentStart[1]);
      result = result.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      result = result.replace(decorators.alignmentEnd[0], decorators.alignmentEnd[1]);

      // Verify granular structure preserves content
      expect(result).toContain('<span class="milestone">');
      expect(result).toContain('<span class="content">Paul</span>'); // CRITICAL: Word content visible
      expect(result).toContain('<span class="marker">\\zaln-s </span>');
      expect(result).toContain('<span class="attributes">|x-strong="G39720"</span>');
    });

    it("should separate book title markers granularly", () => {
      const input = "\\h 1 Timothy";
      const [pattern, replacement] = decorators.bookTitle;
      const result = input.replace(pattern, replacement);

      expect(result).toContain('<span class="header">');
      expect(result).toContain('<span class="marker">\\h </span>');
      expect(result).toContain(
        '<span class="content"><h1 class="book-title">1 Timothy</h1></span>'
      );
    });

    it("should separate chapter markers granularly", () => {
      const input = "\\c 1";
      const [pattern, replacement] = decorators.chapterMarker;
      const result = input.replace(pattern, replacement);

      expect(result).toContain('<span class="chapter">');
      expect(result).toContain('<span class="marker">\\c </span>');
      expect(result).toContain(
        '<span class="content"><h2 class="chapter-heading">Chapter 1</h2></span>'
      );
    });

    it("should separate verse markers granularly", () => {
      const input = "\\v 1";
      const [pattern, replacement] = decorators.verseMarker;
      const result = input.replace(pattern, replacement);

      expect(result).toContain('<span class="verse-marker">');
      expect(result).toContain('<span class="marker">\\v </span>');
      expect(result).toContain('<span class="content verse-number" data-verse="1">1</span>');
    });

    it("should separate footnote markers granularly", () => {
      const input = "\\f + \\fr 1:1 \\ft Some footnote\\f*";
      const [pattern, replacement] = decorators.footnoteMarker;
      const result = input.replace(pattern, replacement);

      expect(result).toContain('<span class="footnote">');
      expect(result).toContain('<span class="marker">\\f </span>');
      expect(result).toContain(
        '<span class="content"><sup class="footnote-ref">[note]</sup></span>'
      );
      expect(result).toContain('<span class="marker">\\f*</span>');
    });

    it("should handle complex alignment attributes", () => {
      const input =
        '\\zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\\*';
      const [pattern, replacement] = decorators.alignmentStart;
      const result = input.replace(pattern, replacement);

      // Should capture all attributes in one attributes span
      expect(result).toContain(
        '<span class="attributes">|x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"</span>'
      );
    });

    it("should handle multiple words in sequence", () => {
      const input = '\\w Paul|x-occurrence="1"\\w* \\w is|x-occurrence="1"\\w*';

      let result = input;
      result = result.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      // Apply again for second word (global flag should catch both)
      result = result.replace(decorators.wordMarker[0], decorators.wordMarker[1]);

      // Both words should be preserved
      expect(result).toContain('<span class="content">Paul</span>');
      expect(result).toContain('<span class="content">is</span>');
    });
  });

  describe("CSS Integration Tests", () => {
    it("should create spans that work with CSS hiding rules", () => {
      const decorators = createMilestoneDecorators(true);
      const input = '\\w Paul|x-occurrence="1"\\w*';

      const [pattern, replacement] = decorators.wordMarker;
      const result = input.replace(pattern, replacement);

      // The CSS rule `.usfm .preview .marker, .usfm .preview .attributes { display: none; }`
      // should hide these spans but leave .content visible
      const markerSpans = result.match(/<span class="marker"[^>]*>/g);
      const attributeSpans = result.match(/<span class="attributes"[^>]*>/g);
      const contentSpans = result.match(/<span class="content"[^>]*>/g);

      expect(markerSpans).toBeTruthy(); // Should exist to be hidden
      expect(attributeSpans).toBeTruthy(); // Should exist to be hidden
      expect(contentSpans).toBeTruthy(); // Should exist to remain visible

      // Content should contain the actual word
      expect(result).toContain('<span class="content">Paul</span>');
    });

    it("should not wrap content in marker or attribute classes", () => {
      const decorators = createMilestoneDecorators(true);
      const input = '\\w Paul|x-occurrence="1"\\w*';

      const [pattern, replacement] = decorators.wordMarker;
      const result = input.replace(pattern, replacement);

      // CRITICAL: The word "Paul" should NOT be inside a .marker or .attributes span
      // It should only be in a .content span
      expect(result).not.toMatch(/<span class="marker"[^>]*>[^<]*Paul[^<]*<\/span>/);
      expect(result).not.toMatch(/<span class="attributes"[^>]*>[^<]*Paul[^<]*<\/span>/);
      expect(result).toMatch(/<span class="content"[^>]*>Paul<\/span>/);
    });
  });

  describe("Real-world USFM Examples", () => {
    it("should handle Titus 1:1 alignment data correctly", () => {
      const decorators = createMilestoneDecorators(true);
      const input =
        '\\zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\\*\\w Paul|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*';

      // Apply decorators in sequence
      let result = input;
      result = result.replace(decorators.alignmentStart[0], decorators.alignmentStart[1]);
      result = result.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      result = result.replace(decorators.alignmentEnd[0], decorators.alignmentEnd[1]);

      // Verify the word "Paul" is in a content span and will be visible
      expect(result).toContain('<span class="content">Paul</span>');

      // Verify all Greek data is in attributes spans and will be hidden
      expect(result).toContain('<span class="attributes">|x-strong="G39720" x-lemma="Παῦλος"');
      expect(result).toContain(
        '<span class="attributes">|x-occurrence="1" x-occurrences="1"</span>'
      );

      // Verify structure is properly nested
      expect(result).toContain('<span class="milestone">');
      expect(result).toContain('<span class="word">');
    });

    it("should handle multiple alignment milestones", () => {
      const decorators = createMilestoneDecorators(true);
      const input =
        '\\zaln-s |x-strong="G1161"\\*\\w And|x-occurrence="1"\\w*\\zaln-e\\* \\zaln-s |x-strong="G3972"\\*\\w Paul|x-occurrence="1"\\w*\\zaln-e\\*';

      // Apply decorators (with global flag they should catch all instances)
      let result = input;
      result = result.replace(decorators.alignmentStart[0], decorators.alignmentStart[1]);
      result = result.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      result = result.replace(decorators.alignmentEnd[0], decorators.alignmentEnd[1]);

      // Both words should be preserved in content spans
      expect(result).toContain('<span class="content">And</span>');
      expect(result).toContain('<span class="content">Paul</span>');
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed USFM gracefully", () => {
      const decorators = createMilestoneDecorators(true);

      // Missing closing marker
      const input1 = '\\w Paul|x-occurrence="1"';
      const result1 = input1.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      expect(result1).toBe(input1); // Should remain unchanged

      // Missing attributes
      const input2 = "\\w Paul\\w*";
      const result2 = input2.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      // Should not crash, may or may not match depending on regex
    });

    it("should handle empty content", () => {
      const decorators = createMilestoneDecorators(true);
      const input = "";
      const result = input.replace(decorators.wordMarker[0], decorators.wordMarker[1]);
      expect(result).toBe("");
    });
  });
});

describe("parseAlignmentData", () => {
  it("should parse all alignment attributes", () => {
    const input =
      'x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"';
    const result = parseAlignmentData(input);

    expect(result).toEqual({
      strong: "G39720",
      lemma: "Παῦλος",
      morph: "Gr,N,,,,,NMS,",
      occurrence: "1",
      occurrences: "1",
      content: "Παῦλος",
    });
  });

  it("should handle missing attributes gracefully", () => {
    const input = 'x-strong="G39720"';
    const result = parseAlignmentData(input);

    expect(result.strong).toBe("G39720");
    expect(result.lemma).toBeNull();
    expect(result.morph).toBeNull();
  });

  it("should handle empty input", () => {
    const result = parseAlignmentData("");

    expect(result).toEqual({
      strong: null,
      lemma: null,
      morph: null,
      occurrence: null,
      occurrences: null,
      content: null,
    });
  });
});
