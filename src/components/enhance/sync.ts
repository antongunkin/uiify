/**
 * Pure DOM synchronisers for `UIEnhance`.
 *
 * No React and no listeners live here: each function takes the state the caller
 * has already resolved and writes it to the DOM. That keeps them unit-testable
 * in jsdom, which implements neither `:popover-open` nor Invoker Commands —
 * nor, like packages/uiify/src/core/tabbable.ts also found, `CSS.escape`.
 */

/** Same feature-detect as packages/uiify/src/core/tabbable.ts: only the quote
 * character needs escaping inside a double-quoted attribute selector value. */
function escapeAttrValue(value: string): string {
  return typeof CSS !== "undefined" && typeof CSS.escape === "function"
    ? CSS.escape(value)
    : value.replaceAll('"', '\\"');
}

/**
 * Point every `toggle-popover` invoker for `popoverId` at its real open state.
 *
 * `querySelectorAll`, not `querySelector`: a popover may legitimately have more
 * than one invoker, and invokers may be added after the enhancer mounts.
 */
export function syncPopoverTriggers(popoverId: string, open: boolean): void {
  if (!popoverId) return;

  const selector = `[command="toggle-popover"][commandfor="${escapeAttrValue(popoverId)}"]`;
  for (const invoker of document.querySelectorAll(selector)) {
    invoker.setAttribute("aria-expanded", String(open));
  }
}

/**
 * Point tab triggers and contents of one Tabs `root` at its checked radio.
 *
 * Tabs pair by position, as `behavior.css` does: the i-th control in the direct TabsList
 * selects the i-th direct TabsContent, and with no control checked the first one shows.
 * Child combinators keep a nested Tabs untouched.
 */
export function syncTabs(root: HTMLElement): void {
  const controls = [
    ...root.querySelectorAll<HTMLInputElement>(
      ":scope > .uiify-tabs-list > .uiify-tabs-item > .uiify-tabs-control",
    ),
  ];
  const selected = Math.max(
    0,
    controls.findIndex((control) => control.checked),
  );

  controls.forEach((control, index) => {
    const trigger = control.nextElementSibling;
    if (!(trigger instanceof HTMLElement) || !trigger.matches(".uiify-tabs-trigger")) return;
    trigger.setAttribute("aria-selected", String(index === selected));
    trigger.dataset["state"] = index === selected ? "active" : "inactive";
  });

  root.querySelectorAll<HTMLElement>(":scope > .uiify-tabs-content").forEach((content, index) => {
    content.dataset["state"] = index === selected ? "active" : "inactive";
    content.tabIndex = index === selected ? 0 : -1;
  });
}
