import type {
  CSSProperties,
  ElementType,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { CandleChartAxisLabel, CandleChartData, CandleChartProps } from "./types.js";

interface CandleStyle extends CSSProperties {
  "--candle-body-height": string;
  "--candle-body-top": string;
  "--candle-slot": string;
  "--candle-wick-height": string;
  "--candle-wick-top": string;
  "--candle-x": string;
  "--candle-cursor-y"?: string;
}

interface CrosshairStyle extends CSSProperties {
  "--candle-crosshair-x": string;
  "--candle-cursor-y"?: string;
}

interface CursorStyle extends CSSProperties {
  "--candle-cursor-y"?: string;
}

interface AxisStyle extends CSSProperties {
  "--candle-axis-x"?: string;
  "--candle-axis-y"?: string;
}

type CandleDirection = "down" | "flat" | "up";

interface CandleGeometry {
  readonly bodyHeight: string;
  readonly bodyTop: string;
  readonly direction: CandleDirection;
  readonly slot: string;
  readonly wickHeight: string;
  readonly wickTop: string;
  readonly x: string;
}

function percent(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return `${rounded}%`;
}

function valueToPercent(value: number, min: number, range: number): number {
  if (range === 0) return 50;
  return Math.min(100, Math.max(0, ((min + range - value) / range) * 100));
}

function directionFor(candle: CandleChartData): CandleDirection {
  if (candle.close > candle.open) return "up";
  if (candle.close < candle.open) return "down";
  return "flat";
}

function getPriceBounds(data: readonly CandleChartData[]): { max: number; min: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const candle of data) {
    min = Math.min(min, candle.low);
    max = Math.max(max, candle.high);
  }

  if (data.length === 0) return { max: 1, min: 0 };
  return { max, min };
}

interface AxisLabel {
  readonly label: ReactNode;
  readonly position: number;
}

function monthKey(time: string | number): string {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return String(time);
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

function monthLabel(time: string | number): string {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return String(time);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
    year: "2-digit",
  }).format(date);
}

function monthLabelsFor(data: readonly CandleChartData[]): AxisLabel[] {
  const labels: AxisLabel[] = [];
  const seen = new Set<string>();

  data.forEach((candle, index) => {
    const key = monthKey(candle.time);
    if (seen.has(key)) return;
    seen.add(key);
    labels.push({
      label: monthLabel(candle.time),
      position: (index / Math.max(data.length, 1)) * 100,
    });
  });

  return labels;
}

function priceLabelsFor(min: number, max: number): AxisLabel[] {
  const tickCount = 6;
  const range = max - min;

  return Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    const value = max - range * ratio;
    return {
      label: new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value),
      position: ratio * 100,
    };
  });
}

function geometryFor(
  candle: CandleChartData,
  index: number,
  count: number,
  min: number,
  max: number,
): CandleGeometry {
  const range = max - min;
  const open = valueToPercent(candle.open, min, range);
  const close = valueToPercent(candle.close, min, range);
  const high = valueToPercent(candle.high, min, range);
  const low = valueToPercent(candle.low, min, range);

  return {
    bodyHeight: percent(Math.abs(close - open)),
    bodyTop: percent(Math.min(open, close)),
    direction: directionFor(candle),
    slot: percent(100 / count),
    wickHeight: percent(Math.max(0, low - high)),
    wickTop: percent(high),
    x: percent((index / count) * 100),
  };
}

function candleStyle(geometry: CandleGeometry, cursorY: number | undefined): CandleStyle {
  return {
    "--candle-body-height": geometry.bodyHeight,
    "--candle-body-top": geometry.bodyTop,
    "--candle-slot": geometry.slot,
    "--candle-wick-height": geometry.wickHeight,
    "--candle-wick-top": geometry.wickTop,
    "--candle-x": geometry.x,
    ...(cursorY === undefined ? {} : { "--candle-cursor-y": `${Math.max(0, cursorY)}px` }),
  };
}

function crosshairStyle(index: number, count: number, cursorY: number | undefined): CrosshairStyle {
  return {
    "--candle-crosshair-x": percent(((index + 0.5) / Math.max(count, 1)) * 100),
    ...(cursorY === undefined ? {} : { "--candle-cursor-y": `${Math.max(0, cursorY)}px` }),
  };
}

function cursorStyle(cursorY: number | undefined): CursorStyle {
  return cursorY === undefined ? {} : { "--candle-cursor-y": `${Math.max(0, cursorY)}px` };
}

function clampAxisPosition(position: number): number {
  return Math.min(100, Math.max(0, position));
}

function axisStyle(axis: "x" | "y", position: number): AxisStyle {
  const value = percent(clampAxisPosition(position));
  if (axis === "x") return { "--candle-axis-x": value };
  return { "--candle-axis-y": value };
}

function axisLabelsFor(
  overrides: readonly CandleChartAxisLabel[] | undefined,
  fallback: readonly AxisLabel[],
): readonly AxisLabel[] {
  return overrides ?? fallback;
}

export function CandleChart<TAs extends ElementType = "figure">(
  props: CandleChartProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    data,
    xAxis,
    yAxis,
    "aria-label": ariaLabel,
    activeCandleIndex,
    cursorY,
    interactive = false,
    onCandleClick,
    onCandlePointerLeave,
    onCandlePointerMove,
    selectedCandleIndex,
    ...consumerProps
  } = props as CandleChartProps<"figure">;
  const { min, max } = getPriceBounds(data);
  const label = ariaLabel ?? "Candlestick chart";
  const monthLabels = axisLabelsFor(xAxis, monthLabelsFor(data));
  const priceLabels = axisLabelsFor(yAxis, priceLabelsFor(min, max));
  const readoutIndex =
    activeCandleIndex ?? selectedCandleIndex ?? (data.length > 0 ? data.length - 1 : undefined);
  const readoutCandle = readoutIndex === undefined ? undefined : data[readoutIndex];
  const crosshairCandle = activeCandleIndex === undefined ? undefined : data[activeCandleIndex];
  const candles = data.map((candle, index) => {
    const geometry = geometryFor(candle, index, data.length, min, max);
    const isActive = activeCandleIndex === index;
    const isSelected = selectedCandleIndex === index;
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onCandleClick?.(index);
    };

    return (
      <li
        key={`${candle.time}-${index}`}
        aria-hidden={interactive ? undefined : true}
        data-direction={geometry.direction}
        data-crosshair-active={interactive && isActive ? "" : undefined}
        data-time={String(candle.time)}
        style={candleStyle(geometry, isActive ? cursorY : undefined)}
      >
        {interactive ? (
          <button
            data-part="candle-hit"
            type="button"
            aria-label={`Candle ${String(candle.time)}`}
            aria-pressed={isSelected}
            onClick={() => onCandleClick?.(index)}
            onKeyDown={handleKeyDown}
            onPointerLeave={onCandlePointerLeave}
            onPointerMove={(event: PointerEvent<HTMLButtonElement>) =>
              onCandlePointerMove?.({ index, offsetY: event.nativeEvent.offsetY })
            }
          />
        ) : null}
      </li>
    );
  });

  return useRenderElement({
    as,
    defaultTag: "figure",
    props: {
      ...consumerProps,
      "aria-label": label,
      "data-uiify-candle-chart": "",
      "data-interactive": interactive ? "" : undefined,
      children: (
        <>
          <figcaption>{label}</figcaption>
          {interactive && readoutCandle ? (
            <div data-part="readout" aria-live="polite">
              <span data-part="readout-time">{String(readoutCandle.time)}</span>
              <span>O {readoutCandle.open}</span>
              <span>H {readoutCandle.high}</span>
              <span>L {readoutCandle.low}</span>
              <span>C {readoutCandle.close}</span>
            </div>
          ) : null}
          <div data-part="plot" aria-hidden={interactive ? undefined : true}>
            <div data-part="scroll-viewport">
              <div data-part="canvas">
                <div data-part="viewport">
                  <ol data-part="candles" aria-label={`${label} candles`}>
                    {candles}
                  </ol>
                  {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                    <div
                      data-part="crosshair"
                      aria-hidden="true"
                      style={crosshairStyle(activeCandleIndex, data.length, cursorY)}
                    >
                      <span data-part="crosshair-marker">+</span>
                    </div>
                  ) : null}
                </div>
                <div data-part="time-viewport">
                  <ol data-part="time-axis" data-axis="time" aria-label={`${label} months`}>
                    {monthLabels.map((axisLabel, index) => (
                      <li
                        key={`${axisLabel.position}-${index}`}
                        style={axisStyle("x", axisLabel.position)}
                      >
                        {axisLabel.label}
                      </li>
                    ))}
                    {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                      <li
                        data-part="crosshair-time"
                        style={crosshairStyle(activeCandleIndex, data.length, undefined)}
                      >
                        {String(crosshairCandle.time)}
                      </li>
                    ) : null}
                  </ol>
                </div>
              </div>
            </div>
            <ol data-part="price-axis" data-axis="price" aria-label={`${label} prices`}>
              {priceLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  style={axisStyle("y", axisLabel.position)}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                <li data-part="crosshair-price" style={cursorStyle(cursorY)}>
                  {crosshairCandle.close}
                </li>
              ) : null}
            </ol>
          </div>
          <table data-part="data" aria-label={`${label} data`}>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Open</th>
                <th scope="col">High</th>
                <th scope="col">Low</th>
                <th scope="col">Close</th>
              </tr>
            </thead>
            <tbody>
              {data.map((candle, index) => (
                <tr key={`${candle.time}-${index}`}>
                  <th scope="row">{String(candle.time)}</th>
                  <td>{candle.open}</td>
                  <td>{candle.high}</td>
                  <td>{candle.low}</td>
                  <td>{candle.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ),
    },
    render,
    state: {},
  });
}
CandleChart.displayName = "CandleChart";
