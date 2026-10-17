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

function sourceCheck(id, law, message, violates) {
  return {
    id,
    kind: "static",
    law,
    run(input) {
      const tree = parse(input);
      const { file, typescript } = input;
      const findings = [];
      const visit = (node) => {
        if (
          (typescript.isJsxOpeningElement(node) || typescript.isJsxSelfClosingElement(node)) &&
          typescript.isIdentifier(node.tagName) &&
          /^[a-z][a-z0-9-]*$/.test(node.tagName.text) &&
          violates(node.tagName.text, attributes(node, typescript), typescript)
        ) {
          findings.push({
            file,
            line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1,
            rule: id,
            message,
          });
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
    (tag, attrs) => tag === "button" && !attrs.some((attr) => attr.name.text === "type"),
  ),
  sourceCheck(
    "image-alt",
    "accessibility",
    "Give the intrinsic image an alt attribute (empty for decoration).",
    (tag, attrs) => tag === "img" && !attrs.some((attr) => attr.name.text === "alt"),
  ),
];
