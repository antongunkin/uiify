import type { Ref } from "react";
import { describe, expect, it } from "vitest";
import { resolveRepeatedSlotProps } from "./slot-props.js";
import type { SlotProps } from "./slot-props.js";

describe("SlotProps", () => {
  it("accepts native attributes the component also writes by default", () => {
    const title: SlotProps<"h2"> = {
      id: "custom-title",
      "aria-level": 3,
      "data-part": "heading",
      "data-uiify-modal": undefined,
    };
    const trigger: SlotProps<"button"> = { type: "submit", "data-part": "opener" };
    expect([title.id, trigger.type]).toEqual(["custom-title", "submit"]);
  });
});

describe("resolveRepeatedSlotProps", () => {
  it("joins common and per-item classes and styles", () => {
    const props = resolveRepeatedSlotProps<{
      className?: string;
      style?: { color?: string; margin?: number };
    }>(
      {
        className: "a",
        style: { color: "red" },
        byItemValue: { x: { className: "b", style: { margin: 1 } } },
      },
      "x",
    );
    expect(props).toEqual({ className: "a b", style: { color: "red", margin: 1 } });
  });

  it("leaves no empty className when neither side has a class", () => {
    const props = resolveRepeatedSlotProps<{ className?: string }>(
      { className: "", byItemValue: { x: {} } },
      "x",
    );
    expect(props.className).toBeUndefined();
  });

  it("runs the common handler, then the item handler, even after preventDefault", () => {
    const calls: string[] = [];
    type Click = { preventDefault(): void };
    const props = resolveRepeatedSlotProps<{ onClick?: (event: Click) => void }>(
      {
        onClick: (event) => {
          calls.push("common");
          event.preventDefault();
        },
        byItemValue: { x: { onClick: () => void calls.push("item") } },
      },
      "x",
    );
    props.onClick?.({ preventDefault: () => {} });
    expect(calls).toEqual(["common", "item"]);
  });

  it("attaches both refs and runs both cleanups", () => {
    const objectRef: { current: unknown } = { current: null };
    const seen: unknown[] = [];
    const props = resolveRepeatedSlotProps<{ ref?: Ref<unknown> }>(
      {
        ref: objectRef,
        byItemValue: {
          x: {
            ref: (node: unknown) => {
              seen.push(node);
              return () => void seen.push("cleanup");
            },
          },
        },
      },
      "x",
    );
    const node = {};
    const cleanup = (props.ref as (node: unknown) => () => void)(node);
    expect(objectRef.current).toBe(node);
    cleanup();
    expect(objectRef.current).toBeNull();
    expect(seen).toEqual([node, "cleanup"]);
  });

  it("ignores an unknown value and a missing slot, never returns byItemValue", () => {
    expect(resolveRepeatedSlotProps({ id: "a", byItemValue: { x: { id: "b" } } }, "y")).toEqual({
      id: "a",
    });
    expect(resolveRepeatedSlotProps(undefined, "x")).toEqual({});
  });
});
