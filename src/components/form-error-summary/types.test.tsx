import { expect, it } from "vitest";
import type { FormErrorSummaryProps } from "./types.js";

it("accepts native generated-part overrides for links and anatomy", () => {
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
  const nativeHref: FormErrorSummaryProps = {
    title: "Errors",
    errors: [{ href: "#email", message: "Invalid email" }],
    slotProps: { link: { href: "#other" } },
  };
  const nativePart: FormErrorSummaryProps = {
    title: "Errors",
    errors: [{ href: "#email", message: "Invalid email" }],
    slotProps: { item: { "data-part": "other" } },
  };

  expect([valid, nativeHref, nativePart].length).toBe(3);
});
