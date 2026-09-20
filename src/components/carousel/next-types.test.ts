import { expect, test } from "vitest";
import type { CarouselClientProps, CarouselProps } from "./types.js";

test("keeps timer and controlled state out of server props", () => {
  const base: CarouselProps = { id: "gallery", "aria-label": "Gallery", items: [] };
  // @ts-expect-error autoplay belongs to the client entry
  const invalid: CarouselProps = { ...base, autoplay: true };
  const client: CarouselClientProps = { ...base, autoplay: { delay: 5000 } };
  expect(client.autoplay).toEqual({ delay: 5000 });
  expect(invalid.id).toBe("gallery");
});
