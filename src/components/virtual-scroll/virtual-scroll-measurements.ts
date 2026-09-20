export interface VirtualScrollMeasurementStore {
  readonly getRowHeight: (index: number) => number;
  readonly getRowOffset: (index: number) => number;
  readonly getTotalSize: () => number;
  readonly setMeasuredHeight: (itemId: string, index: number, height: number) => boolean;
  readonly findStartIndex: (scrollTop: number) => number;
  readonly findEndIndex: (scrollBottom: number) => number;
  readonly syncItemCount: (count: number) => void;
  readonly rebuild: () => void;
}

export interface CreateVirtualScrollMeasurementStoreOptions {
  readonly itemCount: number;
  readonly defaultRowHeight: number;
  readonly estimateRowHeight?: (index: number) => number;
  readonly measuredHeights: Map<string, number>;
  readonly itemIdAtIndex: (index: number) => string | undefined;
}

function lowerBound(offsets: readonly number[], value: number): number {
  let low = 0;
  let high = offsets.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (offsets[mid]! < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

/** Prefix-sum cache for fixed or dynamically measured row heights. */
export function createVirtualScrollMeasurementStore(
  options: CreateVirtualScrollMeasurementStoreOptions,
): VirtualScrollMeasurementStore {
  const { defaultRowHeight, estimateRowHeight, measuredHeights, itemIdAtIndex } = options;
  let itemCount = options.itemCount;
  let offsets = buildOffsets(itemCount);
  let totalSize = offsets[itemCount] ?? 0;

  function heightAt(index: number): number {
    const itemId = itemIdAtIndex(index);
    if (itemId) {
      const measured = measuredHeights.get(itemId);
      if (measured !== undefined && measured > 0) return measured;
    }
    return estimateRowHeight?.(index) ?? defaultRowHeight;
  }

  function buildOffsets(count: number): number[] {
    const next: number[] = [0];
    for (let index = 0; index < count; index++) {
      next.push(next[index]! + heightAt(index));
    }
    return next;
  }

  function rebuildOffsets(): void {
    offsets = buildOffsets(itemCount);
    totalSize = offsets[itemCount] ?? 0;
  }

  rebuildOffsets();

  return {
    getRowHeight(index: number): number {
      if (index < 0 || index >= itemCount) return defaultRowHeight;
      return heightAt(index);
    },

    getRowOffset(index: number): number {
      if (index <= 0) return 0;
      if (index >= itemCount) return totalSize;
      return offsets[index] ?? 0;
    },

    getTotalSize(): number {
      return totalSize;
    },

    setMeasuredHeight(itemId: string, index: number, height: number): boolean {
      if (height <= 0 || index < 0 || index >= itemCount) return false;
      const previous = measuredHeights.get(itemId);
      if (previous === height) return false;
      measuredHeights.set(itemId, height);
      rebuildOffsets();
      return true;
    },

    findStartIndex(scrollTop: number): number {
      if (itemCount <= 0) return 0;
      const clamped = Math.max(0, scrollTop);
      return Math.min(itemCount - 1, Math.max(0, lowerBound(offsets, clamped) - 1));
    },

    findEndIndex(scrollBottom: number): number {
      if (itemCount <= 0) return 0;
      const clamped = Math.max(0, scrollBottom);
      return Math.min(itemCount, lowerBound(offsets, clamped));
    },

    syncItemCount(count: number): void {
      if (count === itemCount) return;
      itemCount = count;
      rebuildOffsets();
    },

    rebuild(): void {
      rebuildOffsets();
    },
  };
}

/** When a row above the viewport grows, shift scrollTop by the height delta to keep content stable. */
export function computeScrollAdjustmentForRowResize(options: {
  readonly scrollTop: number;
  readonly rowOffset: number;
  readonly previousHeight: number;
  readonly nextHeight: number;
}): number {
  const { scrollTop, rowOffset, previousHeight, nextHeight } = options;
  const delta = nextHeight - previousHeight;
  if (delta <= 0) return 0;
  if (rowOffset + previousHeight <= scrollTop) return delta;
  return 0;
}
