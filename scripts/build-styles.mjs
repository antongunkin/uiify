/* Compile recipe styles into dist/styles/<style>.css, per-recipe files, a scoped variant and the
 * committed src/styles/generated copies. Runs before scripts/build.mjs bundles src/styles/index.css. */
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const load = (path) => import(pathToFileURL(resolve(root, path)).href);
const { compileStyle } = await load("dist/styles/build/compile.js");
const styles = [(await load("dist/styles/uiify/index.js")).uiify];

for (const style of styles) {
  const compiled = await compileStyle(style, {
    tailwindEntry: resolve(root, "src/styles/build/entry.css"),
    effectsCss: await readFile(resolve(root, `src/styles/${style.name}/effects.css`), "utf8"),
  });
  await mkdir(resolve(root, `dist/styles/${style.name}`), { recursive: true });
  await writeFile(resolve(root, `dist/styles/${style.name}.css`), compiled.all);
  await writeFile(resolve(root, `dist/styles/${style.name}.scoped.css`), compiled.scoped);
  for (const [name, css] of compiled.perRecipe) {
    await writeFile(resolve(root, `dist/styles/${style.name}/${name}.css`), css);
  }
  // Committed copies for the native entry (src/styles/index.css) and the workspace site, which
  // load the compiled style without running Tailwind with the adapter; a test keeps them fresh.
  await mkdir(resolve(root, "src/styles/generated"), { recursive: true });
  await writeFile(resolve(root, `src/styles/generated/${style.name}.css`), compiled.all);
  await writeFile(resolve(root, "src/styles/generated/tailwind-theme.css"), compiled.theme);
}

// The adapter and themes are consumer Tailwind input: copied raw, at the same relative paths.
await copyFile(resolve(root, "src/styles/tailwind.css"), resolve(root, "dist/styles/tailwind.css"));
await mkdir(resolve(root, "dist/styles/themes"), { recursive: true });
for (const file of await readdir(resolve(root, "src/styles/themes"))) {
  if (file.endsWith(".css")) {
    await copyFile(
      resolve(root, `src/styles/themes/${file}`),
      resolve(root, `dist/styles/themes/${file}`),
    );
  }
}

console.log(`@gunkin/uiify recipe styles built (${styles.map((style) => style.name).join(", ")})`);
