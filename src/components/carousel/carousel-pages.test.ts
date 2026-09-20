import { expect, test } from "vitest";
import { createCarouselPages, findCarouselPage } from "./carousel-pages.js";

const geometry = {
  physicalAxis: "x" as const,
  sign: 1 as const,
  viewportSize: 640,
  currentOffset: 0,
  itemStarts: [0, 220, 440, 660, 880, 1100],
  itemSizes: [200, 200, 200, 200, 200, 200],
};

test("merges end-clamped targets into one reachable page", () => {
  const pages = createCarouselPages(geometry);
  expect(pages).toEqual([
    { index: 0, offset: 0 },
    { index: 1, offset: 220 },
    { index: 2, offset: 440 },
    { index: 3, offset: 660 },
  ]);
  expect(findCarouselPage(pages, 660)?.index).toBe(3);
  expect(findCarouselPage(pages, 110)?.index).toBe(0);
});

test("handles empty, fitting, fractional, and gapped geometry", () => {
  expect(createCarouselPages({ ...geometry, itemStarts: [], itemSizes: [] })).toEqual([]);
  expect(createCarouselPages({ ...geometry, viewportSize: 1400 })).toEqual([
    { index: 0, offset: 0 },
  ]);
  expect(
    createCarouselPages({
      ...geometry,
      viewportSize: 10.5,
      itemStarts: [0.25, 10.75, 25.5],
      itemSizes: [10.25, 10.25, 10.25],
    }),
  ).toEqual([
    { index: 0, offset: 0.25 },
    { index: 1, offset: 10.75 },
    { index: 2, offset: 25.25 },
  ]);
});

test("uses the same normalized model for axes and progression signs", () => {
  const vertical = createCarouselPages({ ...geometry, physicalAxis: "y", sign: -1 });
  expect(vertical).toEqual(createCarouselPages(geometry));
});

test("finds the nearest page, preferring the earlier page on ties", () => {
  const pages = [
    { index: 0, offset: 0 },
    { index: 1, offset: 100 },
  ];
  expect(findCarouselPage(pages, 50)).toEqual(pages[0]);
  expect(() => findCarouselPage(pages, Number.NaN)).toThrow(RangeError);
});

test("rejects non-finite geometry and offsets", () => {
  expect(() =>
    createCarouselPages({ ...geometry, viewportSize: Number.POSITIVE_INFINITY }),
  ).toThrow(RangeError);
  expect(() => createCarouselPages({ ...geometry, itemStarts: [0, Number.NaN] })).toThrow(
    RangeError,
  );
  expect(() => findCarouselPage([], Number.POSITIVE_INFINITY)).toThrow(RangeError);
});
