// The HTML a document renders to must be valid and accessible as it leaves the server: this is
// what a browser parses before any script runs. Each fixture is stream-rendered, then checked by
// html-validate (config: the package's .htmlvalidate.json) and by axe-core inside jsdom.
import axe from "axe-core";
import { FileSystemConfigLoader, HtmlValidate } from "html-validate";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import type { UiNodeInput } from "./catalog.generated.js";
import { filterDocument, pricingDocument, settingsDocument } from "./test-utils/documents.js";
import { renderDocumentHtml } from "./test-utils/render-html.js";

const fixtures = [
  ["filterDocument", filterDocument],
  ["settingsDocument", settingsDocument],
  ["pricingDocument", pricingDocument],
] as const;

// A document is a fragment of a page, so check it in the page it would be placed in.
const pageStart = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>`;
const pageEnd = `</main></body></html>`;

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
// The file loader finds .htmlvalidate.json by walking up from this path; a bare
// `new HtmlValidate()` would ignore it.
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "rendered-html.html");

afterEach(() => {
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe.each(fixtures)("%s rendered HTML", (_name, fixture) => {
  it("is valid HTML", async () => {
    const html = pageStart + (await renderDocumentHtml(fixture)) + pageEnd;
    const report = await htmlValidate.validateString(html, configFilename);
    const messages = report.results.flatMap((result) =>
      result.messages.map(
        (message) => `${message.ruleId} ${message.line}:${message.column} ${message.message}`,
      ),
    );
    expect(messages).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("has no axe violations", async () => {
    document.documentElement.lang = "en";
    document.title = "Fixture";
    document.body.innerHTML = `<main>${await renderDocumentHtml(fixture)}</main>`;
    const results = await axe.run(document, {
      // jsdom has no layout engine, so it cannot compute colors or contrast.
      rules: { "color-contrast": { enabled: false } },
    });
    const violations = results.violations.map(
      (violation) =>
        `${violation.id}: ${violation.help} ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
    );
    expect(violations).toEqual([]);
  });
});

// The nesting rule in rules.ts sees native parents only. A component that renders `p`
// (EmptyDescription) around a block part (Stack, a `div`) is caught by html-validate on the
// rendered HTML instead: the parser closes the `p` before the `div`, as a browser does, so the
// page would not hydrate. TSX gives the same HTML; in designs `design-slot-in-text` catches it.
describe("block layout part inside EmptyDescription", () => {
  const document = {
    type: "Empty",
    props: {},
    children: [
      { type: "EmptyTitle", props: {}, children: ["No projects"] },
      {
        type: "EmptyDescription",
        props: {},
        children: [{ type: "Stack", props: {}, children: ["Create one"] }],
      },
    ],
  } satisfies UiNodeInput;

  it("is rejected by html-validate", async () => {
    const html = pageStart + (await renderDocumentHtml(document)) + pageEnd;
    const report = await htmlValidate.validateString(html, configFilename);
    const rules = report.results.flatMap((result) => result.messages.map((m) => m.ruleId));
    expect(report.valid).toBe(false);
    expect(rules).toEqual(expect.arrayContaining(["no-implicit-close", "close-order"]));
  });
});
