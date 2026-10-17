/** Parser-backed source facts only. Kept dependency-free so sync can copy it into the skill. */
function parse({ source, file, typescript }) {
  if (!typescript?.createSourceFile) {
    throw Object.assign(new Error("TypeScript parser is not installed in the consumer project."), {
      code: "MISSING_TYPESCRIPT",
    });
  }
  const tree = typescript.createSourceFile(file, source, typescript.ScriptTarget.Latest, true);
  if (tree.parseDiagnostics.length > 0) {
    const diagnostic = tree.parseDiagnostics[0];
    const { line } = tree.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    throw Object.assign(
      new Error(
        `${file}:${line + 1}: cannot parse source: ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
      ),
      { code: "PARSE_ERROR" },
    );
  }
  return tree;
}

function attributes(node, typescript) {
  return node.attributes.properties.filter((attribute) => typescript.isJsxAttribute(attribute));
}

function positiveLiteral(attribute, typescript) {
  let value = attribute.initializer;
  if (value && typescript.isJsxExpression(value)) value = value.expression;
  while (value && typescript.isParenthesizedExpression(value)) value = value.expression;
  if (
    value &&
    typescript.isPrefixUnaryExpression(value) &&
    value.operator === typescript.SyntaxKind.PlusToken
  ) {
    value = value.operand;
  }
  return Boolean(
    value &&
    (typescript.isNumericLiteral(value) || typescript.isStringLiteral(value)) &&
    Number(value.text) > 0,
  );
}

const UIIFY_MODULE = /^@gunkin\/uiify\/(?:components|elements)(?:\/[a-z0-9-]+)?$/;

function uiifyBindings(tree, typescript) {
  const bindings = new Set();
  for (const statement of tree.statements) {
    if (
      !typescript.isImportDeclaration(statement) ||
      !typescript.isStringLiteral(statement.moduleSpecifier) ||
      !UIIFY_MODULE.test(statement.moduleSpecifier.text)
    ) continue;
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    if (clause.name) bindings.add(clause.name.text);
    const namedBindings = clause.namedBindings;
    if (namedBindings && typescript.isNamespaceImport(namedBindings)) {
      bindings.add(namedBindings.name.text);
    } else if (namedBindings && typescript.isNamedImports(namedBindings)) {
      for (const specifier of namedBindings.elements) {
        if (!specifier.isTypeOnly) bindings.add(specifier.name.text);
      }
    }
  }

  const shadowable = new Set([
    typescript.SyntaxKind.VariableDeclaration,
    typescript.SyntaxKind.BindingElement,
    typescript.SyntaxKind.Parameter,
    typescript.SyntaxKind.FunctionDeclaration,
    typescript.SyntaxKind.FunctionExpression,
    typescript.SyntaxKind.ClassDeclaration,
    typescript.SyntaxKind.ClassExpression,
  ]);
  const visit = (node) => {
    if (shadowable.has(node.kind) && node.name && typescript.isIdentifier(node.name)) {
      bindings.delete(node.name.text);
    }
    typescript.forEachChild(node, visit);
  };
  visit(tree);
  return bindings;
}

function jsxTarget(tagName, bindings, typescript) {
  if (typescript.isIdentifier(tagName)) {
    if (/^[a-z][a-z0-9-]*$/.test(tagName.text)) return { kind: "intrinsic", tag: tagName.text };
    if (bindings.has(tagName.text)) return { kind: "uiify", name: tagName.text };
    return null;
  }
  if (!typescript.isPropertyAccessExpression(tagName)) return null;
  let root = tagName.expression;
  while (typescript.isPropertyAccessExpression(root)) root = root.expression;
  return typescript.isIdentifier(root) && bindings.has(root.text)
    ? { kind: "uiify", name: tagName.getText() }
    : null;
}

function sourceCheck(id, law, message, violates) {
  return {
    id,
    kind: "static",
    law,
    run(input) {
      const tree = parse(input);
      const { file, typescript } = input;
      const bindings = uiifyBindings(tree, typescript);
      const findings = [];
      const visit = (node) => {
        if (typescript.isJsxOpeningElement(node) || typescript.isJsxSelfClosingElement(node)) {
          const target = jsxTarget(node.tagName, bindings, typescript);
          if (target && violates(target, attributes(node, typescript), typescript)) {
            findings.push({
              file,
              line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1,
              rule: id,
              message,
            });
          }
        }
        typescript.forEachChild(node, visit);
      };
      visit(tree);
      return { pass: findings.length === 0, detail: `${findings.length} ${id} findings`, findings };
    },
  };
}

export const staticChecks = [
  sourceCheck(
    "no-positive-tabindex",
    "accessibility",
    "Use zero or negative tabIndex instead of a positive literal.",
    (_, attrs, typescript) =>
      attrs.some((attr) => attr.name.text === "tabIndex" && positiveLiteral(attr, typescript)),
  ),
  sourceCheck(
    "button-type",
    "error-prevention",
    "Give the intrinsic button an explicit type.",
    (target, attrs) =>
      target.kind === "intrinsic" && target.tag === "button" && !attrs.some((attr) => attr.name.text === "type"),
  ),
  sourceCheck(
    "image-alt",
    "accessibility",
    "Give the intrinsic image an alt attribute (empty for decoration).",
    (target, attrs) =>
      target.kind === "intrinsic" && target.tag === "img" && !attrs.some((attr) => attr.name.text === "alt"),
  ),
];
