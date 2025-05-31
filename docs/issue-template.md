# Issue Template

When creating new issues in `docs/issues/open/`, follow this standardized format:

## Metadata Header

Every issue must begin with HTML comment metadata containing:

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

### Field Descriptions

- **status**: Always `open` for new issues
- **Resolved**: Always `false` for new issues
- **priority**:
  - `low` - Nice to have, not blocking
  - `medium` - Important but not urgent
  - `high` - Important and should be addressed soon
  - `critical` - Blocking or breaking functionality
- **created**: Date in YYYY-MM-DD format
- **tags**: Array of relevant tags (see common tags below)
- **changelog_category**: Type of change for changelog entry
  - `added` - New features, new functionality
  - `changed` - Changes to existing functionality
  - `deprecated` - Features marked for removal in future versions
  - `removed` - Features removed in this version
  - `fixed` - Bug fixes
  - `security` - Security-related changes
  - `closed` - Issue resolution (for tracking purposes)
- **semver_impact**: Semantic versioning impact level
  - `patch` - Bug fixes, documentation updates, test improvements, internal refactoring
  - `minor` - New features, new components, non-breaking API additions
  - `major` - Breaking changes, API removals, incompatible changes
- **changelog_description**: Brief description for the changelog entry (exact text to be used)

### Common Tags

- `testing` - Test-related issues
- `bug` - Bug fixes
- `feature` - New features
- `refactor` - Code refactoring
- `documentation` - Documentation updates
- `performance` - Performance improvements
- `migration` - Migration tasks
- `integration` - Integration work
- `ui` - User interface changes
- `service` - Service layer changes
- `dcs-client` - DCS client related
- `fetch` - Fetch/network related
- `mocking` - Test mocking related
- `twl` - Translation Words Links
- `tn` - Translation Notes
- `tq` - Translation Questions
- `tw` - Translation Words

## Issue Structure

After the metadata, use this structure:

1. **Title** - Clear, descriptive title starting with `#`
2. **Issue Description** - Brief overview of the problem/requirement
3. **Detailed Sections** as appropriate:
   - Problem details
   - Root cause analysis
   - Investigation steps
   - Files affected
   - Related issues
4. **Acceptance Criteria** - Checkbox list of requirements
5. **Test Commands** - How to verify the fix
6. **Additional Context** - Any other relevant information

## Example

````markdown
<!--
status: open
Resolved: false
priority: high
created: 2025-05-31
tags: [testing, bug, service]
-->

# Fix Service X Test Failures

## Issue Description

Brief description of the issue...

## Acceptance Criteria

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Test Command

```bash
npm test src/service-x.test.js
```
````

````

## Issue Completion Process

When resolving an issue, follow this standardized completion checklist:

### Completion Checklist

- [ ] **Update CHANGELOG.md** with entry based on `changelog_category` and `changelog_description`
- [ ] **Bump package.json version** according to `semver_impact` (patch/minor/major)
- [ ] **Update issue metadata**:
  - `status: closed`
  - `Resolved: true`
  - Add `resolved: YYYY-MM-DD` field
- [ ] **Move issue file** from `docs/issues/open/` to `docs/issues/closed/`
- [ ] **Verify tests pass** and functionality works as expected

### Version Bumping Rules

- **Patch** (x.y.Z+1): Use for `semver_impact: patch`
  - Bug fixes, documentation updates, test improvements, internal refactoring
- **Minor** (x.Y+1.0): Use for `semver_impact: minor`
  - New features, new components, non-breaking API additions
- **Major** (X+1.0.0): Use for `semver_impact: major`
  - Breaking changes, API removals, incompatible changes

### Changelog Entry Format

Add entries to CHANGELOG.md following this format:

```markdown
## [NEW_VERSION] - YYYY-MM-DD

### [CHANGELOG_CATEGORY]

- [CHANGELOG_DESCRIPTION]
````

### Example Completion

For an issue with:

- `changelog_category: fixed`
- `semver_impact: patch`
- `changelog_description: "Fix DCS client test failures by unmocking module"`
- Current version: `0.2.20`

**Steps:**

1. Bump version to `0.2.21` in package.json
2. Add changelog entry:

   ```markdown
   ## [0.2.21] - 2025-05-31

   ### Fixed

   - Fix DCS client test failures by unmocking module
   ```

3. Update issue metadata and move to closed

```

```
