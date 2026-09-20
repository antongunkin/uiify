import type { ReactElement } from "react";
import { CarouselMarkup } from "./CarouselMarkup.js";
import type { CarouselProps } from "./types.js";

/** Native scrolling and fragment navigation; no client behavior required. */
export function Carousel(props: CarouselProps): ReactElement | null {
  return <CarouselMarkup base={props} />;
}
Carousel.displayName = "Carousel";
