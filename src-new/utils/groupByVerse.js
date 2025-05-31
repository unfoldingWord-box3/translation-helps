/**
 * groupByVerse.js
 * Utility to group entries by verse reference.
 */

/**
 * Groups rows by their Reference field.
 * @param {Array<Object>} rows
 * @returns {Object<string, Array<Object>>}
 */
export function groupByVerse(rows) {
  return rows.reduce((acc, row) => {
    const key = row.Reference;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}