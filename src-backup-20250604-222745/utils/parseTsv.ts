/**
 * parseTsv.ts
 * Helper to parse TSV text into an array of objects keyed by the header row.
 *
 * @param text Raw TSV content.
 * @returns Parsed rows as objects.
 */
export function parseTsv(text: string): Record<string, string>[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim() && !line.startsWith('#'));
  if (lines.length === 0) return [];
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split('\t');
  return rows.map(line => {
    const cols = line.split('\t');
    const entry: Record<string, string> = {};
    headers.forEach((h, i) => {
      entry[h] = cols[i] || '';
    });
    return entry;
  });
}