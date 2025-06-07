# AGENTS.md

name: translationHelps Viewer
description: An application for viewing unfoldingWord Bible translation resources including Translation Notes (tN), Translation Questions (tQ), Translation Words (tW), and the new Translation Words Links (TWL) format.

## 🧭 Project Structure

- `src-new/`: Main React app source (clean-slate rewrite)
- `src/`: Legacy source (can be removed)
- `docs/`: Developer documentation (architecture, TWL, resource guides, DCS)
- `public/`: Static assets
- `package.json`: Project config and dependencies
- `CHANGELOG.md`: Documentation of all changes following semantic versioning

## 📘 Key Docs (in ./docs)

- `ARCHITECTURE.md`: High-level component and data layer overview
- `app-overview.md`: Defines application purpose, target audience, and supported resources
- `ui-map.md`: UI layout, screen regions, and component interactions
- `lifecycle.md`: Startup process, context flow, resource fetching, and offline behavior
- `component-map.md`: Key React components with paths and descriptions
- `rewrite/plan.md`: Clean-slate rewrite roadmap and architecture plan
- `rewrite/decision-log.md`: Architectural decision log for the rewrite execution
- `rewrite/module-checklist.md`: Module checklist for the clean-slate rewrite
- `rewrite/dependency-review.md`: Audit of legacy dependencies and proposed modern dependency list
- `TWL_Integration_Documentation.md`: Guide for the new TWL resource
- `Translation_Notes_Implementation.md`: Implementation details for Translation Notes (tN)
- `DCS_Integration_Documentation.md`: Explains access patterns to Door43 Content Service
- `Resource_Integration_Overview.md`: Outlines all supported translation resource types
- `simple-text-editor-rcl-integration.md`: **CRITICAL** - simple-text-editor-rcl API usage and NO USFM PREPROCESSING requirement
- `codex-version-guard.md`: Policy and CLI guard for verifying package versions against Codex model cutoff date
- `changelog-process.md`: Guidelines for maintaining CHANGELOG.md

## 🛠️ Development Environment

- React + Material UI
- Capacitor (for native builds)
- Loads data from Door43 Git-based repos
- Uses TSV and Markdown content structures

## 🧠 Assistant Tips (for AGENTS)

- Be concise but context-aware
- Prioritize docs in `/docs` for any questions about resource format or architecture
- If editing React components, respect separation of concerns (UI, state, data-fetching)
- TWL is a new addition that replaces Greek inline tags—point devs to TWL documentation
- UI/UX tests have been added for core components using Vitest and React Testing Library (see `src-new/__tests__/`).
- For Dev Server issues (blank page), refer to the "Debugging Dev Server Blank Screen" section in README.md.
- The app now uses `js-yaml` for YAML parsing (`load()` API); remove any legacy `yaml` aliasing in `vite.config.ts` and add `js-yaml` to `optimizeDeps.include` if needed.
- **⚠️ CRITICAL: NEVER preprocess USFM when using simple-text-editor-rcl** - See `docs/simple-text-editor-rcl-integration.md` for details. Raw USFM must be passed directly to UsfmEditor component.

## 🔄 GitFlow Branch Strategy

This project follows the GitFlow branching model:

### Core Branches

- **main**: Production-ready code. Only merged from release branches or hotfix branches.
- **develop**: Integration branch for ongoing development. Features are merged here.

### Supporting Branches

- **feature/[feature-name]**: Created from `develop` for new features. Merge back to `develop` when complete.
- **release/[version]**: Created from `develop` when preparing a release. Merge to both `main` and `develop` when ready.
- **hotfix/[fix-name]**: Created from `main` for critical production fixes. Merge to both `main` and `develop`.
- **bugfix/[bug-name]**: Created from `develop` for non-critical bugs. Merge to `develop`.

### Branch Naming Conventions

- Feature branches: `feature/[issue-id]-short-description`
- Bugfix branches: `bugfix/[issue-id]-short-description`
- Hotfix branches: `hotfix/[issue-id]-short-description`
- Release branches: `release/v[semver]`

Example: `feature/42-add-translation-notes-filtering`

### Branch Lifecycle

1. Create branch from appropriate base (develop for features/bugfixes, main for hotfixes)
2. Develop and commit changes
3. Create pull request to target branch (develop or main)
4. Review, test, and approve
5. Merge and delete feature branch
6. Update CHANGELOG.md according to the changes

## 📝 GitHub Issue Management

This project uses GitHub Issues for tracking development tasks, bugs, and features. The GitHub MCP integration enables LLMs to manage issues directly through the GitHub API.

### Issue Creation Process

1. Use the GitHub MCP tool `create_issue` to create a new issue:

   ```
   owner: [repository-owner]
   repo: [repository-name]
   title: [Issue title]
   body: [Detailed issue description with acceptance criteria]
   labels: [array of labels like "bug", "enhancement", "documentation"]
   assignees: [array of GitHub usernames]
   ```

2. Issue Format

   - Title: Clear, descriptive title
   - Body:
     - **Issue Description**: Brief overview of the problem/requirement
     - **Detailed Information**: Problem details, root cause analysis, investigation steps
     - **Acceptance Criteria**: Checkbox list of requirements using `- [ ] Requirement`
     - **Test Instructions**: How to verify the fix
     - **Additional Context**: Any other relevant information

3. Metadata Requirements
   - Labels should include:
     - Type: `bug`, `feature`, `enhancement`, `documentation`, etc.
     - Priority: `priority:low`, `priority:medium`, `priority:high`, `priority:critical`
     - Scope: `ui`, `service`, `test`, etc.
     - Versioning impact: `semver:patch`, `semver:minor`, `semver:major`
     - Changelog category: `changelog:added`, `changelog:changed`, `changelog:fixed`, etc.

### Issue Resolution Workflow

AGENTIC AI should:

1. Use `list_issues` to get open issues for the repository
2. For each issue:

   - Use `get_issue` to fetch issue details
   - Create an appropriate branch using `create_branch` following GitFlow naming conventions
   - Locate and update relevant code files (typically under `src-new/`)
   - Implement the requested behavior
   - Implement, review and update unit tests
   - Confirm visually through Playwright test that implementation works
   - Update documentation as described
   - **Review and align documentation** with code changes
   - Update `package.json` version using `update_version` according to semver impact
   - Update `CHANGELOG.md` with an entry using `update_changelog`
   - Close the issue using `close_issue` with a detailed comment summarizing the changes

3. Don't EVER claim that implementation is complete or close the issue when you have not done the following:
   - Updated the tests to cover changes
   - Run the tests and all the tests pass
   - Have visual confirmation through Playwright and/or
   - Manually clicking around to confirm

### Issue Completion Checklist

Before closing an issue:

1. All acceptance criteria must be met
2. Tests must be passing
3. Documentation must be updated
4. CHANGELOG.md must be updated
5. Version in package.json must be bumped appropriately
6. Any related PRs must be linked in the issue comment

## 📊 Semantic Versioning (SemVer)

The project follows semantic versioning (MAJOR.MINOR.PATCH):

- **PATCH (0.0.X)**: Bug fixes, documentation updates, test improvements, refactoring with no API changes
- **MINOR (0.X.0)**: New features, new components, non-breaking API additions
- **MAJOR (X.0.0)**: Breaking changes, API removals, incompatible behavior changes

### Version Bumping Rules

- **Patch** (x.y.Z+1): Use for `semver:patch` labeled issues
- **Minor** (x.Y+1.0): Use for `semver:minor` labeled issues
- **Major** (X+1.0.0): Use for `semver:major` labeled issues

The version should be updated in:

- `package.json`: `"version": "X.Y.Z"`

## 📝 CHANGELOG.md Process

The project maintains a comprehensive CHANGELOG.md file documenting all changes:

### Structure

```markdown
# Changelog

## [NEW_VERSION] - YYYY-MM-DD

### [CHANGELOG_CATEGORY]

- [CHANGELOG_DESCRIPTION with details]
  - ✅ Implementation detail 1
  - ✅ Implementation detail 2
  - ...
```

### Categories

- **Added**: New features or capabilities
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed in future versions
- **Removed**: Features removed in this version
- **Fixed**: Bug fixes
- **Security**: Security-related changes

### Best Practices

1. Add entries at the top of the file (newest first)
2. Include detailed implementation bullets beneath main entries
3. Mark completed items with ✅
4. Group entries by category (Added, Changed, Fixed, etc.)
5. Include technical details and user experience benefits where relevant
6. Link to relevant GitHub issues where appropriate

### Changelog Entry Example

```markdown
## [0.11.0] - 2025-06-06

### Added

- **Milestone Marker Rendering with Mode-Aware Decorators - COMPLETED**
  - ✅ Implemented comprehensive milestone marker rendering system
  - ✅ Created `src-new/utils/milestoneDecorators.js` with factory function
  - ✅ Added support for all USFM milestone marker types
```

## 🚧 Workflow Summary for LLMs

1. **Issue Analysis**

   - Use GitHub MCP tools to list and examine open issues
   - Check related documentation and existing implementation
   - Identify affected files and dependencies

2. **Branch Creation** (via GitHub API)

   - Base branch selection (develop or main) based on issue type
   - Branch naming following GitFlow conventions

3. **Implementation**

   - Develop the solution following established patterns
   - Write tests to validate functionality
   - Update documentation to reflect changes

4. **Testing**

   - Run unit tests to verify implementation
   - Visual confirmation with Playwright tests
   - Manual verification as needed

5. **Documentation**

   - Update project documentation
   - Ensure all documentation is in sync with code changes

6. **Version and Changelog Updates**

   - Increment version number in package.json according to semver impact
   - Add detailed changelog entry with implementation bullets
   - Follow established changelog format and standards

7. **Issue Closure**
   - Update the GitHub issue with a detailed completion summary
   - Reference all relevant commits and PRs
   - Close the issue through GitHub API
   - Verify all acceptance criteria have been met
