
<!--
Resolved: true
status: closed
priority: medium
created: 2025-05-30
tags: [codex, compatibility, dependencies, tooling]
-->

# 📦 Issue: Enforce Codex CLI Compatibility by Verifying Package Versions

**Description**  
To ensure that `codex-mini-latest` and `o4-mini-high` generate correct, context-aware code, we need to verify that all installed `npm` packages were released **before May 31, 2024**—the training cutoff date for these models.

---

## ✅ Acceptance Criteria

- [ ] Create a `docs/codex-version-guard.md` file describing this policy
- [ ] Add a CLI command or Codex CLI plugin step to:
  - Check `package.json` versions
  - Compare with release dates using `npm show <pkg> time`
  - Log warnings for versions released **after 2024-05-31**
- [ ] Integrate the check into CI (optional)
- [ ] Update `codex.md` to reference this version guard

---

## 🧠 Notes

This ensures Codex agents can reason confidently about packages and prevents reliance on post-training API surfaces or unstable semantics.
