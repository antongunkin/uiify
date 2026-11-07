import type { ElementType, KeyboardEvent, PointerEvent, ReactElement, Ref } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import { mergeRepeatedSlotProps } from "../../core/slot-props.js";
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

function getIndexedPartProps<T extends object>(
  props: (T & { readonly byItemIndex?: Readonly<Record<number, T>> }) | undefined,
  index: number,
): T {
  const { byItemIndex, ...common } = props ?? {};
  return mergeRepeatedSlotProps(common as T, byItemIndex?.[index]);
}

function styledPart<T extends { className?: string | undefined }>(
  props: T | undefined,
  className: string,
): T {
  return { ...props, className: cn(className, props?.className) } as T;
}

function withGeneratedStyle<T extends { readonly style?: object | undefined }>(
  props: T,
  generatedStyle: object,
): T {
  return { ...props, style: { ...generatedStyle, ...props.style } };
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
  const pointSlotProps = getIndexedPartProps(slotProps?.point, index);
  const { ref: pointRef, className: pointClassName, ...pointProps } = pointSlotProps;
  const pointHitSlotProps = getIndexedPartProps(slotProps?.pointHit, index);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onPointClick?.(index);
  };

  return (
    <Tag
      aria-hidden={interactive ? undefined : true}
      data-first={previousPoint === undefined ? "" : undefined}
      data-crosshair-active={interactive && isActive ? "" : undefined}
      data-point-selected={interactive && isSelected ? "" : undefined}
      data-time={String(point.time)}
      data-trend={geometry.trend}
      {...pointProps}
      className={cn("uiify-line-chart-point", pointClassName)}
      {...(pointRef ? { ref: forwardPointRef(pointRef) } : {})}
      style={{
        ...pointStyle(geometry, isActive ? cursorY : undefined),
        ...pointSlotProps.style,
      }}
    >
      {interactive ? (
        <button
          type="button"
          aria-label={`Point ${String(point.time)}`}
          aria-pressed={isSelected}
          {...pointHitSlotProps}
          className={cn("uiify-line-chart-point-hit", pointHitSlotProps.className)}
          onClick={composeEventHandlers(pointHitSlotProps.onClick, () => onPointClick?.(index))}
          onKeyDown={composeEventHandlers(pointHitSlotProps.onKeyDown, handleKeyDown)}
          onPointerLeave={composeEventHandlers(pointHitSlotProps.onPointerLeave, () =>
            onPointPointerLeave?.(),
          )}
          onPointerMove={composeEventHandlers(
            pointHitSlotProps.onPointerMove,
            (event: PointerEvent<HTMLButtonElement>) =>
              onPointPointerMove?.({ index, offsetY: event.nativeEvent.offsetY }),
          )}
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
  const label = consumerProps["aria-label"] ?? "Line chart";
  const timeLabels = axisLabelsFor(xAxis, monthLabelsFor(data, locale));
  const valueLabels = axisLabelsFor(yAxis, valueLabelsFor(min, max, locale));
  const readoutIndex =
    activePointIndex ?? selectedPointIndex ?? (data.length > 0 ? data.length - 1 : undefined);
  const readoutPoint = readoutIndex === undefined ? undefined : data[readoutIndex];
  const crosshairPoint = activePointIndex === undefined ? undefined : data[activePointIndex];
  const points = pointLayer ?? (
    <ol
      aria-label={`${label} points`}
      {...styledPart(slotProps?.points, "uiify-line-chart-points")}
      style={{ ...pointsStyle(data.length), ...slotProps?.points?.style }}
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
      "aria-label": label,

      "data-interactive": interactive ? "" : undefined,
      ...consumerProps,
      className: cn(
        "uiify-line-chart",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children: (
        <>
          <figcaption {...styledPart(slotProps?.caption, "uiify-line-chart-caption")}>
            {label}
          </figcaption>
          {interactive && readoutPoint ? (
            <div
              aria-live={announceReadout ? "polite" : "off"}
              {...slotProps?.readout}
              className={cn("uiify-line-chart-readout", slotProps?.readout?.className)}
            >
              <span
                {...slotProps?.readoutTime}
                className={cn("uiify-line-chart-readout-time", slotProps?.readoutTime?.className)}
              >
                {String(readoutPoint.time)}
              </span>
              <span {...slotProps?.readoutValue}>{readoutPoint.value}</span>
            </div>
          ) : null}
          <div
            aria-hidden={interactive ? undefined : true}
            {...slotProps?.plot}
            className={cn("uiify-line-chart-plot", slotProps?.plot?.className)}
          >
            <div
              {...slotProps?.scrollViewport}
              className={cn(
                "uiify-line-chart-scroll-viewport",
                slotProps?.scrollViewport?.className,
              )}
            >
              <div
                {...slotProps?.canvas}
                className={cn("uiify-line-chart-canvas", slotProps?.canvas?.className)}
              >
                <div
                  {...slotProps?.viewport}
                  className={cn("uiify-line-chart-viewport", slotProps?.viewport?.className)}
                >
                  {points}
                  {interactive && crosshairPoint && activePointIndex !== undefined ? (
                    <div
                      aria-hidden="true"
                      {...styledPart(slotProps?.crosshair, "uiify-line-chart-crosshair")}
                      style={{
                        ...crosshairFor(activePointIndex, cursorY),
                        ...slotProps?.crosshair?.style,
                      }}
                    >
                      <span
                        {...styledPart(
                          slotProps?.crosshairMarker,
                          "uiify-line-chart-crosshair-marker",
                        )}
                      >
                        +
                      </span>
                    </div>
                  ) : null}
                </div>
                <div {...styledPart(slotProps?.timeViewport, "uiify-line-chart-time-viewport")}>
                  <ol
                    data-axis="time"
                    aria-label={`${label} dates`}
                    {...styledPart(slotProps?.timeAxis, "uiify-line-chart-time-axis")}
                  >
                    {timeLabels.map((axisLabel, index) => (
                      <li
                        key={`${axisLabel.position}-${index}`}
                        {...withGeneratedStyle(
                          styledPart(
                            getIndexedPartProps(slotProps?.timeAxisLabel, index),
                            "uiify-line-chart-time-axis-label",
                          ),
                          axisStyle("x", axisLabel.position),
                        )}
                      >
                        {axisLabel.label}
                      </li>
                    ))}
                    {interactive && crosshairPoint && activePointIndex !== undefined ? (
                      <li
                        {...styledPart(slotProps?.crosshairTime, "uiify-line-chart-crosshair-time")}
                        style={{
                          ...crosshairFor(activePointIndex, undefined),
                          ...slotProps?.crosshairTime?.style,
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
              data-axis="value"
              aria-label={`${label} values`}
              {...styledPart(slotProps?.valueAxis, "uiify-line-chart-value-axis")}
            >
              {valueLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  {...withGeneratedStyle(
                    styledPart(
                      getIndexedPartProps(slotProps?.valueAxisLabel, index),
                      "uiify-line-chart-value-axis-label",
                    ),
                    axisStyle("y", axisLabel.position),
                  )}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairPoint && activePointIndex !== undefined ? (
                <li
                  {...styledPart(slotProps?.crosshairValue, "uiify-line-chart-crosshair-value")}
                  style={{ ...cursorStyle(cursorY), ...slotProps?.crosshairValue?.style }}
                >
                  {crosshairPoint.value}
                </li>
              ) : null}
            </ol>
          </div>
          <table
            aria-label={`${label} data`}
            {...styledPart(slotProps?.dataTable, "uiify-line-chart-data")}
          >
            <thead {...slotProps?.dataTableHead}>
              <tr {...slotProps?.dataTableHeaderRow}>
                <th scope="col" {...slotProps?.dataTableTimeHeader}>
                  Time
                </th>
                <th scope="col" {...slotProps?.dataTableValueHeader}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody {...slotProps?.dataTableBody}>
              {data.map((point, index) => (
                <tr
                  key={`${point.time}-${index}`}
                  {...getIndexedPartProps(slotProps?.dataTableRow, slotOffset + index)}
                >
                  <th
                    scope="row"
                    {...getIndexedPartProps(slotProps?.dataTableTimeCell, slotOffset + index)}
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
