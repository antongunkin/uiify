/**
 * Closed-vocabulary rules for /uiify screens (TSX that only composes @gunkin/uiify components).
 * Pure: the consumer's own TypeScript is passed in, so sync can copy this file into the skill.
 */

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

/** `@gunkin/uiify`, `@gunkin/uiify/components/<name>` and `@gunkin/uiify/components/<name>/client`. */
function isUiifyModule(spec) {
  return spec === "@gunkin/uiify" || /^@gunkin\/uiify\/components\/[^/]+(?:\/client)?$/.test(spec);
}

/**
 * Findings are errors unless `severity` is "warning".
 * @param {string} file
 * @param {string} source
 * @param {typeof import("typescript")} typescript
 * @param {{ allow?: readonly string[] }} [options]
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
  const allowedModule = (spec) =>
    isUiifyModule(spec) ||
    spec.startsWith("./") ||
    spec.startsWith("../") ||
    allow.some((rule) => (rule.endsWith("*") ? spec.startsWith(rule.slice(0, -1)) : spec === rule));

  const checkModule = (node, spec, kind) => {
    if (!allowedModule(spec)) {
      report(node, "screen-import", `${kind} from "${spec}" is not allowed in screens (allowed: @gunkin/uiify, @gunkin/uiify/components/<name>[/client], relative paths${allow.length ? `, ${allow.join(", ")}` : ""})`);
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

  const visit = (node, inside) => {
    const specifier =
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier
        : undefined;
    if (specifier) checkModule(node, specifier.text, ts.isImportDeclaration(node) ? "import" : "export");
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      const kind = node.expression.kind === ts.SyntaxKind.ImportKeyword ? "dynamic import" : "require";
      const [argument] = node.arguments;
      if (argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) checkModule(node, argument.text, kind);
      else report(node, "screen-import", `${kind} with a non-literal argument cannot be verified: use a static import`);
    }
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf);
      if (name === "className") report(node, "screen-class-name", '"className" is not allowed in screens: use component props');
      else if (name === "style") report(node, "screen-style", '"style" is not allowed in screens: use component props');
      else if (/^on[A-Z]/.test(name)) report(node, "screen-handler", `event handler "${name}" is not allowed: screens are static`);
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
