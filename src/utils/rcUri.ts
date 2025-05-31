/**
 * rcUri.ts
 * Utility to parse rc:// URIs.
 */

/**
 * Parses an rc:// URI into segments.
 * @param uri URI string to parse.
 * @returns An object with segments array or null if invalid.
 */
export function parseRcUri(uri: string): { segments: string[] } | null {
  if (typeof uri !== 'string' || !uri.startsWith('rc://')) return null;
  const segments = uri.slice(5).split('/');
  return { segments };
}