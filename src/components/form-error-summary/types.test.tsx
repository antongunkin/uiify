import { expect, it } from "vitest";
import type { FormErrorSummaryProps } from "./types.js";

it("accepts native generated-part props and protects the error link and anatomy", () => {
  const valid: FormErrorSummaryProps = {
    title: "Errors",
    errors: [{ href: "#email", message: "Invalid email" }],
    slotProps: {
      title: { className: "title", "data-testid": "title" },
      list: { "data-testid": "list" },
      item: { byItemValue: { "#email": { "data-testid": "item" } } },
      link: { byItemValue: { "#email": { title: "Fix email", "data-testid": "link" } } },
    },
  };
  const invalidHref: FormErrorSummaryProps = {
    title: "Errors",
    errors: [{ href: "#email", message: "Invalid email" }],
    // @ts-expect-error Field destinations are owned by the error records.
    slotProps: { link: { href: "#other" } },
  };
  const invalidPart: FormErrorSummaryProps = {
    title: "Errors",
    errors: [{ href: "#email", message: "Invalid email" }],
    // @ts-expect-error Generated anatomy markers are library-owned.
    slotProps: { item: { "data-part": "other" } },
  };

  expect([valid, invalidHref, invalidPart].length).toBe(3);
});
