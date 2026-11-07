import { resolveTableOfContentsId } from "../scrollspy-selection.js";
import type { TableOfContentsInteractionOptions, TableOfContentsInteractions } from "../types.js";

export function attachTableOfContentsInteractions({
  root,
  getOpen,
  requestOpen,
  controlled,
  openOnHover,
  openDelay,
  closeDelay,
}: TableOfContentsInteractionOptions): TableOfContentsInteractions {
  const doc = root.ownerDocument,
    view = doc.defaultView!;
  const selectors = {
    content: ".uiify-table-of-contents-content",
    trigger: ".uiify-table-of-contents-trigger",
    rail: ".uiify-table-of-contents-rail",
    indicator: ".uiify-table-of-contents-indicator",
    link: ".uiify-table-of-contents-link",
  } as const;
  const part = (name: "content" | "trigger") => root.querySelector<HTMLElement>(selectors[name]);
  const panel = () => part("content");
  const trigger = () => part("trigger");
  const within = (node: EventTarget | null) =>
    node instanceof view.Node && (panel()?.contains(node) || trigger()?.contains(node));
  let timer = 0,
    toggleTimer = 0,
    pinned = false,
    transient = false,
    suppressed = false,
    returnFocus = false,
    navigating = false,
    destroyed = false;
  const clear = () => {
    view.clearTimeout(timer);
    timer = 0;
  };
  const focused = () => panel()?.contains(doc.activeElement);
  const enter = (event: Event) => {
    const pointer = event as PointerEvent;
    if (pointer.pointerType !== "mouse" || !within(pointer.target) || within(pointer.relatedTarget))
      return;
    clear();
    if (!openOnHover || suppressed || getOpen()) return;
    timer = view.setTimeout(() => {
      timer = 0;
      transient = true;
      requestOpen(true);
    }, openDelay);
  };
  const leave = (event: Event) => {
    if (within((event as PointerEvent).relatedTarget)) return;
    suppressed = false;
    clear();
    if (transient && !pinned && !focused())
      timer = view.setTimeout(() => {
        timer = 0;
        transient = false;
        requestOpen(false);
      }, closeDelay);
  };
  const focus = () => clear();
  const blur = (event: Event) => {
    if (
      !root.contains((event as FocusEvent).relatedTarget as Node | null) &&
      transient &&
      !pinned
    ) {
      clear();
      timer = view.setTimeout(() => requestOpen(false), closeDelay);
    }
  };
  const before = (event: Event) => {
    if (event.target !== panel()) return;
    const next = (event as ToggleEvent).newState === "open";
    if (!next) {
      returnFocus = !navigating && (focused() ?? false);
      navigating = false;
      clear();
      transient = false;
      pinned = false;
      suppressed = true;
    }
    if (next !== getOpen()) {
      requestOpen(next);
      if (controlled && event.cancelable) event.preventDefault();
    }
    view.clearTimeout(toggleTimer);
    toggleTimer = view.setTimeout(() => {
      const surface = panel();
      if (destroyed || !surface?.isConnected) return;
      const actual = surface.matches(":popover-open");
      if (controlled && actual !== getOpen()) {
        if (getOpen()) surface.showPopover();
        else surface.hidePopover();
      } else if (!actual && returnFocus) {
        returnFocus = false;
        trigger()?.focus({ preventScroll: true });
      }
    }, 0);
  };
  root.addEventListener("pointerover", enter);
  root.addEventListener("pointerout", leave);
  root.addEventListener("focusin", focus);
  root.addEventListener("focusout", blur);
  root.addEventListener("beforetoggle", before, true);
  return {
    click(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const element = (event.target as Element).closest(
        ".uiify-table-of-contents-trigger, .uiify-table-of-contents-link",
      );
      if (!element || element.closest(".uiify-table-of-contents") !== root) return;
      if (element === trigger()) {
        event.preventDefault();
        clear();
        const rail = (event.target as Element).closest(".uiify-table-of-contents-rail");
        const indicator =
          (event.target as Element).closest(".uiify-table-of-contents-indicator") ??
          rail?.querySelector(".uiify-table-of-contents-indicator[data-highlighted]");
        const id = indicator?.getAttribute("data-toc-value");
        if (rail && id && event.detail > 0 && (event as PointerEvent).pointerType !== "touch") {
          const link = [
            ...root.querySelectorAll<HTMLAnchorElement>(".uiify-table-of-contents-link"),
          ].find((node) => node.getAttribute("data-toc-value") === id);
          if (link) {
            link.click();
            return;
          }
        }
        if (transient && getOpen()) {
          transient = false;
          pinned = true;
        } else {
          pinned = !getOpen();
          transient = false;
          suppressed = !pinned;
          requestOpen(pinned);
        }
      } else if (
        !element.hasAttribute("download") &&
        (!element.getAttribute("target") || element.getAttribute("target") === "_self") &&
        resolveTableOfContentsId(element.getAttribute("href") ?? "", doc.URL) !== null
      ) {
        clear();
        navigating = true;
        pinned = false;
        transient = false;
        suppressed = true;
        requestOpen(false);
      }
    },
    destroy() {
      destroyed = true;
      clear();
      view.clearTimeout(toggleTimer);
      root.removeEventListener("pointerover", enter);
      root.removeEventListener("pointerout", leave);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", blur);
      root.removeEventListener("beforetoggle", before, true);
    },
  };
}
