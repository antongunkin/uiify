import type {
  CSSProperties,
  ElementType,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { mergeRepeatedSlotProps, omitProps } from "../../core/slot-props.js";
import { assignRef } from "../../hooks/utils/assign-ref.js";
import type {
  CandleChartAxisLabel,
  CandleChartCandleProps,
  CandleChartData,
  CandleChartProps,
  CandleChartViewProps,
} from "./types.js";

function getPartProps<T extends object>(
  props: T | undefined,
  protectedKeys: readonly string[] = [],
): T {
  return omitProps(props, ["children", "dangerouslySetInnerHTML", ...protectedKeys]);
}

function getIndexedPartProps<T extends object>(
  props: (T & { readonly byItemIndex?: Readonly<Record<number, T>> }) | undefined,
  index: number,
  protectedKeys: readonly string[] = [],
): T {
  const { byItemIndex, ...common } = props ?? {};
  const merged = mergeRepeatedSlotProps(common as T, byItemIndex?.[index]);
  return omitProps(merged, [
    "children",
    "dangerouslySetInnerHTML",
    "byItemIndex",
    ...protectedKeys,
  ]);
}

function withGeneratedStyle<T extends { readonly style?: object | undefined }>(
  props: T,
  generatedStyle: object,
): T {
  return { ...props, style: { ...props.style, ...generatedStyle } };
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
  const candleSlotProps = getIndexedPartProps(slotProps?.candle, index, [
    "aria-hidden",
    "data-crosshair-active",
    "data-direction",
    "data-part",
    "data-time",
  ]);
  const { ref: candleRef, ...candleProps } = candleSlotProps;
  const candleHitSlotProps = getIndexedPartProps(slotProps?.candleHit, index, [
    "aria-label",
    "aria-pressed",
    "data-part",
    "type",
  ]);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    candleHitSlotProps.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onCandleClick?.(index);
  };

  return (
    <Tag
      {...candleProps}
      {...(candleRef ? { ref: forwardCandleRef(candleRef) } : {})}
      aria-hidden={interactive ? undefined : true}
      data-part="candle"
      data-direction={geometry.direction}
      data-crosshair-active={interactive && isActive ? "" : undefined}
      data-time={String(candle.time)}
      style={{
        ...candleSlotProps.style,
        ...candleStyle(geometry, isActive ? cursorY : undefined),
      }}
    >
      {interactive ? (
        <button
          {...candleHitSlotProps}
          data-part="candle-hit"
          type="button"
          aria-label={hitLabel}
          aria-pressed={isSelected}
          onClick={(event) => {
            candleHitSlotProps.onClick?.(event);
            if (!event.defaultPrevented) onCandleClick?.(index);
          }}
          onKeyDown={handleKeyDown}
          onPointerLeave={(event) => {
            candleHitSlotProps.onPointerLeave?.(event);
            if (!event.defaultPrevented) onCandlePointerLeave?.();
          }}
          onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
            candleHitSlotProps.onPointerMove?.(event);
            if (!event.defaultPrevented)
              onCandlePointerMove?.({ index, offsetY: event.nativeEvent.offsetY });
          }}
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
    "aria-label": ariaLabel,
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
  const label = ariaLabel ?? accessibleLabels.chart;
  const monthLabels = axisLabelsFor(xAxis, monthLabelsFor(data, locale));
  const priceLabels = axisLabelsFor(yAxis, priceLabelsFor(min, max, locale));
  const readoutIndex =
    activeCandleIndex ?? selectedCandleIndex ?? (data.length > 0 ? data.length - 1 : undefined);
  const readoutCandle = readoutIndex === undefined ? undefined : data[readoutIndex];
  const crosshairCandle = activeCandleIndex === undefined ? undefined : data[activeCandleIndex];
  const candles = candleLayer ?? (
    <ol
      {...getPartProps(slotProps?.candles, ["aria-label", "data-part"])}
      data-part="candles"
      aria-label={`${label} ${accessibleLabels.candles}`}
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
      ...consumerProps,
      "aria-label": label,
      "data-uiify-candle-chart": "",
      "data-interactive": interactive ? "" : undefined,
      children: (
        <>
          <figcaption {...getPartProps(slotProps?.caption)}>{label}</figcaption>
          {interactive && readoutCandle ? (
            <div
              {...getPartProps(slotProps?.readout, ["aria-live", "data-part"])}
              data-part="readout"
              aria-live={announceReadout ? "polite" : "off"}
            >
              <span
                {...getPartProps(slotProps?.readoutTime, ["data-part"])}
                data-part="readout-time"
              >
                {String(readoutCandle.time)}
              </span>
              <span {...getPartProps(slotProps?.readoutOpen)}>{`O ${readoutCandle.open}`}</span>
              <span {...getPartProps(slotProps?.readoutHigh)}>{`H ${readoutCandle.high}`}</span>
              <span {...getPartProps(slotProps?.readoutLow)}>{`L ${readoutCandle.low}`}</span>
              <span {...getPartProps(slotProps?.readoutClose)}>{`C ${readoutCandle.close}`}</span>
            </div>
          ) : null}
          <div
            {...getPartProps(slotProps?.plot, ["aria-hidden", "data-part"])}
            data-part="plot"
            aria-hidden={interactive ? undefined : true}
          >
            <div
              {...getPartProps(slotProps?.scrollViewport, ["data-part"])}
              data-part="scroll-viewport"
            >
              <div {...getPartProps(slotProps?.canvas, ["data-part"])} data-part="canvas">
                <div {...getPartProps(slotProps?.viewport, ["data-part"])} data-part="viewport">
                  {candles}
                  {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                    <div
                      {...getPartProps(slotProps?.crosshair, ["aria-hidden", "data-part"])}
                      data-part="crosshair"
                      aria-hidden="true"
                      style={{
                        ...slotProps?.crosshair?.style,
                        ...crosshairStyle(slotOffset + activeCandleIndex, slotCount, cursorY),
                      }}
                    >
                      <span
                        {...getPartProps(slotProps?.crosshairMarker, ["data-part"])}
                        data-part="crosshair-marker"
                      >
                        +
                      </span>
                    </div>
                  ) : null}
                </div>
                <div
                  {...getPartProps(slotProps?.timeViewport, ["data-part"])}
                  data-part="time-viewport"
                >
                  <ol
                    {...getPartProps(slotProps?.timeAxis, ["aria-label", "data-axis", "data-part"])}
                    data-part="time-axis"
                    data-axis="time"
                    aria-label={`${label} ${accessibleLabels.months}`}
                  >
                    {monthLabels.map((axisLabel, index) => (
                      <li
                        key={`${axisLabel.position}-${index}`}
                        {...withGeneratedStyle(
                          getIndexedPartProps(slotProps?.timeAxisLabel, index, ["data-part"]),
                          axisStyle("x", axisLabel.position),
                        )}
                      >
                        {axisLabel.label}
                      </li>
                    ))}
                    {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                      <li
                        {...getPartProps(slotProps?.crosshairTime, ["data-part"])}
                        data-part="crosshair-time"
                        style={{
                          ...slotProps?.crosshairTime?.style,
                          ...crosshairStyle(slotOffset + activeCandleIndex, slotCount, undefined),
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
              {...getPartProps(slotProps?.priceAxis, ["aria-label", "data-axis", "data-part"])}
              data-part="price-axis"
              data-axis="price"
              aria-label={`${label} ${accessibleLabels.prices}`}
            >
              {priceLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  {...withGeneratedStyle(
                    getIndexedPartProps(slotProps?.priceAxisLabel, index, ["data-part"]),
                    axisStyle("y", axisLabel.position),
                  )}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairCandle && activeCandleIndex !== undefined ? (
                <li
                  {...getPartProps(slotProps?.crosshairPrice, ["data-part"])}
                  data-part="crosshair-price"
                  style={{ ...slotProps?.crosshairPrice?.style, ...cursorStyle(cursorY) }}
                >
                  {crosshairCandle.close}
                </li>
              ) : null}
            </ol>
          </div>
          <table
            {...getPartProps(slotProps?.dataTable, ["aria-label", "data-part"])}
            data-part="data"
            aria-label={`${label} ${accessibleLabels.data}`}
          >
            <thead {...getPartProps(slotProps?.dataTableHead)}>
              <tr {...getPartProps(slotProps?.dataTableHeaderRow)}>
                <th {...getPartProps(slotProps?.dataTableTimeHeader, ["scope"])} scope="col">
                  {accessibleLabels.time}
                </th>
                <th {...getPartProps(slotProps?.dataTableOpenHeader, ["scope"])} scope="col">
                  {accessibleLabels.open}
                </th>
                <th {...getPartProps(slotProps?.dataTableHighHeader, ["scope"])} scope="col">
                  {accessibleLabels.high}
                </th>
                <th {...getPartProps(slotProps?.dataTableLowHeader, ["scope"])} scope="col">
                  {accessibleLabels.low}
                </th>
                <th {...getPartProps(slotProps?.dataTableCloseHeader, ["scope"])} scope="col">
                  {accessibleLabels.close}
                </th>
              </tr>
            </thead>
            <tbody {...getPartProps(slotProps?.dataTableBody)}>
              {data.map((candle, index) => (
                <tr
                  key={`${candle.time}-${index}`}
                  {...getIndexedPartProps(slotProps?.dataTableRow, slotOffset + index)}
                >
                  <th
                    {...getIndexedPartProps(slotProps?.dataTableTimeCell, slotOffset + index, [
                      "scope",
                    ])}
                    scope="row"
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
