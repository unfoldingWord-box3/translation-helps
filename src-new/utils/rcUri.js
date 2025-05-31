/**
 * rcUri.js
 * Utility to parse rc:// URIs.
 */

/**
 * Parses an rc:// URI into segments.
 * @param {string} uri
 * @returns {{segments: string[]}|null}
 */
export function parseRcUri(uri) {
  if (typeof uri !== 'string' || !uri.startsWith('rc://')) return null;
  const segments = uri.slice(5).split('/');
  return { segments };
}