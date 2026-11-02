import { uiParts, uiPatternRules } from "./catalog.generated.js";
import type { AjvError } from "./validator.generated.js";
import type { UiValidationIssue } from "./types.js";

const NOISE_KEYWORDS = new Set(["anyOf", "oneOf", "if", "then", "else"]);
const SHOWN_VALUE_LENGTH = 60;

function unescapePointer(segment: string): string {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}

function escapePointer(key: string): string {
  return key.replaceAll("~", "~0").replaceAll("/", "~1");
}

function segmentsOf(pointer: string): string[] {
  return pointer === "" ? [] : pointer.slice(1).split("/").map(unescapePointer);
}

function child(container: unknown, key: string): unknown {
  return typeof container === "object" && container !== null && Object.hasOwn(container, key)
    ? (container as Record<string, unknown>)[key]
    : undefined;
}

/** Where a pointer lands: the node types passed on the way and the value it points at. */
interface Location {
  readonly crumbs: string[];
  /** The type of the nearest node on the way, if it has a string type. */
  readonly nodeType: string | undefined;
  /** Segments after the nearest node, e.g. `["props", "variant"]`. */
  readonly rest: string[];
  readonly target: unknown;
}

function locate(value: unknown, pointer: string): Location {
  const crumbs: string[] = [];
  const segments = segmentsOf(pointer);
  let current = value;
  let nodeType: string | undefined;
  let consumed = 0;

  const enter = (node: unknown, fallback: string): void => {
    const type = child(node, "type");
    nodeType = typeof type === "string" ? type : undefined;
    crumbs.push(nodeType ?? fallback);
  };

  if (typeof child(current, "type") === "string") enter(current, "document");
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index] as string;
    if (segment === "root" && crumbs.length === 0) {
      current = child(current, "root");
      consumed = index + 1;
      enter(current, "root");
    } else if (segment === "children" && crumbs.length > 0) {
      const next = segments[index + 1];
      const list = child(current, "children");
      const item = next === undefined ? undefined : child(list, next);
      if (next === undefined || item === undefined) break;
      index += 1;
      consumed = index + 1;
      if (typeof item !== "object" || item === null) {
        // Text or a wrong value, not a node: name the position and stop.
        crumbs.push(`children[${next}]`);
        current = item;
        break;
      }
      current = item;
      enter(current, `children[${next}]`);
    } else {
      break;
    }
  }

  let target = current;
  const rest = segments.slice(consumed);
  for (const segment of rest) target = child(target, segment);
  return { crumbs, nodeType, rest, target };
}

function breadcrumbOf(location: Location, extra: readonly string[]): string {
  const tail = [...location.rest, ...extra].join(".");
  if (location.crumbs.length === 0) return tail === "" ? "document" : tail;
  const crumbs = [...location.crumbs];
  if (tail !== "") crumbs[crumbs.length - 1] += `.${tail}`;
  return crumbs.join(" › ");
}

/** The readable location of a JSON Pointer in `value`, e.g. `form › Button.props.title`. */
export function breadcrumbAt(value: unknown, pointer: string): string {
  return breadcrumbOf(locate(value, pointer), []);
}

function show(value: unknown): string {
  let text: string;
  try {
    // JSON.stringify throws on cycles and BigInt, and returns undefined for functions.
    text = JSON.stringify(value) ?? String(typeof value);
  } catch {
    text = `a ${typeof value} value`;
  }
  return text.length > SHOWN_VALUE_LENGTH ? `${text.slice(0, SHOWN_VALUE_LENGTH)}…` : text;
}

function isChildPath(pointer: string): boolean {
  return /\/children\/\d+$/.test(pointer);
}

function explain(
  error: AjvError,
  location: Location,
): { message: string; extra?: string; allowed?: readonly unknown[] } {
  const { params } = error;
  const insideProps = location.rest[0] === "props" && location.rest.length === 1;
  switch (error.keyword) {
    case "enum": {
      const allowed = params.allowedValues as readonly unknown[];
      return {
        message: `${show(location.target)} is not allowed; use one of ${allowed.map(show).join(", ")}`,
        allowed,
      };
    }
    case "const": {
      const allowed = [params.allowedValue];
      return {
        message: `${show(location.target)} is not allowed; use ${show(params.allowedValue)}`,
        allowed,
      };
    }
    case "required": {
      const name = String(params.missingProperty);
      return {
        message: insideProps
          ? `missing required prop ${show(name)}`
          : `missing required property ${show(name)}`,
        extra: name,
      };
    }
    case "additionalProperties": {
      const name = String(params.additionalProperty);
      const node = location.rest.length === 0 && location.crumbs.length > 0;
      if (
        name === "children" &&
        node &&
        location.nodeType !== undefined &&
        uiParts[location.nodeType as keyof typeof uiParts]?.leaf
      ) {
        return { message: `${location.nodeType} takes no children`, extra: name };
      }
      return {
        message: insideProps ? `unknown prop ${show(name)}` : `unknown property ${show(name)}`,
        extra: name,
      };
    }
    case "discriminator": {
      if (params.error === "mapping") {
        return {
          message: `unknown type ${show(params.tagValue)}`,
          extra: "type",
          allowed: Object.keys(uiParts),
        };
      }
      return { message: 'the "type" property must be a string naming a part', extra: "type" };
    }
    case "pattern": {
      const rule = uiPatternRules[String(params.pattern)];
      return {
        message: `${show(location.target)} is not ${rule ?? `allowed; it must match ${String(params.pattern)}`}`,
      };
    }
    case "type": {
      if (params.type === "object" && isChildPath(error.instancePath)) {
        return {
          message: `a child must be a string or a node object, not ${show(location.target)}`,
        };
      }
      return { message: `must be ${String(params.type)}, not ${show(location.target)}` };
    }
    default:
      return { message: error.message ?? "is invalid" };
  }
}

/**
 * Turns Ajv errors into issues. The schema reports every failed branch of the child union and
 * a trailing `if` error; only the precise error at each location is kept.
 */
export function toIssues(
  errors: readonly AjvError[] | null | undefined,
  value: unknown,
): UiValidationIssue[] {
  const list = errors ?? [];
  const requiredTypeAt = new Set(
    list
      .filter((e) => e.keyword === "required" && e.params.missingProperty === "type")
      .map((e) => e.instancePath),
  );
  const seen = new Set<string>();
  const issues: UiValidationIssue[] = [];

  for (const error of list) {
    if (NOISE_KEYWORDS.has(error.keyword)) continue;
    // The string branch of the child union: a node that fails on its own has a precise error.
    if (
      error.keyword === "type" &&
      error.params.type === "string" &&
      isChildPath(error.instancePath)
    )
      continue;
    // A missing "type" is reported once, by `required`.
    if (
      error.keyword === "discriminator" &&
      error.params.error === "tag" &&
      requiredTypeAt.has(error.instancePath)
    )
      continue;

    const location = locate(value, error.instancePath);
    const found = explain(error, location);
    const extra = found.extra === undefined ? [] : [found.extra];
    const leafChildren =
      error.keyword === "additionalProperties" &&
      found.extra === "children" &&
      found.message.endsWith("takes no children");
    const path =
      found.extra === undefined
        ? error.instancePath
        : `${error.instancePath}/${escapePointer(found.extra)}`;
    const issue: UiValidationIssue = {
      path,
      breadcrumb: breadcrumbOf(location, leafChildren ? [] : extra),
      message: found.message,
      ...(found.allowed === undefined ? {} : { allowed: found.allowed }),
    };
    const key = `${issue.path}\u0000${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push(issue);
  }

  return issues.length > 0
    ? issues
    : [{ path: "", breadcrumb: "document", message: "does not match the UI document schema" }];
}
