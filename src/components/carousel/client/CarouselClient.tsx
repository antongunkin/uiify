"use client";

import {
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactElement } from "react";
import type {
  CarouselAutoplayController,
  CarouselClientProps,
  CarouselController,
} from "../types.js";
import { createCarouselAutoplay } from "./carousel-autoplay.js";
import { attachCarouselDrag } from "./carousel-drag.js";
import { createCarouselController } from "./carousel-controller.js";
import { attachCarouselControls } from "./carousel-controls.js";
import {
  CarouselClientView,
  getCarouselServerSnapshot,
  subscribeToNothing,
} from "./CarouselClientView.js";

export function CarouselClient(props: CarouselClientProps): ReactElement | null {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [controller, setController] = useState<CarouselController>();
  const [autoplay, setAutoplay] = useState<CarouselAutoplayController>();
  // Also rerender this owner so controlled values reconcile after a settled native change.
  useSyncExternalStore(
    controller?.subscribe ?? subscribeToNothing,
    controller?.getSnapshot ?? getCarouselServerSnapshot,
    getCarouselServerSnapshot,
  );
  for (const [name, index] of [
    ["defaultValue", props.defaultValue],
    ["value", props.value],
  ] as const) {
    if (
      index !== undefined &&
      (!Number.isInteger(index) ||
        index < 0 ||
        (props.items.length > 0 && index >= props.items.length))
    )
      throw new RangeError(`Carousel ${name} must be a valid item index`);
  }
  const options = useEffectEvent(() => ({
    defaultValue: props.defaultValue ?? 0,
    rewind: props.rewind ?? false,
    ...(props.value === undefined ? {} : { value: props.value }),
    ...(props.onSelect ? { onSelect: props.onSelect } : {}),
    ...(props.beforeChange ? { beforeChange: props.beforeChange } : {}),
    ...(props.afterChange ? { afterChange: props.afterChange } : {}),
    ...(props.onSwipe ? { onSwipe: props.onSwipe } : {}),
  }));
  const rotationOptions = useEffectEvent(() =>
    typeof props.autoplay === "object" ? props.autoplay : {},
  );
  const autoplayEnabled = Boolean(props.autoplay);
  useEffect(() => {
    if (!root) return;
    const attached = createCarouselController(root, options());
    setController(attached);
    return () => {
      attached.destroy();
      setController(undefined);
    };
  }, [root]);
  useEffect(() => {
    controller?.update(options());
  });
  useEffect(() => {
    controller?.refresh();
  }, [controller, props.items, props.axis, props.dir]);
  useEffect(() => {
    if (!root || !controller || !autoplayEnabled) return;
    const rotation = createCarouselAutoplay(root, controller, rotationOptions());
    setAutoplay(rotation);
    return () => {
      rotation.destroy();
      setAutoplay(undefined);
    };
  }, [root, controller, autoplayEnabled]);
  useEffect(() => {
    autoplay?.update(rotationOptions());
  });
  useEffect(() => {
    if (!root || !controller) return;
    return attachCarouselControls(root, controller, autoplay);
  }, [root, controller, autoplay]);
  useEffect(() => {
    if (!root || !controller || !props.mouseDrag) return;
    return attachCarouselDrag(root, controller);
  }, [root, controller, props.mouseDrag]);
  useImperativeHandle(
    props.ref,
    () => ({
      next: () => controller?.next("next"),
      previous: () => controller?.previous("previous"),
      goTo: (index) => controller?.goTo(index, "command"),
      start: () => autoplay?.start(),
      stop: () => autoplay?.stop(),
      reset: () => autoplay?.reset(),
    }),
    [controller, autoplay],
  );
  return (
    <CarouselClientView
      base={props}
      rootRef={setRoot}
      mode="scroll"
      {...(controller ? { controller } : {})}
      {...(autoplay ? { autoplay } : {})}
    />
  );
}
CarouselClient.displayName = "CarouselClient";
