import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { splitRef } from "./split-ref.js";

describe("splitRef", () => {
  it("returns the ref and props without it", () => {
    const ref = createRef<HTMLButtonElement>();
    const [extracted, rest] = splitRef<HTMLButtonElement, { ref: typeof ref; id: string }>({
      id: "x",
      ref,
    });
    expect(extracted).toBe(ref);
    expect(rest).toEqual({ id: "x" });
    expect("ref" in rest).toBe(false);
  });

  it("returns undefined and an equal object when there is no ref", () => {
    const props = { id: "x" };
    const [extracted, rest] = splitRef<HTMLButtonElement, typeof props>(props);
    expect(extracted).toBeUndefined();
    expect(rest).toEqual({ id: "x" });
  });

  it("does not mutate the input", () => {
    const ref = createRef<HTMLButtonElement>();
    const props = { id: "x", ref };
    splitRef<HTMLButtonElement, typeof props>(props);
    expect(props.ref).toBe(ref);
  });
});
