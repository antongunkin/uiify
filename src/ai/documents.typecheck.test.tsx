// Raw JSX as a child is a compile error: children are nodes and strings only. The message is
// longer than for other mistakes (TypeScript compares a React element with every node shape), so
// diagnostics.test.ts checks only where it is reported. See documents.typecheck.test.ts.
import { expect, it } from "vitest";
import type { UiNodeInput } from "./index.js";

const element = <b>x</b>;

export const rawJsxChild = {
  type: "form",
  props: {},
  children: [
    // @ts-expect-error a JSX element is not a document node
    element,
  ],
} satisfies UiNodeInput;

it("keeps the JSX case importable so the compiler checks it", () => {
  expect(rawJsxChild.children).toHaveLength(1);
});
