export interface RateLimitedFn<Args extends unknown[]> {
  (...args: Args): void;
  cancel(): void;
}

/** Trailing-edge debounce with a `.cancel()` method. */
export function createDebouncedFn<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): RateLimitedFn<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const fn = (...args: Args) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, delay);
  };

  fn.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return fn;
}

/** Leading + trailing throttle with a `.cancel()` method. */
export function createThrottledFn<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): RateLimitedFn<Args> {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let trailingArgs: Args | null = null;

  const fn = (...args: Args) => {
    const now = Date.now();
    const remaining = delay - (now - lastRun);
    trailingArgs = args;

    if (remaining <= 0) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      lastRun = now;
      const latestArgs = trailingArgs;
      trailingArgs = null;
      callback(...latestArgs);
    } else if (timer === null) {
      timer = setTimeout(() => {
        lastRun = Date.now();
        timer = null;
        const latestArgs = trailingArgs;
        trailingArgs = null;
        if (latestArgs) callback(...latestArgs);
      }, remaining);
    }
  };

  fn.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    trailingArgs = null;
  };

  return fn;
}
