import { act, renderHook } from "@testing-library/react";
import type { CSSProperties } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { useScrollbarReserve } from "./use-scrollbar-reserve.js";

afterEach(() => vi.unstubAllGlobals());
it.each(["--line-scrollbar-size", "--candle-scrollbar-size"] as const)(
  "keeps consumer %s on mount, observation and latest undefined removal",
  (variable) => {
    let notify: (() => void) | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(private readonly callback: ResizeObserverCallback) {}
        observe(target: Element): void {
          notify = () =>
            this.callback(
              [
                {
                  target,
                  contentRect: new DOMRectReadOnly(0, 0, 684, 312),
                  borderBoxSize: [{ inlineSize: 684, blockSize: 327 }],
                  contentBoxSize: [{ inlineSize: 684, blockSize: 312 }],
                  devicePixelContentBoxSize: [],
                },
              ],
              this,
            );
          notify();
        }
        unobserve(): void {}
        disconnect(): void {}
      },
    );
    const root = document.createElement("figure");
    root.innerHTML = '<div data-part="scroll-viewport"></div>';
    const rootRef = { current: root };
    const { rerender, unmount } = renderHook(
      ({ style }: { style: CSSProperties | undefined }) =>
        useScrollbarReserve(rootRef, variable, style),
      { initialProps: { style: { [variable]: "7px" } as CSSProperties | undefined } },
    );
    expect(root.style.getPropertyValue(variable)).toBe("7px");
    act(() => notify?.());
    expect(root.style.getPropertyValue(variable)).toBe("7px");
    rerender({ style: { [variable]: undefined } as CSSProperties });
    act(() => notify?.());
    expect(root.style.getPropertyValue(variable)).toBe("");
    rerender({ style: undefined });
    act(() => notify?.());
    expect(root.style.getPropertyValue(variable)).toBe("15px");
    unmount();
  },
);
