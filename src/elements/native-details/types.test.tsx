import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { NativeDetailsContent, NativeDetailsRoot } from "./NativeDetails.js";

it("accepts native open alongside defaultOpen", () => {
  const root = <NativeDetailsRoot defaultOpen>Body</NativeDetailsRoot>;
  const withOpen = <NativeDetailsRoot open>Body</NativeDetailsRoot>;
  expect([root, withOpen]).toHaveLength(2);
});

it("is not polymorphic — NativeDetails.Root is always a <details>", () => {
  // @ts-expect-error -- Root has no `as`/`render`, unlike NativeDetails.Content.
  const el = <NativeDetailsRoot as="section">Body</NativeDetailsRoot>;
  expect(el).toBeDefined();
});

it("NativeDetails.Content accepts `as` or `render`, not both", () => {
  const elements: ReactElement[] = [
    <NativeDetailsContent key="default">Body</NativeDetailsContent>,
    <NativeDetailsContent key="ol" as="ol">
      <li>Item</li>
    </NativeDetailsContent>,
    <NativeDetailsContent key="render" render={(props) => <section {...props} />}>
      Body
    </NativeDetailsContent>,
    // @ts-expect-error -- as and render are mutually exclusive.
    <NativeDetailsContent key="both" as="ol" render={(props) => <section {...props} />}>
      Body
    </NativeDetailsContent>,
  ];
  expect(elements).toHaveLength(4);
});
