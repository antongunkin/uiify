"use client";

import { useRef } from "react";
import type { ElementType, KeyboardEvent as ReactKeyboardEvent, ReactElement, Ref } from "react";
import { useEventCallback, useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "./compose-event-handlers.js";
import type { RenderableProps } from "./polymorphic.js";
import { getEventPath, getOwnerDocument, isEventInsideLayer } from "./platform.js";
import { getTabbableCandidates } from "./tabbable.js";
import { useRenderElement } from "./use-render-element.js";

interface ScopeRecord {
  readonly branches: Set<Element>;
  readonly element: HTMLElement;
}

const stacks = new WeakMap<Document, ScopeRecord[]>();

function getStack(document: Document): ScopeRecord[] {
  const existing = stacks.get(document);
  if (existing) return existing;
  const created: ScopeRecord[] = [];
  stacks.set(document, created);
  return created;
}

export interface FocusScopeOwnProps {
  readonly branches?: ReadonlySet<Element>;
  readonly contain?: boolean;
  readonly loop?: boolean;
  readonly onMountAutoFocus?: (event: Event) => void;
  readonly onUnmountAutoFocus?: (event: Event) => void;
}

export type FocusScopeProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FocusScopeOwnProps,
  { active: boolean },
  HTMLElement
>;

export function FocusScope<TAs extends ElementType = "div">(
  props: FocusScopeProps<TAs>,
): ReactElement | null {
  const {
    as,
    branches,
    contain = true,
    loop = true,
    onKeyDown: consumerOnKeyDown,
    onMountAutoFocus,
    onUnmountAutoFocus,
    ref: consumerRef,
    render,
    ...consumerProps
  } = props as FocusScopeProps<ElementType> & {
    onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
    ref?: Ref<HTMLElement>;
  };
  const elementRef = useRef<HTMLElement | null>(null);
  const emitMountAutoFocus = useEventCallback((event: Event) => {
    onMountAutoFocus?.(event);
  });
  const emitUnmountAutoFocus = useEventCallback((event: Event) => {
    onUnmountAutoFocus?.(event);
  });
  const mergedRef = useMergedRefs(elementRef, consumerRef);

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    const document = getOwnerDocument(element);
    if (!element || !document) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const record: ScopeRecord = { branches: new Set(branches), element };
    const stack = getStack(document);
    stack.push(record);

    const mountEvent = new Event("ui.mountAutoFocus", { cancelable: true });
    emitMountAutoFocus(mountEvent);
    if (!mountEvent.defaultPrevented && !element.contains(document.activeElement)) {
      (getTabbableCandidates(element)[0] ?? element).focus({ preventScroll: true });
    }

    const onFocusIn = (event: FocusEvent) => {
      if (!contain || stack.at(-1) !== record) return;
      if (isEventInsideLayer(getEventPath(event), element, record.branches)) {
        return;
      }
      (getTabbableCandidates(element)[0] ?? element).focus({ preventScroll: true });
    };
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      const index = stack.indexOf(record);
      if (index >= 0) stack.splice(index, 1);
      const unmountEvent = new Event("ui.unmountAutoFocus", { cancelable: true });
      emitUnmountAutoFocus(unmountEvent);
      if (!unmountEvent.defaultPrevented && previouslyFocused?.isConnected) {
        queueMicrotask(() => {
          if (previouslyFocused.isConnected) {
            previouslyFocused.focus({ preventScroll: true });
          }
        });
      }
    };
  }, [branches, contain, emitMountAutoFocus, emitUnmountAutoFocus]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (!loop || event.key !== "Tab") return;
    const element = elementRef.current;
    if (!element) return;
    const candidates = getTabbableCandidates(element);
    const first = candidates[0];
    const last = candidates.at(-1);
    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      ref: mergedRef,
      tabIndex: -1,
    },
    render,
    state: { active: true },
  });
}
