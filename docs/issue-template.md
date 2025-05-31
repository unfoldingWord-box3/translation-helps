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

```

## Moving Issues

When an issue is resolved:

1. Move from `docs/issues/open/` to `docs/issues/closed/`
2. Update metadata:
   - `status: closed`
   - `Resolved: true`
   - Add `resolved: YYYY-MM-DD` field
```
