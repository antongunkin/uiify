import type { TooltipProviderOptions, TooltipProviderStore } from "./types.js";

const CONTENT_HOVER_GRACE_MS = 100;

export function createTooltipProviderStore(initial: TooltipProviderOptions): TooltipProviderStore {
  let options = initial;
  let lastOpenTime = 0;

  return {
    getDelayDuration() {
      return options.delayDuration;
    },
    markOpened() {
      lastOpenTime = Date.now();
    },
    shouldSkipDelay() {
      return Date.now() - lastOpenTime <= options.skipDelayDuration;
    },
    updateOptions(next: TooltipProviderOptions) {
      options = next;
    },
  };
}

export { CONTENT_HOVER_GRACE_MS };
