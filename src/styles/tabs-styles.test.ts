import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { validateRecipeSyntax } from "./build/validate.js";
import { defineStyle } from "./define.js";
import { tabs } from "./uiify/tabs.js";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs/index.js";

const behaviorCss = readFileSync(
  resolve(import.meta.dirname, "../components/behavior.css"),
  "utf8",
);

let rules: postcss.Rule[] = [];

beforeAll(async () => {
  const compiled = await compileStyle(defineStyle("probe", [tabs]), {
    tailwindEntry: resolve(import.meta.dirname, "build/entry.css"),
    effectsCss: "",
  });
  rules = [];
  postcss.parse(compiled.perRecipe.get("tabs")!).walkRules((rule) => {
    if (rule.selector.includes(".uiify-tabs")) rules.push(rule);
  });
});

/** The real TabsTrigger markup, A checked: each trigger keeps its own wrapper, so `peer-*` stays inside it. */
function renderList(): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    createElement(
      Tabs,
      null,
      createElement(
        TabsList,
        null,
        createElement(TabsTrigger, { name: "t", value: "a", defaultChecked: true }, "A"),
        createElement(TabsTrigger, { name: "t", value: "b" }, "B"),
        createElement(TabsTrigger, { name: "t", value: "c" }, "C"),
      ),
    ),
  );
  document.body.replaceChildren(host);
  return host;
}

const checkedRules = () => rules.filter((rule) => rule.selector.includes(":checked"));

describe("Tabs CSS", () => {
  it("uses standard utilities only", () => {
    expect(validateRecipeSyntax(tabs)).toEqual([]);
  });

  it("styles only the label right after the checked control", () => {
    const host = renderList();
    const [a, b, c] = host.querySelectorAll("label");
    expect(checkedRules().length).toBeGreaterThan(0);
    expect(checkedRules().some((rule) => a!.matches(rule.selector))).toBe(true);
    for (const label of [b!, c!]) {
      expect(checkedRules().filter((rule) => label.matches(rule.selector))).toEqual([]);
    }
  });

  it("keeps the content rule free of other components' parts", () => {
    const host = document.createElement("div");
    host.innerHTML = `
      <div class="uiify-tabs">
        <div class="uiify-tabs-content" data-value="a">
          <button class="uiify-button" data-part="trigger">Preferences</button>
        </div>
      </div>`;
    const nested = host.querySelector("button")!;
    expect(rules.filter((rule) => nested.matches(rule.selector))).toEqual([]);
  });
});

describe("Tabs behavior CSS", () => {
  const normalized = behaviorCss
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")");

  it("pairs the n-th checked trigger with the n-th content for 1..12", () => {
    for (let index = 1; index <= 12; index += 1) {
      expect(normalized).toContain(
        `.uiify-tabs:has(> .uiify-tabs-list > .uiify-tabs-item:nth-child(${index} of .uiify-tabs-item) > .uiify-tabs-control:checked) > .uiify-tabs-content:nth-child(${index} of .uiify-tabs-content)`,
      );
    }
    expect(normalized).not.toContain("nth-child(13 of");
  });

  it("shows the first content while no trigger is checked", () => {
    expect(normalized).toContain(
      ".uiify-tabs:not(:has(> .uiify-tabs-list > .uiify-tabs-item > .uiify-tabs-control:checked)) > .uiify-tabs-content:nth-child(1 of .uiify-tabs-content)",
    );
    expect(normalized).toContain(".uiify-tabs > .uiify-tabs-content { display: none; }");
  });
});
