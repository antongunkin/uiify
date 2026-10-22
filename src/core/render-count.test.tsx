import { Profiler } from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RovingFocusItem, RovingFocusRoot } from "./roving-focus.js";

describe("roving focus render budget", () => {
  it("rerenders only the previous and next item subtrees", () => {
    const renders = Array.from({ length: 100 }, () => 0);
    function Item({ index }: { readonly index: number }) {
      return (
        <Profiler
          id={String(index)}
          onRender={() => {
            renders[index] = (renders[index] ?? 0) + 1;
          }}
        >
          <RovingFocusItem as="button" textValue={`Item ${index}`}>
            Item {index}
          </RovingFocusItem>
        </Profiler>
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

    expect(document.activeElement).toBe(getByRole("button", { name: "Item 1" }));
    expect(renders.slice(2).every((count) => count === 0)).toBe(true);
    expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(2);
  });
});
