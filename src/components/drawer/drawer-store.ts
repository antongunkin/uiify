import type { DrawerSide } from "./types.js";
import type { DrawerStoreOptions, DrawerStore } from "./client-types.js";

function isVerticalSide(side: DrawerSide): boolean {
  return side === "top" || side === "bottom";
}

function snapToNearest(
  snapPoints: readonly number[],
  currentSnap: number,
  dragOffset: number,
  containerSize: number,
  dismissible: boolean,
): number | null {
  if (containerSize <= 0) return currentSnap;
  const openSize = currentSnap * containerSize;
  const projected = openSize - dragOffset;
  const ratio = projected / containerSize;

  if (dismissible && ratio < 0.25) return null;

  let nearest = snapPoints[0] ?? currentSnap;
  let nearestDistance = Math.abs(ratio - nearest);
  for (const point of snapPoints) {
    const distance = Math.abs(ratio - point);
    if (distance < nearestDistance) {
      nearest = point;
      nearestDistance = distance;
    }
  }
  return nearest;
}

export function createDrawerStore(options: DrawerStoreOptions): DrawerStore {
  const snapPoints = options.snapPoints ?? [];
  const dismissible = options.dismissible ?? true;
  const side = options.side;
  const vertical = isVerticalSide(side);

  let activeSnapPoint =
    options.activeSnapPoint ??
    options.defaultActiveSnapPoint ??
    snapPoints[snapPoints.length - 1] ??
    1;
  let containerSize = 0;
  let dragOffset = 0;
  let dragging = false;
  let pointerStart = 0;
  let dragStartOffset = 0;
  let onSnapChange = options.onSnapChange;
  let onDismiss = options.onDismiss;

  const listeners = new Set<() => void>();
  const emit = () => {
    for (const listener of listeners) listener();
  };

  const store: DrawerStore = {
    endDrag() {
      if (!dragging) return;
      dragging = false;
      if (snapPoints.length > 0 && containerSize > 0) {
        const next = snapToNearest(
          snapPoints,
          activeSnapPoint,
          dragOffset,
          containerSize,
          dismissible,
        );
        if (next === null) {
          dragOffset = 0;
          emit();
          onDismiss?.();
          return;
        }
        activeSnapPoint = next;
        onSnapChange?.(next);
      }
      dragOffset = 0;
      emit();
    },
    getActiveSnapPoint: () => activeSnapPoint,
    getDragOffset: () => dragOffset,
    getTransform() {
      if (snapPoints.length === 0) return "";
      const openPx = activeSnapPoint * containerSize;
      const delta = openPx - dragOffset;
      const closedPx = containerSize;
      const offset = closedPx - delta;
      if (vertical) {
        const sign = side === "bottom" ? 1 : -1;
        return `translate${side === "bottom" || side === "top" ? "Y" : "X"}(${sign * offset}px)`;
      }
      const sign = side === "right" ? 1 : -1;
      return `translateX(${sign * offset}px)`;
    },
    isDragging: () => dragging,
    moveDrag(clientCoord) {
      if (!dragging) return;
      const delta = clientCoord - pointerStart;
      const signedDelta = side === "top" || side === "left" ? -delta : delta;
      dragOffset = Math.max(0, dragStartOffset + signedDelta);
      emit();
    },
    setContainerSize(size) {
      if (size === containerSize) return;
      containerSize = size;
      emit();
    },
    startDrag(clientCoord) {
      if (snapPoints.length === 0) return;
      dragging = true;
      pointerStart = clientCoord;
      dragStartOffset = dragOffset;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    syncActiveSnapPoint(snap) {
      if (snap === activeSnapPoint) return;
      activeSnapPoint = snap;
      emit();
    },
  };

  return store;
}
