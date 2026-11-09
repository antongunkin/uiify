/**
 * Closed-vocabulary rules for /uiify screens (TSX that only composes @gunkin/uiify components).
 * Pure: the consumer's own TypeScript is passed in, so sync can copy this file into the skill.
 */
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { PUBLIC_PATH, UIIFY_SELECTOR, UIIFY_VAR } from "./project-css.mjs";

const INTERACTIVE = /^(?:a|button|input|select|textarea|Button|.*Link|.*Trigger|Input|Checkbox|Switch|RadioGroupItem)$/;
const FIELD = new Set(["Field"]);
const FIELD_DESCRIPTION = new Set(["FieldDescription"]);
const RADIO_GROUP = new Set(["RadioGroup"]);
const RADIO_ITEM = new Set(["RadioGroupItem"]);
/** Tabs pair the n-th TabsTrigger with the n-th TabsContent in CSS, up to this many. */
const MAX_TABS = 12;
const FIELD_LABEL = new Set(["FieldLabel"]);
/** Block parts and elements that render div/p: invalid inside a label (choice cards put the label inside). */
const NOT_IN_LABEL = new Set(["Field", "FieldContent", "FieldDescription", "FieldError", "FieldGroup", "FieldTitle", "div", "p"]);

/** Attributes whose every string value is a color (compared without dashes, case-insensitively). */
const COLOR_ATTRIBUTES = new Set(["color", "bgcolor", "fill", "stroke", "stopcolor", "floodcolor", "lightingcolor"]);
const COLOR_KEYWORD = /^(?:currentcolor|inherit|none|transparent)$/i;
const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/i;
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix|color|light-dark)\(/i;
const PALETTE = /\b(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)\b/i;
/** A `#` in a URL is a fragment (`href="#add"`), not a color. */
const URL_ATTRIBUTES = new Set(["href", "src", "action", "formAction"]);

/** `@gunkin/uiify`, `@gunkin/uiify/blocks`, `@gunkin/uiify/components/<name>` and `@gunkin/uiify/components/<name>/client`. */
function isUiifyModule(spec) {
  return spec === "@gunkin/uiify" || spec === "@gunkin/uiify/blocks" || /^@gunkin\/uiify\/components\/[^/]+(?:\/client)?$/.test(spec);
}

const isExported = (ts, node) => node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
const propertyName = (ts, name) => (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) ? name.text : undefined);

/**
 * Exported types of `contract.ts`: the slot keys of each object type literal, or why the check
 * cannot read them. Syntax only: `type X = { a: ReactNode }` is a contract; `&`, `extends`,
 * mapped or computed types are not, because their keys are not written in the file.
 * `text` holds the keys typed `string`: the design picks the text part for them.
 * @returns {Map<string, { keys: string[]; optional: Set<string>; text: Set<string> } | { problem: string }>}
 */
function contractTypes(ts, source) {
  const sf = ts.createSourceFile("contract.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const types = new Map();
  for (const statement of sf.statements) {
    if (ts.isInterfaceDeclaration(statement) && isExported(ts, statement)) {
      types.set(statement.name.text, { problem: "is an interface" });
    }
    if (!ts.isTypeAliasDeclaration(statement) || !isExported(ts, statement)) continue;
    const { type } = statement;
    if (!ts.isTypeLiteralNode(type)) {
      types.set(statement.name.text, { problem: ts.isIntersectionTypeNode(type) ? "is an intersection (&)" : "is not an object type literal" });
      continue;
    }
    const keys = [];
    const optional = new Set();
    const text = new Set();
    let problem;
    for (const member of type.members) {
      const key = ts.isPropertySignature(member) ? propertyName(ts, member.name) : undefined;
      if (key === undefined) problem = `has a member the check cannot read (${member.getText(sf).split("\n")[0]})`;
      else {
        keys.push(key);
        if (member.questionToken) optional.add(key);
        if (member.type && isStringType(ts, member.type)) text.add(key);
      }
    }
    types.set(statement.name.text, problem ? { problem } : { keys, optional, text });
  }
  return types;
}

/** `string`, or `string` with `undefined`/`null` in a union. */
function isStringType(ts, type) {
  if (type.kind === ts.SyntaxKind.StringKeyword) return true;
  if (!ts.isUnionTypeNode(type)) return false;
  const nullish = (t) => t.kind === ts.SyntaxKind.UndefinedKeyword || (ts.isLiteralTypeNode(t) && t.literal.kind === ts.SyntaxKind.NullKeyword);
  return type.types.some((t) => t.kind === ts.SyntaxKind.StringKeyword) && type.types.every((t) => t.kind === ts.SyntaxKind.StringKeyword || nullish(t));
}

/**
 * Findings are errors unless `severity` is "warning".
 * Pass `contract` (the source of `../contract.ts`) when `file` is a design in a feature's `designs/`.
 * `allow`: project modules screens may import (package.json `uiify.components` and `--allow`).
 * `root` and `path` (absolute): a relative import must stay inside `root`, the screens folder.
 * `uiifyNames`: UIify's catalog names; a project module may not supply one of them.
 * @param {string} file
 * @param {string} source
 * @param {typeof import("typescript")} typescript
 * @param {{ allow?: readonly string[]; contract?: string; root?: string; path?: string; uiifyNames?: ReadonlySet<string> }} [options]
 * @returns {{ file: string; line: number; column: number; rule: string; message: string; severity?: "warning" }[]}
 */
export function screenFindings(file, source, typescript, options = {}) {
  const ts = typescript;
  if (!ts?.createSourceFile) throw new Error("TypeScript parser is not available.");
  const allow = options.allow ?? [];
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings = [];
  const report = (node, rule, message, severity) => {
    const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    findings.push({ file, line: line + 1, column: character + 1, rule, message, ...(severity ? { severity } : {}) });
  };
  if (options.contract !== undefined) checkDesign(ts, sf, contractTypes(ts, options.contract), report);
  const isRelative = (spec) => spec.startsWith("./") || spec.startsWith("../");
  const insideRoot = (spec) => {
    if (!options.root || !options.path) return true;
    const to = relative(options.root, resolve(dirname(options.path), spec));
    return to !== ".." && !to.startsWith(`..${sep}`) && !isAbsolute(to);
  };
  const listed = (spec) => allow.some((rule) => (rule.endsWith("*") ? spec.startsWith(rule.slice(0, -1)) : spec === rule));

  const checkModule = (node, spec, kind) => {
    if (isUiifyModule(spec)) return;
    if (isRelative(spec)) {
      if (!insideRoot(spec)) {
        report(node, "screen-import", `${kind} from "${spec}" leaves the screens folder: import a project component by a module listed in package.json "uiify.components"`);
      }
      return;
    }
    if (!listed(spec)) {
      report(node, "screen-import", `${kind} from "${spec}" is not allowed in screens (allowed: @gunkin/uiify, @gunkin/uiify/blocks, @gunkin/uiify/components/<name>[/client], relative paths inside the screens folder${allow.length ? `, ${allow.join(", ")}` : ""}; add a project module to package.json "uiify.components")`);
    }
  };

  /** A UIify name imported from another module (a shadcn `Button`): screens use UIify's own. */
  const checkTwins = (node, spec) => {
    const clause = node.importClause;
    if (!options.uiifyNames || isUiifyModule(spec) || !clause || clause.isTypeOnly) return;
    const names = clause.name ? [[clause.name, clause.name.text]] : [];
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) {
        if (!element.isTypeOnly) names.push([element, (element.propertyName ?? element.name).text]);
      }
    }
    for (const [at, name] of names) {
      if (options.uiifyNames.has(name)) {
        report(at, "screen-uiify-twin", `"${name}" from "${spec}": UIify has ${name}; import it from @gunkin/uiify`);
      }
    }
  };

  const opening = (node) => (ts.isJsxElement(node) ? node.openingElement : node);
  const isElement = (node) => ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);
  const attrs = (node) => opening(node).attributes.properties.filter((a) => ts.isJsxAttribute(a));
  const attr = (node, name) => attrs(node).find((a) => a.name.getText(sf) === name);
  const literal = (attribute) => {
    let value = attribute?.initializer;
    if (value && ts.isJsxExpression(value)) value = value.expression;
    return value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) ? value.text : undefined;
  };
  // A bare attribute or `={true}` sets a boolean; `={false}` does not.
  const isSet = (attribute) =>
    attribute !== undefined &&
    !(attribute.initializer && ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression?.kind === ts.SyntaxKind.FalseKeyword);
  const nameOf = (node) => opening(node).tagName.getText(sf);

  const descendants = (node, predicate, found = []) => {
    ts.forEachChild(node, (child) => {
      if (isElement(child) && predicate(child)) found.push(child);
      descendants(child, predicate, found);
    });
    return found;
  };

  const checkRadioGroup = (group) => {
    const names = new Set();
    for (const item of descendants(group, (el) => RADIO_ITEM.has(nameOf(el)))) {
      const name = literal(attr(item, "name"));
      if (name === undefined) report(item, "screen-radio-name", `<${nameOf(item)}> needs a literal name="..." shared by the whole group`);
      else names.add(name);
    }
    if (names.size > 1) {
      report(group, "screen-radio-name", `radio items in one <${nameOf(group)}> must share one name (found: ${[...names].join(", ")})`);
    }
  };

  /** The nearest enclosing JSX element; `{items.map(...)}` and `{cond && ...}` stay direct children. */
  const parentElement = (node) => {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (isElement(parent)) return parent;
    }
    return undefined;
  };
  const nearest = (node, names) => {
    for (let parent = parentElement(node); parent; parent = parentElement(parent)) {
      if (names.has(nameOf(parent))) return parent;
    }
    return undefined;
  };
  const TABS = new Set(["Tabs"]);

  const checkTabs = (tabs) => {
    const own = (name) => descendants(tabs, (el) => nameOf(el) === name && nearest(el, TABS) === tabs);
    const triggers = own("TabsTrigger");
    const contents = own("TabsContent");
    const names = new Set();
    for (const trigger of triggers) {
      const name = literal(attr(trigger, "name"));
      if (name === undefined) report(trigger, "screen-radio-name", `<${nameOf(trigger)}> needs a literal name="..." shared by the whole <Tabs>`);
      else names.add(name);
      if (nameOf(parentElement(trigger) ?? trigger) !== "TabsList") {
        report(trigger, "screen-tabs-structure", "<TabsTrigger> must be a direct child of <TabsList>: Tabs pair triggers and contents by position");
      }
    }
    if (names.size > 1) report(tabs, "screen-radio-name", `triggers in one <Tabs> must share one name (found: ${[...names].join(", ")})`);
    for (const part of [...own("TabsList"), ...contents]) {
      if (parentElement(part) !== tabs) report(part, "screen-tabs-structure", `<${nameOf(part)}> must be a direct child of <Tabs>: Tabs pair triggers and contents by position`);
    }
    if (triggers.length > MAX_TABS) report(tabs, "screen-tabs-structure", `<Tabs> pairs at most ${MAX_TABS} triggers with contents (found ${triggers.length})`);
    const values = (parts) => parts.map((part) => literal(attr(part, "value")));
    const triggerValues = values(triggers);
    const contentValues = values(contents);
    if (![...triggerValues, ...contentValues].includes(undefined) && triggerValues.join("\0") !== contentValues.join("\0")) {
      report(tabs, "screen-tabs-order", `<TabsContent> values must follow the <TabsTrigger> order (triggers: ${triggerValues.join(", ")}; contents: ${contentValues.join(", ")})`);
    }
    if (triggers.length > 0 && !triggers.some((trigger) => isSet(attr(trigger, "defaultChecked")))) {
      report(tabs, "screen-tabs-default", "no <TabsTrigger> has defaultChecked: the first content shows, but no trigger looks selected", "warning");
    }
  };

  const checkAccordion = (accordion) => {
    const items = descendants(accordion, (el) => nameOf(el) === "AccordionItem" && nearest(el, new Set(["Accordion"])) === accordion);
    const names = new Set(items.map((item) => (attr(item, "name") ? (literal(attr(item, "name")) ?? "{expression}") : "(none)")));
    if (names.size > 1) {
      report(accordion, "screen-radio-name", `items in one <Accordion> need the same literal name (single-open) or none (multiple) (found: ${[...names].join(", ")})`);
    } else if (names.has("{expression}")) {
      report(accordion, "screen-radio-name", "<AccordionItem> needs a literal name=\"...\" shared by the whole <Accordion>, or none");
    }
  };

  const checkLabel = (label) => {
    for (const block of descendants(label, (el) => NOT_IN_LABEL.has(nameOf(el)))) {
      report(block, "screen-label-content", `<${nameOf(block)}> inside <${nameOf(label)}> is invalid HTML: put the label inside FieldContent and keep only text in it`);
    }
  };

  const checkField = (field) => {
    const describedBy = new Set();
    for (const el of [field, ...descendants(field, () => true)]) {
      const value = literal(attr(el, "aria-describedby"));
      if (value) for (const id of value.split(/\s+/).filter(Boolean)) describedBy.add(id);
    }
    for (const description of descendants(field, (el) => FIELD_DESCRIPTION.has(nameOf(el)))) {
      // The nearest Field owns the description; outer Fields do not re-check it.
      if (nearestField(description) !== field) continue;
      const id = literal(attr(description, "id"));
      if (id === undefined) {
        report(description, "screen-field-description", `<${nameOf(description)}> needs a literal id="..."`);
      } else if (!describedBy.has(id)) {
        report(description, "screen-field-description", `no control in this <${nameOf(field)}> lists "${id}" in aria-describedby`);
      }
    }
  };
  const nearestField = (node) => {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (isElement(parent) && FIELD.has(nameOf(parent))) return parent;
    }
    return undefined;
  };
  // className customizes a part: a literal list of classes, no raw colors; Tailwind's default scale over arbitrary values.
  const checkClassName = (attribute, value) => {
    if (value === undefined) {
      report(attribute, "screen-class-name", 'className must be a literal string: className="gap-4 md:p-8"');
      return;
    }
    for (const token of value.split(/\s+/).filter(Boolean)) {
      const internalVar = UIIFY_VAR.exec(token)?.[0];
      const internalSelector = token.includes("[") ? UIIFY_SELECTOR.exec(token)?.[0] : undefined;
      if (internalVar) {
        report(attribute, "screen-uiify-var", `"${token}": "${internalVar}" is a UIify-internal variable: ${PUBLIC_PATH}`);
      } else if (internalSelector) {
        report(attribute, "screen-uiify-selector", `"${token}": "${internalSelector}" targets UIify internals: ${PUBLIC_PATH}`);
      } else if (token.includes("[") && (HEX.test(token) || COLOR_FUNCTION.test(token))) {
        report(attribute, "screen-raw-color", `"${token}": raw colors are not allowed in screens: use a theme color (bg-primary, text-muted-foreground)`);
      } else if (token.includes("[")) {
        report(attribute, "screen-class-arbitrary", `"${token}": prefer Tailwind's default scale (p-3, w-64, rounded-lg); keep an arbitrary value only when no step fits`, "warning");
      } else if (PALETTE.test(token)) {
        report(attribute, "screen-raw-color", `"${token}": raw palette colors are not allowed in screens: use a theme color (bg-primary, text-muted-foreground)`);
      }
    }
  };

  // style is allowed; a literal color in it must still come from the theme (var(--primary)), not a raw value,
  // and it neither sets nor reads UIify's internal variables.
  const checkStyle = (attribute) => {
    const object = attribute.initializer && ts.isJsxExpression(attribute.initializer) ? attribute.initializer.expression : undefined;
    if (!object || !ts.isObjectLiteralExpression(object)) return;
    for (const property of object.properties) {
      const value = ts.isPropertyAssignment(property) ? property.initializer : undefined;
      const key = property.name ? propertyName(ts, property.name) : undefined;
      const text = value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) ? value.text : value && ts.isTemplateExpression(value) ? value.getText(sf) : undefined;
      const internalVar = UIIFY_VAR.exec(key ?? "")?.[0] ?? UIIFY_VAR.exec(text ?? "")?.[0];
      if (internalVar) {
        report(property, "screen-uiify-var", `style ${property.name.getText(sf)}: "${internalVar}" is a UIify-internal variable: ${PUBLIC_PATH}`);
        continue;
      }
      if (!value || !(ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))) continue;
      if (HEX.test(value.text) || COLOR_FUNCTION.test(value.text)) {
        report(property, "screen-raw-color", `style ${property.name.getText(sf)}: "${value.text}": raw colors are not allowed in screens: use a theme variable (var(--primary))`);
      }
    }
  };

  const visit = (node, inside) => {
    const specifier =
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier
        : undefined;
    if (specifier) checkModule(node, specifier.text, ts.isImportDeclaration(node) ? "import" : "export");
    if (specifier && ts.isImportDeclaration(node)) checkTwins(node, specifier.text);
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      const kind = node.expression.kind === ts.SyntaxKind.ImportKeyword ? "dynamic import" : "require";
      const [argument] = node.arguments;
      if (argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) checkModule(node, argument.text, kind);
      else report(node, "screen-import", `${kind} with a non-literal argument cannot be verified: use a static import`);
    }
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf);
      const value = literal(node);
      if (name === "className") checkClassName(node, value);
      else if (name === "style") checkStyle(node);
      else if (/^on[A-Z]/.test(name)) report(node, "screen-handler", `event handler "${name}" is not allowed: screens are static`);
      if (name !== "className" && value !== undefined && isRawColor(name, value)) {
        report(node, "screen-raw-color", `${name}="${value}": raw colors are not allowed in screens: use a component variant`);
      }
    }
    if (ts.isJsxSpreadAttribute(node)) report(node, "screen-spread", "spread props are not allowed in screens: write each prop");
    if (ts.isCallExpression(node) && /(?:^|\.)use[A-Z]/.test(node.expression.getText(sf))) {
      report(node, "screen-hook", "hooks are not allowed: screens are static");
    }
    let next = inside;
    if (isElement(node)) {
      const name = nameOf(node);
      // `asChild` hands the element to its single child, so the parent is not an element of its own.
      if (INTERACTIVE.test(name) && !attr(node, "asChild")) {
        if (inside) report(node, "screen-nested-interactive", `<${name}> inside <${inside}>: interactive elements cannot be nested`);
        next = name;
      }
      if (RADIO_GROUP.has(name)) checkRadioGroup(node);
      if (name === "Tabs") checkTabs(node);
      if (name === "Accordion") checkAccordion(node);
      if (FIELD.has(name)) checkField(node);
      if (FIELD_LABEL.has(name)) checkLabel(node);
    }
    ts.forEachChild(node, (child) => visit(child, next));
  };
  visit(sf, null);
  return findings;
}

/** A color attribute with any value but a keyword, or any attribute whose value names a color. */
function isRawColor(name, value) {
  if (COLOR_ATTRIBUTES.has(name.replaceAll("-", "").toLowerCase())) return !COLOR_KEYWORD.test(value.trim());
  return (!URL_ATTRIBUTES.has(name) && HEX.test(value)) || COLOR_FUNCTION.test(value) || PALETTE.test(value);
}

/**
 * A design is `export default function X({ every, slot }: Slots)` with `Slots` imported from
 * `../contract`. `tsc` rejects a slot the contract lacks; only this check sees a slot that was
 * never taken from the props.
 */
function checkDesign(ts, sf, contracts, report) {
  const imported = new Map();
  for (const statement of sf.statements) {
    if (!ts.isImportDeclaration(statement) || !/^\.\.\/contract(?:\.[cm]?[jt]s)?$/.test(statement.moduleSpecifier.text)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) imported.set(element.name.text, (element.propertyName ?? element.name).text);
    }
  }
  const design = sf.statements.find(
    (statement) => ts.isFunctionDeclaration(statement) && statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword),
  );
  if (!design) {
    report(sf.statements[0] ?? sf, "design-default", "a design default-exports one function: export default function Name({ ...slots }: FeatureSlots)");
    return;
  }
  const [param, ...more] = design.parameters;
  const type = param?.type;
  const local = type && ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName) && !type.typeArguments ? type.typeName.text : undefined;
  const name = local === undefined ? undefined : imported.get(local);
  if (!param || more.length > 0 || name === undefined) {
    report(param ?? design, "design-contract-type", "the only parameter is typed with the feature contract imported from ../contract, not a type of its own");
    return;
  }
  const contract = contracts.get(name);
  if (!contract || "problem" in contract) {
    const why = contract ? contract.problem : "is not an exported type there";
    report(type, "design-contract-type", `${name} in ../contract.ts ${why}: write the contract as export type ${name} = { slot: ReactNode; ... } so its slots can be checked`);
    return;
  }
  if (!ts.isObjectBindingPattern(param.name)) {
    report(param, "design-destructure", `destructure every slot in the parameter: ({ ${contract.keys.join(", ")} }: ${local})`);
    return;
  }
  const taken = new Set();
  /** Local binding → contract key, for the optional slots only. */
  const optionalLocals = new Map();
  /** Local binding → contract key, for every slot. */
  const slotLocals = new Map();
  for (const element of param.name.elements) {
    if (element.dotDotDotToken) {
      report(element, "design-rest", "rest props are not allowed in a design: name every slot");
      continue;
    }
    const key = element.propertyName ? propertyName(ts, element.propertyName) : ts.isIdentifier(element.name) ? element.name.text : undefined;
    if (key === undefined) continue;
    taken.add(key);
    if (ts.isIdentifier(element.name)) slotLocals.set(element.name.text, key);
    if (contract.optional.has(key) && ts.isIdentifier(element.name)) optionalLocals.set(element.name.text, key);
  }
  for (const key of contract.keys) {
    if (!taken.has(key)) report(param, "design-missing-slot", `slot "${key}" of ${name} is not taken from the props: every design renders every slot, optional ones too`);
  }
  if (design.body && optionalLocals.size > 0) checkEmptyWrappers(ts, sf, design.body, optionalLocals, report);
  if (design.body) checkSlotsInText(ts, sf, design.body, slotLocals, contract.text, report);
}

/**
 * Parts and elements whose element allows only phrasing content (`p`, `h2`, `label`, `button`, `a`…). Found by
 * rendering every public part (researches/m4-skill-2026-11-07/probe/roots.mjs); parts that render only inside a
 * context were added from their `defaultTag`. Rerun the probe when a part's root element changes.
 */
const TEXT_PARTS = new Set([
  "AccordionTrigger", "AlertDialogAction", "AlertDialogCancel", "AlertDialogTrigger", "Badge", "BreadcrumbLink",
  "BreadcrumbSeparator", "Button", "ComboboxTrigger", "DescriptionTerm", "DialogClose", "DialogDescription",
  "DialogTitle", "DialogTrigger", "DrawerClose", "DrawerDescription", "DrawerNativeClose", "DrawerNativeTrigger",
  "DrawerTitle", "DrawerTrigger", "DropdownMenuItemDescription", "DropdownMenuItemIcon", "DropdownMenuItemText",
  "DropdownMenuTrigger", "EmptyDescription", "EmptyTitle", "FieldDescription", "FieldError", "FieldLabel",
  "FieldLegend", "FieldSeparator", "FileUploadTrigger", "Heading", "HoverCardTrigger", "InputGroupAddon", "ItemMedia",
  "NativeSelectOption", "PaginationLink", "PopoverClose", "PopoverTrigger", "TableCaption", "TableColumnHeader",
  "TableOfContentsIndicator", "TableOfContentsLink", "TableOfContentsRail", "TableRowHeader", "TabsTrigger", "Text",
  "ToastAction", "ToastClose", "TooltipTrigger",
  "a", "button", "caption", "dt", "em", "h1", "h2", "h3", "h4", "h5", "h6", "label", "legend", "option", "p", "small",
  "span", "strong", "summary", "th",
]);

/**
 * A slot inside a text part (at any depth) must be typed `string` in the contract. A `ReactNode` slot there lets
 * the slot code bring its own text part: `<EmptyTitle>{title}</EmptyTitle>` with `<Heading>` in `title` renders
 * `h1` in `h2`, which neither `tsc` nor the other rules see.
 */
function checkSlotsInText(ts, sf, body, slotLocals, textKeys, report) {
  const slotsIn = (expression) => {
    const found = new Set();
    const walk = (node) => {
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) return;
      // `rows.length` reads a number from a slot and `x.cta` is another object's property; `rows.map(…)` renders.
      const access = ts.isPropertyAccessExpression(node.parent) ? node.parent : undefined;
      const reads = access && (access.name === node || access.name.text === "length");
      if (ts.isIdentifier(node) && slotLocals.has(node.text) && !reads) found.add(node.text);
      ts.forEachChild(node, walk);
    };
    walk(expression);
    return found;
  };
  /** `as="h1"` makes any part a text part: `<CardTitle as="h1">` renders `h1`, though `CardTitle` is a `div`. */
  const textAs = (opening) => {
    for (const attribute of opening.attributes.properties) {
      if (!ts.isJsxAttribute(attribute) || attribute.name.getText(sf) !== "as" || !attribute.initializer) continue;
      const value = ts.isJsxExpression(attribute.initializer) ? attribute.initializer.expression : attribute.initializer;
      if (value && ts.isStringLiteralLike(value) && /^[a-z]/.test(value.text) && TEXT_PARTS.has(value.text)) return value.text;
    }
    return undefined;
  };
  const visit = (node, part) => {
    if (ts.isJsxElement(node)) {
      const name = node.openingElement.tagName.getText(sf);
      const as = textAs(node.openingElement);
      const tag = as ? `${name} as="${as}"` : name;
      // The outermost text part names the finding; each slot is reported once per such part.
      const inside = part ?? (as || TEXT_PARTS.has(name) ? { tag, seen: new Set() } : null);
      for (const child of node.children) visit(child, inside);
      return;
    }
    if (part && ts.isJsxExpression(node) && node.expression) {
      for (const local of slotsIn(node.expression)) {
        const key = slotLocals.get(local);
        if (textKeys.has(key) || part.seen.has(key)) continue;
        part.seen.add(key);
        report(
          node,
          "design-slot-in-text",
          `slot "${key}" is rendered inside <${part.tag}>, a text part: type it ${key}: string in ../contract.ts, or render {${local}} outside <${part.tag}> and let the slot code pick the element`,
        );
      }
    }
    ts.forEachChild(node, (child) => visit(child, part));
  };
  visit(body, null);
}

/** `&&`, `||`, `??` or `? :` between the wrapper and the design: the wrapper renders only with the slot. */
function isConditional(ts, node, stop) {
  for (let parent = node.parent; parent && parent !== stop; parent = parent.parent) {
    if (ts.isConditionalExpression(parent)) return true;
    if (ts.isBinaryExpression(parent)) {
      const operator = parent.operatorToken.kind;
      if (operator === ts.SyntaxKind.AmpersandAmpersandToken || operator === ts.SyntaxKind.BarBarToken || operator === ts.SyntaxKind.QuestionQuestionToken) return true;
    }
  }
  return false;
}

/**
 * An optional slot that is the only content of an element, with no condition around it: without the
 * slot the element still renders, empty (an empty `Alert`, a `CardFooter` that adds a gap).
 */
function checkEmptyWrappers(ts, sf, body, optionalLocals, report) {
  const visit = (node) => {
    if (ts.isJsxElement(node)) {
      const content = node.children.filter((child) => !(ts.isJsxText(child) && child.containsOnlyTriviaWhiteSpaces));
      const [only] = content;
      const local = content.length === 1 && ts.isJsxExpression(only) && only.expression && ts.isIdentifier(only.expression) ? only.expression.text : undefined;
      if (local !== undefined && optionalLocals.has(local) && !isConditional(ts, node, body)) {
        const tag = node.openingElement.tagName.getText(sf);
        report(
          node,
          "design-empty-wrapper",
          `optional slot "${optionalLocals.get(local)}" is the only content of <${tag}>: without it <${tag}> renders empty; write {${local} && <${tag}>{${local}}</${tag}>}`,
          "warning",
        );
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(body);
}

/** `./designs` and `./designs/index` with any extension: the registry of every design, not one design. */
const DESIGNS_MODULE = /^\.\/designs(?:\/|$)/;
const DESIGNS_REGISTRY = /^\.\/designs(?:\/index(?:\.[cm]?[jt]sx?)?)?\/?$/;

/**
 * `active.ts` of a feature (next to `contract.ts`) picks the design the product renders. It imports one
 * file `./designs/<name>`: the registry `./designs` references every design, so the bundle gets them all.
 * Type-only imports do not count. Same finding shape as `screenFindings`.
 * @param {string} file
 * @param {string} source
 * @param {typeof import("typescript")} typescript
 * @returns {{ file: string; line: number; column: number; rule: string; message: string }[]}
 */
export function activeFindings(file, source, typescript) {
  const ts = typescript;
  if (!ts?.createSourceFile) throw new Error("TypeScript parser is not available.");
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const findings = [];
  const report = (node, message) => {
    const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    findings.push({ file, line: line + 1, column: character + 1, rule: "active-direct-import", message });
  };
  const designs = [];
  for (const statement of sf.statements) {
    const spec = statement.moduleSpecifier;
    if (!spec || !ts.isStringLiteral(spec) || !DESIGNS_MODULE.test(spec.text)) continue;
    if (ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly) continue;
    if (ts.isExportDeclaration(statement) && statement.isTypeOnly) continue;
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
    if (DESIGNS_REGISTRY.test(spec.text)) {
      report(statement, `import one design file (./designs/<name>), not the registry ${spec.text}: the registry puts every design into the bundle`);
    }
    designs.push(statement);
  }
  if (designs.length !== 1) {
    report(designs[1] ?? sf.statements[0] ?? sf, `active.ts imports ${designs.length} designs; it imports exactly one file from ./designs/`);
  }
  return findings;
}
