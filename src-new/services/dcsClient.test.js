import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchManifest, fetchResourceFile } from "./dcsClient";
import * as yaml from "js-yaml";

// Mock global fetch
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(yaml, "load");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("dcsClient", () => {
  it("fetches and parses manifest.yaml correctly", async () => {
    const sampleYaml = "key: value";
    const expectedResult = { key: "value" };

    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(sampleYaml),
    };

    fetch.mockResolvedValue(mockResponse);
    yaml.load.mockReturnValue(expectedResult);

    const manifest = await fetchManifest("en", "tn");

    expect(fetch).toHaveBeenCalledWith(
      "https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/manifest.yaml"
    );
    expect(yaml.load).toHaveBeenCalledWith(sampleYaml);
    expect(manifest).toEqual(expectedResult);
  });

  it("throws when manifest fetch fails", async () => {
    const mockResponse = {
      ok: false,
      statusText: "Not Found",
    };

    fetch.mockResolvedValue(mockResponse);

    await expect(fetchManifest("en", "tn")).rejects.toThrow(
      "Failed to load manifest for en_tn: Not Found"
    );
  });

  it("fetches resource file correctly", async () => {
    const expectedData = "file content";
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(expectedData),
    };

    fetch.mockResolvedValue(mockResponse);

    const data = await fetchResourceFile("en", "tn", "gen.tsv");

    expect(fetch).toHaveBeenCalledWith(
      "https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/gen.tsv"
    );
    expect(data).toBe(expectedData);
  });

  it("throws when resource file fetch fails", async () => {
    const mockResponse = {
      ok: false,
      statusText: "Error",
    };

    fetch.mockResolvedValue(mockResponse);

    await expect(fetchResourceFile("en", "tn", "gen.tsv")).rejects.toThrow(
      "Failed to load gen.tsv for en_tn: Error"
    );
  });
});
