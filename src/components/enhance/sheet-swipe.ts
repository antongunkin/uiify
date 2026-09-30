import { MODAL_DIALOG, isOutside, requestCloseDialog } from "./dialog-dismiss.js";
import { readBox } from "./internal/read-box.js";

/** Below this width the modal is a bottom sheet. Keep in sync with the `@media` in modal.css. */
export const SHEET_QUERY = "(width < 40rem)";
/** Where a press may start a swipe, besides the backdrop: the modal's own parts only. */
const HANDLE = '[data-uiify-modal][data-part="header"], [data-uiify-modal][data-part="grabber"]';
/** Never start a swipe from these: the press is meant for them. */
const INTERACTIVE = "a, button, input, select, textarea, [contenteditable], [data-no-swipe]";
/** Pixels a press must travel down before it becomes a drag; below it the tap reaches `click`. */
const SLOP = 6;
/** Fraction of the sheet height that dismisses on release. */
const DISMISS_RATIO = 0.25;
/** Downward release speed (px per ms) that dismisses regardless of distance. */
const DISMISS_VELOCITY = 0.5;
/** A release this long after the last move is a pause, not a fling: its speed counts as zero. */
const FLING_WINDOW_MS = 80;
/** How long the click that follows a drag is swallowed if it never arrives. */
const SWALLOW_MS = 300;

interface Press {
  readonly dialog: HTMLDialogElement;
  readonly height: number;
  readonly pointerId: number;
  readonly startY: number;
  dragging: boolean;
  lastY: number;
  lastTime: number;
  velocity: number;
}

/** Swallows the click that ends a drag; returns a function that removes the trap. */
function swallowNextClick(doc: Document): () => void {
  const swallow = (event: Event): void => {
    event.stopPropagation();
    event.preventDefault();
  };
  doc.addEventListener("click", swallow, { capture: true, once: true });
  const timer = setTimeout(() => doc.removeEventListener("click", swallow, true), SWALLOW_MS);
  return () => {
    clearTimeout(timer);
    doc.removeEventListener("click", swallow, true);
  };
}

/**
 * Swipe-down-to-close for the mobile sheet, driven by pointer events. It only moves the sheet
 * with `data-dragging` and `--uiify-sheet-offset`; the transition back or out is the CSS in
 * modal.css. Optional: without it the sheet still closes by icon, Escape and backdrop tap.
 */
export function attachSheetSwipe(doc: Document = document): () => void {
  const view = doc.defaultView ?? window;
  let press: Press | null = null;
  let cancelSwallow: (() => void) | null = null;

  const startOf = (event: PointerEvent): { dialog: HTMLDialogElement; height: number } | null => {
    const origin = event.target instanceof Element ? event.target : null;
    const dialog = origin?.closest<HTMLDialogElement>(MODAL_DIALOG);
    if (!origin || !dialog || !dialog.open) return null;
    if (dialog.getAttribute("closedby") === "none" || dialog.getAttribute("data-size") === "full") {
      return null;
    }
    const handle = origin === dialog ? null : origin.closest(HANDLE);
    const onHandle =
      handle !== null && handle.closest(MODAL_DIALOG) === dialog && !origin.closest(INTERACTIVE);
    // A press in the body or on a control never starts a swipe: skip the layout read for it.
    if (origin !== dialog && !onHandle) return null;
    if (!view.matchMedia(SHEET_QUERY).matches) return null;
    const box = readBox(dialog);
    const onBackdrop = origin === dialog && isOutside(box, event.clientX, event.clientY);
    return onBackdrop || onHandle ? { dialog, height: box.height } : null;
  };

  const onDown = (event: PointerEvent): void => {
    if (press || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const start = startOf(event);
    if (!start) return;
    press = {
      ...start,
      dragging: false,
      lastTime: event.timeStamp,
      lastY: event.clientY,
      pointerId: event.pointerId,
      startY: event.clientY,
      velocity: 0,
    };
  };

  const onMove = (event: PointerEvent): void => {
    if (!press || event.pointerId !== press.pointerId) return;
    const dy = event.clientY - press.startY;
    if (!press.dragging) {
      if (dy < SLOP) return;
      press.dragging = true;
      press.dialog.setPointerCapture(event.pointerId);
      press.dialog.setAttribute("data-dragging", "");
    }
    const elapsed = event.timeStamp - press.lastTime;
    if (elapsed > 0) press.velocity = (event.clientY - press.lastY) / elapsed;
    press.lastY = event.clientY;
    press.lastTime = event.timeStamp;
    press.dialog.style.setProperty("--uiify-sheet-offset", `${Math.max(0, dy)}px`);
  };

  const onEnd = (event: PointerEvent): void => {
    if (!press || event.pointerId !== press.pointerId) return;
    const { dialog, dragging, height, lastTime, startY, velocity: lastVelocity } = press;
    press = null;
    if (!dragging) return;
    cancelSwallow?.();
    cancelSwallow = swallowNextClick(doc);
    if (!dialog.open) {
      // Closed by other means mid-drag (Escape, a programmatic close): just reset the drag state.
      dialog.removeAttribute("data-dragging");
      dialog.style.removeProperty("--uiify-sheet-offset");
      return;
    }
    const velocity = event.timeStamp - lastTime > FLING_WINDOW_MS ? 0 : lastVelocity;
    const distance = event.clientY - startY;
    const dismiss =
      event.type === "pointerup" &&
      (distance > height * DISMISS_RATIO || velocity > DISMISS_VELOCITY);
    // Hand the position back to CSS first: if the dialog closes it slides out from where the
    // finger left it, if a cancel handler vetoes it springs back to the resting position.
    dialog.removeAttribute("data-dragging");
    dialog.style.removeProperty("--uiify-sheet-offset");
    if (dismiss) requestCloseDialog(dialog);
  };

  doc.addEventListener("pointerdown", onDown);
  doc.addEventListener("pointermove", onMove);
  doc.addEventListener("pointerup", onEnd);
  doc.addEventListener("pointercancel", onEnd);
  return () => {
    doc.removeEventListener("pointerdown", onDown);
    doc.removeEventListener("pointermove", onMove);
    doc.removeEventListener("pointerup", onEnd);
    doc.removeEventListener("pointercancel", onEnd);
    cancelSwallow?.();
    if (press) {
      press.dialog.removeAttribute("data-dragging");
      press.dialog.style.removeProperty("--uiify-sheet-offset");
      press = null;
    }
  };
}
