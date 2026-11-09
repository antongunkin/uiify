/**
 * Project CSS rules for /uiify: the project styles UIify through the public shadcn/Tailwind theme
 * tokens (`--primary`, `--radius`) and `className`, never through UIify's internal classes,
 * attributes or variables. A small scanner, not a CSS parser: consumer projects have no postcss.
 * Copied into the skill as `scripts/project-css.mjs`; `screens.mjs` imports `UIIFY_VAR` from it.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";

/** UIify-internal custom properties; `--my-control-x` is the project's own. */
export const UIIFY_VAR =
  /(?<![\w-])--(?:uiify-[\w-]*|control-[\w-]*|spacing-control-[\w-]*|radius-control[\w-]*|text-control[\w-]*|color-primary-fill[\w-]*)/;
/** `.uiify-*` classes and `[data-ui-*]` attributes; shadcn's `[data-slot]`, `[data-variant]`… are public. */
export const UIIFY_SELECTOR = /(?<!\\)\.uiify-[\w-]+|\[\s*data-ui-[\w-]+/;
/** `[class*="uiify-"]` and the like: the value is in a string, so it is matched on the unmasked text. */
const CLASS_ATTRIBUTE = /\[\s*class\s*[~|^$*]?=\s*["']?[^\]"']*uiify-[^\]]*\]/i;
export const PUBLIC_PATH =
  "style the instance with className or a prop, or change a shadcn/Tailwind theme token (--primary, --radius, …) after asking";

/** Folders the CSS search never enters (and any dot folder). */
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out"]);

/**
 * `code`: comments blanked. `masked`: comments, string contents and unquoted `url(...)` blanked.
 * Both keep every offset and newline of `source`, so positions map back to it.
 */
function mask(source) {
  let code = "";
  let masked = "";
  const blank = (text) => text.replace(/[^\n]/g, " ");
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      const stop = end === -1 ? source.length : end + 2;
      const comment = blank(source.slice(index, stop));
      code += comment;
      masked += comment;
      index = stop;
    } else if (char === '"' || char === "'") {
      let stop = index + 1;
      while (stop < source.length && source[stop] !== char && source[stop] !== "\n") stop += source[stop] === "\\" ? 2 : 1;
      stop = Math.min(stop + 1, source.length);
      const text = source.slice(index, stop);
      code += text;
      masked += char + blank(text.slice(1, -1)) + (text.length > 1 ? text.at(-1) : "");
      index = stop;
    } else if (char === "\\") {
      const text = source.slice(index, index + 2);
      code += text;
      masked += text;
      index += 2;
    } else if ((char === "u" || char === "U") && /^url\(\s*[^\s"')]/i.test(source.slice(index, index + 32)) && !/[\w-]/.test(source[index - 1] ?? "")) {
      const end = source.indexOf(")", index);
      const stop = end === -1 ? source.length : end + 1;
      const text = source.slice(index, stop);
      code += text;
      masked += `url(${blank(text.slice(4, -1))})`;
      index = stop;
    } else {
      code += char;
      masked += char;
      index += 1;
    }
  }
  return { code, masked };
}

/**
 * Statements of a stylesheet, flat, in source order: rules (`selector`), at-rules (`name`, `prelude`)
 * and declarations (`property`, `value`). Texts have comments removed; `start` is the offset of the
 * first character. Braces inside strings, comments and `url()` do not open blocks.
 */
function parse(source) {
  const { code, masked } = mask(source);
  const nodes = [];
  let depth = 0;
  let from = 0;
  const piece = (to, block) => {
    const text = masked.slice(from, to);
    const lead = text.length - text.trimStart().length;
    const start = from + lead;
    const end = from + text.trimEnd().length;
    if (start >= end) return;
    const raw = code.slice(start, end);
    const bare = masked.slice(start, end);
    if (bare.startsWith("@")) {
      const name = /^@([\w-]+)/.exec(bare)?.[1] ?? "";
      nodes.push({ type: "atrule", name, prelude: raw.slice(name.length + 1).trim(), start, raw, bare });
    } else if (block) {
      nodes.push({ type: "rule", selector: raw, start, raw, bare });
    } else if (depth > 0 && bare.includes(":")) {
      const colon = bare.indexOf(":");
      nodes.push({ type: "decl", property: raw.slice(0, colon).trim(), value: raw.slice(colon + 1).trim(), start, raw, bare });
    }
  };
  for (let index = 0; index < masked.length; index += 1) {
    const char = masked[index];
    if (char === "\\") index += 1;
    else if (char === "{") {
      piece(index, true);
      depth += 1;
      from = index + 1;
    } else if (char === ";" || char === "}") {
      piece(index, false);
      if (char === "}" && depth > 0) depth -= 1;
      from = index + 1;
    }
  }
  piece(masked.length, false);
  return { nodes, lineStarts: lineStarts(source) };
}

function lineStarts(source) {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) if (source[index] === "\n") starts.push(index + 1);
  return starts;
}

function position(starts, offset) {
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (starts[mid] <= offset) low = mid;
    else high = mid - 1;
  }
  return { line: low + 1, column: offset - starts[low] + 1 };
}

/**
 * The statements of `source` with 1-based line and column.
 * @param {string} source
 * @returns {{ type: "rule" | "atrule" | "decl"; line: number; column: number; selector?: string; name?: string; prelude?: string; property?: string; value?: string }[]}
 */
export function scanCss(source) {
  const { nodes, lineStarts: starts } = parse(source);
  return nodes.map((node) => {
    const { type, selector, name, prelude, property, value } = node;
    const fields = Object.entries({ selector, name, prelude, property, value }).filter(([, text]) => text !== undefined);
    return { type, ...Object.fromEntries(fields), ...position(starts, node.start) };
  });
}

/**
 * `css-uiify-selector` and `css-uiify-var` findings for one stylesheet, in the shape of `screenFindings`.
 * @param {string} file
 * @param {string} source
 * @returns {{ file: string; line: number; column: number; rule: string; message: string }[]}
 */
export function cssFindings(file, source) {
  const { nodes, lineStarts: starts } = parse(source);
  const findings = [];
  const report = (offset, rule, message) => findings.push({ file, ...position(starts, offset), rule, message });
  for (const node of nodes) {
    // A selector, or an at-rule prelude that holds one (`@custom-variant x (&:is(.uiify-button))`).
    if (node.type !== "decl" && node.name !== "import") {
      const match = UIIFY_SELECTOR.exec(node.bare) ?? CLASS_ATTRIBUTE.exec(node.raw);
      if (match) {
        report(node.start + match.index, "css-uiify-selector", `"${match[0]}" targets UIify internals: ${PUBLIC_PATH}`);
      }
    }
    if (node.type !== "rule") {
      const match = UIIFY_VAR.exec(node.bare);
      if (match) report(node.start + match.index, "css-uiify-var", `"${match[0]}" is a UIify-internal variable: ${PUBLIC_PATH}`);
    }
  }
  return findings;
}

/** Package CSS (UIify's own included) is never the project's. */
const isPackagePath = (path) => path.split(sep).includes("node_modules");

/**
 * The project's stylesheets: components.json `tailwind.css` and the relative files it `@import`s;
 * without it, every `.css` under `root` outside `node_modules`, build output and dot folders.
 * @param {string} root
 * @returns {string[]} absolute paths, sorted
 */
export function projectCssFiles(root) {
  const entry = componentsCss(root);
  if (entry) {
    const found = new Set();
    const visit = (path) => {
      if (found.has(path) || isPackagePath(path) || !existsSync(path)) return;
      found.add(path);
      for (const node of parse(readFileSync(path, "utf8")).nodes) {
        if (node.type !== "atrule" || node.name !== "import") continue;
        const spec = /^(?:url\(\s*)?(["']?)([^"')\s]+)\1/i.exec(node.prelude)?.[2];
        if (spec && /^\.\.?\//.test(spec)) visit(resolve(dirname(path), spec));
      }
    };
    visit(entry);
    return [...found].sort();
  }
  const files = [];
  const walk = (dir) => {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (item.isDirectory() && !SKIP_DIRS.has(item.name) && !item.name.startsWith(".")) walk(join(dir, item.name));
      else if (item.isFile() && item.name.endsWith(".css")) files.push(join(dir, item.name));
    }
  };
  walk(root);
  return files.sort();
}

/** components.json `tailwind.css`, when it names a file that exists. */
function componentsCss(root) {
  try {
    const css = JSON.parse(readFileSync(join(root, "components.json"), "utf8"))?.tailwind?.css;
    const path = typeof css === "string" ? resolve(root, css) : undefined;
    return path && existsSync(path) && !isPackagePath(path) ? path : undefined;
  } catch {
    return undefined;
  }
}
