import { supportsCheckVisibility } from "./platform.js";

const candidateSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(",");

interface TabbableOptions {
  readonly includeContainer?: boolean;
}

function isElementDisabled(element: Element): boolean {
  if ("disabled" in element && (element as HTMLButtonElement).disabled) return true;
  const fieldset = element.closest("fieldset[disabled]");
  if (!fieldset) return false;
  const firstLegend = fieldset.querySelector(":scope > legend");
  return !firstLegend?.contains(element);
}

function isInClosedDetails(element: Element): boolean {
  const details = element.closest("details:not([open])");
  const summary = details?.querySelector(":scope > summary");
  return details !== null && !summary?.contains(element);
}

function isStructurallyVisible(element: HTMLElement): boolean {
  let current: Element | null = element;
  while (current instanceof HTMLElement) {
    if (current.hidden || current.getAttribute("aria-hidden") === "true") return false;
    const root = current.getRootNode();
    current = current.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
  }
  return true;
}

function isVisible(element: HTMLElement): boolean {
  if (element.closest("[hidden], [inert]")) return false;
  if (supportsCheckVisibility()) {
    return element.checkVisibility({
      checkOpacity: true,
      checkVisibilityCSS: true,
    });
  }
  return isStructurallyVisible(element);
}

function isRadioTabbable(element: HTMLInputElement): boolean {
  if (element.type !== "radio" || !element.name || element.checked) return true;
  const root = element.form ?? element.ownerDocument;
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(element.name)
      : element.name.replaceAll('"', '\\"');
  return !root.querySelector(`input[type="radio"][name="${escaped}"]:checked`);
}

export function isFocusable(element: Element): element is HTMLElement {
  return (
    element instanceof HTMLElement &&
    element.matches(candidateSelector) &&
    element.isConnected &&
    !isElementDisabled(element) &&
    !isInClosedDetails(element) &&
    isVisible(element)
  );
}

export function isTabbable(element: Element): element is HTMLElement {
  if (!isFocusable(element) || element.tabIndex < 0) return false;
  return !(element instanceof HTMLInputElement) || isRadioTabbable(element);
}

function collectCandidates(root: Element | ShadowRoot, result: HTMLElement[]): void {
  if (root instanceof Element && root.shadowRoot) {
    collectCandidates(root.shadowRoot, result);
  }
  for (const element of root.querySelectorAll<HTMLElement>("*")) {
    if (element.matches(candidateSelector) && isTabbable(element)) {
      result.push(element);
    }
    if (element.shadowRoot) collectCandidates(element.shadowRoot, result);
    if (element instanceof HTMLSlotElement) {
      for (const assigned of element.assignedElements({ flatten: true })) {
        if (isTabbable(assigned)) result.push(assigned);
      }
    }
  }
}

export function getTabbableCandidates(
  container: HTMLElement,
  { includeContainer = false }: TabbableOptions = {},
): HTMLElement[] {
  const candidates: HTMLElement[] = [];
  if (includeContainer && isTabbable(container)) candidates.push(container);
  collectCandidates(container, candidates);

  return [...new Set(candidates)]
    .map((element, order) => ({ element, order, tabIndex: element.tabIndex }))
    .sort((left, right) => {
      const leftPositive = left.tabIndex > 0;
      const rightPositive = right.tabIndex > 0;
      if (leftPositive !== rightPositive) return leftPositive ? -1 : 1;
      if (leftPositive && left.tabIndex !== right.tabIndex) {
        return left.tabIndex - right.tabIndex;
      }
      return left.order - right.order;
    })
    .map(({ element }) => element);
}
