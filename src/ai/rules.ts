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

/** Only render semantics used by the bounded nesting checks below; document props cannot
 * override these tags with `as` or `render`. Other parts remain physical boundaries. */
const HTML_TAGS: Readonly<Partial<Record<UiType, string>>> = {
  Item: "li",
  DescriptionList: "dl",
  DescriptionTerm: "dt",
  DescriptionDetails: "dd",
  Table: "table",
  TableCaption: "caption",
  TableHeader: "thead",
  TableBody: "tbody",
  TableFooter: "tfoot",
  TableRow: "tr",
  TableCell: "td",
  TableHead: "th",
  TableRowHeader: "th",
};

const BUTTONS: ReadonlySet<UiType> = new Set([
  "Button",
  "AlertDialogTrigger",
  "AlertDialogAction",
  "AlertDialogCancel",
  "DialogTrigger",
  "DialogClose",
  "PopoverTrigger",
  "PopoverClose",
  "DrawerTrigger",
  "DrawerClose",
  "NumberField.Increment",
  "NumberField.Decrement",
  "Pagination.Link",
  "FileUpload.ItemRemove",
  "TooltipTrigger",
]);

/** These parts return their children/context providers without a DOM element. */
const TRANSPARENT: ReadonlySet<UiType> = new Set([
  "NativeSelectContent",
  "TooltipProvider",
  "Tooltip",
]);

const TABLE_CHILDREN: Readonly<Record<string, readonly string[]>> = {
  table: ["caption", "thead", "tbody", "tfoot"],
  thead: ["tr"],
  tbody: ["tr"],
  tfoot: ["tr"],
  tr: ["th", "td"],
};

const TABLE_PARENTS: Readonly<Record<string, readonly string[]>> = {
  caption: ["table"],
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  tr: ["thead", "tbody", "tfoot"],
  th: ["tr"],
  td: ["tr"],
};

function htmlType(node: UiNode): string | undefined {
  if (TRANSPARENT.has(node.type)) return undefined;
  return BUTTONS.has(node.type) ? "button" : (HTML_TAGS[node.type] ?? node.type);
}

function physicalParent(parent: Ancestry | undefined): Ancestry | undefined {
  let link = parent;
  while (link !== undefined && TRANSPARENT.has(link.node.type)) link = link.parent;
  return link;
}

function restrictedChildren(type: string): readonly string[] | undefined {
  return LIST_ITEMS[type] ?? TABLE_CHILDREN[type];
}

function nestingProblem(node: UiNode, parent: Ancestry | undefined): string | undefined {
  const type = htmlType(node);
  if (type === undefined) return undefined;
  const effectiveParent = physicalParent(parent);
  const parentType = effectiveParent === undefined ? undefined : htmlType(effectiveParent.node);
  if (type === "button") {
    for (let link = parent; link !== undefined; link = link.parent) {
      if (htmlType(link.node) === "button") return `${node.type} cannot be inside another button`;
    }
  }
  const parents = TABLE_PARENTS[type];
  if (parents !== undefined && (parentType === undefined || !parents.includes(parentType))) {
    return `${node.type} must be directly inside ${parents.join(" or ")}; transparent parts do not add an HTML parent`;
  }
  if (parentType === undefined) return undefined;
  const items = restrictedChildren(parentType);
  if (items !== undefined && !items.includes(type)) {
    return `${node.type} cannot be directly inside ${parentType}; ${parentType} takes only ${items.join(" and ")} children`;
  }
  if (PHRASING_PARENTS.has(parentType) && !PHRASING.has(type)) {
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

/** An id reference to check once every id of the document is known. */
interface Reference {
  readonly code: "field.label-target" | "field.describedby-target";
  readonly prop: string;
  readonly ids: readonly string[];
  readonly path: string;
  readonly breadcrumb: string;
}

/**
 * Rules JSON Schema cannot express, over a document that already passed the schema:
 * a part sits inside its root, a `FieldLabel` `htmlFor` and every id in an `aria-describedby`
 * name an id in the document, ids are unique, and nesting the HTML parser would rewrite (block
 * content in phrasing elements, a form in a form, a link or label in a link, anything but items
 * in a list) is rejected.
 * `basePath` is the pointer of `root` inside the value the caller validated.
 */
export function checkRules(root: UiNode, basePath = ""): UiValidationIssue[] {
  const issues: UiValidationIssue[] = [];
  const firstPathOfId = new Map<string, string>();
  const references: Reference[] = [];
  const stack: Visit[] = [{ node: root, path: basePath, parent: undefined }];

  while (stack.length > 0) {
    const { node, path, parent } = stack.pop() as Visit;
    const props = propsOf(node);
    const rootType = uiParts[node.type].rootType;

    const nesting = nestingProblem(node, parent);
    if (nesting !== undefined) {
      issues.push({ code: "nesting", path, breadcrumb: crumbsOf(parent, node), message: nesting });
    }

    if (rootType !== undefined && nearest(parent, rootType) === undefined) {
      issues.push({
        code: "root.missing",
        path,
        breadcrumb: crumbsOf(parent, node),
        message: `${node.type} must be inside a ${rootType}`,
        allowed: [rootType],
      });
    }

    if (node.type === "FieldLabel" && typeof props.htmlFor === "string") {
      references.push({
        code: "field.label-target",
        prop: "htmlFor",
        ids: [props.htmlFor],
        path: `${path}/props/htmlFor`,
        breadcrumb: crumbsOf(parent, node, ".props.htmlFor"),
      });
    }
    const describedBy = props["aria-describedby"];
    if (typeof describedBy === "string") {
      references.push({
        code: "field.describedby-target",
        prop: "aria-describedby",
        ids: describedBy.split(/\s+/).filter(Boolean),
        path: `${path}/props/aria-describedby`,
        breadcrumb: crumbsOf(parent, node, ".props.aria-describedby"),
      });
    }

    if (typeof props.id === "string") {
      const first = firstPathOfId.get(props.id);
      if (first === undefined) {
        firstPathOfId.set(props.id, path);
      } else {
        issues.push({
          code: "id.duplicate",
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
        } else {
          const effective = physicalParent(link);
          const type = effective === undefined ? undefined : htmlType(effective.node);
          const items = type === undefined ? undefined : restrictedChildren(type);
          if (items === undefined) continue;
          issues.push({
            code: "nesting",
            path: `${path}/children/${index}`,
            breadcrumb: `${crumbsOf(parent, node)} › children[${index}]`,
            message: `text cannot be directly inside ${type}; wrap it in ${items[0] ?? "an item"}`,
          });
        }
      }
    }
  }

  const ids = [...firstPathOfId.keys()];
  for (const { code, prop, ids: named, path, breadcrumb } of references) {
    const missing = named.filter((id) => !firstPathOfId.has(id));
    if (missing.length === 0) continue;
    issues.push({
      code,
      path,
      breadcrumb,
      message: `${prop} names ${missing.map((id) => JSON.stringify(id)).join(", ")}, but no element in the document has that id`,
      allowed: ids,
    });
  }
  return issues;
}
