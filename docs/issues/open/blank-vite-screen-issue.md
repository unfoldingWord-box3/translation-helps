
<!--
status: open
priority: high
created: 2025-05-30
tags: [vite, bug, dev-server, blank-screen]
-->

# 🧱 Issue: Blank Page When Accessing Vite Dev Server

**Description**  
After running `yarn dev`, Vite reports that the development server is running on `http://localhost:5173`, but the page appears blank when visited in the browser. All tests pass and the app builds without errors, but no visible content renders in the UI.

---

## ✅ Acceptance Criteria

- [ ] Confirm `index.html` contains a valid `<div id="root">`
- [ ] Ensure `main.jsx` (or `main.tsx`) properly renders `<App />` to `#root` using `ReactDOM.createRoot`
- [ ] Check browser console for any runtime JavaScript errors
- [ ] Ensure routing (e.g. React Router) includes a valid `<Route path="/" element={<MainView />}>`
- [ ] Add fallback rendering or error boundary to catch render-time exceptions
- [ ] Update `README.md` with debug instructions for local dev if needed

---

## 🔍 Investigation Tips

- Use browser DevTools console to check for:
  - JavaScript import or module errors
  - DOM mismatch or mount failure
- Try adding a static element (e.g. `<h1>Hello</h1>`) in `App.jsx` to confirm it's rendering
- If using React Router, add a catch-all fallback route (`*`) temporarily
- Confirm `vite.config.js` is using correct `base` and `root` settings

---

## 🧠 Notes

This is a high-priority dev-blocking issue. Fixing it will unblock UI verification and allow proper local development. Once resolved, verify that `src-new/` launches a working page under Vite.

If the problem is resolved via documentation or error boundaries, update `codex.md` to capture debugging workflow.
