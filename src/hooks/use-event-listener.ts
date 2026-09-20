"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { useEventCallback } from "./use-event-callback.js";
import { useRefElement } from "./use-ref-element.js";
import { isRefObject, resolveTarget } from "./utils/ref-target.js";

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  target?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  target: RefObject<T | null> | T | null,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener(
  type: string,
  listener: (event: Event) => void,
  target?: RefObject<EventTarget | null> | EventTarget | null,
  options?: boolean | AddEventListenerOptions,
): void {
  const handler = useEventCallback(listener);
  const refTarget = isRefObject(target) ? target : null;
  const refElement = useRefElement(refTarget);
  const capture = typeof options === "boolean" ? options : (options?.capture ?? false);
  const passive = typeof options === "object" ? (options.passive ?? false) : false;
  const once = typeof options === "object" ? (options.once ?? false) : false;
  const signal = typeof options === "object" ? options.signal : undefined;

  useEffect(() => {
    const node = refTarget ? refElement : resolveTarget(target);
    if (!node) return;
    const normalizedOptions: AddEventListenerOptions = { capture, passive, once };
    if (signal) normalizedOptions.signal = signal;
    const onEvent = (event: Event) => handler(event);
    node.addEventListener(type, onEvent, normalizedOptions);
    return () => node.removeEventListener(type, onEvent, capture);
  }, [type, refTarget, refElement, target, handler, capture, passive, once, signal]);
}
