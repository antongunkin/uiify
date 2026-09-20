import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useControllableOpenChange } from "./use-controllable-open-change.js";

describe("useControllableOpenChange", () => {
  it("updates open state and reports cancellable details", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableOpenChange({ defaultOpen: false, onOpenChange }),
    );

    act(() => {
      expect(result.current.requestChange(true, "trigger-press")).toBe(true);
    });
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: "trigger-press", isCanceled: false }),
    );
  });

  it("does not update open when details are canceled", () => {
    const onOpenChange = vi.fn((_, details) => details.cancel());
    const { result } = renderHook(() =>
      useControllableOpenChange({ defaultOpen: false, onOpenChange }),
    );

    act(() => {
      expect(result.current.requestChange(true, "programmatic")).toBe(false);
    });
    expect(result.current.open).toBe(false);
  });
});
