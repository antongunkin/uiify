/**
 * update-size-limits.mjs
 *
 * Measures every `.size-limit.json` entry (needs a built `dist/`), then
 *   - rewrites each entry's `limit` to the measured gzip size plus 2 % headroom
 *     (rounded up to 10 B), so `size-limit` fails as soon as a component grows
 *     past what was last recorded, and
 *   - writes the measured sizes to `size-report.json`, which the docs site
 *     shows as the component's real bundle size.
 *
 * Usage: `npm run size:update` (run by `npm run checks:fix`).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HEADROOM = 1.02;
const ROUND_TO = 10;

const packageDir = fileURLToPath(new URL("..", import.meta.url));
const configPath = `${packageDir}.size-limit.json`;
const reportPath = `${packageDir}size-report.json`;

// size-limit exits 1 when an entry is over its limit but still prints the JSON.
const run = spawnSync("npx", ["size-limit", "--json"], {
  cwd: packageDir,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});

let measured;
try {
  measured = JSON.parse(run.stdout);
} catch {
  console.error(run.stderr || run.stdout || "size-limit produced no output");
  process.exit(1);
}

const sizes = new Map(measured.map((entry) => [entry.name, entry.size]));
const config = JSON.parse(readFileSync(configPath, "utf8"));

for (const entry of config) {
  const size = sizes.get(entry.name);
  if (size === undefined) throw new Error(`size-limit did not measure "${entry.name}"`);
  entry.limit = `${Math.ceil((size * HEADROOM) / ROUND_TO) * ROUND_TO} B`;
}

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
writeFileSync(
  reportPath,
  `${JSON.stringify(Object.fromEntries(config.map((entry) => [entry.name, sizes.get(entry.name)])), null, 2)}\n`,
);
console.log(`Updated ${config.length} size limits and size-report.json`);
