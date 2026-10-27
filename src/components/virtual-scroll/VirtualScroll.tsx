"use client";

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
import { flushSync } from "react-dom";
import { useResizeObserver } from "@gunkin/uiify/hooks";
import { useMergedRefs } from "../../hooks/use-merged-refs.js";
import {
  mergeRepeatedSlotProps,
  omitProps,
  resolveRepeatedSlotProps,
} from "../../core/slot-props.js";
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
    role = "list",
    anchor = "start",
    followAppend = false,
    onScrollStateChange,
    isScrollingResetDelay = VIRTUAL_SCROLL_SCROLL_RESET_DELAY,
    slotProps,
    ...consumerProps
  } = props;

  const height = suppliedHeight ?? 600;
  const dynamicLayout = estimateRowHeight !== undefined;
  const horizontal = orientation === "horizontal";
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useMergedRefs(ref, consumerRef);
  const scrollOffsetRef = useRef(0);
  const programmaticScrollRef = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const lastRangeChangeRef = useRef<string>("");
  const measuredHeightsRef = useRef(new Map<string, number>());
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

  const measurementStoreRef = useRef(
    createVirtualScrollMeasurementStore({
      itemCount: items.length,
      defaultRowHeight: rowHeight,
      ...(estimateRowHeight ? { estimateRowHeight } : {}),
      measuredHeights: measuredHeightsRef.current,
      itemIdAtIndex: (index) => itemsRef.current[index]?.id,
    }),
  );

  measurementStoreRef.current.syncItemCount(items.length);

  const scrollOptionsRef = useRef({
    dynamicLayout,
    itemCount: items.length,
    orientation,
    overscan,
    rowHeight,
    viewportSize,
  });
  scrollOptionsRef.current = {
    dynamicLayout,
    itemCount: items.length,
    orientation,
    overscan,
    rowHeight,
    viewportSize,
  };

  const onRangeChangeRef = useRef(onRangeChange);
  onRangeChangeRef.current = onRangeChange;

  const onScrollStateChangeRef = useRef(onScrollStateChange);
  onScrollStateChangeRef.current = onScrollStateChange;

  const computeRange = (): ReturnType<typeof computeVirtualScrollRange> => {
    const { dynamicLayout, itemCount, overscan, rowHeight, viewportSize } =
      scrollOptionsRef.current;
    const scrollTop = scrollOffsetRef.current;

    if (dynamicLayout) {
      const store = measurementStoreRef.current;
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
  };

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

  syncRangeFromScrollRef.current = (offset?: number) => {
    const element = ref.current;
    if (!element) return;

    const scrollOffset = offset ?? readScrollOffset(element, scrollOptionsRef.current.orientation);
    const previousRange = computeRange();
    scrollOffsetRef.current = scrollOffset;

    const nextRange = computeRange();
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
    const store = measurementStoreRef.current;

    // Write range CSS vars on the scroll handler so rows move in the same frame as the scroll offset.
    applyVirtualScrollRangeToDom(element, nextRange, {
      dynamicLayout,
      slotCount,
      getRowOffset: store.getRowOffset.bind(store),
    });

    // Commit the visible slice synchronously so content matches scroll position on large jumps.
    flushSync(() => {
      setRangeVersion((version) => version + 1);
    });
  };

  const iosControllerRef = useRef(
    createVirtualScrollIosScroll({
      enabled: detectTouchScrollEnvironment(),
      resetDelay: isScrollingResetDelay,
    }),
  );

  const applyScrollDeltaRef = useRef((_delta: number) => {});

  applyScrollDeltaRef.current = (delta: number) => {
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

    const store = measurementStoreRef.current;
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

  applyScrollOffsetRef.current = applyScrollOffset;

  useImperativeHandle(
    scrollRef,
    (): VirtualScrollHandle => ({
      get element() {
        return ref.current;
      },
      scrollToIndex(index: number, options?: VirtualScrollScrollToIndexOptions): void {
        const normalized = normalizeScrollToIndexOptions(options);
        const store = measurementStoreRef.current;
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
        const store = measurementStoreRef.current;
        const totalSize = dynamicLayout
          ? store.getTotalSize()
          : scrollOptionsRef.current.itemCount * scrollOptionsRef.current.rowHeight;
        const offset = Math.max(0, totalSize - scrollOptionsRef.current.viewportSize);
        applyScrollOffsetRef.current(offset, normalizeScrollBehaviorOptions(options));
      },
    }),
    [dynamicLayout],
  );

  const range = useMemo(() => {
    void rangeVersion;
    void measurementVersion;
    return computeRange();
  }, [
    rangeVersion,
    measurementVersion,
    dynamicLayout,
    items.length,
    overscan,
    rowHeight,
    viewportSize,
  ]);

  const totalSize = useMemo(() => {
    void measurementVersion;
    if (dynamicLayout) return measurementStoreRef.current.getTotalSize();
    return items.length * rowHeight;
  }, [dynamicLayout, items.length, measurementVersion, rowHeight]);

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
    const store = measurementStoreRef.current;
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
      const ios = iosControllerRef.current;
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
          iosControllerRef.current.flushAdjustments(applyScrollDeltaRef.current);
        }
      },
    });

    let onScroll: (() => void) | null = null;
    let onScrollEnd: (() => void) | null = null;
    const ios = iosControllerRef.current;
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

    onScroll = () => {
      syncNativeScroll();
      scrollState.notifyScroll();
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    if (supportsScrollEndEvent()) {
      onScrollEnd = () => {
        syncNativeScroll();
        scrollState.notifyScrollEnd();
      };
      element.addEventListener("scrollend", onScrollEnd, { passive: true });
    }
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      if (verifyFrame !== 0) cancelAnimationFrame(verifyFrame);
      if (verifyTimer !== 0) window.clearTimeout(verifyTimer);
      if (onScroll) element.removeEventListener("scroll", onScroll);
      if (onScrollEnd) element.removeEventListener("scrollend", onScrollEnd);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
      scrollState.dispose();
    };
  }, [isScrollingResetDelay]);

  useEffect(() => {
    const element = ref.current;
    const store = measurementStoreRef.current;
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
  }, [anchor, followAppend, items, dynamicLayout, orientation, rowHeight, viewportSize]);

  useEffect(() => {
    emitRangeChange(range);
  }, [range]);

  const scrollportStyle = {
    ...(suppliedHeight !== undefined || (!consumerStyle?.blockSize && !consumerStyle?.height)
      ? { blockSize: height }
      : {}),
    ...consumerStyle,
    overflowX: horizontal ? "auto" : undefined,
    overflowY: horizontal ? "hidden" : "auto",
    "--uiify-virtual-scroll-count": items.length,
    "--uiify-virtual-scroll-row-height": `${rowHeight}px`,
    ...(dynamicLayout ? { "--uiify-virtual-scroll-total-size": `${totalSize}px` } : {}),
  } as CSSProperties;

  const spacerStyle = dynamicLayout
    ? undefined
    : ({
        "--uiify-range-start": range.start,
      } as CSSProperties);

  return (
    <div
      {...consumerProps}
      ref={rootRef}
      data-testid={testId ?? consumerProps["data-testid" as keyof typeof consumerProps]}
      data-uiify-virtual-scroll=""
      data-dynamic-layout={dynamicLayout ? "" : undefined}
      data-orientation={orientation}
      role={role}
      className={className}
      style={scrollportStyle}
    >
      <div
        {...omitProps(slotProps?.spacer, ["children", "dangerouslySetInnerHTML", "data-part"])}
        data-part="spacer"
        style={{ ...slotProps?.spacer?.style, ...spacerStyle }}
      >
        {rowSlots.map((slot) => {
          const store = measurementStoreRef.current;
          const rowOffset = dynamicLayout ? store.getRowOffset(slot.index) : undefined;
          const measuredRowHeight = dynamicLayout ? store.getRowHeight(slot.index) : undefined;

          return (
            <VirtualScrollRowShell
              {...(() => {
                if (!slot.item) return {};
                const { byItemIndex, ...byItemValueProps } = slotProps?.row ?? {};
                const commonProps = resolveRepeatedSlotProps(byItemValueProps, slot.item.id);
                return omitProps(mergeRepeatedSlotProps(commonProps, byItemIndex?.[slot.index]), [
                  "children",
                  "dangerouslySetInnerHTML",
                  "aria-posinset",
                  "aria-setsize",
                  "data-dynamic-row",
                  "data-part",
                  "data-row-index",
                  "role",
                ]);
              })()}
              key={`slot-${slot.slotIndex}`}
              slotIndex={slot.slotIndex}
              index={slot.index}
              itemCount={items.length}
              listRole={role}
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
