import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNotesForVerse, getNotesForBook } from "./tnService";
import * as dcsClient from "./dcsClient";

beforeEach(() => {
  vi.spyOn(dcsClient, "fetchResourceFile");
  vi.spyOn(dcsClient, "fetchManifest");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("tnService", () => {
  const mockManifest = {
    projects: [
      {
        identifier: "gen",
        path: "./tn_GEN.tsv",
        title: "Genesis",
      },
      {
        identifier: "exo",
        path: "./tn_EXO.tsv",
        title: "Exodus",
      },
    ],
  };

  const sampleTsv = [
    "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote",
    "1:1\tgen01-01-01\ttranslate-names\t\tGod\t1\tThis refers to the one true God.",
    "1:2\tgen01-02-01\tfigs-metaphor\tPsa 104:30\tthe Spirit of God\t1\tThis is a metaphor describing God's power.",
    "2:1\tgen02-01-01\ttranslate-ordinal\t\tthe seventh day\t1\tThis refers to the completion of creation.",
  ].join("\n");

  describe("getNotesForVerse", () => {
    it("fetches manifest and filters notes correctly", async () => {
      dcsClient.fetchManifest.mockResolvedValue(mockManifest);
      dcsClient.fetchResourceFile.mockResolvedValue(sampleTsv);

      const notes = await getNotesForVerse("gen", "1", "1");

      expect(dcsClient.fetchManifest).toHaveBeenCalledWith("en", "tn");
      expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith("en", "tn", "tn_GEN.tsv");
      expect(notes).toHaveLength(1);
      expect(notes[0]).toEqual({
        id: 0,
        text: "This refers to the one true God.",
        quote: "God",
        occurrence: "1",
        tags: "translate-names",
        supportReference: "",
        reference: "1:1",
      });
    });

    it("handles gen/chapter/verse reference format", async () => {
      const tsvWithFullRef = [
        "Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote",
        "gen/1/1\tgen01-01-01\ttranslate-names\t\tGod\t1\tThis refers to the one true God.",
        "gen/1/2\tgen01-02-01\tfigs-metaphor\tPsa 104:30\tthe Spirit of God\t1\tThis is a metaphor.",
      ].join("\n");

      dcsClient.fetchManifest.mockResolvedValue(mockManifest);
      dcsClient.fetchResourceFile.mockResolvedValue(tsvWithFullRef);

      const notes = await getNotesForVerse("gen", "1", "1");

      expect(notes).toHaveLength(1);
      expect(notes[0].reference).toBe("gen/1/1");
    });

    it("returns empty array when no notes found", async () => {
      dcsClient.fetchManifest.mockResolvedValue(mockManifest);
      dcsClient.fetchResourceFile.mockResolvedValue(sampleTsv);

      const notes = await getNotesForVerse("gen", "99", "99");

      expect(notes).toHaveLength(0);
    });

    it("throws error when book not found in manifest", async () => {
      dcsClient.fetchManifest.mockResolvedValue(mockManifest);

      await expect(getNotesForVerse("nonexistent", "1", "1")).rejects.toThrow(
        "Book nonexistent not found in tN manifest"
      );
    });

    it("handles missing optional fields gracefully", async () => {
      const minimalTsv = ["Reference\tNote", "1:1\tSimple note"].join("\n");

      dcsClient.fetchManifest.mockResolvedValue(mockManifest);
      dcsClient.fetchResourceFile.mockResolvedValue(minimalTsv);

      const notes = await getNotesForVerse("gen", "1", "1");

      expect(notes).toHaveLength(1);
      expect(notes[0]).toEqual({
        id: 0,
        text: "Simple note",
        quote: "",
        occurrence: "1",
        tags: "",
        supportReference: "",
        reference: "1:1",
      });
    });
  });

  describe("getNotesForBook", () => {
    it("returns all notes for a book with parsed chapter/verse", async () => {
      dcsClient.fetchManifest.mockResolvedValue(mockManifest);
      dcsClient.fetchResourceFile.mockResolvedValue(sampleTsv);

      const notes = await getNotesForBook("gen");

      expect(dcsClient.fetchManifest).toHaveBeenCalledWith("en", "tn");
      expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith("en", "tn", "tn_GEN.tsv");
      expect(notes).toHaveLength(3);

      // Check that chapter and verse are parsed correctly
      expect(notes[0]).toMatchObject({
        chapter: "1",
        verse: "1",
        reference: "1:1",
      });
      expect(notes[1]).toMatchObject({
        chapter: "1",
        verse: "2",
        reference: "1:2",
      });
    });

    it("throws error when book not found in manifest", async () => {
      dcsClient.fetchManifest.mockResolvedValue(mockManifest);

      await expect(getNotesForBook("nonexistent")).rejects.toThrow(
        "Book nonexistent not found in tN manifest"
      );
    });
  });
});
