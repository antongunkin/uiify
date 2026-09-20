import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMounted } from "./use-is-mounted.js";

describe("useIsMounted", () => {
  it("reports true while mounted and false after unmount", () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    expect(result.current()).toBe(true);
    unmount();
    expect(result.current()).toBe(false);
  });
});
