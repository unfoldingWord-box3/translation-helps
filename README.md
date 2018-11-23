
# unfoldingWord translationHelps Viewer
[https://unfoldingword.bible/content/]

## Purpose
All resources are currently integrated into the unfoldingWord Scripture drafting tool, translationStudio to aid in the translation process. Resources are also being integrated into the unfoldingWord Scripture checking tool, translationCore to aid in the checking process.

Outside of using tS, tC or downloading PDF files of the resources, there is a need to consume these resources in a similar Just in Time method that displays relevant information in an efficient manner.

### Use cases
- Drafting using tools other than tS including Autographa and even basic pen and paper.
- Community checking printed copies of translations where tC is not practical.
- Bible study and reference when drafting and checking are not taking place.

## Resource Integration
 Resources are categorized by two categories. This is not an exclusive list of unfoldingWord resources.

### Scope
 Most of these resources are in progress. The New Testament resources in English are complete enough to use.

### Scripture
- ULT - unfoldingWord Literal Text
- UST - unfoldingWord Simplified Text
- UGNT - unfoldingWord Greek New Testament

### translationHelps
- tN - translationNotes
- tA - translationAcademy
- tQ - translationQuestions
- UGL - unfoldingWord Greek Lexicon

## Technical Overview
All resources are managed in Git repositories on (DCS)[https://git.door43.org]. Each repository is organized in a Resource Container Spec (RC). Each RC has a manifest that contains metadata about included resource projects. Each project has metadata including information such as the book id and relative paths to included project files. By fetching the project file it can then be parsed by file type. Each resource project's data can then be integrated based on the relevant alignments and tags that link the resources together.

### Relationships
The relationships between the resources can be used to display relevant information where appropriate.
- ULT - (primary text organized by reference)
  - tN (tagged to UGNT and ULT by reference and quote)
    - tA (links in tN)
  - UGNT (aligned in ULT)
    - tW (tagged in UGNT)
  - tQ (tagged by reference)
  - UST - (secondary text organized by reference)
