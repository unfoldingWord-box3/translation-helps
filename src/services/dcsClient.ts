import { parse } from 'yaml';

const BASE_URL = 'https://git.door43.org/unfoldingWord';

/**
 * Constructs the raw branch URL for a given language and resource.
 * @param languageId Language identifier (e.g., 'en').
 * @param resourceId Resource identifier (e.g., 'tn', 'tq').
 * @returns Base URL string for raw content.
 */
function rawBaseUrl(languageId: string, resourceId: string): string {
  return `${BASE_URL}/${languageId}_${resourceId}/raw/branch/master`;
}

/**
 * Fetches and parses the manifest.yaml from a DCS repository.
 * @param languageId Language identifier (e.g., 'en').
 * @param resourceId Resource identifier (e.g., 'tn', 'tq').
 * @returns Parsed manifest object.
 */
export async function fetchManifest(
  languageId: string,
  resourceId: string
): Promise<unknown> {
  const url = `${rawBaseUrl(languageId, resourceId)}/manifest.yaml`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to load manifest for ${languageId}_${resourceId}: ${res.statusText}`
    );
  }
  const text = await res.text();
  return parse(text);
}

/**
 * Fetches a file (e.g., TSV, USFM, Markdown) from a DCS repository and returns its text content.
 * @param languageId Language identifier (e.g., 'en').
 * @param resourceId Resource identifier (e.g., 'tn', 'tq').
 * @param filePath Path to the file within the repository (e.g., 'gen.tsv').
 * @returns Raw file text content.
 */
export async function fetchResourceFile(
  languageId: string,
  resourceId: string,
  filePath: string
): Promise<string> {
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