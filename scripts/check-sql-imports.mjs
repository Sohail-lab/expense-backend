#!/usr/bin/env node
/**
 * check-sql-imports.mjs
 * Scans all .ts source files for .sql imports and verifies each file exists.
 * Run before build/dev to catch missing SQL files early.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Recursively collect all .ts files (excluding node_modules, dist)
function collectTsFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      collectTsFiles(full, results);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}

// Match: import ... from "...something.sql"
const SQL_IMPORT_RE = /from\s+["']([^"']+\.sql)["']/g;

let hasError = false;

const tsFiles = collectTsFiles(ROOT);

for (const tsFile of tsFiles) {
  const source = fs.readFileSync(tsFile, "utf8");
  let match;
  SQL_IMPORT_RE.lastIndex = 0;

  while ((match = SQL_IMPORT_RE.exec(source)) !== null) {
    const importPath = match[1];
    const resolvedPath = path.resolve(path.dirname(tsFile), importPath);

    if (!fs.existsSync(resolvedPath)) {
      const relativeTs = path.relative(ROOT, tsFile);
      const relativeSql = path.relative(ROOT, resolvedPath);
      console.error(
        `\x1b[31m[SQL CHECK] Missing SQL file!\x1b[0m\n` +
        `  Imported in : ${relativeTs}\n` +
        `  Missing file: ${relativeSql}\n`
      );
      hasError = true;
    }
  }
}

if (hasError) {
  console.error(
    "\x1b[31m[SQL CHECK] Build aborted: one or more imported .sql files do not exist.\x1b[0m"
  );
  process.exit(1);
} else {
  console.log("\x1b[32m[SQL CHECK] All .sql imports resolved successfully.\x1b[0m");
}
