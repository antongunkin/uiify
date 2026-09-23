import { act, createEvent, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CandleChartClient } from "./CandleChartClient.js";

const DATA = Array.from({ length: 100 }, (_, index) => ({
  time: `2026-09-${String(index + 1).padStart(2, "0")}`,
  open: 100 + index,
  high: 110 + index,
  low: 90 + index,
  close: 105 + index,
}));

describe("CandleChartClient", () => {
  it("keeps the full data table while starting at the right edge", () => {
    const { container } = render(<CandleChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;

    expect(chart.style.getPropertyValue("--candle-scale")).toBe("3.2");
    expect(chart.querySelectorAll('[data-part="candles"] > li')).toHaveLength(100);
    expect(chart.querySelectorAll("tbody tr")).toHaveLength(100);
  });

  it("intercepts vertical zoom while leaving horizontal movement native", () => {
    const { container } = render(<CandleChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;

    fireEvent.wheel(chart, { deltaY: -100 });
    expect(chart.style.getPropertyValue("--candle-scale")).toBe("3.84");

    fireEvent.wheel(chart, { deltaX: -100 });
    expect(chart.style.getPropertyValue("--candle-scale")).toBe("3.84");
  });

  it("snaps the crosshair to the moved candle and updates the React readout on click", () => {
    const { container } = render(<CandleChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;
    const candles = chart.querySelectorAll<HTMLLIElement>('[data-part="candles"] > li');
    const target = candles[7] as HTMLLIElement;
    const hit = target.querySelector('[data-part="candle-hit"]') as HTMLButtonElement;

    const pointerMove = createEvent.pointerMove(hit);
    Object.defineProperty(pointerMove, "offsetY", { value: 24 });
    fireEvent(hit, pointerMove);
    expect(target?.getAttribute("data-crosshair-active")).toBe("");
    expect(chart.querySelector('[data-part="viewport"] > [data-part="crosshair"]')).not.toBeNull();
    expect(target?.getAttribute("style")).toContain("--candle-cursor-y: 24px");

    fireEvent.click(hit);
    expect(target?.getAttribute("data-tooltip-open")).toBeNull();
    expect(chart.querySelector('[data-part="readout"]')?.textContent).toContain("O 107");
    expect(chart.querySelector('[data-part="readout"]')?.textContent).toContain("C 112");
  });

  describe("visibleCount live mode", () => {
    /** 684px figure − 84px price-axis column = 600px of candles, so 20 visible candles are 30px. */
    function stubResizeObserver(): void {
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(private readonly callback: ResizeObserverCallback) {}
          observe(target: Element): void {
            this.callback(
              [
                {
                  target,
                  contentRect: { width: 684, height: 312 },
                  // A classic 15px horizontal scrollbar: border box minus content box.
                  borderBoxSize: [{ inlineSize: 684, blockSize: 327 }],
                  contentBoxSize: [{ inlineSize: 684, blockSize: 312 }],
                } as unknown as ResizeObserverEntry,
              ],
              this as unknown as ResizeObserver,
            );
          }
          unobserve(): void {}
          disconnect(): void {}
        },
      );
    }

    function scrollport(container: HTMLElement): HTMLElement {
      return container.querySelector(
        '[data-part="viewport"] > [data-uiify-virtual-scroll]',
      ) as HTMLElement;
    }

    afterEach(() => vi.unstubAllGlobals());

    it("virtualizes every candle and fits the chrome to the visible candles", () => {
      const { container } = render(<CandleChartClient data={DATA} visibleCount={20} />);
      const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;

      expect(scrollport(container).dataset.orientation).toBe("horizontal");
      expect(chart.querySelector('[data-part="candles"]')).toBeNull();
      expect(chart.querySelectorAll("tbody tr")).toHaveLength(20);
      expect(chart.querySelector("tbody th")?.textContent).toBe(DATA[80]?.time);
      expect(chart.querySelector('[data-part="readout"]')?.getAttribute("aria-live")).toBe("off");
      expect(chart.querySelector('[data-part="readout"]')?.textContent).toContain("C 204");
    });

    it("disables zoom so visibleCount candles always fill the viewport", () => {
      const { container } = render(<CandleChartClient data={DATA} visibleCount={20} />);
      const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;

      fireEvent.wheel(chart, { deltaY: -100 });
      expect(chart.style.getPropertyValue("--candle-scale")).toBe("1");
    });

    it("follows appends at the newest candle and leaves a scrolled-back reader in place", () => {
      stubResizeObserver();
      const { container, rerender } = render(
        <CandleChartClient data={DATA.slice(0, 80)} visibleCount={20} />,
      );
      const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;
      const element = scrollport(container);

      expect(chart.style.getPropertyValue("--candle-content-size")).toBe(`${80 * 30}px`);
      // The plot reserves the measured horizontal scrollbar below the time axis.
      expect(chart.style.getPropertyValue("--candle-scrollbar-size")).toBe("15px");
      expect(element.scrollLeft).toBe(80 * 30 - 600);

      rerender(<CandleChartClient data={DATA.slice(0, 81)} visibleCount={20} />);
      expect(element.scrollLeft).toBe(81 * 30 - 600);

      act(() => {
        element.scrollLeft = 300;
        fireEvent.scroll(element);
      });
      rerender(<CandleChartClient data={DATA.slice(0, 82)} visibleCount={20} />);

      expect(element.scrollLeft).toBe(300);
      expect(chart.style.getPropertyValue("--candle-scroll-x")).toBe("300px");
      // The price scale and table now describe the candles the reader scrolled to.
      expect(chart.querySelector("tbody th")?.textContent).toBe(DATA[10]?.time);
    });

    it("resumes following when the reader lands within one candle of the end", () => {
      stubResizeObserver();
      const { container, rerender } = render(
        <CandleChartClient data={DATA.slice(0, 80)} visibleCount={20} />,
      );
      const element = scrollport(container);

      act(() => {
        element.scrollLeft = 300;
        fireEvent.scroll(element);
      });
      // A candle arrived mid-scroll, so the reader stops one item short of the new end.
      rerender(<CandleChartClient data={DATA.slice(0, 81)} visibleCount={20} />);
      act(() => {
        element.scrollLeft = 80 * 30 - 600;
        fireEvent.scroll(element);
      });
      rerender(<CandleChartClient data={DATA.slice(0, 82)} visibleCount={20} />);

      expect(element.scrollLeft).toBe(82 * 30 - 600);
    });
  });
});
