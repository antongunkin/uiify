import type { ElementType, KeyboardEvent, PointerEvent, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
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
  valueLabelsFor,
} from "./line-chart-geometry.js";
import type { LineChartProps } from "./types.js";

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
    onPointClick,
    onPointPointerLeave,
    onPointPointerMove,
    selectedPointIndex,
    ...consumerProps
  } = props as LineChartProps<"figure">;
  const { min, max } = getValueBounds(data);
  const label = ariaLabel ?? "Line chart";
  const timeLabels = axisLabelsFor(xAxis, monthLabelsFor(data));
  const valueLabels = axisLabelsFor(yAxis, valueLabelsFor(min, max));
  const readoutIndex =
    activePointIndex ?? selectedPointIndex ?? (data.length > 0 ? data.length - 1 : undefined);
  const readoutPoint = readoutIndex === undefined ? undefined : data[readoutIndex];
  const crosshairPoint = activePointIndex === undefined ? undefined : data[activePointIndex];
  const points = data.map((point, index) => {
    const geometry = geometryFor(point, data[index - 1], index, data.length, min, max);
    const isActive = activePointIndex === index;
    const isSelected = selectedPointIndex === index;
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onPointClick?.(index);
    };

    return (
      <li
        key={`${point.time}-${index}`}
        aria-hidden={interactive ? undefined : true}
        data-crosshair-active={interactive && isActive ? "" : undefined}
        data-point-selected={interactive && isSelected ? "" : undefined}
        data-time={String(point.time)}
        data-trend={geometry.trend}
        style={pointStyle(geometry, isActive ? cursorY : undefined)}
      >
        {interactive ? (
          <button
            className="line-chart__point-hit"
            type="button"
            aria-label={`Point ${String(point.time)}`}
            aria-pressed={isSelected}
            onClick={() => onPointClick?.(index)}
            onKeyDown={handleKeyDown}
            onPointerLeave={onPointPointerLeave}
            onPointerMove={(event: PointerEvent<HTMLButtonElement>) =>
              onPointPointerMove?.({ index, offsetY: event.nativeEvent.offsetY })
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
      "data-uiify-line-chart": "",
      "data-interactive": interactive ? "" : undefined,
      children: (
        <>
          <figcaption>{label}</figcaption>
          {interactive && readoutPoint ? (
            <div className="line-chart__readout" aria-live="polite">
              <span className="line-chart__readout-time">{String(readoutPoint.time)}</span>
              <span>{readoutPoint.value}</span>
            </div>
          ) : null}
          <div className="line-chart__plot" aria-hidden={interactive ? undefined : true}>
            <div className="line-chart__scroll-viewport">
              <div className="line-chart__canvas">
                <div className="line-chart__viewport">
                  <ol
                    className="line-chart__points"
                    aria-label={`${label} points`}
                    style={pointsStyle(data.length)}
                  >
                    {points}
                  </ol>
                  {interactive && crosshairPoint && activePointIndex !== undefined ? (
                    <div
                      className="line-chart__crosshair"
                      aria-hidden="true"
                      style={crosshairStyle(activePointIndex, data.length, cursorY)}
                    >
                      <span className="line-chart__crosshair-marker">+</span>
                    </div>
                  ) : null}
                </div>
                <div className="line-chart__time-viewport">
                  <ol
                    className="line-chart__time-axis"
                    data-axis="time"
                    aria-label={`${label} dates`}
                  >
                    {timeLabels.map((axisLabel, index) => (
                      <li
                        key={`${axisLabel.position}-${index}`}
                        style={axisStyle("x", axisLabel.position)}
                      >
                        {axisLabel.label}
                      </li>
                    ))}
                    {interactive && crosshairPoint && activePointIndex !== undefined ? (
                      <li
                        className="line-chart__crosshair-time"
                        style={crosshairStyle(activePointIndex, data.length, undefined)}
                      >
                        {String(crosshairPoint.time)}
                      </li>
                    ) : null}
                  </ol>
                </div>
              </div>
            </div>
            <ol className="line-chart__value-axis" data-axis="value" aria-label={`${label} values`}>
              {valueLabels.map((axisLabel, index) => (
                <li
                  key={`${axisLabel.position}-${index}`}
                  style={axisStyle("y", axisLabel.position)}
                >
                  {axisLabel.label}
                </li>
              ))}
              {interactive && crosshairPoint && activePointIndex !== undefined ? (
                <li className="line-chart__crosshair-value" style={cursorStyle(cursorY)}>
                  {crosshairPoint.value}
                </li>
              ) : null}
            </ol>
          </div>
          <table className="line-chart__data" aria-label={`${label} data`}>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point, index) => (
                <tr key={`${point.time}-${index}`}>
                  <th scope="row">{String(point.time)}</th>
                  <td>{point.value}</td>
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
