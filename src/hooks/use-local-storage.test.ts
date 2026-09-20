import { createElement, StrictMode } from "react";
import type { PropsWithChildren } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./use-local-storage.js";

describe("useLocalStorage", () => {
  beforeEach(() => window.localStorage.clear());

  it("reads the default, then persists writes as JSON", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(window.localStorage.getItem("count")).toBe("5");
  });

  it("hydrates an existing stored value on mount", () => {
    window.localStorage.setItem("name", JSON.stringify("ada"));
    const { result } = renderHook(() => useLocalStorage("name", "default"));
    expect(result.current[0]).toBe("ada");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("n", 1));
    act(() => result.current[1]((prev) => prev + 9));
    expect(result.current[0]).toBe(10);
  });

  it("composes batched updates and writes once per update under StrictMode", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const wrapper = ({ children }: PropsWithChildren) => createElement(StrictMode, null, children);
    wrapper.displayName = "wrapper";
    const { result } = renderHook(() => useLocalStorage("n", 0), { wrapper });

    act(() => {
      result.current[1]((prev) => prev + 1);
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem("n")).toBe("2");
    expect(setItem).toHaveBeenCalledTimes(2);
  });

  it("does not rehydrate on every render for an inline object default", () => {
    const { result, rerender } = renderHook(() => useLocalStorage("settings", { theme: "dark" }));
    const initialValue = result.current[0];

    rerender();

    expect(result.current[0]).toBe(initialValue);
  });
});
