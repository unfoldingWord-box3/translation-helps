
# 📚 Resource Integration Overview

This document summarizes how different unfoldingWord resources are integrated and linked within the app. Each resource type follows its own conventions for alignment, formatting, and contextual relevance.

## 🔗 Common Resource Types and Their Linkage Strategies

| Resource | Format | Linkage Method | Notes |
|----------|--------|----------------|-------|
| **ULT/UST** | USFM, USX | Verse-based | Source text and translation; often used as anchor for other resources |
| **tN** (Translation Notes) | TSV | Verse-based | Notes with optional references to tW, tA |
| **tQ** (Translation Questions) | TSV | Verse-based | Each question maps to a verse |
| **tW** (Translation Words) | Markdown | Linked via TWL | Articles explaining theological or key terms |
| **TWL** (Translation Words Links) | TSV | Verse-based links to tW articles | Replaces former in-text tagging in Greek |
| **tA** (Translation Academy) | Markdown | Topic-based | Articles referenced from tN or externally |
| **UGNT/UHB** | USFM, TSV | Aligned text + strongs/lemma tags | Original language texts |
| **OBS** (Open Bible Stories) | Markdown + TSV | Frame-based | Uses its own TWL variant (`obs-twl`) and tN/tQ variants |

## 🧱 Structural Notes

- All resources conform to the **Resource Container (RC)** specification and live in Git repositories (e.g., DCS).
- Each RC contains a `manifest.yaml` for metadata and a directory of content (TSV, USFM, Markdown, etc.)
- `rc://` URIs are used to cross-reference resources (e.g., `rc://en/tw/dict/bible/kt/faith`).

## 🔁 Common Use Patterns

- tN often links to tW and tA articles.
- TWL provides links between a verse and the relevant tW article(s).
- ULT/UGNT are used as anchors for alignment and referencing.

## 🧪 Testing Considerations

For each resource type:
- Validate format parsing (TSV, USFM, MD)
- Check verse/frame alignment
- Confirm cross-resource references resolve

## 🔚 Summary

Resources follow standardized formats and alignment strategies. TWL is the newest addition, replacing Greek-tagged inline linking for tW articles and improving clarity and portability across languages.
