import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RovingFocusItem, RovingFocusRoot } from "./roving-focus.js";

describe("roving focus render budget", () => {
  it(
    "rerenders only the previous and next items in a 1,000-item group",
    { timeout: 30_000 },
    () => {
      const renders = Array.from({ length: 1000 }, () => 0);
      function Item({ index }: { readonly index: number }) {
        renders[index] = (renders[index] ?? 0) + 1;
        return (
          <RovingFocusItem as="button" textValue={`Item ${index}`}>
            Item {index}
          </RovingFocusItem>
        );
      }
      Item.displayName = "Item";

      const { getByRole } = render(
        <RovingFocusRoot orientation="horizontal">
          {renders.map((_, index) => (
            <Item index={index} key={index} />
          ))}
        </RovingFocusRoot>,
      );
      renders.fill(0);
      fireEvent.keyDown(getByRole("button", { name: "Item 0" }), {
        key: "ArrowRight",
      });

      expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(2);
    },
  );
});
