export interface VirtualScrollIosScrollController {
  readonly onTouchStart: () => void;
  readonly onTouchEnd: () => void;
  readonly isTouchScrolling: () => boolean;
  readonly queueAdjustment: (delta: number) => void;
  readonly flushAdjustments: (apply: (delta: number) => void) => void;
  readonly dispose: () => void;
}

export interface CreateVirtualScrollIosScrollOptions {
  readonly resetDelay: number;
  readonly enabled: boolean;
}

export function detectTouchScrollEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window;
}

/** Defers scrollTop writes during iOS momentum scroll (clean-room behavioral intent). */
export function createVirtualScrollIosScroll(
  options: CreateVirtualScrollIosScrollOptions,
): VirtualScrollIosScrollController {
  const { resetDelay, enabled } = options;
  let touchScrolling = false;
  let pendingDelta = 0;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  function clearSettleTimer(): void {
    if (settleTimer !== undefined) {
      clearTimeout(settleTimer);
      settleTimer = undefined;
    }
  }

  return {
    onTouchStart(): void {
      if (!enabled) return;
      clearSettleTimer();
      touchScrolling = true;
    },

    onTouchEnd(): void {
      if (!enabled) return;
      clearSettleTimer();
      settleTimer = setTimeout(() => {
        settleTimer = undefined;
        touchScrolling = false;
      }, resetDelay);
    },

    isTouchScrolling(): boolean {
      return enabled && touchScrolling;
    },

    queueAdjustment(delta: number): void {
      if (!enabled || delta === 0) return;
      pendingDelta += delta;
    },

    flushAdjustments(apply: (delta: number) => void): void {
      if (pendingDelta === 0) return;
      const delta = pendingDelta;
      pendingDelta = 0;
      apply(delta);
    },

    dispose(): void {
      clearSettleTimer();
      pendingDelta = 0;
      touchScrolling = false;
    },
  };
}
