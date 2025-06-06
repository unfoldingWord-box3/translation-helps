/**
 * usfmProcessor.js
 * Utilities for processing USFM content, especially alignment data
 */

/**
 * Extracts readable text from USFM alignment markers
 * Converts alignment data like:
 * \zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\*\w Paul|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
 * To: Paul
 */
export function extractReadableText(usfm) {
  if (!usfm) return "";

  console.log("🔧 Processing USFM alignment data for readable text extraction");

  let processed = usfm;

  // Extract text from \w word markers within alignment blocks
  // Pattern: \w text|attributes\w*
  processed = processed.replace(/\\w\s+([^|]+)\|[^\\]*\\w\*/g, "$1");

  // Remove alignment start markers
  // Pattern: \zaln-s |attributes\*
  processed = processed.replace(/\\zaln-s[^\\]*\\\*/g, "");

  // Remove alignment end markers
  // Pattern: \zaln-e\*
  processed = processed.replace(/\\zaln-e\\\*/g, "");

  // Clean up extra spaces and newlines
  processed = processed.replace(/\s+/g, " ");
  processed = processed.replace(/\n\s*\n/g, "\n");

  // Clean up spacing around punctuation
  processed = processed.replace(/\s+([,.;:!?])/g, "$1");
  processed = processed.replace(/([,.;:!?])\s+/g, "$1 ");

  console.log("✅ USFM processing complete");
  console.log("📄 First 500 chars after processing:", processed.substring(0, 500));

  return processed.trim();
}

/**
 * Alternative extraction method focusing specifically on word content
 */
export function extractWordsOnly(usfm) {
  if (!usfm) return "";

  console.log("🔧 Alternative processing: extracting words only");

  const lines = usfm.split("\n");
  const processedLines = [];

  for (const line of lines) {
    let processedLine = line;

    // Extract all \w word content
    const wordMatches = line.matchAll(/\\w\s+([^|\\]+)/g);
    const words = [];

    for (const match of wordMatches) {
      words.push(match[1].trim());
    }

    if (words.length > 0) {
      // Replace the entire alignment section with just the words
      processedLine = line.replace(/\\zaln-s[^\\]*\\zaln-e\\\*/g, () => {
        return words.join(" ");
      });

      // If that didn't work, try a more aggressive approach
      if (processedLine === line && line.includes("\\w ")) {
        // Find verse marker and preserve it
        const verseMatch = line.match(/(\\v\s+\d+\s*)/);
        const verseMarker = verseMatch ? verseMatch[1] : "";

        processedLine = verseMarker + words.join(" ");
      }
    }

    processedLines.push(processedLine);
  }

  const result = processedLines.join("\n");
  console.log("📄 Alternative processing result (first 500 chars):", result.substring(0, 500));

  return result;
}

/**
 * Simple approach: just extract text between \w and \w* markers
 */
export function simpleWordExtraction(usfm) {
  if (!usfm) return "";

  console.log("🔧 Simple word extraction");

  // Keep verse and chapter markers intact
  let processed = usfm;

  // Extract just the word content, preserving verse structure
  processed = processed.replace(/\\w\s+([^|\\]+)[^\\]*\\w\*/g, "$1");

  // Remove zaln markers completely
  processed = processed.replace(/\\zaln-[se][^\\]*\\\*/g, "");

  // Clean up multiple spaces
  processed = processed.replace(/\s+/g, " ");

  // Clean up verse formatting
  processed = processed.replace(/(\\v\s+\d+)\s+/g, "$1 ");

  console.log("📄 Simple extraction result (first 500 chars):", processed.substring(0, 500));

  return processed;
}
