import type { BoxObserver } from "../types.js";

/** Snapshot geometry after the browser's layout phase, without synchronously flushing it. */
export function createBoxObserver(doc: Document): BoxObserver {
  const pending = new Map<Element, ((box: DOMRectReadOnly) => void)[]>();
  const view = doc.defaultView ?? window;
  let observer: IntersectionObserver | undefined;
  return {
    read(element, callback) {
      const callbacks = pending.get(element);
      if (callbacks) callbacks.push(callback);
      else {
        pending.set(element, [callback]);
        observer ??= new view.IntersectionObserver((entries) => {
          for (const entry of entries) {
            const callbacks = pending.get(entry.target);
            if (!callbacks) continue;
            pending.delete(entry.target);
            observer?.unobserve(entry.target);
            for (const callback of callbacks) callback(entry.boundingClientRect);
          }
        });
        observer.observe(element);
      }
    },
    disconnect() {
      pending.clear();
      observer?.disconnect();
    },
  };
}
