/**
 * dcsClient.js
 * Unified fetch layer for DCS repositories.
 */

import { load } from 'js-yaml';

const BASE_URL = 'https://git.door43.org/unfoldingWord';

/**
 * Constructs the raw branch URL for a given language and resource.
 * @param {string} languageId
 * @param {string} resourceId
 * @returns {string}
 */
function rawBaseUrl(languageId, resourceId) {
  return `${BASE_URL}/${languageId}_${resourceId}/raw/branch/master`;
}

/**
 * Fetches and parses the manifest.yaml from a DCS repository.
 * @param {string} languageId
 * @param {string} resourceId
 * @returns {Promise<Object>}
 */
export async function fetchManifest(languageId, resourceId) {
  const url = `${rawBaseUrl(languageId, resourceId)}/manifest.yaml`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to load manifest for ${languageId}_${resourceId}: ${res.statusText}`
    );
  }
  const text = await res.text();
  return load(text);
}

/**
 * Fetches a file (e.g., TSV, USFM) from a DCS repository and returns its text content.
 * @param {string} languageId
 * @param {string} resourceId
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function fetchResourceFile(languageId, resourceId, filePath) {
  const url = `${rawBaseUrl(languageId, resourceId)}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to load ${filePath} for ${languageId}_${resourceId}: ${res.statusText}`
    );
  }
  return res.text();
}

export default { fetchManifest, fetchResourceFile };