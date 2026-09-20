import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRef } from "react";
import { useIntersectionObserver } from "./use-intersection-observer.js";

describe("useIntersectionObserver", () => {
  let trigger: ((entries: IntersectionObserverEntry[]) => void) | null = null;

  beforeEach(() => {
    trigger = null;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
          trigger = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
  });

  it("returns the latest intersection entry", () => {
    const element = document.createElement("div");
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      ref.current = element;
      return useIntersectionObserver(ref);
    });
    expect(result.current).toBeUndefined();
    act(() => {
      trigger?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });
    expect(result.current?.isIntersecting).toBe(true);
  });
});
