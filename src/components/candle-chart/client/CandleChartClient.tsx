"use client";

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties, ElementType, ReactElement, Ref } from "react";
import { CandleChart, CandleChartCandle, getPriceBounds } from "../CandleChart.js";
import type {
  CandleChartClientProps,
  CandleChartData,
  CandleChartPointerPosition,
  CandleChartProps,
  CandleChartViewProps,
} from "../types.js";
import { VirtualScroll } from "../../virtual-scroll/VirtualScroll.js";
import {
  liveTimeAxis,
  useLiveChartWindow,
} from "../../internal/live-chart/use-live-chart-window.js";
import { useScrollbarReserve } from "../../internal/chart-scrollbar/use-scrollbar-reserve.js";
import { useChartViewport } from "../../../hooks/use-chart-viewport.js";
import { useMergedRefs } from "../../../hooks/use-merged-refs.js";
import { useResizeObserver } from "../../../hooks/use-resize-observer.js";

interface InteractiveCandleStyle extends CSSProperties {
  "--candle-scale": string;
  "--candle-content-size"?: string;
  "--candle-plot-height"?: string;
}

interface CursorState extends CandleChartPointerPosition {}

interface LiveCandle {
  readonly id: string;
  readonly candle: CandleChartData;
}

/**
 * `[data-part="plot"]`'s fixed price-axis column (4.5rem) plus its grid gap
 * (0.75rem) — see candle-chart.css. `useChartViewport` measures the whole
 * `<figure>`, but candles only ever get the width left over after this
 * column, so it must be subtracted before sizing `minItemWidth`.
 */
const Y_AXIS_COLUMN_WIDTH = 72 + 12;
export function CandleChartClient<TAs extends ElementType = "figure">(
  props: CandleChartClientProps<TAs>,
): ReactElement | null {
  const {
    data,
    visibleCount,
    xAxis,
    ref: consumerRef,
    style: consumerStyle,
    onCandleClick: consumerOnCandleClick,
    onCandlePointerLeave: consumerOnCandlePointerLeave,
    onCandlePointerMove: consumerOnCandlePointerMove,
    ...consumerProps
  } = props as CandleChartClientProps<"figure"> & {
    ref?: Ref<HTMLElement>;
    style?: CSSProperties;
  };
  const live = visibleCount !== undefined && visibleCount > 0;
  const viewport = useChartViewport(
    live
      ? {
          enabled: false,
          initialScale: 1,
          itemCount: visibleCount,
          measuredWidthOffset: Y_AXIS_COLUMN_WIDTH,
        }
      : { itemCount: data.length, measuredWidthOffset: Y_AXIS_COLUMN_WIDTH, minItemWidth: 24 },
  );
  const figureSize = useResizeObserver(viewport.ref);
  const liveWindow = useLiveChartWindow({
    count: data.length,
    visibleCount,
    itemWidth: viewport.itemWidth,
    figureHeight: figureSize?.height,
    scrollVariable: "--candle-scroll-x",
  });
  useScrollbarReserve(liveWindow.chartRef, "--candle-scrollbar-size");
  // Cursor and selection hold absolute indices so they survive scrolling and appends.
  const [cursor, setCursor] = useState<CursorState | null>(null);
  const [selectedCandleIndex, setSelectedCandleIndex] = useState<number | undefined>();
  const chartRef = useMergedRefs<HTMLElement>(viewport.ref, consumerRef, liveWindow.chartRef);
  const handleCandleClick = useCallback(
    (index: number) => {
      setSelectedCandleIndex(index);
      consumerOnCandleClick?.(index);
    },
    [consumerOnCandleClick],
  );
  const handleCandlePointerLeave = useCallback(() => {
    setCursor(null);
    consumerOnCandlePointerLeave?.();
  }, [consumerOnCandlePointerLeave]);
  const handleCandlePointerMove = useCallback(
    (position: CandleChartPointerPosition) => {
      setCursor(position);
      consumerOnCandlePointerMove?.(position);
    },
    [consumerOnCandlePointerMove],
  );
  const liveItems = useMemo<readonly LiveCandle[]>(
    () => (live ? data.map((candle, index) => ({ id: String(index), candle })) : []),
    [data, live],
  );
  const style: InteractiveCandleStyle = {
    ...consumerStyle,
    "--candle-scale": String(viewport.scale),
  };

  if (!live) {
    const chartProps = {
      ...consumerProps,
      ...(xAxis ? { xAxis } : {}),
      data,
      activeCandleIndex: cursor?.index,
      cursorY: cursor?.offsetY,
      interactive: true,
      onCandleClick: handleCandleClick,
      onCandlePointerLeave: handleCandlePointerLeave,
      onCandlePointerMove: handleCandlePointerMove,
      ref: chartRef,
      selectedCandleIndex,
      style,
    } as CandleChartProps<"figure">;
    return <CandleChart {...chartProps} />;
  }

  const { sliceStart, sliceEnd, contentSize, plotHeight } = liveWindow;
  const slice = data.slice(sliceStart, sliceEnd);
  const { min, max } = getPriceBounds(slice);
  const toSliceIndex = (index: number | undefined): number | undefined =>
    index !== undefined && index >= sliceStart && index < sliceEnd ? index - sliceStart : undefined;
  const candleLayer = (
    <VirtualScroll
      height={plotHeight}
      items={liveItems}
      orientation="horizontal"
      overscan={2}
      rowHeight={viewport.itemWidth}
      scrollRef={liveWindow.scrollRef}
      onRangeChange={liveWindow.onRangeChange}
      renderRow={({ candle }, index) => {
        // Overscan candles stay inert, so focus never scrolls hidden candles into view.
        const inSlice = index >= sliceStart && index < sliceEnd;
        const isActive = cursor?.index === index;
        return (
          <CandleChartCandle
            as="div"
            candle={candle}
            index={index}
            x={0}
            slot={100}
            min={min}
            max={max}
            interactive={inSlice}
            isActive={isActive}
            isSelected={selectedCandleIndex === index}
            cursorY={isActive ? cursor?.offsetY : undefined}
            onCandleClick={handleCandleClick}
            onCandlePointerLeave={handleCandlePointerLeave}
            onCandlePointerMove={handleCandlePointerMove}
          />
        );
      }}
    />
  );

  const liveStyle: InteractiveCandleStyle = {
    ...style,
    "--candle-content-size": `${contentSize}px`,
    "--candle-plot-height": `${plotHeight}px`,
  };
  const chartProps = {
    ...consumerProps,
    data: slice,
    xAxis: xAxis ?? liveTimeAxis(data, sliceStart, sliceEnd, visibleCount),
    activeCandleIndex: toSliceIndex(cursor?.index),
    announceReadout: false,
    candleLayer,
    cursorY: cursor?.offsetY,
    interactive: true,
    ref: chartRef,
    selectedCandleIndex: toSliceIndex(selectedCandleIndex),
    slotCount: data.length,
    slotOffset: sliceStart,
    style: liveStyle,
  } as CandleChartProps<"figure"> & CandleChartViewProps;

  return <CandleChart {...chartProps} />;
}
CandleChartClient.displayName = "CandleChartClient";
