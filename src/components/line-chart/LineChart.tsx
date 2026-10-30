import type { ElementType, KeyboardEvent, PointerEvent, ReactElement, Ref } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
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
  const { ref: pointRef, ...pointProps } = pointSlotProps;
  const pointHitSlotProps = getIndexedPartProps(slotProps?.pointHit, index);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onPointClick?.(index);
  };

  return (
    <Tag
      aria-hidden={interactive ? undefined : true}
      data-part="point"
      data-first={previousPoint === undefined ? "" : undefined}
      data-crosshair-active={interactive && isActive ? "" : undefined}
      data-point-selected={interactive && isSelected ? "" : undefined}
      data-time={String(point.time)}
      data-trend={geometry.trend}
      {...pointProps}
      {...(pointRef ? { ref: forwardPointRef(pointRef) } : {})}
      style={{
        ...pointStyle(geometry, isActive ? cursorY : undefined),
        ...pointSlotProps.style,
      }}
    >
      {interactive ? (
        <button
          data-part="point-hit"
          type="button"
          aria-label={`Point ${String(point.time)}`}
          aria-pressed={isSelected}
          {...pointHitSlotProps}
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
      data-part="points"
      aria-label={`${label} points`}
      {...slotProps?.points}
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
      "data-uiify-line-chart": "",
      "data-interactive": interactive ? "" : undefined,
      ...consumerProps,
      children: (
        <>
          <figcaption {...slotProps?.caption}>{label}</figcaption>
          {interactive && readoutPoint ? (
            <div
              data-part="readout"
              aria-live={announceReadout ? "polite" : "off"}
              {...slotProps?.readout}
            >
              <span data-part="readout-time" {...slotProps?.readoutTime}>
                {String(readoutPoint.time)}
              </span>
              <span {...slotProps?.readoutValue}>{readoutPoint.value}</span>
            </div>
          ) : null}
          <div data-part="plot" aria-hidden={interactive ? undefined : true} {...slotProps?.plot}>
            <div data-part="scroll-viewport" {...slotProps?.scrollViewport}>
              <div data-part="canvas" {...slotProps?.canvas}>
                <div data-part="viewport" {...slotProps?.viewport}>
                  {points}
                  {interactive && crosshairPoint && activePointIndex !== undefined ? (
                    <div
                      data-part="crosshair"
                      aria-hidden="true"
                      {...slotProps?.crosshair}
                      style={{
                        ...crosshairFor(activePointIndex, cursorY),
                        ...slotProps?.crosshair?.style,
                      }}
                    >
                      <span data-part="crosshair-marker" {...slotProps?.crosshairMarker}>
                        +
                      </span>
                    </div>
                  ) : null}
                </div>
                <div data-part="time-viewport" {...slotProps?.timeViewport}>
                  <ol
                    data-part="time-axis"
                    data-axis="time"
                    aria-label={`${label} dates`}
                    {...slotProps?.timeAxis}
                  >
                    {timeLabels.map((axisLabel, index) => (
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
                    {interactive && crosshairPoint && activePointIndex !== undefined ? (
                      <li
                        data-part="crosshair-time"
                        {...slotProps?.crosshairTime}
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
              data-part="value-axis"
              data-axis="value"
              aria-label={`${label} values`}
              {...slotProps?.valueAxis}
            >
              {valueLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  {...withGeneratedStyle(
                    getIndexedPartProps(slotProps?.valueAxisLabel, index),
                    axisStyle("y", axisLabel.position),
                  )}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairPoint && activePointIndex !== undefined ? (
                <li
                  data-part="crosshair-value"
                  {...slotProps?.crosshairValue}
                  style={{ ...cursorStyle(cursorY), ...slotProps?.crosshairValue?.style }}
                >
                  {crosshairPoint.value}
                </li>
              ) : null}
            </ol>
          </div>
          <table data-part="data" aria-label={`${label} data`} {...slotProps?.dataTable}>
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
