/**
 * groupByVerse.ts
 * Utility to group entries by verse reference.
 */

/**
 * Groups rows by their Reference field.
 * @param rows Array of objects with a Reference property.
 * @returns An object mapping each Reference to its array of rows.
 */
export function groupByVerse<T extends { Reference: string }>(rows: T[]): Record<string, T[]> {
  return rows.reduce<Record<string, T[]>>((acc, row) => {
    const key = row.Reference;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}