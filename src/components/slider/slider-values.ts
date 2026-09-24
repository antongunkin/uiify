import type { SliderMark } from "./types.js";

export function getSliderStops(
  min: number,
  max: number,
  marks: readonly SliderMark[],
): readonly number[] {
  return [
    ...new Set([
      min,
      ...marks
        .map(({ value }) => value)
        .filter((value) => Number.isFinite(value) && value >= min && value <= max),
      max,
    ]),
  ].sort((a, b) => a - b);
}

export function snapSliderToStops(value: number, stops: readonly number[]): number {
  let closest = stops[0]!;
  let closestDistance = Math.abs(value - closest);

  for (const stop of stops.slice(1)) {
    const distance = Math.abs(value - stop);
    if (distance < closestDistance) {
      closest = stop;
      closestDistance = distance;
    }
  }

  return closest;
}
