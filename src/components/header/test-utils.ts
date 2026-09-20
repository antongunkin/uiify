import { vi } from "vitest";

export function patchDialogElements(root: HTMLElement = document.body): void {
  for (const dialog of root.querySelectorAll("dialog")) {
    if (!(dialog instanceof HTMLDialogElement)) continue;
    dialog.showModal = () => {
      Object.defineProperty(dialog, "open", { configurable: true, value: true, writable: true });
    };
    dialog.show = () => {
      Object.defineProperty(dialog, "open", { configurable: true, value: true, writable: true });
    };
    dialog.close = () => {
      Object.defineProperty(dialog, "open", { configurable: true, value: false, writable: true });
    };
  }
}

export function installDialogPrototypePatch(): void {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    Object.defineProperty(this, "open", { configurable: true, value: true, writable: true });
  };
  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    Object.defineProperty(this, "open", { configurable: true, value: true, writable: true });
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    Object.defineProperty(this, "open", { configurable: true, value: false, writable: true });
  };
}

export function createIntersectionObserverMock() {
  let trigger: ((entries: IntersectionObserverEntry[]) => void) | null = null;
  const observe = vi.fn();
  const disconnect = vi.fn();

  class MockIntersectionObserver {
    constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
      trigger = cb;
    }
    observe = observe;
    disconnect = disconnect;
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  return {
    disconnect,
    observe,
    trigger(entries: IntersectionObserverEntry[]) {
      trigger?.(entries);
    },
  };
}
