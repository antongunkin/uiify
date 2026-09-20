import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useControllableState } from "./use-controllable-state.js";

describe("useControllableState", () => {
  it("uncontrolled: updates internal state and calls onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string>({ defaultValue: "a", onChange }),
    );
    expect(result.current[0]).toBe("a");
    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("b");
    expect(onChange).toHaveBeenLastCalledWith("b");
  });

  it("controlled: does not change internal value, only calls onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState<string>({ value: "x", onChange }));
    act(() => result.current[1]("y"));
    expect(result.current[0]).toBe("x"); // parent still owns it
    expect(onChange).toHaveBeenCalledWith("y");
  });

  it("supports functional updates and no-ops on unchanged value", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<number>({ defaultValue: 1, onChange }),
    );
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
    act(() => result.current[1](2)); // same value
    expect(onChange).toHaveBeenCalledTimes(1); // not called again
  });

  it("composes multiple functional updates in the same event", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<number>({ defaultValue: 0, onChange }),
    );

    act(() => {
      result.current[1]((prev) => prev + 1);
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 2);
  });
});
