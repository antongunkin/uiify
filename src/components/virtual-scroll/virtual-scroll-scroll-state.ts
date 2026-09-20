export interface VirtualScrollScrollStateController {
  readonly notifyScroll: () => void;
  readonly notifyScrollEnd: () => void;
  readonly dispose: () => void;
}

export interface CreateVirtualScrollScrollStateOptions {
  readonly resetDelay: number;
  readonly onChange: (isScrolling: boolean) => void;
  readonly supportsScrollEnd: boolean;
}

/** Tracks burst scroll activity; settles on `scrollend` or debounced timeout. */
export function createVirtualScrollScrollState(
  options: CreateVirtualScrollScrollStateOptions,
): VirtualScrollScrollStateController {
  const { resetDelay, onChange, supportsScrollEnd } = options;
  let isScrolling = false;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  function setScrolling(next: boolean): void {
    if (isScrolling === next) return;
    isScrolling = next;
    onChange(next);
  }

  function clearResetTimer(): void {
    if (resetTimer !== undefined) {
      clearTimeout(resetTimer);
      resetTimer = undefined;
    }
  }

  function scheduleReset(): void {
    if (supportsScrollEnd) return;
    clearResetTimer();
    resetTimer = setTimeout(() => {
      resetTimer = undefined;
      setScrolling(false);
    }, resetDelay);
  }

  return {
    notifyScroll(): void {
      if (!isScrolling) setScrolling(true);
      scheduleReset();
    },

    notifyScrollEnd(): void {
      clearResetTimer();
      setScrolling(false);
    },

    dispose(): void {
      clearResetTimer();
    },
  };
}

export function supportsScrollEndEvent(): boolean {
  return typeof window !== "undefined" && "onscrollend" in window;
}
