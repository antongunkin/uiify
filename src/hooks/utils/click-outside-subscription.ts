export type ClickOutsideListener = (event: Event) => void;

const listeners = new Set<ClickOutsideListener>();
let subscribed = false;

function dispatch(event: Event): void {
  for (const listener of listeners) {
    listener(event);
  }
}

/** Refcounted capture-phase `pointerdown` subscription shared across hook instances. */
export function subscribeClickOutside(listener: ClickOutsideListener): () => void {
  listeners.add(listener);
  if (!subscribed) {
    document.addEventListener("pointerdown", dispatch, true);
    subscribed = true;
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      document.removeEventListener("pointerdown", dispatch, true);
      subscribed = false;
    }
  };
}
