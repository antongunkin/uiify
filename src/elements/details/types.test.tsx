import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { DetailsContent, DetailsRoot } from "./Details.js";

it("does not expose native `open` — use `defaultOpen`", () => {
  const root = <DetailsRoot defaultOpen>Body</DetailsRoot>;
  // @ts-expect-error -- open is native state; the browser owns it after defaultOpen.
  const withOpen = <DetailsRoot open>Body</DetailsRoot>;
  expect([root, withOpen]).toHaveLength(2);
});

it("is not polymorphic — Details.Root is always a <details>", () => {
  // @ts-expect-error -- Root has no `as`/`render`, unlike Details.Content.
  const el = <DetailsRoot as="section">Body</DetailsRoot>;
  expect(el).toBeDefined();
});

it("Details.Content accepts `as` or `render`, not both", () => {
  const elements: ReactElement[] = [
    <DetailsContent key="default">Body</DetailsContent>,
    <DetailsContent key="ol" as="ol">
      <li>Item</li>
    </DetailsContent>,
    <DetailsContent key="render" render={(props) => <section {...props} />}>
      Body
    </DetailsContent>,
    // @ts-expect-error -- as and render are mutually exclusive.
    <DetailsContent key="both" as="ol" render={(props) => <section {...props} />}>
      Body
    </DetailsContent>,
  ];
  expect(elements).toHaveLength(4);
});
