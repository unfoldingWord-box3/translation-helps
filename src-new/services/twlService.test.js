import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getLinksForVerse, clearCache } from "./twlService";
import * as dcsClient from "./dcsClient";

// Mock the dcsClient
vi.mock("./dcsClient");

beforeEach(() => {
  clearCache();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

const sampleTsv = [
  "Reference\tTWLink",
  "1:1\trc://en/tw/dict/bible/kt/create",
  "1:2\trc://en/tw/dict/bible/kt/begin",
].join("\n");

const mockTwlManifest = {
  projects: [
    {
      identifier: "gen",
      path: "./gen.tsv",
      title: "Genesis",
    },
    {
      identifier: "exo",
      path: "./exo.tsv",
      title: "Exodus",
    },
  ],
};

describe("getLinksForVerse", () => {
  it("fetches and filters links correctly", async () => {
    dcsClient.fetchResourceFile.mockResolvedValue(sampleTsv);

    const links = await getLinksForVerse("gen", 1, 1, mockTwlManifest, "unfoldingWord", "en");

    expect(links).toEqual(["rc://en/tw/dict/bible/kt/create"]);
    expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith(
      "en",
      "twl",
      "gen.tsv",
      "unfoldingWord"
    );
  });

  it("returns empty array for no matches", async () => {
    dcsClient.fetchResourceFile.mockResolvedValue(sampleTsv);

    const links = await getLinksForVerse("gen", 2, 1, mockTwlManifest, "unfoldingWord", "en");

    expect(links).toEqual([]);
  });

  it("throws when response not ok", async () => {
    dcsClient.fetchResourceFile.mockRejectedValue(
      new Error("Failed to load TWL file for gen: Not Found")
    );

    await expect(
      getLinksForVerse("gen", 1, 1, mockTwlManifest, "unfoldingWord", "en")
    ).rejects.toThrow(/Failed to load TWL file for gen: Not Found/);
  });
});
