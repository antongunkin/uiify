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
  CarouselController,
  FadeCarouselClientProps,
} from "../types.js";
import { useIsomorphicLayoutEffect } from "../../../hooks/use-isomorphic-layout-effect.js";
import { createCarouselAutoplay } from "../client/carousel-autoplay.js";
import { attachCarouselControls } from "../client/carousel-controls.js";
import {
  CarouselClientView,
  getCarouselServerSnapshot,
  subscribeToNothing,
} from "../client/CarouselClientView.js";
import { createFadeController } from "./fade-controller.js";
import { attachFadeSwipe } from "./fade-swipe.js";

export function FadeCarouselClient(props: FadeCarouselClientProps): ReactElement | null {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [controller, setController] = useState<CarouselController>();
  const [autoplay, setAutoplay] = useState<CarouselAutoplayController>();
  useSyncExternalStore(
    controller?.subscribe ?? subscribeToNothing,
    controller?.getSnapshot ?? getCarouselServerSnapshot,
    getCarouselServerSnapshot,
  );
  for (const index of [props.defaultValue, props.value]) {
    if (
      index !== undefined &&
      (!Number.isInteger(index) ||
        index < 0 ||
        (props.items.length > 0 && index >= props.items.length))
    )
      throw new RangeError("Carousel value must be a valid item index");
  }
  const options = () => ({
    defaultValue: props.defaultValue ?? 0,
    rewind: props.rewind ?? false,
    ...(props.value === undefined ? {} : { value: props.value }),
    ...(props.onSelect ? { onSelect: props.onSelect } : {}),
    ...(props.beforeChange ? { beforeChange: props.beforeChange } : {}),
    ...(props.afterChange ? { afterChange: props.afterChange } : {}),
    ...(props.onSwipe ? { onSwipe: props.onSwipe } : {}),
  });
  const rotationOptions = useEffectEvent(() =>
    typeof props.autoplay === "object" ? props.autoplay : {},
  );
  const autoplayEnabled = Boolean(props.autoplay);
  // Layout effect: fade's readiness is synchronous, so creating the controller
  // before paint (rather than after, like the native scroll controller) avoids a
  // visible frame where fallback links are still shown but persistent controls
  // are hidden, waiting on an effect that has already run.
  useIsomorphicLayoutEffect(() => {
    if (!root) return;
    const attached = createFadeController(root, options());
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
  }, [controller, props.items]);
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
    if (!root || !controller || props.swipe === false) return;
    return attachFadeSwipe(root, controller, props.mouseDrag ?? false);
  }, [root, controller, props.swipe, props.mouseDrag]);
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
      mode="fade"
      {...(controller ? { controller } : {})}
      {...(autoplay ? { autoplay } : {})}
    />
  );
}
FadeCarouselClient.displayName = "FadeCarouselClient";
