export interface HoverIntentOptions {
  readonly closeDelay: number;
  readonly openDelay: number;
}

export interface HoverIntentStore {
  readonly clearAll: () => void;
  readonly clearCloseTimer: () => void;
  readonly clearOpenTimer: () => void;
  readonly scheduleClose: (callback: () => void, delayMs?: number) => void;
  readonly scheduleOpen: (callback: () => void, delayMs?: number) => void;
  readonly updateOptions: (next: HoverIntentOptions) => void;
}

type Timer = ReturnType<typeof setTimeout> | null;

/**
 * Open/close intent timers for hover-driven surfaces (Tooltip, HoverCard,
 * DropdownMenu). Framework-agnostic on purpose: the React parts own the
 * lifecycle, this owns only the two timers.
 *
 * A non-positive delay runs the callback synchronously — pointer handlers rely
 * on the surface being open by the time they return.
 */
export function createHoverIntentStore(initial: HoverIntentOptions): HoverIntentStore {
  let options = initial;
  let openTimer: Timer = null;
  let closeTimer: Timer = null;

  function clearOpenTimer(): void {
    if (openTimer !== null) {
      clearTimeout(openTimer);
      openTimer = null;
    }
  }

  function clearCloseTimer(): void {
    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  return {
    clearAll() {
      clearOpenTimer();
      clearCloseTimer();
    },
    clearCloseTimer,
    clearOpenTimer,
    scheduleClose(callback, delayMs = options.closeDelay) {
      clearCloseTimer();
      if (delayMs <= 0) {
        callback();
        return;
      }
      closeTimer = setTimeout(() => {
        closeTimer = null;
        callback();
      }, delayMs);
    },
    scheduleOpen(callback, delayMs = options.openDelay) {
      clearOpenTimer();
      if (delayMs <= 0) {
        callback();
        return;
      }
      openTimer = setTimeout(() => {
        openTimer = null;
        callback();
      }, delayMs);
    },
    updateOptions(next) {
      options = next;
    },
  };
}
