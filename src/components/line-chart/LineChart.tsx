import type { ElementType, KeyboardEvent, PointerEvent, ReactElement, Ref } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { mergeRepeatedSlotProps, omitProps } from "../../core/slot-props.js";
import { assignRef } from "../../hooks/utils/assign-ref.js";
import {
  axisLabelsFor,
  axisStyle,
  crosshairStyle,
  cursorStyle,
  geometryFor,
  getValueBounds,
  monthLabelsFor,
  pointStyle,
  pointsStyle,
  slotCrosshairStyle,
  valueLabelsFor,
} from "./line-chart-geometry.js";
import type { LineChartPointProps, LineChartProps, LineChartViewProps } from "./types.js";

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

function forwardPointRef(ref: Ref<HTMLElement> | undefined) {
  return (element: HTMLLIElement | HTMLDivElement | null): void | (() => void) => {
    const cleanup = assignRef(ref, element);
    if (typeof cleanup === "function") return cleanup;
    if (ref && typeof ref !== "function" && element !== null) {
      return () => assignRef(ref, null);
    }
  };
}

/** One point and the segment from its predecessor; shared by the static list and virtual rows. */
export function LineChartPoint({
  as: Tag,
  point,
  previousPoint,
  index,
  count,
  min,
  max,
  interactive,
  isActive,
  isSelected,
  cursorY,
  onPointClick,
  onPointPointerLeave,
  onPointPointerMove,
  slotProps,
}: LineChartPointProps): ReactElement {
  const geometry = geometryFor(point, previousPoint, index, count, min, max);
  const pointSlotProps = getIndexedPartProps(slotProps?.point, index, [
    "aria-hidden",
    "data-crosshair-active",
    "data-first",
    "data-part",
    "data-point-selected",
    "data-time",
    "data-trend",
  ]);
  const { ref: pointRef, ...pointProps } = pointSlotProps;
  const pointHitSlotProps = getIndexedPartProps(slotProps?.pointHit, index, [
    "aria-label",
    "aria-pressed",
    "data-part",
    "type",
  ]);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    pointHitSlotProps.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onPointClick?.(index);
  };

  return (
    <Tag
      {...pointProps}
      {...(pointRef ? { ref: forwardPointRef(pointRef) } : {})}
      aria-hidden={interactive ? undefined : true}
      data-part="point"
      data-first={previousPoint === undefined ? "" : undefined}
      data-crosshair-active={interactive && isActive ? "" : undefined}
      data-point-selected={interactive && isSelected ? "" : undefined}
      data-time={String(point.time)}
      data-trend={geometry.trend}
      style={{
        ...pointSlotProps.style,
        ...pointStyle(geometry, isActive ? cursorY : undefined),
      }}
    >
      {interactive ? (
        <button
          {...pointHitSlotProps}
          data-part="point-hit"
          type="button"
          aria-label={`Point ${String(point.time)}`}
          aria-pressed={isSelected}
          onClick={(event) => {
            pointHitSlotProps.onClick?.(event);
            if (!event.defaultPrevented) onPointClick?.(index);
          }}
          onKeyDown={handleKeyDown}
          onPointerLeave={(event) => {
            pointHitSlotProps.onPointerLeave?.(event);
            if (!event.defaultPrevented) onPointPointerLeave?.();
          }}
          onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
            pointHitSlotProps.onPointerMove?.(event);
            if (!event.defaultPrevented)
              onPointPointerMove?.({ index, offsetY: event.nativeEvent.offsetY });
          }}
        />
      ) : null}
    </Tag>
  );
}
LineChartPoint.displayName = "LineChartPoint";

export function LineChart<TAs extends ElementType = "figure">(
  props: LineChartProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    data,
    xAxis,
    yAxis,
    "aria-label": ariaLabel,
    activePointIndex,
    cursorY,
    interactive = false,
    locale = "en-US",
    onPointClick,
    onPointPointerLeave,
    onPointPointerMove,
    selectedPointIndex,
    slotProps,
    pointLayer,
    announceReadout = true,
    slotCount,
    slotOffset = 0,
    ...consumerProps
  } = props as LineChartProps<"figure"> & LineChartViewProps;
  const { min, max } = getValueBounds(data);
  const label = ariaLabel ?? "Line chart";
  const timeLabels = axisLabelsFor(xAxis, monthLabelsFor(data, locale));
  const valueLabels = axisLabelsFor(yAxis, valueLabelsFor(min, max, locale));
  const readoutIndex =
    activePointIndex ?? selectedPointIndex ?? (data.length > 0 ? data.length - 1 : undefined);
  const readoutPoint = readoutIndex === undefined ? undefined : data[readoutIndex];
  const crosshairPoint = activePointIndex === undefined ? undefined : data[activePointIndex];
  const points = pointLayer ?? (
    <ol
      {...getPartProps(slotProps?.points, ["aria-label", "data-part"])}
      data-part="points"
      aria-label={`${label} points`}
      style={{ ...slotProps?.points?.style, ...pointsStyle(data.length) }}
    >
      {data.map((point, index) => (
        <LineChartPoint
          key={`${point.time}-${index}`}
          as="li"
          point={point}
          previousPoint={data[index - 1]}
          index={index}
          count={data.length}
          min={min}
          max={max}
          interactive={interactive}
          isActive={activePointIndex === index}
          isSelected={selectedPointIndex === index}
          cursorY={cursorY}
          onPointClick={onPointClick}
          onPointPointerLeave={onPointPointerLeave}
          onPointPointerMove={onPointPointerMove}
          slotProps={slotProps}
        />
      ))}
    </ol>
  );
  const crosshairFor = (index: number, y: number | undefined) =>
    slotCount === undefined
      ? crosshairStyle(index, data.length, y)
      : slotCrosshairStyle(slotOffset + index, slotCount, y);

  return useRenderElement({
    as,
    defaultTag: "figure",
    props: {
      ...consumerProps,
      "aria-label": label,
      "data-uiify-line-chart": "",
      "data-interactive": interactive ? "" : undefined,
      children: (
        <>
          <figcaption {...getPartProps(slotProps?.caption)}>{label}</figcaption>
          {interactive && readoutPoint ? (
            <div
              {...getPartProps(slotProps?.readout, ["aria-live", "data-part"])}
              data-part="readout"
              aria-live={announceReadout ? "polite" : "off"}
            >
              <span
                {...getPartProps(slotProps?.readoutTime, ["data-part"])}
                data-part="readout-time"
              >
                {String(readoutPoint.time)}
              </span>
              <span {...getPartProps(slotProps?.readoutValue)}>{readoutPoint.value}</span>
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
                  {points}
                  {interactive && crosshairPoint && activePointIndex !== undefined ? (
                    <div
                      {...getPartProps(slotProps?.crosshair, ["aria-hidden", "data-part"])}
                      data-part="crosshair"
                      aria-hidden="true"
                      style={{
                        ...slotProps?.crosshair?.style,
                        ...crosshairFor(activePointIndex, cursorY),
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
                    aria-label={`${label} dates`}
                  >
                    {timeLabels.map((axisLabel, index) => (
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
                    {interactive && crosshairPoint && activePointIndex !== undefined ? (
                      <li
                        {...getPartProps(slotProps?.crosshairTime, ["data-part"])}
                        data-part="crosshair-time"
                        style={{
                          ...slotProps?.crosshairTime?.style,
                          ...crosshairFor(activePointIndex, undefined),
                        }}
                      >
                        {String(crosshairPoint.time)}
                      </li>
                    ) : null}
                  </ol>
                </div>
              </div>
            </div>
            <ol
              {...getPartProps(slotProps?.valueAxis, ["aria-label", "data-axis", "data-part"])}
              data-part="value-axis"
              data-axis="value"
              aria-label={`${label} values`}
            >
              {valueLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  {...withGeneratedStyle(
                    getIndexedPartProps(slotProps?.valueAxisLabel, index, ["data-part"]),
                    axisStyle("y", axisLabel.position),
                  )}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairPoint && activePointIndex !== undefined ? (
                <li
                  {...getPartProps(slotProps?.crosshairValue, ["data-part"])}
                  data-part="crosshair-value"
                  style={{ ...slotProps?.crosshairValue?.style, ...cursorStyle(cursorY) }}
                >
                  {crosshairPoint.value}
                </li>
              ) : null}
            </ol>
          </div>
          <table
            {...getPartProps(slotProps?.dataTable, ["aria-label", "data-part"])}
            data-part="data"
            aria-label={`${label} data`}
          >
            <thead {...getPartProps(slotProps?.dataTableHead)}>
              <tr {...getPartProps(slotProps?.dataTableHeaderRow)}>
                <th {...getPartProps(slotProps?.dataTableTimeHeader, ["scope"])} scope="col">
                  Time
                </th>
                <th {...getPartProps(slotProps?.dataTableValueHeader, ["scope"])} scope="col">
                  Value
                </th>
              </tr>
            </thead>
            <tbody {...getPartProps(slotProps?.dataTableBody)}>
              {data.map((point, index) => (
                <tr
                  key={`${point.time}-${index}`}
                  {...getIndexedPartProps(slotProps?.dataTableRow, slotOffset + index)}
                >
                  <th
                    {...getIndexedPartProps(slotProps?.dataTableTimeCell, slotOffset + index, [
                      "scope",
                    ])}
                    scope="row"
                  >
                    {String(point.time)}
                  </th>
                  <td {...getIndexedPartProps(slotProps?.dataTableValueCell, slotOffset + index)}>
                    {point.value}
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
LineChart.displayName = "LineChart";
