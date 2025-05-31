#!/usr/bin/env node

/**
 * codex-version-guard.js
 * Ensure all dependencies in package.json were released on or before cutoff date (2024-05-31)
 */
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const path = require('path');

const cutoffDate = new Date('2024-05-31T23:59:59Z');
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

console.log(`Codex Version Guard: Ensuring packages are released on or before ${cutoffDate.toISOString().slice(0,10)}.\n`);

let warnings = 0;

for (const [name, versionRange] of Object.entries(deps)) {
  const version = versionRange.replace(/^[~^><=]*/, '');
  try {
    const output = execSync(`npm show ${name} time --json`, { stdio: ['pipe', 'pipe', 'ignore'] });
    const times = JSON.parse(output.toString());
    const releaseDateStr = times[version];
    if (!releaseDateStr) {
      console.warn(`  ⚠️ Could not find release date for ${name}@${version}.`);
      warnings++;
      continue;
    }
    const releaseDate = new Date(releaseDateStr);
    if (releaseDate > cutoffDate) {
      console.warn(`  ⚠️ ${name}@${version} was released on ${releaseDate.toISOString().slice(0,10)}, which is after the cutoff.`);
      warnings++;
    } else {
      console.log(`  ✔️ ${name}@${version} (${releaseDate.toISOString().slice(0,10)})`);
    }
  } catch (err) {
    console.error(`  ⚠️ Failed to fetch release times for ${name}: ${err.message}`);
    warnings++;
  }
}

if (warnings > 0) {
  console.error(`\n⚠️ Found ${warnings} packages violating Codex version guard!`);
  process.exit(1);
}

console.log(`\nAll packages comply with Codex version guard.`);