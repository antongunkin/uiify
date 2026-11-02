import { uiParts, type UiChild, type UiNode, type UiType } from "./catalog.generated.js";
import type { UiValidationIssue } from "./types.js";

interface Ancestry {
  readonly node: UiNode;
  readonly parent: Ancestry | undefined;
}

interface Visit {
  readonly node: UiNode;
  readonly path: string;
  readonly parent: Ancestry | undefined;
}

/** Natives that may hold only text and phrasing natives: the HTML parser closes or moves out
 * anything else, so server HTML would not hydrate. */
const PHRASING_PARENTS: ReadonlySet<string> = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "strong",
  "em",
  "label",
  "legend",
  "dt",
]);

/** The phrasing natives a phrasing parent may hold. */
const PHRASING: ReadonlySet<string> = new Set(["a", "strong", "em", "label"]);

/** Types that render a `<form>`. */
const FORMS: readonly UiType[] = ["form", "Form"];

/** Native interactive content a link may not hold; components are caught as non-phrasing. */
const LINK_INTERACTIVE: ReadonlySet<string> = new Set(["a", "label"]);

/** List natives and the only children they take. */
const LIST_ITEMS: Readonly<Record<string, readonly string[]>> = {
  ul: ["li"],
  ol: ["li"],
  dl: ["dt", "dd"],
};

function nestingProblem(node: UiNode, parent: Ancestry | undefined): string | undefined {
  if (parent === undefined) return undefined;
  const parentType = parent.node.type;
  const items = LIST_ITEMS[parentType];
  if (items !== undefined && !items.includes(node.type)) {
    return `${node.type} cannot be directly inside ${parentType}; ${parentType} takes only ${items.join(" and ")} children`;
  }
  if (PHRASING_PARENTS.has(parentType) && !PHRASING.has(node.type)) {
    return `${node.type} cannot be inside ${parentType}; ${parentType} holds only text and ${[...PHRASING].join(", ")}`;
  }
  if (FORMS.includes(node.type) && FORMS.some((type) => nearest(parent, type) !== undefined)) {
    return `${node.type} cannot be inside another form`;
  }
  if (LINK_INTERACTIVE.has(node.type) && nearest(parent, "a") !== undefined) {
    return `${node.type} cannot be inside a link (a)`;
  }
  return undefined;
}

function propsOf(node: UiNode): Readonly<Record<string, unknown>> {
  return node.props as Readonly<Record<string, unknown>>;
}

function nearest(from: Ancestry | undefined, type: UiType): UiNode | undefined {
  for (let link = from; link !== undefined; link = link.parent) {
    if (link.node.type === type) return link.node;
  }
  return undefined;
}

function crumbsOf(parent: Ancestry | undefined, node: UiNode, suffix = ""): string {
  const types: string[] = [];
  for (let link = parent; link !== undefined; link = link.parent) types.push(link.node.type);
  types.reverse();
  types.push(`${node.type}${suffix}`);
  return types.join(" › ");
}

/**
 * Rules JSON Schema cannot express, over a document that already passed the schema:
 * a part sits inside its root, a `fieldId` names the enclosing root, ids are unique, and
 * nesting the HTML parser would rewrite (block content in phrasing elements, a form in a form,
 * a link or label in a link, anything but items in a list) is rejected.
 * `basePath` is the pointer of `root` inside the value the caller validated.
 */
export function checkRules(root: UiNode, basePath = ""): UiValidationIssue[] {
  const issues: UiValidationIssue[] = [];
  const firstPathOfId = new Map<string, string>();
  const stack: Visit[] = [{ node: root, path: basePath, parent: undefined }];

  while (stack.length > 0) {
    const { node, path, parent } = stack.pop() as Visit;
    const props = propsOf(node);
    const rootType = uiParts[node.type].rootType;

    const nesting = nestingProblem(node, parent);
    if (nesting !== undefined) {
      issues.push({ path, breadcrumb: crumbsOf(parent, node), message: nesting });
    }

    if (rootType !== undefined) {
      const enclosing = nearest(parent, rootType);
      if (enclosing === undefined) {
        issues.push({
          path,
          breadcrumb: crumbsOf(parent, node),
          message: `${node.type} must be inside a ${rootType}`,
          allowed: [rootType],
        });
      } else if (typeof props.fieldId === "string") {
        const id = propsOf(enclosing).id;
        if (props.fieldId !== id) {
          issues.push({
            path: `${path}/props/fieldId`,
            breadcrumb: crumbsOf(parent, node, ".props.fieldId"),
            message: `fieldId ${JSON.stringify(props.fieldId)} does not match the id ${JSON.stringify(id)} of the enclosing ${rootType}`,
            allowed: [id],
          });
        }
      }
    }

    if (typeof props.id === "string") {
      const first = firstPathOfId.get(props.id);
      if (first === undefined) {
        firstPathOfId.set(props.id, path);
      } else {
        issues.push({
          path: `${path}/props/id`,
          breadcrumb: crumbsOf(parent, node, ".props.id"),
          message: `duplicate id ${JSON.stringify(props.id)}; first used at ${first}`,
        });
      }
    }

    const children = (node as { readonly children?: readonly UiChild[] }).children;
    if (children !== undefined) {
      const link: Ancestry = { node, parent };
      for (let index = children.length - 1; index >= 0; index -= 1) {
        const child = children[index];
        if (typeof child === "object" && child !== null) {
          stack.push({ node: child, path: `${path}/children/${index}`, parent: link });
        } else if (LIST_ITEMS[node.type] !== undefined) {
          issues.push({
            path: `${path}/children/${index}`,
            breadcrumb: `${crumbsOf(parent, node)} › children[${index}]`,
            message: `text cannot be directly inside ${node.type}; wrap it in ${LIST_ITEMS[node.type]?.[0] ?? "an item"}`,
          });
        }
      }
    }
  }
  return issues;
}
