"use client";

import { createContext, useCallback, useContext, useRef, useSyncExternalStore } from "react";
import { useId, useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import type {
  ElementType,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactElement,
  Ref,
} from "react";
import { composeEventHandlers } from "./compose-event-handlers.js";
import { useDirection, type Direction } from "./direction.js";
import type { RenderableProps } from "./polymorphic.js";
import {
  createRovingFocusStore,
  type RovingFocusOrientation,
  type RovingFocusStore,
} from "./roving-focus-store.js";
import { useRenderElement } from "./use-render-element.js";

const RovingFocusContext = createContext<RovingFocusStore | null>(null);

export interface RovingFocusRootOwnProps {
  readonly direction?: Direction;
  readonly loop?: boolean;
  readonly orientation?: RovingFocusOrientation;
}

export type RovingFocusRootProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  RovingFocusRootOwnProps,
  { orientation: RovingFocusOrientation },
  HTMLElement
>;

export function RovingFocusRoot<TAs extends ElementType = "div">(
  props: RovingFocusRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    direction: localDirection,
    loop = true,
    orientation = "both",
    render,
    ...consumerProps
  } = props as RovingFocusRootProps<ElementType>;
  const direction = useDirection(localDirection);
  const storeRef = useRef<RovingFocusStore | null>(null);
  storeRef.current ??= createRovingFocusStore({ direction, loop, orientation });
  storeRef.current.updateConfig({ direction, loop, orientation });

  const element = useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-orientation": orientation,
      dir: direction,
    },
    render,
    state: { orientation },
  });
  return <RovingFocusContext value={storeRef.current}>{element}</RovingFocusContext>;
}
RovingFocusRoot.displayName = "RovingFocusRoot";

export interface RovingFocusItemOwnProps {
  readonly disabled?: boolean;
  readonly id?: string;
  readonly textValue?: string;
}

export type RovingFocusItemProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  RovingFocusItemOwnProps,
  { current: boolean; disabled: boolean },
  HTMLElement
>;

export function RovingFocusItem<TAs extends ElementType = "div">(
  props: RovingFocusItemProps<TAs>,
): ReactElement | null {
  const {
    as,
    disabled = false,
    id: providedId,
    ref: consumerRef,
    render,
    textValue = "",
    ...consumerProps
  } = props as RovingFocusItemProps<ElementType> & { ref?: Ref<HTMLElement> };
  const { onFocus: consumerOnFocus, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onFocus?: (event: ReactFocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  };
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const store = useContext(RovingFocusContext);
  if (!store) throw new Error("RovingFocusItem must be used inside RovingFocusRoot");
  const elementRef = useRef<HTMLElement | null>(null);
  const current = useSyncExternalStore(
    (listener) => store.subscribeItem(id, listener),
    () => store.getCurrentId() === id,
    () => false,
  );
  const setElement = useCallback(
    (element: HTMLElement | null) => store.setElement(id, element),
    [id, store],
  );
  const mergedRef = useMergedRefs(elementRef, consumerRef, setElement);

  useIsomorphicLayoutEffect(
    () =>
      store.register({
        disabled,
        element: elementRef.current,
        id,
        textValue: textValue || elementRef.current?.textContent?.trim() || "",
      }),
    [id, store],
  );
  useIsomorphicLayoutEffect(() => {
    store.updateItem(id, {
      disabled,
      textValue: textValue || elementRef.current?.textContent?.trim() || "",
    });
  }, [disabled, id, store, textValue]);

  const nativeButton = as === "button";

  const handleFocus = () => {
    if (!disabled) store.setCurrentId(id);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Home" || event.key === "End" || event.key.startsWith("Arrow")) {
      if (store.move(id, event.key)) event.preventDefault();
    } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      store.search(event.key);
    }
  };

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      id,
      "aria-disabled": disabled || undefined,
      "data-current": current ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      ...(nativeButton ? { disabled: disabled || undefined } : {}),
      onFocus: composeEventHandlers(consumerOnFocus, handleFocus),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      ref: mergedRef,
      tabIndex: current && !disabled ? 0 : -1,
    },
    render,
    state: { current, disabled },
  });
}

export { createRovingFocusStore };
export type { RovingFocusOrientation, RovingFocusStore };
