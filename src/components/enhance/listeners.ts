import { attachInvokerFallback } from "./invoker-fallback.js";
import { syncPopoverTriggers, syncTabs } from "./sync.js";

/**
 * Attach the document-level enhancement listeners. Returns a teardown.
 *
 * `toggle` is captured rather than bubbled: the event has `bubbles: false`, but
 * the capture phase runs from the root down to the target for every dispatched
 * event regardless of bubbling, so a single capture-phase listener on the
 * document sees every popover on the page — including ones rendered later.
 *
 * `change` bubbles, so tabs are handled in the ordinary bubble phase.
 *
 * The invoker fallback attaches only on engines without `command`/`commandfor`
 * (see invoker-fallback.ts); on the baseline it is a no-op.
 */
export function attachEnhancers(doc: Document = document): () => void {
  const onToggle = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    if (!target?.hasAttribute("popover") || !target.id) return;
    const { newState } = event as ToggleEvent;
    syncPopoverTriggers(target.id, newState === "open");
  };

  const onChange = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    if (!target?.hasAttribute("data-uiify-tabs-input")) return;
    // The root Tabs renders is `data-uiify-tabs`, not `data-uiify-tabs-root`:
    // the latter never existed outside this selector, so syncTabs was never
    // reached in production. Pinned by listeners.test.ts, which now builds its
    // fixture with renderToStaticMarkup instead of hand-written HTML.
    const root = target.closest<HTMLElement>("[data-uiify-tabs]");
    if (root?.id) syncTabs(root.id);
  };

  doc.addEventListener("toggle", onToggle, true);
  doc.addEventListener("change", onChange);
  const detachInvokerFallback = attachInvokerFallback(doc);

  return () => {
    doc.removeEventListener("toggle", onToggle, true);
    doc.removeEventListener("change", onChange);
    detachInvokerFallback();
  };
}
