import type { ReactElement } from "react";
import { CarouselMarkup } from "./CarouselMarkup.js";
import type { CarouselWithRefProps } from "./types.js";

/** Native scrolling and fragment navigation; no client behavior required. */
export function Carousel(props: CarouselWithRefProps): ReactElement | null {
  const { ref, ...base } = props;
  return <CarouselMarkup base={base} {...(ref ? { rootRef: ref } : {})} />;
}
Carousel.displayName = "Carousel";
