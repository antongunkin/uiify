import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEventCallback } from "./use-event-callback.js";

describe("useEventCallback", () => {
  it("keeps a stable identity but calls the latest callback", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useEventCallback(() => value),
      { initialProps: { value: 1 } },
    );
    const first = result.current;
    rerender({ value: 2 });
    expect(result.current).toBe(first); // identity stable across renders
    expect(result.current()).toBe(2); // but reads the latest value
  });
});
