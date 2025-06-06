import { describe, it, expect } from "vitest";
import { createMilestoneDecorators, parseAlignmentData } from "./milestoneDecorators";

describe("milestoneDecorators", () => {
  describe("createMilestoneDecorators", () => {
    describe("preview mode", () => {
      const decorators = createMilestoneDecorators(true);

      it("should strip alignment markers and keep only words", () => {
        const input =
          '\\zaln-s |x-strong="G39720" x-lemma="Παῦλος"\\*\\w Paul|x-occurrence="1"\\w*\\zaln-e\\*';
        const [pattern, replacement] = decorators.alignmentMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("Paul");
      });

      it("should strip standalone word markers", () => {
        const input = '\\w servant|x-occurrence="1"\\w*';
        const [pattern, replacement] = decorators.wordMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("servant");
      });

      it("should remove footnotes completely", () => {
        const input = "text \\f + \\fr 1:1 \\ft Some footnote\\f* more text";
        const [pattern, replacement] = decorators.footnotes;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("text  more text");
      });

      it("should format verse markers as plain numbers", () => {
        const input = "\\v 1 Paul, a servant";
        const [pattern, replacement] = decorators.verseMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("1 Paul, a servant");
      });

      it("should format chapter markers as headings", () => {
        const input = "\\c 1 \\p";
        const [pattern, replacement] = decorators.chapterMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("\n\nChapter 1\n\n\\p");
      });

      it("should remove all non-verse/chapter USFM markers", () => {
        const input = "\\id TIT \\h Titus \\mt Titus";
        const [pattern, replacement] = decorators.allMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("");
      });

      it("should clean up extra spaces", () => {
        const input = "word1    word2     word3";
        const [pattern, replacement] = decorators.spaceCleanup;
        const result = input.replace(pattern, replacement);
        expect(result).toBe("word1 word2 word3");
      });
    });

    describe("source mode", () => {
      const decorators = createMilestoneDecorators(false);

      it("should wrap alignment markers with HTML spans", () => {
        const input = '\\zaln-s |x-strong="G39720"\\*\\w Paul|x-occurrence="1"\\w*\\zaln-e\\*';
        const [pattern, replacement] = decorators.alignmentMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toContain('<span class="milestone-alignment"');
        expect(result).toContain("\\zaln-s");
        expect(result).toContain("\\zaln-e\\*");
      });

      it("should wrap word markers with HTML spans", () => {
        const input = '\\w servant|x-occurrence="1"\\w*';
        const [pattern, replacement] = decorators.wordMarkers;
        const result = input.replace(pattern, replacement);
        expect(result).toContain('<span class="milestone-word"');
        expect(result).toContain("\\w servant");
      });

      it("should wrap footnotes with HTML spans", () => {
        const input = "\\f + \\fr 1:1 \\ft Some footnote\\f*";
        const [pattern, replacement] = decorators.footnotes;
        const result = input.replace(pattern, replacement);
        expect(result).toContain("<span class='footnote'");
        expect(result).toContain("\\f");
        expect(result).toContain("\\f*");
      });

      it("should highlight word attributes", () => {
        const input = '|x-strong="G39720"';
        const [pattern, replacement] = decorators.attributes;
        const result = input.replace(pattern, replacement);
        expect(result).toContain("<span class='attribute'");
        expect(result).toContain('x-strong="G39720"');
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

  describe("decorator application order", () => {
    it("should apply decorators in correct cascade order for preview mode", () => {
      const decorators = createMilestoneDecorators(true);
      const decoratorKeys = Object.keys(decorators);

      // Verify critical ordering
      const htmlIndex = decoratorKeys.indexOf("embededHtml");
      const alignmentIndex = decoratorKeys.indexOf("alignmentMarkers");
      const wordIndex = decoratorKeys.indexOf("wordMarkers");
      const cleanupIndex = decoratorKeys.indexOf("spaceCleanup");

      expect(htmlIndex).toBeLessThan(alignmentIndex);
      expect(alignmentIndex).toBeLessThan(wordIndex);
      expect(wordIndex).toBeLessThan(cleanupIndex);
    });
  });
});
