import type { CarouselLabels, CarouselProps } from "./types.js";

const ASCII_WHITESPACE = /[\t\n\f\r ]/u;

export interface NormalizedCarouselProps extends CarouselProps {
  readonly axis: NonNullable<CarouselProps["axis"]>;
  readonly navigation: boolean;
  readonly pagination: boolean;
  readonly labels: CarouselLabels;
}

const defaultLabels: CarouselLabels = {
  previous: "Previous slide",
  next: "Next slide",
  goTo: "Go to",
  navigation: "Choose slide",
  start: "Start slide rotation",
  stop: "Stop slide rotation",
  of: "of",
};

function validateId(id: string, subject: string): void {
  if (id.length === 0) {
    throw new TypeError(`${subject} id must not be empty`);
  }
  if (ASCII_WHITESPACE.test(id)) {
    throw new TypeError(`${subject} id must not contain ASCII whitespace`);
  }
}

export function normalizeCarouselProps(props: CarouselProps): NormalizedCarouselProps {
  validateId(props.id, "Carousel");

  const itemIds = new Set<string>();
  for (const item of props.items) {
    validateId(item.id, "Carousel item");
    if (itemIds.has(item.id)) {
      throw new TypeError(`Carousel item id must be unique; duplicate id: ${item.id}`);
    }
    itemIds.add(item.id);
  }

  return {
    ...props,
    axis: props.axis ?? "inline",
    navigation: props.navigation ?? true,
    pagination: props.pagination ?? true,
    labels: { ...defaultLabels, ...props.labels },
  };
}

export function carouselSlideId(carouselId: string, itemId: string): string {
  return `${carouselId}--slide-${itemId}`;
}

export function carouselFragment(id: string): string {
  return `#${encodeURIComponent(id)}`;
}

export function joinClassNames(...values: readonly (string | undefined)[]): string | undefined {
  const value = values.filter(Boolean).join(" ");
  return value || undefined;
}
