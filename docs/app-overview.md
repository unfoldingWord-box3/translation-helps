
# 📘 App Overview: translationHelps Viewer

## 🎯 Purpose

The **translationHelps Viewer** is a browser-based application that helps Bible translators and checkers engage with multiple types of translation resources, aligned by verse and passage.

It is built to support **just-in-time access** to reference materials for any given book, chapter, and verse — including:

- Translation Notes (tN)
- Translation Questions (tQ)
- Translation Words (tW)
- Translation Words Links (TWL)
- Scripture texts (ULT, UST, UGNT, UHB)
- Open Bible Stories (OBS)

The app aligns these helps contextually to aid understanding, clarify ambiguous verses, and provide theological, grammatical, and stylistic explanations for Bible translators.

## 👥 Target Audience

- Field translators (solo or team-based)
- Translation consultants and trainers
- Community checkers and reviewers
- Tool developers and UI integrators

## 🧩 Key Features

- Book/Chapter/Verse navigation
- Multi-tab layout for notes, words, questions, and scripture
- Door43 Git-based resource access (TSV/Markdown/USFM)
- Auto-fetching of manifests and resources
- Just-in-time rendering of helps
- Preview and linking of `rc://` resources (e.g., to tW or tA)
- Support for OBS-based translation workflows

## ⚙️ Supported Resource Types

| Resource | Format | Description |
|----------|--------|-------------|
| tN       | `.tsv` | Commentary notes on verses |
| tQ       | `.tsv` | Comprehension questions |
| tW       | Markdown | Articles for key theological words |
| TWL      | `.tsv` | Links from verses to tW articles |
| ULT/UST/UGNT/UHB | USFM | Source and translation texts |
| OBS      | Markdown + `.tsv` | Frame-based stories with linked helps |
