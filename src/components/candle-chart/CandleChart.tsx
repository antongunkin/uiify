import type {
  CSSProperties,
  ElementType,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { mergeRepeatedSlotProps } from "../../core/slot-props.js";
import { assignRef } from "../../hooks/utils/assign-ref.js";
import type {
  CandleChartAxisLabel,
  CandleChartCandleProps,
  CandleChartData,
  CandleChartProps,
  CandleChartViewProps,
} from "./types.js";

function getIndexedPartProps<T extends object>(
  props: (T & { readonly byItemIndex?: Readonly<Record<number, T>> }) | undefined,
  index: number,
): T {
  const { byItemIndex, ...common } = props ?? {};
  return mergeRepeatedSlotProps(common as T, byItemIndex?.[index]);
}

function withGeneratedStyle<T extends { readonly style?: object | undefined }>(
  props: T,
  generatedStyle: object,
): T {
  return { ...props, style: { ...generatedStyle, ...props.style } };
}

function forwardCandleRef(ref: Ref<HTMLElement> | undefined) {
  return (element: HTMLLIElement | HTMLDivElement | null): void | (() => void) => {
    const cleanup = assignRef(ref, element);
    if (typeof cleanup === "function") return cleanup;
    if (ref && typeof ref !== "function" && element !== null) {
      return () => assignRef(ref, null);
    }
  };
}

const DEFAULT_CANDLE_CHART_LABELS = {
  chart: "Candlestick chart",
  candle: "Candle {time}",
  candles: "candles",
  months: "months",
  prices: "prices",
  data: "data",
  time: "Time",
  open: "Open",
  high: "High",
  low: "Low",
  close: "Close",
} as const;

interface CandleStyle extends CSSProperties {
  "--uiify-candle-body-height": string;
  "--uiify-candle-body-top": string;
  "--uiify-candle-slot": string;
  "--uiify-candle-wick-height": string;
  "--uiify-candle-wick-top": string;
  "--uiify-candle-x": string;
  "--uiify-candle-cursor-y"?: string;
}

interface CrosshairStyle extends CSSProperties {
  "--uiify-candle-crosshair-x": string;
  "--uiify-candle-cursor-y"?: string;
}

interface CursorStyle extends CSSProperties {
  "--uiify-candle-cursor-y"?: string;
}

interface AxisStyle extends CSSProperties {
  "--uiify-candle-axis-x"?: string;
  "--uiify-candle-axis-y"?: string;
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

export function getPriceBounds(data: readonly CandleChartData[]): { max: number; min: number } {
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

function monthLabel(time: string | number, locale: string): string {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return String(time);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
    year: "2-digit",
  }).format(date);
}

function monthLabelsFor(data: readonly CandleChartData[], locale: string): AxisLabel[] {
  const labels: AxisLabel[] = [];
  const seen = new Set<string>();

  data.forEach((candle, index) => {
    const key = monthKey(candle.time);
    if (seen.has(key)) return;
    seen.add(key);
    labels.push({
      label: monthLabel(candle.time, locale),
      position: (index / Math.max(data.length, 1)) * 100,
    });
  });

  return labels;
}

function priceLabelsFor(min: number, max: number, locale: string): AxisLabel[] {
  const tickCount = 6;
  const range = max - min;

  return Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    const value = max - range * ratio;
    return {
      label: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value),
      position: ratio * 100,
    };
  });
}

function geometryFor(
  candle: CandleChartData,
  x: number,
  slot: number,
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
    slot: percent(slot),
    wickHeight: percent(Math.max(0, low - high)),
    wickTop: percent(high),
    x: percent(x),
  };
}

function candleStyle(geometry: CandleGeometry, cursorY: number | undefined): CandleStyle {
  return {
    "--uiify-candle-body-height": geometry.bodyHeight,
    "--uiify-candle-body-top": geometry.bodyTop,
    "--uiify-candle-slot": geometry.slot,
    "--uiify-candle-wick-height": geometry.wickHeight,
    "--uiify-candle-wick-top": geometry.wickTop,
    "--uiify-candle-x": geometry.x,
    ...(cursorY === undefined ? {} : { "--uiify-candle-cursor-y": `${Math.max(0, cursorY)}px` }),
  };
}

function crosshairStyle(index: number, count: number, cursorY: number | undefined): CrosshairStyle {
  return {
    "--uiify-candle-crosshair-x": percent(((index + 0.5) / Math.max(count, 1)) * 100),
    ...(cursorY === undefined ? {} : { "--uiify-candle-cursor-y": `${Math.max(0, cursorY)}px` }),
  };
}

function cursorStyle(cursorY: number | undefined): CursorStyle {
  return cursorY === undefined ? {} : { "--uiify-candle-cursor-y": `${Math.max(0, cursorY)}px` };
}

function clampAxisPosition(position: number): number {
  return Math.min(100, Math.max(0, position));
}

function axisStyle(axis: "x" | "y", position: number): AxisStyle {
  const value = percent(clampAxisPosition(position));
  if (axis === "x") return { "--uiify-candle-axis-x": value };
  return { "--uiify-candle-axis-y": value };
}

function axisLabelsFor(
  overrides: readonly CandleChartAxisLabel[] | undefined,
  fallback: readonly AxisLabel[],
): readonly AxisLabel[] {
  return overrides ?? fallback;
}

/** One candle glyph with its optional hit target; shared by the static list and virtual rows. */
export function CandleChartCandle({
  as: Tag,
  candle,
  hitLabel,
  index,
  x,
  slot,
  min,
  max,
  interactive,
  isActive,
  isSelected,
  cursorY,
  onCandleClick,
  onCandlePointerLeave,
  onCandlePointerMove,
  slotProps,
}: CandleChartCandleProps): ReactElement {
  const geometry = geometryFor(candle, x, slot, min, max);
  const candleSlotProps = getIndexedPartProps(slotProps?.candle, index);
  const { ref: candleRef, ...candleProps } = candleSlotProps;
  const candleHitSlotProps = getIndexedPartProps(slotProps?.candleHit, index);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onCandleClick?.(index);
  };

  return (
    <Tag
      aria-hidden={interactive ? undefined : true}
      data-direction={geometry.direction}
      data-crosshair-active={interactive && isActive ? "" : undefined}
      data-time={String(candle.time)}
      {...candleProps}
      className={cn("uiify-candle-chart-candle", candleProps.className)}
      {...(candleRef ? { ref: forwardCandleRef(candleRef) } : {})}
      style={{
        ...candleStyle(geometry, isActive ? cursorY : undefined),
        ...candleSlotProps.style,
      }}
    >
      {interactive ? (
        <button
          type="button"
          aria-label={hitLabel}
          aria-pressed={isSelected}
          {...candleHitSlotProps}
          className={cn("uiify-candle-chart-candle-hit", candleHitSlotProps.className)}
          onClick={composeEventHandlers(candleHitSlotProps.onClick, () => onCandleClick?.(index))}
          onKeyDown={composeEventHandlers(candleHitSlotProps.onKeyDown, handleKeyDown)}
          onPointerLeave={composeEventHandlers(candleHitSlotProps.onPointerLeave, () =>
            onCandlePointerLeave?.(),
          )}
          onPointerMove={composeEventHandlers(
            candleHitSlotProps.onPointerMove,
            (event: PointerEvent<HTMLButtonElement>) =>
              onCandlePointerMove?.({ index, offsetY: event.nativeEvent.offsetY }),
          )}
        />
      ) : null}
    </Tag>
  );
}
CandleChartCandle.displayName = "CandleChartCandle";

export function CandleChart<TAs extends ElementType = "figure">(
  props: CandleChartProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    data,
    xAxis,
    yAxis,
    labels,
    activeCandleIndex,
    cursorY,
    interactive = false,
    locale = "en-US",
    onCandleClick,
    onCandlePointerLeave,
    onCandlePointerMove,
    selectedCandleIndex,
    slotProps,
    candleLayer,
    announceReadout = true,
    slotCount = data.length,
    slotOffset = 0,
    ...consumerProps
  } = props as CandleChartProps<"figure"> & CandleChartViewProps;
  const accessibleLabels = { ...DEFAULT_CANDLE_CHART_LABELS, ...labels };
  const { min, max } = getPriceBounds(data);
  const label = consumerProps["aria-label"] ?? accessibleLabels.chart;
  const monthLabels = axisLabelsFor(xAxis, monthLabelsFor(data, locale));
  const priceLabels = axisLabelsFor(yAxis, priceLabelsFor(min, max, locale));
  const readoutIndex =
    activeCandleIndex ?? selectedCandleIndex ?? (data.length > 0 ? data.length - 1 : undefined);
  const readoutCandle = readoutIndex === undefined ? undefined : data[readoutIndex];
  const crosshairCandle = activeCandleIndex === undefined ? undefined : data[activeCandleIndex];
  const candles = candleLayer ?? (
    <ol
      aria-label={`${label} ${accessibleLabels.candles}`}
      {...slotProps?.candles}
      className={cn("uiify-candle-chart-candles", slotProps?.candles?.className)}
    >
      {data.map((candle, index) => (
        <CandleChartCandle
          key={`${candle.time}-${index}`}
          as="li"
          candle={candle}
          hitLabel={formatLabel(accessibleLabels.candle, { time: String(candle.time) }, locale)}
          index={index}
          x={(index / data.length) * 100}
          slot={100 / data.length}
          min={min}
          max={max}
          interactive={interactive}
          isActive={activeCandleIndex === index}
          isSelected={selectedCandleIndex === index}
          cursorY={cursorY}
          onCandleClick={onCandleClick}
          onCandlePointerLeave={onCandlePointerLeave}
          onCandlePointerMove={onCandlePointerMove}
          slotProps={slotProps}
        />
      ))}
    </ol>
  );

  return useRenderElement({
    as,
    defaultTag: "figure",
    props: {
      "aria-label": label,
      "data-interactive": interactive ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-candle-chart", consumerProps.className),
      children: (
        <>
          <figcaption
            {...slotProps?.caption}
            className={cn("uiify-candle-chart-caption", slotProps?.caption?.className)}
          >
            {label}
          </figcaption>
          {interactive && readoutCandle ? (
            <div
              aria-live={announceReadout ? "polite" : "off"}
              {...slotProps?.readout}
              className={cn("uiify-candle-chart-readout", slotProps?.readout?.className)}
            >
              <span
                {...slotProps?.readoutTime}
                className={cn("uiify-candle-chart-readout-time", slotProps?.readoutTime?.className)}
              >
                {String(readoutCandle.time)}
              </span>
              <span {...slotProps?.readoutOpen}>{`O ${readoutCandle.open}`}</span>
              <span {...slotProps?.readoutHigh}>{`H ${readoutCandle.high}`}</span>
              <span {...slotProps?.readoutLow}>{`L ${readoutCandle.low}`}</span>
              <span {...slotProps?.readoutClose}>{`C ${readoutCandle.close}`}</span>
            </div>
          ) : null}
          <div
            aria-hidden={interactive ? undefined : true}
            {...slotProps?.plot}
            className={cn("uiify-candle-chart-plot", slotProps?.plot?.className)}
          >
            <div
              {...slotProps?.scrollViewport}
              className={cn(
                "uiify-candle-chart-scroll-viewport",
                slotProps?.scrollViewport?.className,
              )}
            >
              <div
                {...slotProps?.canvas}
                className={cn("uiify-candle-chart-canvas", slotProps?.canvas?.className)}
              >
                <div
                  {...slotProps?.viewport}
                  className={cn("uiify-candle-chart-viewport", slotProps?.viewport?.className)}
                >
                  {candles}
                  {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                    <div
                      aria-hidden="true"
                      {...slotProps?.crosshair}
                      className={cn(
                        "uiify-candle-chart-crosshair",
                        slotProps?.crosshair?.className,
                      )}
                      style={{
                        ...crosshairStyle(slotOffset + activeCandleIndex, slotCount, cursorY),
                        ...slotProps?.crosshair?.style,
                      }}
                    >
                      <span
                        {...slotProps?.crosshairMarker}
                        className={cn(
                          "uiify-candle-chart-crosshair-marker",
                          slotProps?.crosshairMarker?.className,
                        )}
                      >
                        +
                      </span>
                    </div>
                  ) : null}
                </div>
                <div
                  {...slotProps?.timeViewport}
                  className={cn(
                    "uiify-candle-chart-time-viewport",
                    slotProps?.timeViewport?.className,
                  )}
                >
                  <ol
                    data-axis="time"
                    aria-label={`${label} ${accessibleLabels.months}`}
                    {...slotProps?.timeAxis}
                    className={cn("uiify-candle-chart-time-axis", slotProps?.timeAxis?.className)}
                  >
                    {monthLabels.map((axisLabel, index) => (
                      <li
                        key={`${axisLabel.position}-${index}`}
                        {...withGeneratedStyle(
                          getIndexedPartProps(slotProps?.timeAxisLabel, index),
                          axisStyle("x", axisLabel.position),
                        )}
                      >
                        {axisLabel.label}
                      </li>
                    ))}
                    {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                      <li
                        {...slotProps?.crosshairTime}
                        className={cn(
                          "uiify-candle-chart-crosshair-time",
                          slotProps?.crosshairTime?.className,
                        )}
                        style={{
                          ...crosshairStyle(slotOffset + activeCandleIndex, slotCount, undefined),
                          ...slotProps?.crosshairTime?.style,
                        }}
                      >
                        {String(crosshairCandle.time)}
                      </li>
                    ) : null}
                  </ol>
                </div>
              </div>
            </div>
            <ol
              data-axis="price"
              aria-label={`${label} ${accessibleLabels.prices}`}
              {...slotProps?.priceAxis}
              className={cn("uiify-candle-chart-price-axis", slotProps?.priceAxis?.className)}
            >
              {priceLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  {...withGeneratedStyle(
                    getIndexedPartProps(slotProps?.priceAxisLabel, index),
                    axisStyle("y", axisLabel.position),
                  )}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                <li
                  {...slotProps?.crosshairPrice}
                  className={cn(
                    "uiify-candle-chart-crosshair-price",
                    slotProps?.crosshairPrice?.className,
                  )}
                  style={{ ...cursorStyle(cursorY), ...slotProps?.crosshairPrice?.style }}
                >
                  {crosshairCandle.close}
                </li>
              ) : null}
            </ol>
          </div>
          <table
            aria-label={`${label} ${accessibleLabels.data}`}
            {...slotProps?.dataTable}
            className={cn("uiify-candle-chart-data", slotProps?.dataTable?.className)}
          >
            <thead {...slotProps?.dataTableHead}>
              <tr {...slotProps?.dataTableHeaderRow}>
                <th scope="col" {...slotProps?.dataTableTimeHeader}>
                  {accessibleLabels.time}
                </th>
                <th scope="col" {...slotProps?.dataTableOpenHeader}>
                  {accessibleLabels.open}
                </th>
                <th scope="col" {...slotProps?.dataTableHighHeader}>
                  {accessibleLabels.high}
                </th>
                <th scope="col" {...slotProps?.dataTableLowHeader}>
                  {accessibleLabels.low}
                </th>
                <th scope="col" {...slotProps?.dataTableCloseHeader}>
                  {accessibleLabels.close}
                </th>
              </tr>
            </thead>
            <tbody {...slotProps?.dataTableBody}>
              {data.map((candle, index) => (
                <tr
                  key={`${candle.time}-${index}`}
                  {...getIndexedPartProps(slotProps?.dataTableRow, slotOffset + index)}
                >
                  <th
                    scope="row"
                    {...getIndexedPartProps(slotProps?.dataTableTimeCell, slotOffset + index)}
                  >
                    {String(candle.time)}
                  </th>
                  <td {...getIndexedPartProps(slotProps?.dataTableOpenCell, slotOffset + index)}>
                    {candle.open}
                  </td>
                  <td {...getIndexedPartProps(slotProps?.dataTableHighCell, slotOffset + index)}>
                    {candle.high}
                  </td>
                  <td {...getIndexedPartProps(slotProps?.dataTableLowCell, slotOffset + index)}>
                    {candle.low}
                  </td>
                  <td {...getIndexedPartProps(slotProps?.dataTableCloseCell, slotOffset + index)}>
                    {candle.close}
                  </td>
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
