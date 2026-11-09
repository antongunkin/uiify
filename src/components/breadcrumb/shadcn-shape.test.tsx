import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
// The file loader finds .htmlvalidate.json by walking up from this path.
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "breadcrumb.html");
// React writes boolean attributes as `open=""`, the "empty" style.
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

async function problems(markup: string) {
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  return report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
}

function host(markup: string) {
  const element = document.createElement("div");
  element.innerHTML = markup;
  return element;
}

it("a literal shadcn/ui breadcrumb renders valid HTML with separators as list items", async () => {
  const markup = renderToStaticMarkup(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
  );
  expect(await problems(markup)).toEqual([]);
  const root = host(markup);
  const separators = root.querySelectorAll("ol > li.uiify-breadcrumb-separator");
  expect(separators).toHaveLength(2);
  for (const separator of separators) {
    expect(separator.getAttribute("aria-hidden")).toBe("true");
    expect(separator.getAttribute("role")).toBe("none");
  }
  const current = root.querySelector('[aria-current="page"]');
  expect(current?.localName).toBe("span");
  expect(current?.className).toBe("uiify-breadcrumb-page");
  expect(root.querySelector("li > span[aria-hidden='true']")?.textContent).toBe("…");
});

it("items with maxItems render valid HTML: separators between items and links in list items", async () => {
  const items = [
    { key: "home", href: "/", label: "Home" },
    { key: "docs", href: "/docs", label: "Docs" },
    { key: "components", href: "/docs/components", label: "Components" },
    { key: "breadcrumb", current: true, label: "Breadcrumb" },
  ];
  const markup = renderToStaticMarkup(
    <Breadcrumb>
      <BreadcrumbList items={items} maxItems={3} separator="/" />
    </Breadcrumb>,
  );
  expect(await problems(markup)).toEqual([]);
  const root = host(markup);
  const list = root.querySelector("ol.uiify-breadcrumb-list")!;
  expect([...list.children].map((child) => child.className)).toEqual([
    "uiify-breadcrumb-item",
    "uiify-breadcrumb-separator",
    "uiify-breadcrumb-item",
    "uiify-breadcrumb-separator",
    "uiify-breadcrumb-item",
  ]);
  for (const link of root.querySelectorAll(".uiify-breadcrumb-ellipsis-content > *")) {
    expect(link.localName).toBe("li");
  }
  expect(root.querySelector('[aria-current="page"]')?.localName).toBe("span");
});
