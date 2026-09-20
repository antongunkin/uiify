/* Bundle and minify the CSS entries for this package's .browserslistrc. */
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { bundle, browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = browserslistToTargets(browserslist(undefined, { path: root }));

/** @type {Array<{ entry: string, out: string }>} */
const entries = [
  { entry: "src/styles/index.css", out: "dist/styles/index.css" },
  { entry: "src/styles/tokens.css", out: "dist/styles/tokens.css" },
  { entry: "src/styles/reset.css", out: "dist/styles/reset.css" },
];

await mkdir(resolve(root, "dist/styles"), { recursive: true });

for (const { entry, out } of entries) {
  const { code } = bundle({
    filename: resolve(root, entry),
    targets,
    minify: true,
    drafts: { customMedia: true },
  });
  await writeFile(resolve(root, out), code);
}

// Tailwind's @theme syntax is consumer input and must remain raw.
await copyFile(resolve(root, "src/styles/tailwind.css"), resolve(root, "dist/styles/tailwind.css"));

console.log(
  "@gunkin/uiify/styles built (lightningcss → dist/styles/{index,tokens,reset}.css; raw → dist/styles/tailwind.css)",
);
