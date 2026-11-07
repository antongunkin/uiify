"use client";

import { cn } from "../../core/class-names.js";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FragmentInstance,
  type ReactElement,
} from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { flushSync } from "react-dom";
import {
  useEventCallback,
  useIsomorphicLayoutEffect,
  useResizeObserver,
} from "@gunkin/uiify/hooks";
import { useMergedRefs } from "../../hooks/use-merged-refs.js";
import { mergeRepeatedSlotProps, resolveRepeatedSlotProps } from "../../core/slot-props.js";
import { resolveVirtualScrollAnchorAdjustment } from "./virtual-scroll-anchor.js";
import { readScrollOffset, writeScrollOffset } from "./virtual-scroll-axis.js";
import {
  createVirtualScrollIosScroll,
  detectTouchScrollEnvironment,
} from "./virtual-scroll-ios.js";
import {
  computeScrollAdjustmentForRowResize,
  createVirtualScrollMeasurementStore,
} from "./virtual-scroll-measurements.js";
import type { VirtualScrollMeasurementStore } from "./virtual-scroll-measurements.js";
import {
  computeDynamicVirtualScrollRange,
  computeVirtualScrollRange,
  rangesEqual,
  toVirtualScrollRangeChange,
} from "./virtual-scroll-range.js";
import {
  computeActiveVirtualScrollSlotCount,
  computeVirtualScrollSlotCount,
  VirtualScrollRowShell,
} from "./VirtualScrollRowShell.js";
import {
  clampScrollOffset,
  computeScrollOffsetForIndex,
  normalizeScrollBehaviorOptions,
  normalizeScrollToIndexOptions,
  resolveScrollBehavior,
} from "./virtual-scroll-scroll.js";
import {
  createVirtualScrollScrollState,
  supportsScrollEndEvent,
} from "./virtual-scroll-scroll-state.js";
import { applyVirtualScrollRangeToDom } from "./virtual-scroll-scroll-sync.js";
import type {
  VirtualScrollHandle,
  VirtualScrollItem,
  VirtualScrollOwnProps,
  VirtualScrollRowSlot,
  VirtualScrollScrollBehaviorOptions,
  VirtualScrollScrollToIndexOptions,
} from "./types.js";
import { VirtualScrollRowItem } from "./VirtualScrollRowItem.js";
import {
  VIRTUAL_SCROLL_OVERSCAN,
  VIRTUAL_SCROLL_ROW_HEIGHT,
  VIRTUAL_SCROLL_SCROLL_RESET_DELAY,
} from "./types.js";

function computeRange(
  scrollTop: number,
  {
    dynamicLayout,
    itemCount,
    overscan,
    rowHeight,
    viewportSize,
  }: {
    readonly dynamicLayout: boolean;
    readonly itemCount: number;
    readonly overscan: number;
    readonly rowHeight: number;
    readonly viewportSize: number;
  },
  store: VirtualScrollMeasurementStore,
): ReturnType<typeof computeVirtualScrollRange> {
  if (dynamicLayout) {
    return computeDynamicVirtualScrollRange({
      scrollTop,
      viewportHeight: viewportSize,
      itemCount,
      overscan,
      findStartIndex: store.findStartIndex,
      findEndIndex: store.findEndIndex,
      getRowOffset: store.getRowOffset,
    });
  }

  return computeVirtualScrollRange({
    scrollTop,
    viewportHeight: viewportSize,
    itemCount,
    rowHeight,
    overscan,
  });
}

function buildRowSlots<T extends VirtualScrollItem>(
  items: readonly T[],
  rangeStart: number,
  slotCount: number,
): readonly VirtualScrollRowSlot<T>[] {
  const activeSlotCount = computeActiveVirtualScrollSlotCount(items.length, rangeStart, slotCount);
  return Array.from({ length: activeSlotCount }, (_, slotIndex) => {
    const index = rangeStart + slotIndex;
    return {
      index,
      item: items[index] ?? null,
      slotIndex,
    };
  });
}

export function VirtualScroll<T extends VirtualScrollItem>(
  props: VirtualScrollOwnProps<T>,
): ReactElement {
  const {
    items,
    ref: consumerRef,
    height: suppliedHeight,
    style: consumerStyle,
    rowHeight = VIRTUAL_SCROLL_ROW_HEIGHT,
    orientation = "vertical",
    overscan = VIRTUAL_SCROLL_OVERSCAN,
    className,
    testId,
    renderRow,
    scrollRef,
    estimateRowHeight,
    onRangeChange,
    anchor = "start",
    followAppend = false,
    onScrollStateChange,
    isScrollingResetDelay = VIRTUAL_SCROLL_SCROLL_RESET_DELAY,
    slotProps,
    ...consumerProps
  } = props;

  const listRole = consumerProps.role === "grid" ? "grid" : "list";
  const height = suppliedHeight ?? 600;
  const dynamicLayout = estimateRowHeight !== undefined;
  const horizontal = orientation === "horizontal";
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useMergedRefs(ref, consumerRef);
  const scrollOffsetRef = useRef(0);
  const programmaticScrollRef = useRef(false);
  const eventHandlersRef = useRef({
    onScroll: () => {},
    onScrollEnd: () => {},
    onTouchStart: () => {},
    onTouchEnd: () => {},
  });
  const itemsRef = useRef(items);
  const lastRangeChangeRef = useRef<string>("");
  const anchorSnapshotRef = useRef({
    firstItemId: items[0]?.id,
    itemCount: items.length,
    totalSize: 0,
    scrollTop: 0,
  });

  const [rangeVersion, setRangeVersion] = useState(0);
  const [measurementVersion, setMeasurementVersion] = useState(0);

  const measuredSize = useResizeObserver(ref);
  const viewportSize = (horizontal ? measuredSize?.width : measuredSize?.height) ?? height;

  const [measurementStore] = useState(() =>
    createVirtualScrollMeasurementStore({
      itemCount: items.length,
      defaultRowHeight: rowHeight,
      ...(estimateRowHeight ? { estimateRowHeight } : {}),
      measuredHeights: new Map<string, number>(),
      itemIdAtIndex: (index) => items[index]?.id,
    }),
  );

  // Render reads row geometry, so the store follows this render's items, not the last commit's.
  measurementStore.syncItems(items.length, (index) => items[index]?.id);

  const scrollOptionsRef = useRef({
    dynamicLayout,
    itemCount: items.length,
    orientation,
    overscan,
    rowHeight,
    viewportSize,
  });
  const onRangeChangeRef = useRef(onRangeChange);
  const onScrollStateChangeRef = useRef(onScrollStateChange);

  const emitRangeChange = (range: ReturnType<typeof computeVirtualScrollRange>): void => {
    const callback = onRangeChangeRef.current;
    if (!callback) return;
    const payload = toVirtualScrollRangeChange(range);
    const signature = `${payload.overscanStart}:${payload.overscanEnd}`;
    if (signature === lastRangeChangeRef.current) return;
    lastRangeChangeRef.current = signature;
    callback(payload);
  };

  const syncRangeFromScrollRef = useRef((_offset?: number) => {});

  const syncRangeFromScroll = (offset?: number) => {
    const element = ref.current;
    if (!element) return;

    const options = scrollOptionsRef.current;
    const store = measurementStore;
    const scrollOffset = offset ?? readScrollOffset(element, options.orientation);
    const previousRange = computeRange(scrollOffsetRef.current, options, store);
    scrollOffsetRef.current = scrollOffset;

    const nextRange = computeRange(scrollOffset, options, store);
    if (rangesEqual(previousRange, nextRange)) return;

    emitRangeChange(nextRange);

    const { dynamicLayout, itemCount, viewportSize, rowHeight, overscan } =
      scrollOptionsRef.current;
    const slotCount = computeActiveVirtualScrollSlotCount(
      itemCount,
      nextRange.start,
      Math.max(
        nextRange.end - nextRange.start,
        computeVirtualScrollSlotCount(viewportSize, rowHeight, overscan),
      ),
    );
    // Write range CSS vars on the scroll handler so rows move in the same frame as the scroll offset.
    applyVirtualScrollRangeToDom(element, nextRange, {
      dynamicLayout,
      slotCount,
      getRowOffset: store.getRowOffset.bind(store),
      spacerStyle: slotProps?.spacer?.style,
      getRowStyle: (index) => {
        const item = itemsRef.current[index];
        if (!item) return undefined;
        const { byItemIndex, ...byItemValueProps } = slotProps?.row ?? {};
        const commonProps = resolveRepeatedSlotProps(byItemValueProps, item.id);
        return mergeRepeatedSlotProps(commonProps, byItemIndex?.[index]).style;
      },
    });

    // Commit the visible slice synchronously so content matches scroll position on large jumps.
    flushSync(() => {
      setRangeVersion((version) => version + 1);
    });
  };

  const [iosController] = useState(() =>
    createVirtualScrollIosScroll({
      enabled: detectTouchScrollEnvironment(),
      resetDelay: isScrollingResetDelay,
    }),
  );

  const applyScrollDeltaRef = useRef((_delta: number) => {});

  const applyScrollDelta = (delta: number) => {
    const element = ref.current;
    if (!element || delta === 0) return;
    // Preserve the viewport while rows resize.
    const { orientation } = scrollOptionsRef.current;
    const next = scrollOffsetRef.current + delta;
    programmaticScrollRef.current = true;
    writeScrollOffset(element, orientation, next, "auto");
    syncRangeFromScrollRef.current(next);
  };

  const applyScrollOffset = (
    offset: number,
    behavior: VirtualScrollScrollBehaviorOptions["behavior"],
  ): void => {
    const element = ref.current;
    if (!element) return;

    const store = measurementStore;
    const totalSize = dynamicLayout ? store.getTotalSize() : items.length * rowHeight;
    const clamped = clampScrollOffset(offset, totalSize, viewportSize);
    const current = scrollOffsetRef.current;
    programmaticScrollRef.current = behavior === "instant";
    writeScrollOffset(element, orientation, clamped, resolveScrollBehavior(behavior));
    syncRangeFromScrollRef.current(behavior === "instant" ? clamped : current);
  };

  const applyScrollOffsetRef = useRef(
    (_offset: number, _behavior: VirtualScrollScrollBehaviorOptions["behavior"]) => {},
  );

  // Handlers, observers and the imperative handle read this commit's values; layout
  // effects run before the passive effects and any parent layout effect that scrolls.
  useIsomorphicLayoutEffect(() => {
    itemsRef.current = items;
    scrollOptionsRef.current = {
      dynamicLayout,
      itemCount: items.length,
      orientation,
      overscan,
      rowHeight,
      viewportSize,
    };
    onRangeChangeRef.current = onRangeChange;
    onScrollStateChangeRef.current = onScrollStateChange;
    syncRangeFromScrollRef.current = syncRangeFromScroll;
    applyScrollDeltaRef.current = applyScrollDelta;
    applyScrollOffsetRef.current = applyScrollOffset;
  });

  useImperativeHandle(
    scrollRef,
    (): VirtualScrollHandle => ({
      get element() {
        return ref.current;
      },
      scrollToIndex(index: number, options?: VirtualScrollScrollToIndexOptions): void {
        const normalized = normalizeScrollToIndexOptions(options);
        const store = measurementStore;
        const metrics = {
          getRowOffset: store.getRowOffset.bind(store),
          getRowHeight: store.getRowHeight.bind(store),
          getTotalSize: store.getTotalSize.bind(store),
        };
        const offset = computeScrollOffsetForIndex(
          index,
          normalized.align,
          metrics,
          scrollOptionsRef.current.viewportSize,
          scrollOffsetRef.current,
        );
        applyScrollOffsetRef.current(offset, normalized.behavior);
      },
      scrollToOffset(offset: number, options?: VirtualScrollScrollBehaviorOptions): void {
        applyScrollOffsetRef.current(offset, normalizeScrollBehaviorOptions(options));
      },
      scrollToEnd(options?: VirtualScrollScrollBehaviorOptions): void {
        const store = measurementStore;
        const totalSize = dynamicLayout
          ? store.getTotalSize()
          : scrollOptionsRef.current.itemCount * scrollOptionsRef.current.rowHeight;
        const offset = Math.max(0, totalSize - scrollOptionsRef.current.viewportSize);
        applyScrollOffsetRef.current(offset, normalizeScrollBehaviorOptions(options));
      },
    }),
    [dynamicLayout, measurementStore],
  );

  const range = useMemo(() => {
    void rangeVersion;
    void measurementVersion;
    return computeRange(
      // oxlint-disable-next-line react/refs -- the scroll handler owns the live offset and re-renders (rangeVersion) only when the range changes; state would re-render on every scroll event.
      scrollOffsetRef.current,
      { dynamicLayout, itemCount: items.length, overscan, rowHeight, viewportSize },
      measurementStore,
    );
  }, [
    rangeVersion,
    measurementVersion,
    measurementStore,
    dynamicLayout,
    items.length,
    overscan,
    rowHeight,
    viewportSize,
  ]);

  const totalSize = useMemo(() => {
    void measurementVersion;
    if (dynamicLayout) return measurementStore.getTotalSize();
    return items.length * rowHeight;
  }, [dynamicLayout, items.length, measurementStore, measurementVersion, rowHeight]);

  const slotCount = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(
      range.end - range.start,
      computeVirtualScrollSlotCount(viewportSize, rowHeight, overscan),
    );
  }, [items.length, overscan, range.end, range.start, rowHeight, viewportSize]);

  const rowSlots = useMemo(
    () => buildRowSlots(items, range.start, slotCount),
    [items, range.start, slotCount],
  );

  const handleRowMeasureRef = useRef((index: number, itemId: string, height: number) => {
    const store = measurementStore;
    const previousHeight = store.getRowHeight(index);
    const rowOffset = store.getRowOffset(index);
    if (!store.setMeasuredHeight(itemId, index, height)) return;

    const adjustment = computeScrollAdjustmentForRowResize({
      scrollTop: scrollOffsetRef.current,
      rowOffset,
      previousHeight,
      nextHeight: height,
    });

    if (adjustment > 0) {
      const ios = iosController;
      if (ios.isTouchScrolling()) {
        ios.queueAdjustment(adjustment);
      } else {
        applyScrollDeltaRef.current(adjustment);
      }
    }

    setMeasurementVersion((version) => version + 1);
  });

  const rowsFragmentRef = useRef<FragmentInstance>(null);

  // One ResizeObserver for the whole pooled row set. React keeps the
  // subscription in sync as slots mount and unmount — pinned by
  // core/fragment-instance.test.tsx. Fixed layout never measures rows, so no
  // observer is created there at all.
  useEffect(() => {
    if (!dynamicLayout) return;
    const fragment = rowsFragmentRef.current;
    if (!fragment || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target;
        if (!(target instanceof HTMLElement)) continue;
        const raw = target.dataset["uiifyRowIndex"];
        if (raw === undefined) continue;
        const index = Number(raw);
        if (!Number.isInteger(index)) continue;
        const itemId = itemsRef.current[index]?.id;
        if (itemId === undefined) continue;
        const size = horizontal ? entry.contentRect.width : entry.contentRect.height;
        handleRowMeasureRef.current(index, itemId, size);
      }
    });

    fragment.observeUsing(observer);
    return () => fragment.unobserveUsing(observer);
  }, [dynamicLayout, horizontal]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const scrollState = createVirtualScrollScrollState({
      resetDelay: isScrollingResetDelay,
      supportsScrollEnd: supportsScrollEndEvent(),
      onChange: (isScrolling) => {
        onScrollStateChangeRef.current?.({ isScrolling });
        if (!isScrolling) {
          iosController.flushAdjustments(applyScrollDeltaRef.current);
        }
      },
    });

    const ios = iosController;
    const onTouchStart = (): void => ios.onTouchStart();
    const onTouchEnd = (): void => ios.onTouchEnd();
    let verifyFrame = 0;
    let verifyTimer = 0;
    const syncNativeScroll = (): void => {
      if (!programmaticScrollRef.current) {
        syncRangeFromScrollRef.current();
        return;
      }
      // The imperative path already rendered its range. Verify the browser's
      // actual offset after layout, including coalesced external scroll writes.
      if (verifyFrame !== 0) return;
      verifyFrame = requestAnimationFrame(() => {
        verifyTimer = window.setTimeout(() => {
          verifyFrame = 0;
          verifyTimer = 0;
          programmaticScrollRef.current = false;
          syncRangeFromScrollRef.current();
        }, 0);
      });
    };

    const onScroll = () => {
      syncNativeScroll();
      scrollState.notifyScroll();
    };
    const onScrollEnd = (): void => {
      if (!supportsScrollEndEvent()) return;
      syncNativeScroll();
      scrollState.notifyScrollEnd();
    };
    eventHandlersRef.current = { onScroll, onScrollEnd, onTouchStart, onTouchEnd };

    return () => {
      if (verifyFrame !== 0) cancelAnimationFrame(verifyFrame);
      if (verifyTimer !== 0) window.clearTimeout(verifyTimer);
      eventHandlersRef.current = {
        onScroll: () => {},
        onScrollEnd: () => {},
        onTouchStart: () => {},
        onTouchEnd: () => {},
      };
      scrollState.dispose();
    };
  }, [iosController, isScrollingResetDelay]);

  useEffect(() => {
    const element = ref.current;
    const store = measurementStore;
    const nextTotalSize = dynamicLayout ? store.getTotalSize() : items.length * rowHeight;
    const previous = anchorSnapshotRef.current;
    const scrollOffset = element ? readScrollOffset(element, orientation) : scrollOffsetRef.current;
    const nextSnapshot = {
      firstItemId: items[0]?.id,
      itemCount: items.length,
      totalSize: nextTotalSize,
      scrollTop: scrollOffset,
    };

    const adjustment = resolveVirtualScrollAnchorAdjustment({
      anchor,
      followAppend,
      viewportHeight: viewportSize,
      previous,
      next: nextSnapshot,
    });

    if (adjustment && element) {
      // Retain the anchored viewport.
      programmaticScrollRef.current = true;
      writeScrollOffset(element, orientation, scrollOffset + adjustment.delta, adjustment.behavior);
      syncRangeFromScrollRef.current(
        adjustment.behavior === "smooth" ? scrollOffset : scrollOffset + adjustment.delta,
      );
    }

    anchorSnapshotRef.current = nextSnapshot;
  }, [
    anchor,
    followAppend,
    items,
    dynamicLayout,
    measurementStore,
    orientation,
    rowHeight,
    viewportSize,
  ]);

  useEffect(() => {
    emitRangeChange(range);
  }, [range]);

  const handleScroll = useEventCallback(() => eventHandlersRef.current.onScroll());
  const handleScrollEnd = useEventCallback(() => eventHandlersRef.current.onScrollEnd());
  const handleTouchStart = useEventCallback(() => eventHandlersRef.current.onTouchStart());
  const handleTouchEnd = useEventCallback(() => eventHandlersRef.current.onTouchEnd());

  const scrollportStyle = {
    ...(suppliedHeight !== undefined || (!consumerStyle?.blockSize && !consumerStyle?.height)
      ? { blockSize: height }
      : {}),
    overflowX: horizontal ? "auto" : undefined,
    overflowY: horizontal ? "hidden" : "auto",
    "--uiify-virtual-scroll-count": items.length,
    "--uiify-virtual-scroll-row-height": `${rowHeight}px`,
    ...(dynamicLayout ? { "--uiify-virtual-scroll-total-size": `${totalSize}px` } : {}),
    ...consumerStyle,
  } as CSSProperties;

  const spacerStyle = dynamicLayout
    ? undefined
    : ({
        "--uiify-range-start": range.start,
      } as CSSProperties);

  return (
    <div
      data-testid={testId}
      data-dynamic-layout={dynamicLayout ? "" : undefined}
      data-orientation={orientation}
      role={listRole}
      {...consumerProps}
      ref={rootRef}
      onScroll={composeEventHandlers(consumerProps.onScroll, handleScroll)}
      onScrollEnd={composeEventHandlers(consumerProps.onScrollEnd, handleScrollEnd)}
      onTouchStart={composeEventHandlers(consumerProps.onTouchStart, handleTouchStart)}
      onTouchEnd={composeEventHandlers(consumerProps.onTouchEnd, handleTouchEnd)}
      className={cn("uiify-virtual-scroll", className)}
      style={scrollportStyle}
    >
      <div
        {...slotProps?.spacer}
        className={cn("uiify-virtual-scroll-spacer", slotProps?.spacer?.className)}
        style={{ ...spacerStyle, ...slotProps?.spacer?.style }}
      >
        {rowSlots.map((slot) => {
          const store = measurementStore;
          const rowOffset = dynamicLayout ? store.getRowOffset(slot.index) : undefined;
          const measuredRowHeight = dynamicLayout ? store.getRowHeight(slot.index) : undefined;

          return (
            <VirtualScrollRowShell
              {...(() => {
                if (!slot.item) return {};
                const { byItemIndex, ...byItemValueProps } = slotProps?.row ?? {};
                const commonProps = resolveRepeatedSlotProps(byItemValueProps, slot.item.id);
                return mergeRepeatedSlotProps(commonProps, byItemIndex?.[slot.index]);
              })()}
              key={
                dynamicLayout
                  ? `slot-${slot.slotIndex}`
                  : (slot.item?.id ?? `slot-${slot.slotIndex}`)
              }
              slotIndex={slot.slotIndex}
              index={slot.index}
              itemCount={items.length}
              listRole={listRole}
              dynamicLayout={dynamicLayout}
              {...(rowOffset !== undefined ? { rowOffset } : {})}
              {...(measuredRowHeight !== undefined ? { rowHeight: measuredRowHeight } : {})}
            >
              {slot.item ? (
                <VirtualScrollRowItem item={slot.item} index={slot.index} renderRow={renderRow} />
              ) : null}
            </VirtualScrollRowShell>
          );
        })}
      </div>
    </div>
  );
}
VirtualScroll.displayName = "VirtualScroll";
