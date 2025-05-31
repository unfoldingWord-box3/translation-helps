
# 🧠 Codex Compatibility: Package Version Guard

This document defines how Codex CLI agents should handle and verify dependency versions for compatibility with the `o4-mini-high` model.

---

## 🎯 Objective

Ensure that all installed packages are compatible with Codex CLI's model training knowledge cutoff (**May 31, 2024**) to prevent hallucinations or broken agent output.

---

## ✅ Verification Workflow

1. **For each dependency in `package.json`:**
   - Query its release timeline using `npm show <pkg> time`
   - Identify the latest version released **before or on May 31, 2024**
   - Cross-check that version is pinned in `package.json`

2. **If any version is newer:**
   - Flag it with a warning or abort the workflow
   - Optionally, recommend a downgrade to the latest supported pre-cutoff version

---

## 🛠 Agent Instructions

- Use `semver` comparison when parsing `npm` version info
- Respect existing ranges but warn on minor/patch upgrades past the cutoff
- Always log a Codex compatibility report

---

## 📌 Reference

> Codex Model: `o4-mini-high`  
> Training Cutoff: **May 31, 2024**

---

## Example

```json
"yaml": "^2.3.1"
```

→ Latest known safe: `2.3.1` (March 2024) ✅  
→ Avoid: `2.4.0` (May 2025) ❌

