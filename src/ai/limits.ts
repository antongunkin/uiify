import { breadcrumbAt } from "./issues.js";
import type { UiValidationIssue } from "./types.js";

/** Deepest node nesting a document may have (the root is depth 1). */
export const MAX_DEPTH = 32;
/** Most nodes a document may have; text children count as nodes. */
export const MAX_NODES = 2000;
/** Longest string (text, prop value or property name) a document may contain. */
export const MAX_STRING_LENGTH = 10_000;

const MAX_ISSUES = 50;

interface Frame {
  readonly value: unknown;
  readonly path: string;
  readonly depth: number;
  /** True for a node, and for the `children` array whose items are nodes. */
  readonly node: boolean;
}

function escapePointer(key: string): string {
  return key.replaceAll("~", "~0").replaceAll("/", "~1");
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

/**
 * Checks size limits and shared or circular references with an iterative walk, so a hostile
 * document cannot exhaust the call stack. It runs before the schema because the schema is
 * recursive. It walks own enumerable properties and never calls a function value; reading a
 * property does run its getter, as the schema check after it does too, so validate plain data
 * (`JSON.parse` output). `loadDocument` validates a `structuredClone`, whose getters ran once.
 */
export function checkLimits(value: unknown): UiValidationIssue[] {
  const issues: UiValidationIssue[] = [];
  const add = (path: string, code: string, message: string): boolean => {
    issues.push({ path, code, breadcrumb: breadcrumbAt(value, path), message });
    return issues.length >= MAX_ISSUES;
  };

  const visited = new Set<object>();
  const stack: Frame[] = [];
  let nodes = 0;

  if (isObject(value) && !Array.isArray(value) && Object.hasOwn(value, "type")) {
    stack.push({ value, path: "", depth: 1, node: true });
  } else {
    stack.push({ value, path: "", depth: 0, node: false });
  }

  while (stack.length > 0) {
    const frame = stack.pop() as Frame;
    const { value: current, path, depth, node } = frame;

    if (typeof current === "string") {
      // A string inside `children` is a text child, which counts as a node.
      if (node) {
        nodes += 1;
        if (nodes > MAX_NODES) {
          add(
            path,
            "limit.nodes",
            `document has more than ${MAX_NODES} nodes (text children count as nodes)`,
          );
          break;
        }
      }
      if (
        current.length > MAX_STRING_LENGTH &&
        add(
          path,
          "limit.string",
          `string is ${current.length} characters long; the limit is ${MAX_STRING_LENGTH}`,
        )
      )
        break;
      continue;
    }
    if (!isObject(current)) continue;

    if (visited.has(current)) {
      // A reused props object was checked the first time; a reused node or children
      // array would make the document a graph, and a cycle never ends.
      if (
        node &&
        add(
          path,
          "limit.reference",
          "this node or list already appears elsewhere in the document; shared and circular references are not allowed",
        )
      )
        break;
      continue;
    }
    visited.add(current);

    if (Array.isArray(current)) {
      for (let index = current.length - 1; index >= 0; index -= 1) {
        stack.push({ value: current[index], path: `${path}/${index}`, depth, node });
      }
      continue;
    }

    if (node) {
      nodes += 1;
      if (nodes > MAX_NODES) {
        add(
          path,
          "limit.nodes",
          `document has more than ${MAX_NODES} nodes (text children count as nodes)`,
        );
        break;
      }
    }
    if (depth > MAX_DEPTH) {
      if (add(path, "limit.depth", `nesting is deeper than ${MAX_DEPTH} levels`)) break;
      continue;
    }

    const keys = Object.keys(current);
    const isWrapper = !node && depth === 0;
    for (let index = keys.length - 1; index >= 0; index -= 1) {
      const key = keys[index] as string;
      const childPath = `${path}/${escapePointer(key)}`;
      if (key.length > MAX_STRING_LENGTH) {
        if (
          add(
            path,
            "limit.string",
            `property name is ${key.length} characters long; the limit is ${MAX_STRING_LENGTH}`,
          )
        )
          return issues;
        continue;
      }
      const child = (current as Record<string, unknown>)[key];
      if (node && key === "children")
        stack.push({ value: child, path: childPath, depth: depth + 1, node: true });
      else if (node && key === "props")
        stack.push({ value: child, path: childPath, depth, node: false });
      else if (isWrapper && key === "root")
        stack.push({ value: child, path: childPath, depth: 1, node: true });
      else stack.push({ value: child, path: childPath, depth: depth + 1, node: false });
    }
  }
  return issues;
}
