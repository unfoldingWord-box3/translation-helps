/**
 * dcsClient.js
 * Unified fetch layer for DCS repositories.
 */

import * as yaml from "js-yaml";

const BASE_URL = "https://git.door43.org";

/**
 * Constructs the raw branch URL for a given organization, language and resource.
 * @param {string} organization
 * @param {string} languageId
 * @param {string} resourceId
 * @returns {string}
 */
function rawBaseUrl(organization, languageId, resourceId) {
  return `${BASE_URL}/${organization}/${languageId}_${resourceId}/raw/branch/master`;
}

/**
 * Fetches and parses the manifest.yaml from a DCS repository.
 * @param {string} languageId
 * @param {string} resourceId
 * @param {string} organization
 * @returns {Promise<Object>}
 */
export async function fetchManifest(languageId, resourceId, organization = "unfoldingWord") {
  const url = `${rawBaseUrl(organization, languageId, resourceId)}/manifest.yaml`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load manifest for ${languageId}_${resourceId}: ${res.statusText}`);
  }
  const text = await res.text();
  return yaml.load(text);
}

/**
 * Fetches a file (e.g., TSV, USFM) from a DCS repository and returns its text content.
 * @param {string} languageId
 * @param {string} resourceId
 * @param {string} filePath
 * @param {string} organization
 * @returns {Promise<string>}
 */
export async function fetchResourceFile(
  languageId,
  resourceId,
  filePath,
  organization = "unfoldingWord"
) {
  const url = `${rawBaseUrl(organization, languageId, resourceId)}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to load ${filePath} for ${languageId}_${resourceId}: ${res.statusText}`
    );
  }
  return res.text();
}

export default { fetchManifest, fetchResourceFile };
