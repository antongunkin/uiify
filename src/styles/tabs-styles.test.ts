import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const tabsCss = readFileSync(resolve(import.meta.dirname, "components/tabs.css"), "utf8");
const root = postcss.parse(tabsCss);
const rules: postcss.Rule[] = [];
root.walkRules((rule) => {
  rules.push(rule);
});

describe("Tabs skin CSS payload", () => {
  it("does not style other components' triggers or panels inside a tab panel", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <div data-uiify-tabs>
        <div data-part="item">
          <label data-part="trigger">Overview</label>
          <div data-part="panel">
            <button data-uiify-popup data-uiify-button data-part="trigger">Preferences</button>
            <div data-part="panel">Nested component content</div>
          </div>
        </div>
      </div>
    `;
    const [trigger, panel] = container.querySelectorAll('[data-part="panel"] > [data-part]');
    for (const element of [trigger!, panel!]) {
      const matching = rules.filter((rule) => element.matches(rule.selector));
      expect(matching.map((rule) => rule.selector)).toEqual([]);
    }
    const tabTrigger = container.querySelector("label")!;
    expect(rules.some((rule) => tabTrigger.matches(rule.selector))).toBe(true);
  });

  it("declares panel typography once while retaining the direct panel layout rule", () => {
    const panelRules = rules.filter((rule) => rule.selector.includes('[data-part="panel"]'));
    const typography = panelRules.flatMap((rule) =>
      rule.nodes.filter(
        (node): node is postcss.Declaration =>
          node.type === "decl" && (node.prop === "font-size" || node.prop === "line-height"),
      ),
    );

    expect(typography).toHaveLength(2);
    expect(panelRules.some((rule) => rule.selector.includes('> [data-part="item"]'))).toBe(true);
  });
});
