// Compile-time contract: the generated catalog types reject the same mistakes the runtime
// validator rejects, and a model writing a document in code sees the error where the mistake is.
// `npx tsc --noEmit -p packages/uiify` checks every `@ts-expect-error` below (an unused one is
// TS2578), and `diagnostics.test.ts` pins where each error is reported and how long it is.
// Documents in code are checked with `satisfies UiNodeInput`, which reports a mistake against
// the part it is in; `UiNode` alone makes TypeScript compare it with every part at the root.
// Each expect-error comment sits directly above the one line with the wrong key or value.
import { expect, it } from "vitest";
import type { UiNodeInput } from "./index.js";

// Raw JSX children are in documents.typecheck.test.tsx (they need a .tsx file).
// Rules that only exist at runtime (part outside its root, a FieldLabel htmlFor or
// aria-describedby id with no target, duplicate ids, depth, node and string limits, shared
// nodes) are covered by validate.test.ts.

export const unknownType = {
  type: "form",
  props: {},
  children: [
    // @ts-expect-error "Buton" is not a part type
    { type: "Buton", props: {} },
  ],
} satisfies UiNodeInput;

export const unknownProp = {
  type: "form",
  props: {},
  children: [
    {
      type: "Button",
      // @ts-expect-error "colour" is not a Button prop
      props: { colour: "red" },
      children: ["Go"],
    },
  ],
} satisfies UiNodeInput;

export const valueOutsideSet = {
  type: "form",
  props: {},
  children: [
    {
      type: "Button",
      // @ts-expect-error "primary" is not a Button variant
      props: { variant: "primary" },
      children: ["Go"],
    },
  ],
} satisfies UiNodeInput;

export const missingRequiredProp = {
  type: "form",
  props: {},
  children: [
    {
      type: "Checkbox",
      // @ts-expect-error Checkbox requires "id"
      props: {},
    },
  ],
} satisfies UiNodeInput;

export const childrenOnLeaf = {
  type: "NativeSelect",
  props: {},
  children: [
    {
      type: "NativeSelectSeparator",
      props: {},
      // @ts-expect-error NativeSelectSeparator takes no children
      children: ["x"],
    },
  ],
} satisfies UiNodeInput;

export const unsafeUrl = {
  type: "form",
  props: {},
  children: [
    {
      type: "a",
      // @ts-expect-error a `javascript:` URL is not an allowed scheme
      props: { href: "javascript:alert(1)" },
      children: ["x"],
    },
  ],
} satisfies UiNodeInput;

export const unsafeAvatarSrc = {
  type: "Avatar",
  // @ts-expect-error a `javascript:` URL is not an allowed scheme
  props: { name: "Ada", fallback: "A", src: "javascript:alert(1)" },
} satisfies UiNodeInput;

export const childNotTextOrNode = {
  type: "form",
  props: {},
  children: [
    // @ts-expect-error a child is a string or a node, not a number
    5,
  ],
} satisfies UiNodeInput;

export const nodeWithoutType = {
  type: "form",
  props: {},
  children: [
    // @ts-expect-error a node needs a "type"
    { props: {} },
  ],
} satisfies UiNodeInput;

const rows = [
  { name: "Free", price: "$0" },
  { name: "Team", price: "$12" },
];

// A `.map()` callback annotated with the node type is the supported way to build lists.
export const mappedChildren = {
  type: "ul",
  props: {},
  children: rows.map((row): UiNodeInput => ({
    type: "li",
    props: {},
    children: [row.name, row.price],
  })),
} satisfies UiNodeInput;

it("keeps the negative cases importable so the compiler checks them", () => {
  expect(mappedChildren.children).toHaveLength(rows.length);
});
