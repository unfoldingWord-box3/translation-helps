/**
 * tsvUtils.js
 * Utility functions for safe TSV row manipulation.
 */

/**
 * Escapes tabs and newlines in TSV cell values.
 * @param {string} value
 * @returns {string}
 */
export function escapeTsvValue(value) {
  return value != null
    ? String(value).replace(/\t/g, ' ').replace(/\r?\n/g, ' ')
    : '';
}

/**
 * Builds a TSV string from rows of objects.
 * @param {Array<Object>} rows
 * @param {Array<string>} headers Optional headers order.
 * @returns {string}
 */
export function buildTsv(rows, headers) {
  if (!rows || rows.length === 0) return '';
  const hdrs = headers || Object.keys(rows[0]);
  const lines = [hdrs.join('\t')];
  rows.forEach(row => {
    const values = hdrs.map(h => escapeTsvValue(row[h]));
    lines.push(values.join('\t'));
  });
  return lines.join('\n');
}