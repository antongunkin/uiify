import { describe, expect, it, vi } from "vitest";
import { assignRef } from "./assign-ref.js";

describe("assignRef", () => {
  it("writes to object refs", () => {
    const ref = { current: null as HTMLDivElement | null };
    const node = document.createElement("div");
    assignRef(ref, node);
    expect(ref.current).toBe(node);
  });

  it("invokes callback refs and returns cleanup", () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const node = document.createElement("div");
    const returned = assignRef(ref, node);
    expect(ref).toHaveBeenCalledWith(node);
    expect(returned).toBe(cleanup);
  });

  it("ignores undefined refs", () => {
    expect(() => assignRef(undefined, null)).not.toThrow();
  });
});
