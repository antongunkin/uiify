"use client";

import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";
import { useEventListener } from "./use-event-listener.js";
import { useResizeObserver } from "./use-resize-observer.js";

interface ChartWheelEvent {
  readonly deltaX: number;
  readonly deltaY: number;
  readonly shiftKey: boolean;
  preventDefault(): void;
}

export interface UseChartViewportOptions {
  readonly enabled?: boolean;
  readonly itemCount: number;
  readonly initialScale?: number;
  readonly maxScale?: number;
  readonly minScale?: number;
  readonly minItemWidth?: number;
  /**
   * Chrome reserved outside the scrollable item track (e.g. a fixed-width
   * axis column plus its grid gap) that `ref`'s measured element includes
   * but that isn't available to the items themselves. Subtracted from the
   * measured width before it's used to size `minItemWidth`.
   */
  readonly measuredWidthOffset?: number;
}

export interface UseChartViewportResult {
  readonly onWheel: (event: ChartWheelEvent) => void;
  readonly ref: RefObject<HTMLElement | null>;
  readonly reset: () => void;
  readonly scale: number;
  readonly itemWidth: number;
}

const DEFAULT_INITIAL_SCALE = 3.2;
const DEFAULT_MIN_SCALE = 1;
const ZOOM_FACTOR = 1.2;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeAnchoredScrollOffset(
  index: number,
  previousItemWidth: number,
  nextItemWidth: number,
  previousScrollOffset: number,
): number {
  const viewportOffset = (index + 0.5) * previousItemWidth - previousScrollOffset;
  return (index + 0.5) * nextItemWidth - viewportOffset;
}

function maxScaleFor(itemCount: number): number {
  return itemCount > 1 ? itemCount / 2 : 1;
}

function boundsFor(
  options: UseChartViewportOptions,
  measuredWidth: number,
): {
  readonly initial: number;
  readonly max: number;
  readonly min: number;
} {
  const ceiling = maxScaleFor(options.itemCount);
  const measuredMin =
    measuredWidth > 0 && options.minItemWidth !== undefined
      ? (options.minItemWidth * options.itemCount) / measuredWidth
      : DEFAULT_MIN_SCALE;
  const min = Math.min(ceiling, Math.max(1, options.minScale ?? DEFAULT_MIN_SCALE, measuredMin));
  const max = Math.max(min, Math.min(options.maxScale ?? ceiling, ceiling));
  const initial = clamp(options.initialScale ?? DEFAULT_INITIAL_SCALE, min, max);
  return { initial, max, min };
}

export function useChartViewport(options: UseChartViewportOptions): UseChartViewportResult {
  const ref = useRef<HTMLElement | null>(null);
  const measuredSize = useResizeObserver(ref);
  const measuredWidth = Math.max(
    0,
    (measuredSize?.width ?? 0) - (options.measuredWidthOffset ?? 0),
  );
  const enabled = options.enabled ?? true;
  const { initial, max, min } = boundsFor(options, measuredWidth);
  const [rawScale, setScale] = useState(initial);
  // Clamp on every render instead of syncing `rawScale` to bounds through an
  // effect: an effect-driven sync lands one commit after the ResizeObserver's
  // width update, so a consumer that reads `scale` synchronously after mount
  // (e.g. an accessibility scan) can observe the pre-measurement default.
  const scale = clamp(rawScale, min, max);

  const onWheel = useCallback<UseChartViewportResult["onWheel"]>(
    (event) => {
      const horizontalDelta = event.shiftKey ? event.deltaY : event.deltaX;
      const isHorizontal =
        horizontalDelta !== 0 &&
        (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY));

      if (!enabled || isHorizontal) return;

      if (event.deltaY === 0) return;
      event.preventDefault();
      const factor = event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      // Clamp `current` before scaling: a batch of wheel events (or a stale
      // `rawScale` this render hasn't caught up to yet, e.g. right after a
      // measurement changed the bounds) must zoom from the effective scale,
      // not an out-of-range raw value.
      setScale((current) => clamp(clamp(current, min, max) * factor, min, max));
    },
    [enabled, max, min],
  );

  useEventListener("wheel", onWheel, enabled ? ref : null, { passive: false });

  const reset = useCallback(() => {
    setScale(initial);
  }, [initial]);

  const itemWidth =
    measuredWidth > 0 && options.itemCount > 0
      ? Math.max(options.minItemWidth ?? 0, (measuredWidth * scale) / options.itemCount)
      : (options.minItemWidth ?? 0);

  return { itemWidth, onWheel, ref, reset, scale };
}
