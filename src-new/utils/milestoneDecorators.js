/**
 * milestoneDecorators.js
 *
 * Exports a function to create USFM decorators that transform milestone
 * markers into semantic HTML tags for consistent rendering.
 */

/**
 * Creates a set of decorators for rendering USFM milestones as custom HTML tags.
 *
 * This approach ensures that the HTML structure is identical for both preview
 * and non-preview modes, with CSS handling all visual differences.
 *
 * @returns {object} An object containing decorator configurations for UsfmEditor.
 */
export const createMilestoneDecorators = () => {
  return {
    w: [
      /\\w\s([^|]+)\|([^\\*]+)\\w\*/g,
      '<word><marker class="w">\\w </marker><content>$1</content><attributes>|$2</attributes><marker class="w*">\\w*</marker></word>',
    ],
    zaln: [
      /\\zaln-s\s([^\\*]+)\\\*|\\zaln-e\\\*/g,
      (match, attributes) => {
        if (attributes) {
          return `<zaln><marker class="zaln-s">\\zaln-s </marker><attributes>${attributes}</attributes><marker class="*">\\*</marker>`;
        }
        return `<marker class="zaln-e">\\zaln-e</marker><marker class="*">\\*</marker></zaln>`;
      },
    ],
    v: [
      /(\\v\s+)(\d+)([\s\S]*?)(?=\\v\s+\d+|\\c\s+\d+|$)/g,
      "<v><marker>$1</marker><number>$2</number>$3</v>",
    ],
  };
};
