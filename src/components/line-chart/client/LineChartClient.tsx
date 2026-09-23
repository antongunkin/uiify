"use client";

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties, ElementType, ReactElement, Ref } from "react";
import { useChartViewport } from "../../../hooks/use-chart-viewport.js";
import { useMergedRefs } from "../../../hooks/use-merged-refs.js";
import { useResizeObserver } from "../../../hooks/use-resize-observer.js";
import {
  liveTimeAxis,
  useLiveChartWindow,
} from "../../internal/live-chart/use-live-chart-window.js";
import { useScrollbarReserve } from "../../internal/chart-scrollbar/use-scrollbar-reserve.js";
import { VirtualScroll } from "../../virtual-scroll/VirtualScroll.js";
import { LineChart, LineChartPoint } from "../LineChart.js";
import { getValueBounds } from "../line-chart-geometry.js";
import type {
  LineChartClientProps,
  LineChartData,
  LineChartPointerPosition,
  LineChartProps,
  LineChartViewProps,
} from "../types.js";

interface CursorState extends LineChartPointerPosition {}

interface InteractiveLineStyle extends CSSProperties {
  "--line-scale": string;
  "--line-content-size"?: string;
  "--line-plot-height"?: string;
  "--line-run"?: string;
}

interface LivePoint {
  readonly id: string;
  readonly point: LineChartData;
}

/**
 * `[data-part="plot"]`'s fixed price-axis column (4.5rem) plus its grid gap
 * (0.75rem) — see line-chart.css. `useChartViewport` measures the whole
 * `<figure>`, but points only ever get the width left over after this
 * column, so it must be subtracted before sizing `minItemWidth`.
 */
const Y_AXIS_COLUMN_WIDTH = 72 + 12;

export function LineChartClient<TAs extends ElementType = "figure">(
  props: LineChartClientProps<TAs>,
): ReactElement | null {
  const {
    data,
    visibleCount,
    xAxis,
    ref: consumerRef,
    style: consumerStyle,
    onPointClick: consumerOnPointClick,
    onPointPointerLeave: consumerOnPointPointerLeave,
    onPointPointerMove: consumerOnPointPointerMove,
    ...consumerProps
  } = props as LineChartClientProps<"figure"> & {
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
    scrollVariable: "--line-scroll-x",
  });
  useScrollbarReserve(liveWindow.chartRef, "--line-scrollbar-size");
  // Cursor and selection hold absolute indices so they survive scrolling and appends.
  const [cursor, setCursor] = useState<CursorState | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | undefined>();
  const chartRef = useMergedRefs<HTMLElement>(viewport.ref, consumerRef, liveWindow.chartRef);
  const handlePointClick = useCallback(
    (index: number) => {
      setSelectedPointIndex(index);
      consumerOnPointClick?.(index);
    },
    [consumerOnPointClick],
  );
  const handlePointPointerLeave = useCallback(() => {
    setCursor(null);
    consumerOnPointPointerLeave?.();
  }, [consumerOnPointPointerLeave]);
  const handlePointPointerMove = useCallback(
    (position: LineChartPointerPosition) => {
      setCursor(position);
      consumerOnPointPointerMove?.(position);
    },
    [consumerOnPointPointerMove],
  );
  const liveItems = useMemo<readonly LivePoint[]>(
    () => (live ? data.map((point, index) => ({ id: String(index), point })) : []),
    [data, live],
  );

  const style: InteractiveLineStyle = {
    ...consumerStyle,
    "--line-scale": String(viewport.scale),
  };

  if (!live) {
    const chartProps = {
      ...consumerProps,
      ...(xAxis ? { xAxis } : {}),
      data,
      activePointIndex: cursor?.index,
      cursorY: cursor?.offsetY,
      interactive: true,
      onPointClick: handlePointClick,
      onPointPointerLeave: handlePointPointerLeave,
      onPointPointerMove: handlePointPointerMove,
      ref: chartRef,
      selectedPointIndex,
      style,
    } as LineChartProps<"figure">;
    return <LineChart {...chartProps} />;
  }

  const { sliceStart, sliceEnd, contentSize, plotHeight } = liveWindow;
  const slice = data.slice(sliceStart, sliceEnd);
  const { min, max } = getValueBounds(slice);
  const toSliceIndex = (index: number | undefined): number | undefined =>
    index !== undefined && index >= sliceStart && index < sliceEnd ? index - sliceStart : undefined;
  const pointLayer = (
    <VirtualScroll
      height={plotHeight}
      items={liveItems}
      orientation="horizontal"
      overscan={2}
      rowHeight={viewport.itemWidth}
      scrollRef={liveWindow.scrollRef}
      onRangeChange={liveWindow.onRangeChange}
      renderRow={({ point }, index) => {
        // Overscan points stay inert, so focus never scrolls hidden points into view.
        const inSlice = index >= sliceStart && index < sliceEnd;
        const isActive = cursor?.index === index;
        return (
          <LineChartPoint
            as="div"
            point={point}
            previousPoint={data[index - 1]}
            index={index}
            count={data.length}
            min={min}
            max={max}
            interactive={inSlice}
            isActive={isActive}
            isSelected={selectedPointIndex === index}
            cursorY={isActive ? cursor?.offsetY : undefined}
            onPointClick={handlePointClick}
            onPointPointerLeave={handlePointPointerLeave}
            onPointPointerMove={handlePointPointerMove}
          />
        );
      }}
    />
  );

  const liveStyle: InteractiveLineStyle = {
    ...style,
    "--line-content-size": `${contentSize}px`,
    "--line-plot-height": `${plotHeight}px`,
    // One virtual row: the viewport holds `visibleCount` of them.
    "--line-run": String(100 / visibleCount),
  };
  const chartProps = {
    ...consumerProps,
    data: slice,
    xAxis: xAxis ?? liveTimeAxis(data, sliceStart, sliceEnd, visibleCount),
    activePointIndex: toSliceIndex(cursor?.index),
    announceReadout: false,
    pointLayer,
    cursorY: cursor?.offsetY,
    interactive: true,
    ref: chartRef,
    selectedPointIndex: toSliceIndex(selectedPointIndex),
    slotCount: data.length,
    slotOffset: sliceStart,
    style: liveStyle,
  } as LineChartProps<"figure"> & LineChartViewProps;

  return <LineChart {...chartProps} />;
}
LineChartClient.displayName = "LineChartClient";
