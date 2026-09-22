"use client";

import { useCallback, useState } from "react";
import type { CSSProperties, ElementType, ReactElement, Ref } from "react";
import { CandleChart } from "../CandleChart.js";
import type { CandleChartPointerPosition, CandleChartProps } from "../types.js";
import { useChartViewport } from "../../../hooks/use-chart-viewport.js";
import { useMergedRefs } from "../../../hooks/use-merged-refs.js";

interface InteractiveCandleStyle extends CSSProperties {
  "--candle-scale": string;
}

interface CursorState extends CandleChartPointerPosition {}

/**
 * `[data-part="plot"]`'s fixed price-axis column (4.5rem) plus its grid gap
 * (0.75rem) — see candle-chart.css. `useChartViewport` measures the whole
 * `<figure>`, but candles only ever get the width left over after this
 * column, so it must be subtracted before sizing `minItemWidth`.
 */
const Y_AXIS_COLUMN_WIDTH = 72 + 12;

export function CandleChartClient<TAs extends ElementType = "figure">(
  props: CandleChartProps<TAs>,
): ReactElement | null {
  const {
    data,
    ref: consumerRef,
    style: consumerStyle,
    onCandleClick: consumerOnCandleClick,
    onCandlePointerLeave: consumerOnCandlePointerLeave,
    onCandlePointerMove: consumerOnCandlePointerMove,
    ...consumerProps
  } = props as CandleChartProps<"figure"> & {
    ref?: Ref<HTMLElement>;
    style?: CSSProperties;
  };
  const viewport = useChartViewport({
    itemCount: data.length,
    measuredWidthOffset: Y_AXIS_COLUMN_WIDTH,
    minItemWidth: 24,
  });
  const [cursor, setCursor] = useState<CursorState | null>(null);
  const [selectedCandleIndex, setSelectedCandleIndex] = useState<number | undefined>();
  const chartRef = useMergedRefs<HTMLElement>(viewport.ref, consumerRef);
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
  const style: InteractiveCandleStyle = {
    ...consumerStyle,
    "--candle-scale": String(viewport.scale),
  };

  const chartProps = {
    ...consumerProps,
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
CandleChartClient.displayName = "CandleChartClient";
