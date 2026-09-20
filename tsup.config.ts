import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { relative, resolve } from "node:path";
import { promisify } from "node:util";
import { defineConfig } from "tsup";
import ts from "typescript";

const execFileAsync = promisify(execFile);
const packageRoot = import.meta.dirname;
const isWatch = process.argv.includes("--watch");
const require = createRequire(import.meta.url);

function entries(): Record<string, string> {
  const configPath = resolve(packageRoot, "tsconfig.build.json");
  const loaded = ts.readConfigFile(configPath, ts.sys.readFile);
  if (loaded.error)
    throw new Error(ts.flattenDiagnosticMessageText(loaded.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(loaded.config, ts.sys, packageRoot);
  if (parsed.errors.length) {
    throw new Error(
      parsed.errors
        .map((error) => ts.flattenDiagnosticMessageText(error.messageText, "\n"))
        .join("\n"),
    );
  }
  return {
    ...Object.fromEntries(
      parsed.fileNames
        .filter((file) => !file.endsWith(".d.ts"))
        .map((file) => [
          relative(resolve(packageRoot, "src"), file)
            .replaceAll("\\", "/")
            .replace(/\.tsx?$/, ""),
          file,
        ]),
    ),
    "components/behavior": resolve(packageRoot, "src/components/behavior.css"),
  };
}

export default defineConfig({
  entry: entries(),
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  bundle: false,
  splitting: false,
  treeshake: false,
  dts: false,
  sourcemap: true,
  clean: !isWatch,
  // No banner and no duplicate flattened input entries.
  ...(isWatch ? { watch: ["src", "tsconfig.build.json", "scripts"] } : {}),
  esbuildOptions(options) {
    // tsup normalizes entry globs only once; refresh entries on watch rebuild.
    options.entryPoints = entries();
    options.platform = "neutral";
  },
  async onSuccess() {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [resolve(packageRoot, "scripts/finish-build.mjs"), require.resolve("typescript/bin/tsc")],
      { cwd: packageRoot, maxBuffer: 10 * 1024 * 1024 },
    );
    process.stdout.write(stdout);
    process.stderr.write(stderr);
  },
});
