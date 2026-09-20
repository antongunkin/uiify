// @gunkin/uiify/hooks — public API barrel. One re-export per hook.

// Substrate
export { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";
export { useEventCallback } from "./use-event-callback.js";
export { useIsMounted } from "./use-is-mounted.js";
export { useUnmount } from "./use-unmount.js";
export { useMergedRefs } from "./use-merged-refs.js";
export { useId } from "./use-id.js";

// State
export { usePrevious } from "./use-previous.js";
export { useToggle } from "./use-toggle.js";
export { useControllableState } from "./use-controllable-state.js";
export type { UseControllableStateParams } from "./use-controllable-state.js";
export { useLocalStorage } from "./use-local-storage.js";

// Effects / timing
export { useUpdateEffect } from "./use-update-effect.js";
export { useTimeout } from "./use-timeout.js";
export { useInterval } from "./use-interval.js";
export { useDebounce } from "./use-debounce.js";
export { useDebouncedCallback } from "./use-debounced-callback.js";
export type { DebouncedFn } from "./use-debounced-callback.js";
export { useThrottledCallback } from "./use-throttled-callback.js";
export type { ThrottledFn } from "./use-throttled-callback.js";

// Sensors
export { useEventListener } from "./use-event-listener.js";
export { useMediaQuery } from "./use-media-query.js";
export { useResizeObserver } from "./use-resize-observer.js";
export type { Size } from "./use-resize-observer.js";
export { useIntersectionObserver } from "./use-intersection-observer.js";
export type { UseIntersectionObserverOptions } from "./use-intersection-observer.js";
export { useWindowSize } from "./use-window-size.js";
export type { WindowSize } from "./use-window-size.js";
export { computeAnchoredScrollOffset, useChartViewport } from "./use-chart-viewport.js";
export type { UseChartViewportOptions, UseChartViewportResult } from "./use-chart-viewport.js";

// UI / interaction
export { useClickOutside } from "./use-click-outside.js";
export { useFocusWithin } from "./use-focus-within.js";
export type { UseFocusWithinProps, UseFocusWithinResult } from "./use-focus-within.js";
export { useHover } from "./use-hover.js";
export type { UseHoverResult } from "./use-hover.js";
export { useLockBodyScroll } from "./use-lock-body-scroll.js";
