import type { CarouselController } from "../types.js";

const interactive =
  "a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable='false']),[role='button'],[role='link'],[role='slider'],[role='textbox']";

/** Observe a horizontal gesture without taking vertical scrolling or pinch zoom from the browser. */
export function attachFadeSwipe(
  root: HTMLElement,
  controller: CarouselController,
  mouseDrag: boolean,
): () => void {
  const viewport = root.querySelector<HTMLElement>(':scope > [data-part="viewport"]');
  if (!viewport) return () => {};
  let width = 0;
  let state: { id: number; x: number; y: number; captured: boolean } | undefined;
  let cancelClick = false;
  const resize = new ResizeObserver((entries) => {
    const entry = entries.find((value) => value.target === viewport);
    if (entry) width = entry.contentBoxSize[0]?.inlineSize ?? entry.contentRect.width;
  });
  resize.observe(viewport);
  function clear() {
    const current = state;
    state = undefined;
    if (current?.captured) {
      if (viewport!.hasPointerCapture(current.id)) viewport!.releasePointerCapture(current.id);
      controller.setInteracting(false);
    }
    // A drag that briefly grazed selectable text before capturing can leave a stray
    // selection behind; an uncleared one would block every future gesture's `down()`
    // guard below. Only collapse a selection this gesture could plausibly have made.
    if (current) {
      const selection = root.ownerDocument.getSelection();
      if (selection && !selection.isCollapsed && root.contains(selection.anchorNode))
        selection.removeAllRanges();
    }
  }
  function down(event: PointerEvent) {
    cancelClick = false;
    if (
      state ||
      event.defaultPrevented ||
      event.isPrimary === false ||
      event.button !== 0 ||
      (event.pointerType !== "touch" &&
        event.pointerType !== "pen" &&
        !(mouseDrag && event.pointerType === "mouse")) ||
      !controller.getSnapshot().ready ||
      controller.getSnapshot().moving ||
      !(event.target instanceof Element) ||
      event.target.closest("[data-uiify-carousel]") !== root ||
      event.target.closest(interactive) ||
      root.ownerDocument.getSelection()?.isCollapsed === false
    )
      return;
    state = { id: event.pointerId, x: event.clientX, y: event.clientY, captured: false };
  }
  function move(event: PointerEvent) {
    if (!state || state.id !== event.pointerId) return;
    if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
      clear();
      return;
    }
    const x = Math.abs(event.clientX - state.x),
      y = Math.abs(event.clientY - state.y);
    if (!state.captured) {
      if (Math.max(x, y) < 5) return;
      if (y >= x) {
        clear();
        return;
      }
      state.captured = true;
      viewport!.setPointerCapture(event.pointerId);
      controller.setInteracting(true);
    }
    event.preventDefault();
  }
  function up(event: PointerEvent) {
    if (!state || state.id !== event.pointerId) return;
    const current = state,
      x = event.clientX - current.x,
      y = event.clientY - current.y;
    clear();
    if (!current.captured) return;
    cancelClick = true;
    if (Math.abs(x) < Math.max(50, width / 3) || Math.abs(x) <= Math.abs(y)) return;
    const sign = root.closest("[dir]")?.getAttribute("dir") === "rtl" ? -1 : 1;
    if (x * sign < 0) controller.next("drag");
    else controller.previous("drag");
  }
  function cancel(event: PointerEvent) {
    if (state?.id === event.pointerId) clear();
  }
  function click(event: MouseEvent) {
    if (
      !cancelClick ||
      !(event.target instanceof Element) ||
      event.target.closest("[data-uiify-carousel]") !== root
    )
      return;
    cancelClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  viewport.addEventListener("pointerdown", down);
  viewport.addEventListener("pointermove", move);
  viewport.addEventListener("pointerup", up);
  viewport.addEventListener("pointercancel", cancel);
  viewport.addEventListener("lostpointercapture", cancel);
  root.ownerDocument.addEventListener("pointerup", cancel);
  root.ownerDocument.addEventListener("pointercancel", cancel);
  root.addEventListener("click", click, true);
  return () => {
    clear();
    cancelClick = false;
    resize.disconnect();
    viewport.removeEventListener("pointerdown", down);
    viewport.removeEventListener("pointermove", move);
    viewport.removeEventListener("pointerup", up);
    viewport.removeEventListener("pointercancel", cancel);
    viewport.removeEventListener("lostpointercapture", cancel);
    root.ownerDocument.removeEventListener("pointerup", cancel);
    root.ownerDocument.removeEventListener("pointercancel", cancel);
    root.removeEventListener("click", click, true);
  };
}
