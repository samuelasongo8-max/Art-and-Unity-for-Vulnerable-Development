#!/usr/bin/env node
/**
 * i18n:scan — dev-only audit of src/ for English text that never made it into
 * a t() call.
 *
 * It reports:
 *   1. JSX text nodes that are plain words (not {expression}, not a tag);
 *   2. string literals in alt / placeholder / title / aria-label / label /
 *      value attributes;
 *   3. string literals inside a data array or object at module scope.
 *
 * It is a helper for a human, not a build gate: it prints findings and always
 * exits 0 unless --strict is passed. Run with:  npm run i18n:scan
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(here, "..", "src");
const strict = process.argv.includes("--strict");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "assets" && path.basename(dir) === "src" ? [] : walk(full);
    }
    return /\.(jsx|tsx|js|ts)$/.test(entry.name) ? [full] : [];
  });

/* Text that is intentionally not translated: brand / platform names, the
   acronym, the word AUVD, e-mail addresses, URLs and file paths. */
const ALLOW = [
  /^AUVD$/i,
  /^(Facebook|LinkedIn|Instagram|YouTube|TikTok|X|Twitter|WhatsApp|Google|Map)$/i,
  /^\|$/,
  /^[→›‹←»«»|,\/….\-–—:;!?()[\]&+#*%\d\s]+$/,
  /\{/,
  /^(True|False)$/,
];

const isAllowed = (text) =>
  !text || ALLOW.some((re) => re.test(text.trim())) || !/[a-zA-Z]/.test(text);

const findings = [];

const record = (file, line, kind, text) => {
  if (isAllowed(text)) return;
  findings.push({ file: path.relative(process.cwd(), file), line, kind, text: text.trim() });
};

for (const file of walk(srcDir)) {
  const source = fs.readFileSync(file, "utf8");
  const lines = source.split("\n");

  lines.forEach((line, i) => {
    // 1. JSX text nodes: >word word< or >word word{ — not attributes, not {expr}.
    const jsxText = line.match(/>([^<>{}\n]*[a-zA-Z][^<>{}\n]*)</g) ?? [];
    for (const node of jsxText) {
      record(file, i + 1, "jsx-text", node.replace(/^>|<$/g, ""));
    }

    // 2. String values on user-visible attributes.
    const attr = line.match(
      /\b(alt|placeholder|title|aria-label|label|value|content)\s*=\s*"([^"]*)"/g
    );
    for (const match of attr ?? []) {
      const value = match.match(/"([^"]*)"/)[1];
      record(file, i + 1, "attribute", value);
    }

    // 3. Bare English string literals inside module-level data structures.
    if (/^\s*(const|let|var)\s+\w+\s*=\s*[\[{]/.test(line) || /^\s*["'][A-Z]/.test(line)) {
      const literal = line.match(/:\s*"([^"]{12,})"/) ?? line.match(/^\s*"([^"]{12,})"/);
      if (literal) record(file, i + 1, "data-literal", literal[1]);
    }
  });
}

if (findings.length === 0) {
  console.log("✔ i18n:scan — no untranslated English text found in src/.");
  process.exit(0);
}

console.log(`i18n:scan — ${findings.length} possible untranslated string(s):\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}  [${f.kind}]  ${JSON.stringify(f.text)}`);
}
console.log(
  "\nReview each one. If it is deliberately English (a proper noun, brand or\n" +
    "data value), leave it and add it to the ALLOW list in this script."
);

process.exit(strict ? 1 : 0);
