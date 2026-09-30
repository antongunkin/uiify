import { readBox } from "./internal/read-box.js";

/** The modal dialog surface `ModalContent` renders. */
export const MODAL_DIALOG = 'dialog[data-uiify-modal][data-part="content"]';

interface Box {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

/** True when the point lies outside the border box, that is on the dialog's `::backdrop`. */
export function isOutside(box: Box, x: number, y: number): boolean {
  return x < box.left || x > box.right || y < box.top || y > box.bottom;
}

/** `requestClose()` lets a `cancel` handler veto; engines without it get a plain `close()`. */
export function requestCloseDialog(dialog: HTMLDialogElement, returnValue?: string): void {
  const { requestClose } = dialog as HTMLDialogElement & {
    requestClose?: (value?: string) => void;
  };
  if (typeof requestClose === "function") requestClose.call(dialog, returnValue);
  else dialog.close(returnValue);
}

/** Chrome 134+ and Firefox 141+ implement `closedby`; Safari does not (iOS 27). */
export function supportsClosedBy(view: Window = window): boolean {
  const { HTMLDialogElement: DialogCtor } = view as unknown as typeof globalThis;
  return "closedBy" in DialogCtor.prototype;
}

/**
 * Backdrop-tap dismissal for engines without `closedby`. The markup already says
 * `closedby="any"`; where the browser cannot act on it, this closes the dialog when a press
 * and its click both land on the backdrop. Attaches nothing where `closedBy` exists.
 */
export function attachBackdropClose(doc: Document = document): () => void {
  if (supportsClosedBy(doc.defaultView ?? window)) return () => {};

  let pressed: HTMLDialogElement | null = null;

  const backdropTarget = (event: MouseEvent): HTMLDialogElement | null => {
    const dialog = event.target;
    if (!(dialog instanceof HTMLDialogElement) || !dialog.matches(MODAL_DIALOG)) return null;
    if (dialog.getAttribute("closedby") !== "any") return null;
    const box = readBox(dialog);
    return isOutside(box, event.clientX, event.clientY) ? dialog : null;
  };

  const onPointerDown = (event: PointerEvent): void => {
    pressed = backdropTarget(event);
  };

  const onClick = (event: MouseEvent): void => {
    const start = pressed;
    pressed = null;
    if (event.defaultPrevented || !start || backdropTarget(event) !== start) return;
    requestCloseDialog(start);
  };

  doc.addEventListener("pointerdown", onPointerDown);
  doc.addEventListener("click", onClick);
  return () => {
    doc.removeEventListener("pointerdown", onPointerDown);
    doc.removeEventListener("click", onClick);
  };
}
