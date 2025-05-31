# Changelog and Semantic Versioning Process

This document outlines the standardized process for maintaining the changelog and versioning when completing issues.

## Overview

Every completed issue must result in:

1. An appropriate changelog entry
2. A semantic version bump in package.json
3. Proper issue resolution metadata

This ensures consistent release documentation and version history.

## Semantic Versioning (SemVer)

We follow [Semantic Versioning 2.0.0](https://semver.org/) with the format `MAJOR.MINOR.PATCH`:

### Version Components

- **MAJOR** (X.y.z): Breaking changes that are incompatible with previous versions
- **MINOR** (x.Y.z): New functionality added in a backwards-compatible manner
- **PATCH** (x.y.Z): Backwards-compatible bug fixes, documentation updates, or internal improvements

### Decision Matrix

| Change Type          | Examples                                                             | SemVer Impact |
| -------------------- | -------------------------------------------------------------------- | ------------- |
| Bug fixes            | Test fixes, error handling, performance bugs                         | PATCH         |
| Documentation        | README updates, code comments, guides                                | PATCH         |
| Internal refactoring | Code cleanup, reorganization without API changes                     | PATCH         |
| Test improvements    | New tests, test infrastructure improvements                          | PATCH         |
| New features         | New components, new functionality, new APIs                          | MINOR         |
| Feature enhancements | Extending existing features without breaking changes                 | MINOR         |
| Breaking changes     | API changes, removed features, incompatible updates                  | MAJOR         |
| Security fixes       | Security vulnerabilities (may be PATCH or MINOR depending on impact) | VARIES        |

## Changelog Categories

Use these standardized categories in changelog entries:

### Added

- New features
- New functionality
- New components or modules

### Changed

- Changes to existing functionality
- Improvements to existing features
- Updates to existing behavior

### Deprecated

- Features marked for removal in future versions
- APIs that will be removed

### Removed

- Features removed in this version
- Deleted functionality

### Fixed

- Bug fixes
- Error corrections
- Issue resolutions

### Security

- Security-related changes
- Vulnerability fixes
- Security improvements

### Closed

- Issue resolution tracking
- Primarily for process/meta issues

## Issue Metadata Requirements

Every issue must include these metadata fields:

```html
<!--
status: open
Resolved: false
priority: [low|medium|high|critical]
created: YYYY-MM-DD
tags: [tag1, tag2, tag3]
changelog_category: [added|changed|deprecated|removed|fixed|security|closed]
semver_impact: [patch|minor|major]
changelog_description: "Brief description for changelog entry"
-->
```

### Field Guidelines

- **changelog_category**: Choose the most appropriate category from the list above
- **semver_impact**: Use the decision matrix to determine patch/minor/major
- **changelog_description**: Write a clear, concise description that will be used verbatim in the changelog

## Completion Process

### Step-by-Step Workflow

1. **Complete the work** described in the issue
2. **Run tests** to ensure functionality works correctly
3. **Update CHANGELOG.md** with new entry
4. **Bump package.json version** according to semver impact
5. **Update issue metadata** with resolution information
6. **Move issue file** from open to closed directory

### Detailed Steps

#### 1. Update CHANGELOG.md

Add a new entry at the top of the changelog using this format:

```markdown
## [NEW_VERSION] - YYYY-MM-DD

### [CHANGELOG_CATEGORY]

- [CHANGELOG_DESCRIPTION]
```

**Example:**

```markdown
## [0.2.21] - 2025-05-31

### Fixed

- Fix DCS client test failures by unmocking module in test suite
```

#### 2. Bump Package Version

Update the version in `package.json`:

```json
{
  "version": "NEW_VERSION"
}
```

Use the semver impact to determine the new version:

- **patch**: `0.2.20` → `0.2.21`
- **minor**: `0.2.20` → `0.3.0`
- **major**: `0.2.20` → `1.0.0`

#### 3. Update Issue Metadata

Change the issue metadata to:

```html
<!--
status: closed
Resolved: true
priority: [original priority]
created: [original date]
resolved: YYYY-MM-DD
tags: [original tags]
changelog_category: [original category]
semver_impact: [original impact]
changelog_description: "[original description]"
-->
```

#### 4. Move Issue File

```bash
mv docs/issues/open/issue-name.md docs/issues/closed/issue-name.md
```

## Quality Guidelines

### Changelog Descriptions

- Use imperative mood: "Fix bug" not "Fixed bug"
- Be specific but concise
- Focus on user/developer impact
- Reference issue numbers when helpful

**Good Examples:**

- "Fix DCS client test failures by unmocking module in test suite"
- "Add Translation Notes parsing with TSV support"
- "Update issue template with changelog and semver metadata fields"

**Poor Examples:**

- "Bug fix" (too vague)
- "Fixed the thing that was broken" (not specific)
- "Made some changes to improve stuff" (unclear impact)

### Version Bumping

- **Be conservative**: When in doubt, choose a smaller impact
- **Consider user impact**: Focus on how changes affect end users
- **Document breaking changes**: Always clearly document any breaking changes
- **Batch related changes**: Group related issues into single version releases when possible

## Examples

### Example 1: Bug Fix (Patch)

**Issue Metadata:**

```html
changelog_category: fixed semver_impact: patch changelog_description: "Fix DCS client test failures
by unmocking module in test suite"
```

**Actions:**

- Version: `0.2.20` → `0.2.21`
- Changelog:

  ```markdown
  ## [0.2.21] - 2025-05-31

  ### Fixed

  - Fix DCS client test failures by unmocking module in test suite
  ```

### Example 2: New Feature (Minor)

**Issue Metadata:**

```html
changelog_category: added semver_impact: minor changelog_description: "Add Translation Words Links
(TWL) integration with interactive word highlighting"
```

**Actions:**

- Version: `0.2.20` → `0.3.0`
- Changelog:

  ```markdown
  ## [0.3.0] - 2025-05-31

  ### Added

  - Add Translation Words Links (TWL) integration with interactive word highlighting
  ```

### Example 3: Breaking Change (Major)

**Issue Metadata:**

```html
changelog_category: changed semver_impact: major changelog_description: "Restructure DCS client API
with new authentication requirements"
```

**Actions:**

- Version: `0.2.20` → `1.0.0`
- Changelog:

  ```markdown
  ## [1.0.0] - 2025-05-31

  ### Changed

  - Restructure DCS client API with new authentication requirements
  ```

## Validation

### Pre-Completion Checklist

- [ ] Issue metadata includes all required fields
- [ ] Changelog category matches the type of change
- [ ] Semver impact aligns with the scope of changes
- [ ] Changelog description is clear and specific
- [ ] Tests pass and functionality works as expected

### Post-Completion Verification

- [ ] Changelog entry added in correct format
- [ ] Package version bumped correctly
- [ ] Issue metadata updated with resolution info
- [ ] Issue file moved to closed directory
- [ ] No duplicate version numbers in changelog
- [ ] Changelog entries are in chronological order (newest first)

## Tools and Automation

### Future Enhancements

The following tools could be developed to support this process:

1. **Validation Scripts**

   - Verify issue metadata completeness
   - Check changelog format consistency
   - Validate version numbering

2. **Automation Tools**

   - Auto-generate changelog entries from issue metadata
   - Suggest version bumps based on issue types
   - Automated issue completion workflow

3. **Git Hooks**
   - Pre-commit validation of changelog updates
   - Ensure version bumps accompany changelog changes

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Related Documentation

- `docs/issue-template.md` - Issue creation guidelines
- `CHANGELOG.md` - Project changelog
- `package.json` - Version tracking
