import type { CarouselGeometry, CarouselPage } from "./types.js";

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Carousel ${label} must be finite`);
  }
}

function validateGeometry(geometry: CarouselGeometry): void {
  assertFinite(geometry.viewportSize, "viewport size");
  assertFinite(geometry.currentOffset, "current offset");
  if (geometry.viewportSize < 0 || geometry.itemStarts.length !== geometry.itemSizes.length) {
    throw new RangeError("Carousel geometry is invalid");
  }
  geometry.itemStarts.forEach((value) => assertFinite(value, "item start"));
  geometry.itemSizes.forEach((value) => {
    assertFinite(value, "item size");
    if (value < 0) throw new RangeError("Carousel item size must not be negative");
  });
}

export function createCarouselPages(geometry: CarouselGeometry): readonly CarouselPage[] {
  validateGeometry(geometry);
  const lastIndex = geometry.itemStarts.length - 1;
  if (lastIndex < 0) return [];

  const extent = geometry.itemStarts[lastIndex]! + geometry.itemSizes[lastIndex]!;
  const maximum = Math.max(0, extent - geometry.viewportSize);
  const pages: CarouselPage[] = [];

  geometry.itemStarts.forEach((start, index) => {
    const offset = Math.min(maximum, Math.max(0, start));
    const previous = pages.at(-1);
    if (!previous || Math.abs(previous.offset - offset) > 1) pages.push({ index, offset });
  });
  return pages;
}

export function findCarouselPage(
  pages: readonly CarouselPage[],
  offset: number,
): CarouselPage | undefined {
  assertFinite(offset, "offset");
  let nearest: CarouselPage | undefined;
  let distance = Number.POSITIVE_INFINITY;
  for (const page of pages) {
    assertFinite(page.offset, "page offset");
    const nextDistance = Math.abs(page.offset - offset);
    if (nextDistance < distance) {
      nearest = page;
      distance = nextDistance;
    }
  }
  return nearest;
}
