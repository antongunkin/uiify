import type { CSSProperties, ReactNode } from "react";
import type { LineChartAxisLabel, LineChartData } from "./types.js";

export interface PointStyle extends CSSProperties {
  "--line-prev-x"?: string;
  "--line-prev-y"?: string;
  "--line-slot": string;
  "--line-x": string;
  "--line-y": string;
  "--line-cursor-y"?: string;
}

export interface PointsStyle extends CSSProperties {
  "--line-count": string;
  "--line-segment-slot": string;
}

export interface CrosshairStyle extends CSSProperties {
  "--line-crosshair-x": string;
  "--line-cursor-y"?: string;
}

export interface CursorStyle extends CSSProperties {
  "--line-cursor-y"?: string;
}

export interface AxisStyle extends CSSProperties {
  "--line-axis-x"?: string;
  "--line-axis-y"?: string;
}

type LineTrend = "down" | "flat" | "up";

interface LinePointGeometry {
  readonly previousX: string | undefined;
  readonly previousY: string | undefined;
  readonly slot: string;
  readonly trend: LineTrend;
  readonly x: string;
  readonly y: string;
}

function percent(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return `${rounded}%`;
}

function valueToPercent(value: number, min: number, range: number): number {
  if (range === 0) return 50;
  return Math.min(100, Math.max(0, ((min + range - value) / range) * 100));
}

export function getValueBounds(data: readonly LineChartData[]): { max: number; min: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const point of data) {
    min = Math.min(min, point.value);
    max = Math.max(max, point.value);
  }

  if (data.length === 0) return { max: 1, min: 0 };
  return { max, min };
}

export interface AxisLabel {
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

export function pointPosition(index: number, count: number): number {
  if (count <= 1) return 50;
  return (index / (count - 1)) * 100;
}

export function monthLabelsFor(data: readonly LineChartData[]): AxisLabel[] {
  const labels: AxisLabel[] = [];
  const seen = new Set<string>();

  data.forEach((point, index) => {
    const key = monthKey(point.time);
    if (seen.has(key)) return;
    seen.add(key);
    labels.push({
      label: monthLabel(point.time),
      position: pointPosition(index, data.length),
    });
  });

  return labels;
}

export function valueLabelsFor(min: number, max: number): AxisLabel[] {
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

function trendFor(value: number, previousValue: number | undefined): LineTrend {
  if (previousValue === undefined || value === previousValue) return "flat";
  return value > previousValue ? "up" : "down";
}

export function geometryFor(
  point: LineChartData,
  previousPoint: LineChartData | undefined,
  index: number,
  count: number,
  min: number,
  max: number,
): LinePointGeometry {
  const range = max - min;
  return {
    previousX: previousPoint === undefined ? undefined : percent(pointPosition(index - 1, count)),
    previousY:
      previousPoint === undefined
        ? undefined
        : percent(valueToPercent(previousPoint.value, min, range)),
    slot: percent(count > 1 ? 100 / (count - 1) : 100),
    trend: trendFor(point.value, previousPoint?.value),
    x: percent(pointPosition(index, count)),
    y: percent(valueToPercent(point.value, min, range)),
  };
}

export function pointStyle(geometry: LinePointGeometry, cursorY: number | undefined): PointStyle {
  return {
    ...(geometry.previousX === undefined ? {} : { "--line-prev-x": geometry.previousX }),
    ...(geometry.previousY === undefined ? {} : { "--line-prev-y": geometry.previousY }),
    "--line-slot": geometry.slot,
    "--line-x": geometry.x,
    "--line-y": geometry.y,
    ...(cursorY === undefined ? {} : { "--line-cursor-y": `${Math.max(0, cursorY)}px` }),
  };
}

export function pointsStyle(count: number): PointsStyle {
  return {
    "--line-count": String(Math.max(count, 1)),
    "--line-segment-slot": percent(count > 1 ? 100 / (count - 1) : 100),
  };
}

export function crosshairStyle(
  index: number,
  count: number,
  cursorY: number | undefined,
): CrosshairStyle {
  return {
    "--line-crosshair-x": percent(pointPosition(index, count)),
    ...(cursorY === undefined ? {} : { "--line-cursor-y": `${Math.max(0, cursorY)}px` }),
  };
}

export function cursorStyle(cursorY: number | undefined): CursorStyle {
  return cursorY === undefined ? {} : { "--line-cursor-y": `${Math.max(0, cursorY)}px` };
}

export function axisStyle(axis: "x" | "y", position: number): AxisStyle {
  const value = percent(Math.min(100, Math.max(0, position)));
  if (axis === "x") return { "--line-axis-x": value };
  return { "--line-axis-y": value };
}

export function axisLabelsFor(
  overrides: readonly LineChartAxisLabel[] | undefined,
  fallback: readonly AxisLabel[],
): readonly AxisLabel[] {
  return overrides ?? fallback;
}
