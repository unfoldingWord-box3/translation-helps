
<!--
Resolved: true
status: closed
priority: high
created: 2025-05-30
tags: [vite, bug, optimize-deps, 504, yaml]
-->

# 🧨 Issue: 504 Error on `yaml.js` During MainView Launch

**Description**  
When launching the app via `yarn dev`, Vite throws a **504 Gateway Timeout** for the file `yaml.js` located in the optimized Vite dependency cache:

```
[Error] Failed to load resource: the server responded with a status of 504 (Outdated Optimize Dep)
http://localhost:5173/node_modules/.vite/deps/yaml.js?v=2fc06aa6
```

This error occurs when navigating to or loading the `MainView` route, likely due to a stale or corrupted optimization cache.

---

## ✅ Acceptance Criteria

- [ ] Identify the usage of the `yaml` package (likely in `manifest.yaml` parsing)
- [ ] Remove and regenerate Vite’s dependency optimization cache:
  ```bash
  rm -rf node_modules/.vite
  yarn dev
  ```
- [ ] If error persists, explicitly pre-bundle or exclude `yaml` in `vite.config.js`:
  ```ts
  optimizeDeps: {
    include: ['yaml']
  }
  ```
- [ ] Confirm that `yaml` is listed in `package.json` and not relying on a transitive dep
- [ ] Add README.md note to clear `.vite/` cache if this happens again

---

## 🔍 Context

This typically occurs when:
- A module in `node_modules/.vite/deps` becomes stale or improperly optimized
- The Vite cache includes a broken hash or version mismatch
- A package is updated without restarting Vite's optimization

---

## 🧠 Notes

Once resolved, validate that:
- The error no longer appears on `MainView` load
- `manifest.yaml`-related operations still work as expected

Add steps to `codex.md` or `README.md` so future agents/devs know how to resolve this quickly.
