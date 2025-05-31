<!--
Resolved: false
status: failed
priority: high
created: 2025-05-30
tags: [vite, bug, yaml, esm, package-resolution]
-->

# 🚫 Issue: Missing "./browser" Export Specifier in `yaml` Package

**Description**  
Running `vite` fails with the following error:

```
error when starting dev server:
Error: Missing "./browser" specifier in "yaml" package
    at e (...)
    ...
Command failed with exit code 1.
```

This indicates that the `yaml` package does not define a `"browser"` export field in its `package.json`, which is now required by modern bundlers like Vite that rely on `"exports"` maps for module resolution.

---

## ✅ Acceptance Criteria

- [ ] Inspect `node_modules/yaml/package.json` and confirm whether `"exports"` includes a `"./browser"` entry
- [ ] If missing, try one of the following:

  - Downgrade to a known working version:
    ```bash
    yarn add yaml@2.3.1
    ```
  - Replace `yaml` with an alternative: `yaml-es`, `js-yaml`
  - Modify import statements to avoid browser-specific paths

- [ ] As a temporary workaround, patch `vite.config.ts` to alias `yaml` to a working fallback:

  ```ts
  resolve: {
    alias: {
      yaml: "yaml/browser/index.js";
    }
  }
  ```

- [ ] If using `pnpm` or PnP mode, disable strict ESM or use `vite-plugin-pkg-config`

---

## 🧠 Notes

This is a Vite + ESM compatibility issue. Once resolved:

- Validate YAML `manifest.yaml` parsing functionality
- Add a troubleshooting entry in `codex.md` for modern ESM/bundler incompatibilities
- Consider submitting a PR or issue upstream to the `yaml` package maintainers if it's unresolved

---

## 🔗 References

- https://vitejs.dev/guide/troubleshooting.html
- https://github.com/eemeli/yaml/issues (upstream issues)

---

## Error

$ vite
error when starting dev server:
Error: Missing "./browser/index.js" specifier in "yaml" package
at e (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:21446:25)
at n (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:21446:627)
at o (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:21446:1297)
at resolveExportsOrImports (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:28747:20)
at resolveDeepImport (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:28766:31)
at tryNodeResolve (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:28454:20)
at Context.resolveId (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:28213:28)
at Object.resolveId (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:44280:64)
at Context.resolve (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:43996:39)
at Context.resolveId (file:///Volumes/GithubProjects/translation-helps/node_modules/vite/dist/node/chunks/dep-827b23df.js:224:25)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
