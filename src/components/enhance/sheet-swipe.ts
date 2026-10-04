import { SHEET_DIALOG, isOutside, requestCloseDialog } from "./dialog-dismiss.js";
import { createBoxObserver } from "./internal/box-observer.js";

/** Below this width the modal is a bottom sheet. Keep in sync with the `@media` in modal.css. */
export const SHEET_QUERY = "(width < 40rem)";
/** Where a press may start a swipe, besides the backdrop: the modal's own parts only. */
const HANDLE =
  ':is([data-uiify-modal], [data-uiify-drawer]):is([data-part="header"], [data-part="grabber"], [data-part="handle"])';
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
  height: number;
  pendingMove: PointerEvent | null;
  pendingEnd: PointerEvent | null;
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
  const boxes = createBoxObserver(doc);
  let press: Press | null = null;
  let cancelSwallow: (() => void) | null = null;

  const startOf = (event: PointerEvent): HTMLDialogElement | null => {
    const origin = event.target instanceof Element ? event.target : null;
    const dialog = origin?.closest<HTMLDialogElement>(SHEET_DIALOG);
    if (!origin || !dialog || !dialog.open || dialog.hasAttribute("data-snap-enabled")) return null;
    if (dialog.getAttribute("closedby") === "none" || dialog.getAttribute("data-size") === "full") {
      return null;
    }
    const handle = origin === dialog ? null : origin.closest(HANDLE);
    const onHandle =
      handle !== null && handle.closest(SHEET_DIALOG) === dialog && !origin.closest(INTERACTIVE);
    // A press in the body or on a control never starts a swipe.
    if (origin !== dialog && !onHandle) return null;
    if (!view.matchMedia(SHEET_QUERY).matches) return null;
    return dialog;
  };

  const onDown = (event: PointerEvent): void => {
    if (press || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const start = startOf(event);
    if (!start) return;
    press = {
      dialog: start,
      height: 0,
      pendingMove: null,
      pendingEnd: null,
      dragging: false,
      lastTime: event.timeStamp,
      lastY: event.clientY,
      pointerId: event.pointerId,
      startY: event.clientY,
      velocity: 0,
    };
    const candidate = press;
    boxes.read(start, (box) => {
      if (press !== candidate) return;
      if (
        box.height <= 0 ||
        !start.open ||
        (event.target === start && !isOutside(box, event.clientX, event.clientY))
      ) {
        press = null;
        return;
      }
      candidate.height = box.height;
      if (candidate.pendingEnd) {
        candidate.dragging =
          (candidate.pendingMove?.clientY ?? event.clientY) - candidate.startY >= SLOP;
        onEnd(candidate.pendingEnd);
      } else if (candidate.pendingMove) onMove(candidate.pendingMove);
    });
  };

  const onMove = (event: PointerEvent): void => {
    if (!press || event.pointerId !== press.pointerId) return;
    const elapsed = event.timeStamp - press.lastTime;
    if (elapsed > 0) press.velocity = (event.clientY - press.lastY) / elapsed;
    press.lastY = event.clientY;
    press.lastTime = event.timeStamp;
    if (press.height === 0) {
      press.pendingMove = event;
      return;
    }
    const dy = event.clientY - press.startY;
    if (!press.dragging) {
      if (dy < SLOP) return;
      press.dragging = true;
      press.dialog.setPointerCapture(event.pointerId);
      press.dialog.setAttribute("data-dragging", "");
    }
    press.dialog.style.setProperty("--uiify-sheet-offset", `${Math.max(0, dy)}px`);
  };

  const onEnd = (event: PointerEvent): void => {
    if (!press || event.pointerId !== press.pointerId) return;
    if (press.height === 0) {
      press.pendingEnd = event;
      if ((press.pendingMove?.clientY ?? press.startY) - press.startY >= SLOP) {
        cancelSwallow?.();
        cancelSwallow = swallowNextClick(doc);
      }
      return;
    }
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
    boxes.disconnect();
    if (press) {
      press.dialog.removeAttribute("data-dragging");
      press.dialog.style.removeProperty("--uiify-sheet-offset");
      press = null;
    }
  };
}
