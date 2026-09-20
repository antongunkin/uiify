/**
 * Delegated fallback for `command`/`commandfor` on engines below the library
 * baseline (Chrome < 135, Firefox < 144, Safari < 26.2), e.g. Firefox ESR 140
 * and iOS 26.0/26.1. Feature-detected: engines that implement invoker commands
 * get nothing attached. Clicks that happen before hydration on those engines
 * are still lost — see docs/guides/native-composition.md.
 */

const INVOKER_SELECTOR = "button[command][commandfor]";

export function supportsInvokerCommands(view: Window = window): boolean {
  // `HTMLButtonElement` is a global constructor, not a member of the `Window`
  // interface itself, so TypeScript's DOM lib does not expose it on a plain
  // `Window`-typed value. `view` is always the global `window` (or another
  // document's `defaultView`, which carries the same globals) at runtime.
  const { HTMLButtonElement: ButtonCtor } = view as unknown as typeof globalThis;
  return "commandForElement" in ButtonCtor.prototype;
}

function runDialogCommand(dialog: HTMLDialogElement, command: string, value: string): boolean {
  switch (command) {
    case "show-modal":
      if (!dialog.open) dialog.showModal();
      return true;
    case "close":
      if (dialog.open) dialog.close(value);
      return true;
    case "request-close": {
      if (!dialog.open) return true;
      const requestClose = (dialog as HTMLDialogElement & { requestClose?: (v?: string) => void })
        .requestClose;
      if (typeof requestClose === "function") requestClose.call(dialog, value);
      else dialog.close(value);
      return true;
    }
    default:
      return false;
  }
}

function runPopoverCommand(target: HTMLElement, command: string): boolean {
  switch (command) {
    case "toggle-popover":
      target.togglePopover();
      return true;
    case "show-popover":
      target.showPopover();
      return true;
    case "hide-popover":
      target.hidePopover();
      return true;
    default:
      return false;
  }
}

/** Execute the button's declared command against its target. Returns true when a command ran. */
export function runInvokerCommand(button: HTMLButtonElement): boolean {
  const command = button.getAttribute("command");
  const targetId = button.getAttribute("commandfor");
  if (!command || !targetId) return false;
  const target = button.ownerDocument.getElementById(targetId);
  if (!target) return false;
  if (target instanceof HTMLDialogElement) return runDialogCommand(target, command, button.value);
  return target.hasAttribute("popover") && runPopoverCommand(target, command);
}

/**
 * Attach the delegated click listener when the engine lacks invoker commands.
 * Returns a teardown; a no-op teardown when nothing was attached.
 */
export function attachInvokerFallback(doc: Document = document): () => void {
  if (supportsInvokerCommands(doc.defaultView ?? window)) return () => {};

  const onClick = (event: Event): void => {
    if (event.defaultPrevented) return;
    const origin = event.target instanceof Element ? event.target : null;
    const button = origin?.closest(INVOKER_SELECTOR);
    if (!(button instanceof HTMLButtonElement) || button.disabled) return;
    if (runInvokerCommand(button)) event.preventDefault();
  };

  doc.addEventListener("click", onClick);
  return () => doc.removeEventListener("click", onClick);
}
