"use client";

import { useCallback, useState } from "react";
import type { CSSProperties, ElementType, ReactElement, Ref } from "react";
import { useChartViewport } from "../../../hooks/use-chart-viewport.js";
import { useMergedRefs } from "../../../hooks/use-merged-refs.js";
import { LineChart } from "../LineChart.js";
import type { LineChartPointerPosition, LineChartProps } from "../types.js";

interface CursorState extends LineChartPointerPosition {}

interface InteractiveLineStyle extends CSSProperties {
  "--line-scale": string;
}

/**
 * `.line-chart__plot`'s fixed price-axis column (4.5rem) plus its grid gap
 * (0.75rem) — see line-chart.css. `useChartViewport` measures the whole
 * `<figure>`, but points only ever get the width left over after this
 * column, so it must be subtracted before sizing `minItemWidth`.
 */
const Y_AXIS_COLUMN_WIDTH = 72 + 12;

export function LineChartClient<TAs extends ElementType = "figure">(
  props: LineChartProps<TAs>,
): ReactElement | null {
  const {
    data,
    ref: consumerRef,
    style: consumerStyle,
    onPointClick: consumerOnPointClick,
    onPointPointerLeave: consumerOnPointPointerLeave,
    onPointPointerMove: consumerOnPointPointerMove,
    ...consumerProps
  } = props as LineChartProps<"figure"> & {
    ref?: Ref<HTMLElement>;
    style?: CSSProperties;
  };
  const viewport = useChartViewport({
    itemCount: data.length,
    measuredWidthOffset: Y_AXIS_COLUMN_WIDTH,
    minItemWidth: 24,
  });
  const [cursor, setCursor] = useState<CursorState | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | undefined>();
  const chartRef = useMergedRefs<HTMLElement>(viewport.ref, consumerRef);
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

  const style: InteractiveLineStyle = {
    ...consumerStyle,
    "--line-scale": String(viewport.scale),
  };
  const chartProps = {
    ...consumerProps,
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
LineChartClient.displayName = "LineChartClient";
