interface ScrollLockState {
  count: number;
  overflow: string;
  scrollbarGutter: string;
}

const scrollLocks = new WeakMap<HTMLElement, ScrollLockState>();

/** Lock scroll on `root`, preserving original overflow styles with nested refcounting. */
export function lockScroll(root: HTMLElement): void {
  const existing = scrollLocks.get(root);
  if (existing) {
    existing.count += 1;
    return;
  }

  scrollLocks.set(root, {
    count: 1,
    overflow: root.style.overflow,
    scrollbarGutter: root.style.scrollbarGutter,
  });

  root.style.scrollbarGutter = "stable";
  root.style.overflow = "hidden";
}

/** Release one scroll lock on `root`; restore styles when the last lock is released. */
export function unlockScroll(root: HTMLElement): void {
  const state = scrollLocks.get(root);
  if (!state) return;

  state.count -= 1;
  if (state.count > 0) return;

  root.style.overflow = state.overflow;
  root.style.scrollbarGutter = state.scrollbarGutter;
  scrollLocks.delete(root);
}
