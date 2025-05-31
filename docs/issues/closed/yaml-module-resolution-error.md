
<!--
Resolved: true
status: closed
priority: high
created: 2025-05-30
tags: [yaml, vite, esbuild, build-failure, module-resolution]
-->

# 🧨 Issue: Build Fails Due to Missing Internal Modules in `yaml` Package

**Description**  
When running the Vite development server or building the project, the build fails with multiple module resolution errors from the `yaml` package:

```
ERROR: Could not resolve "./doc/Document.js"
ERROR: Could not resolve "../doc/directives.js"
...
```

These errors originate from `node_modules/yaml/browser/dist/...` and indicate that internal submodules (e.g., `doc/Document.js`) used in the browser build are either missing or improperly referenced.

---

## ✅ Acceptance Criteria

- [ ] Confirm that the correct `yaml` package is installed via `yarn list yaml`
- [ ] Try upgrading to the latest `yaml` version:
  ```bash
  yarn add yaml@latest
  ```
- [ ] If issue persists, explicitly import only the top-level `yaml` entry points (avoid direct file access to `dist/browser`)
- [ ] If necessary, switch to `yaml/browser/index.js` or use a different YAML parser (`yaml-js`, `js-yaml`, or `yaml-es`)
- [ ] Update any service or helper that calls `yaml.load()` to use the updated import method
- [ ] Rebuild Vite’s optimize cache:
  ```bash
  rm -rf node_modules/.vite
  yarn dev
  ```

---

## 🔍 Additional Investigation

- Check for broken symbolic links or corruption in `node_modules/yaml/browser/dist/doc`
- Verify that the package lockfile is consistent (`yarn.lock`)
- Consider pinning to a working version of `yaml` that is not using ESM-only or browser-specific internal files

---

## 🧠 Notes

This may be a regression or improper ESM configuration within `yaml@latest`. Once resolved:
- Document workaround in `codex.md` or `README.md`
- Consider writing a test for `manifest.yaml` parsing that confirms proper decoding of valid YAML input

Failure to resolve this will block the rendering and resource loading for any YAML-based files (e.g., resource manifests).
