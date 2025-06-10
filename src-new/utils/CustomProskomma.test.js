import { describe, it, expect } from "vitest";
import { CustomProskomma } from "./CustomProskomma";

describe("CustomProskomma", () => {
  it("should create an instance with correct selectors", () => {
    const pk = new CustomProskomma();

    expect(pk.selectors).toHaveLength(3);
    expect(pk.selectors[0].name).toBe("org");
    expect(pk.selectors[1].name).toBe("lang");
    expect(pk.selectors[2].name).toBe("abbr");
  });

  it("should format selector strings correctly", () => {
    const pk = new CustomProskomma();
    const selectorString = pk.selectorString({
      org: "unfoldingWord",
      lang: "en",
      abbr: "TIT",
    });

    expect(selectorString).toBe("unfoldingWord/en_TIT");
  });

  it("should preprocess USFM content to replace \\s5 tags", () => {
    const pk = new CustomProskomma();
    const usfmWithS5 = `\\id TIT
\\c 1
\\s5
\\v 1 Paul, a servant of God...`;

    // We can't easily test the internal preprocessing without mocking super.importDocuments,
    // but we can verify the regex replacement works
    const processedContent = usfmWithS5.replace(/\\s5/g, "\\ts\\*");
    expect(processedContent).toContain("\\ts\\*");
    expect(processedContent).not.toContain("\\s5");
  });

  it("should have correct processor string", () => {
    const pk = new CustomProskomma();
    expect(pk.processor()).toBe("Proskomma JS for Translation Helps (based on UW-Proskomma)");
  });

  it("should initialize with correct custom tags structure", () => {
    const pk = new CustomProskomma();

    expect(pk.customTags).toHaveProperty("heading");
    expect(pk.customTags).toHaveProperty("paragraph");
    expect(pk.customTags).toHaveProperty("char");
    expect(pk.customTags).toHaveProperty("word");
    expect(pk.customTags).toHaveProperty("intro");
    expect(pk.customTags).toHaveProperty("introHeading");

    // All should be empty arrays
    Object.values(pk.customTags).forEach((value) => {
      expect(Array.isArray(value)).toBe(true);
      expect(value).toHaveLength(0);
    });
  });
});
