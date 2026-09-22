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
 * The value a tab trigger stands for.
 *
 * ChoiceGroup renders the trigger as `<label for="…">` pointing at its radio, so
 * the value lives on that input — there is no `data-value` on the label. Reading
 * `trigger.dataset.value` (as this module used to) always yielded `undefined`,
 * which marked every trigger unselected.
 */
function tabTriggerValue(trigger: HTMLElement, root: HTMLElement): string | undefined {
  const controlId = trigger instanceof HTMLLabelElement ? trigger.htmlFor : "";
  if (!controlId) return undefined;
  const control = root.querySelector<HTMLInputElement>(`[id="${escapeAttrValue(controlId)}"]`);
  return control?.value;
}

/** Point tab triggers and panels at whichever radio in `tabsId` is checked. */
export function syncTabs(tabsId: string): void {
  const root = document.getElementById(tabsId);
  if (!root) return;

  const checked = root.querySelector<HTMLInputElement>(
    `[data-uiify-tabs] > [data-part="item"] > [data-part="control"][name="${escapeAttrValue(tabsId)}"]:checked`,
  );
  const selectedValue = checked?.value;

  for (const trigger of root.querySelectorAll<HTMLElement>(
    '[data-uiify-tabs] [data-part="trigger"]',
  )) {
    const value = tabTriggerValue(trigger, root);
    const selected = value !== undefined && value === selectedValue;
    trigger.setAttribute("aria-selected", String(selected));
    trigger.dataset["state"] = selected ? "active" : "inactive";
  }

  const panelPrefix = `${tabsId}-panel-`;
  for (const panel of root.querySelectorAll<HTMLElement>('[data-uiify-tabs] [data-part="panel"]')) {
    const selected =
      panel.id.startsWith(panelPrefix) && panel.id.slice(panelPrefix.length) === selectedValue;
    panel.dataset["state"] = selected ? "active" : "inactive";
    panel.tabIndex = selected ? 0 : -1;
  }
}
