/**
 * parseTsv.js
 * Helper to parse TSV text into an array of objects keyed by the header row.
 *
 * @param {string} text Raw TSV content.
 * @returns {Array<Object>} Parsed rows as objects.
 */
export function parseTsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(
    line => line.trim() && !line.startsWith('#')
  );
  if (lines.length === 0) return [];
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split('\t');
  return rows.map(line => {
    const cols = line.split('\t');
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = cols[i] || '';
    });
    return entry;
  });
}