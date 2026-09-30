import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { attachSheetSwipe } from "./sheet-swipe.js";

const requestClose = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});
const keepOpen = vi.fn();

let detach: (() => void) | undefined;
let clock = 0;
let sheetMatches = true;

beforeEach(() => {
  clock = 0;
  sheetMatches = true;
  Object.defineProperty(HTMLDialogElement.prototype, "requestClose", {
    configurable: true,
    value: requestClose,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => ({ matches: sheetMatches })),
  });
  Object.defineProperty(Element.prototype, "setPointerCapture", {
    configurable: true,
    value: vi.fn(),
  });
  requestClose.mockClear();
  keepOpen.mockClear();
});

afterEach(() => {
  detach?.();
  detach = undefined;
  document.body.innerHTML = "";
});

function mountSheet(attributes = ""): HTMLDialogElement {
  document.body.innerHTML = `<dialog open closedby="any" data-uiify-modal data-part="content" id="d" ${attributes}>
    <div data-uiify-modal data-part="grabber" id="grabber"></div>
    <div data-uiify-modal data-part="header" id="header"><h2 id="title">Title</h2><button id="x" data-part="close">x</button></div>
    <div data-uiify-modal data-part="body" id="body">Body <div data-part="header" id="card-header">Card</div></div>
  </dialog>`;
  const dialog = document.getElementById("d") as HTMLDialogElement;
  dialog.getBoundingClientRect = () =>
    ({
      left: 0,
      right: 400,
      top: 200,
      bottom: 800,
      width: 400,
      height: 600,
      x: 0,
      y: 200,
      toJSON() {},
    }) as DOMRect;
  return dialog;
}

function pointer(
  type: string,
  target: Element,
  y: number,
  at?: number,
  init: PointerEventInit = {},
): void {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: 200,
    clientY: y,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
    ...init,
  });
  Object.defineProperty(event, "timeStamp", { value: at ?? (clock += 16) });
  target.dispatchEvent(event);
}

const offset = (dialog: HTMLElement): string =>
  dialog.style.getPropertyValue("--uiify-sheet-offset");

describe("attachSheetSwipe", () => {
  it("follows the finger from the header and closes past a quarter of the sheet height", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 320, 4000);
    expect(dialog.hasAttribute("data-dragging")).toBe(true);
    expect(offset(dialog)).toBe("20px");

    pointer("pointermove", title, 500, 8000);
    expect(offset(dialog)).toBe("200px");
    pointer("pointerup", title, 500, 8001);

    expect(requestClose).toHaveBeenCalledTimes(1);
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(offset(dialog)).toBe("");
  });

  it("springs back when released below the threshold at low speed", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const grabber = document.getElementById("grabber")!;

    pointer("pointerdown", grabber, 300, 0);
    pointer("pointermove", grabber, 350, 5000);
    pointer("pointerup", grabber, 350, 5001);

    expect(requestClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(offset(dialog)).toBe("");
  });

  it("closes on a fast fling even when the distance is short", () => {
    mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 340, 20);
    pointer("pointerup", title, 340, 21);

    expect(requestClose).toHaveBeenCalledTimes(1);
  });

  it("starts from the backdrop above the sheet", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();

    pointer("pointerdown", dialog, 100, 0);
    pointer("pointermove", dialog, 400, 9000);
    pointer("pointerup", dialog, 400, 9001);

    expect(requestClose).toHaveBeenCalledTimes(1);
  });

  it("puts the position back to CSS when a cancel handler vetoes the close", () => {
    const dialog = mountSheet();
    Object.defineProperty(dialog, "requestClose", { configurable: true, value: keepOpen });
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 600, 9000);
    pointer("pointerup", title, 600, 9001);

    expect(keepOpen).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(true);
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(offset(dialog)).toBe("");
  });

  it.each([
    ["the body", "body"],
    ["the close button", "x"],
  ])("does not start from %s", (_name, id) => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const target = document.getElementById(id)!;

    pointer("pointerdown", target, 300, 0);
    pointer("pointermove", target, 600, 9000);
    pointer("pointerup", target, 600, 9001);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("does not start from the dialog's own padding inside the box", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();

    pointer("pointerdown", dialog, 300, 0);
    pointer("pointermove", dialog, 600, 9000);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });

  it.each([
    ["a full-screen modal", 'data-size="full"'],
    ["closedby=none", 'closedby="none"'],
  ])("does not start on %s", (_name, attributes) => {
    const dialog = mountSheet(attributes);
    if (attributes.startsWith("closedby")) dialog.setAttribute("closedby", "none");
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 600, 9000);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });

  it("does not start above the sheet breakpoint", () => {
    sheetMatches = false;
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 600, 9000);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });

  it("leaves a tap alone: no drag and the click still reaches its handlers", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;
    const clicked = vi.fn();
    document.addEventListener("click", clicked);

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 303, 10);
    pointer("pointerup", title, 303, 11);
    title.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    document.removeEventListener("click", clicked);
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it("swallows the click that ends a drag", () => {
    mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;
    const clicked = vi.fn();
    document.addEventListener("click", clicked);

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 340, 6000);
    pointer("pointerup", title, 340, 6001);
    title.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    document.removeEventListener("click", clicked);
    expect(clicked).not.toHaveBeenCalled();
  });

  it("cancels the drag without closing when the browser takes the pointer", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 600, 9000);
    pointer("pointercancel", title, 600, 9001);

    expect(requestClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });

  it("ignores a stale fling speed when the finger paused before lifting", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 340, 20);
    pointer("pointerup", title, 340, 2020);

    expect(requestClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(offset(dialog)).toBe("");
  });

  it("still closes on a fling released right after the last move", () => {
    mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 340, 20);
    pointer("pointerup", title, 340, 60);

    expect(requestClose).toHaveBeenCalledTimes(1);
  });

  it("puts the sheet back to CSS when torn down mid-drag", () => {
    const dialog = mountSheet();
    const teardown = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 340, 6000);
    expect(dialog.hasAttribute("data-dragging")).toBe(true);
    teardown();

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(offset(dialog)).toBe("");
  });

  it("does not request a close when the dialog was closed by other means mid-drag", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 600, 9000);
    dialog.open = false;
    pointer("pointerup", title, 600, 9001);

    expect(requestClose).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("data-dragging")).toBe(false);
    expect(offset(dialog)).toBe("");
  });

  it("drags only the modal the header belongs to, not an outer one", () => {
    const outer = mountSheet();
    outer.insertAdjacentHTML(
      "beforeend",
      `<dialog open closedby="any" data-uiify-modal data-part="content" id="inner">
        <div data-uiify-modal data-part="header" id="inner-header"><h2 id="inner-title">Inner</h2></div>
      </dialog>`,
    );
    const inner = document.getElementById("inner") as HTMLDialogElement;
    detach = attachSheetSwipe();
    const title = document.getElementById("inner-title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 340, 6000);

    expect(inner.hasAttribute("data-dragging")).toBe(true);
    expect(outer.hasAttribute("data-dragging")).toBe(false);
  });

  it("does not start from a header part that is not the modal's own", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const cardHeader = document.getElementById("card-header")!;

    pointer("pointerdown", cardHeader, 400, 0);
    pointer("pointermove", cardHeader, 600, 6000);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });

  it("ignores a mouse press with a button other than the primary one", () => {
    const dialog = mountSheet();
    detach = attachSheetSwipe();
    const title = document.getElementById("title")!;
    const rightButton = { button: 2, pointerType: "mouse" };

    pointer("pointerdown", title, 300, 0, rightButton);
    pointer("pointermove", title, 500, 6000, rightButton);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });

  it("does not read the dialog's box for a press in the body", () => {
    const dialog = mountSheet();
    const read = vi.spyOn(dialog, "getBoundingClientRect");
    detach = attachSheetSwipe();

    pointer("pointerdown", document.getElementById("body")!, 500, 0);
    expect(read).not.toHaveBeenCalled();

    pointer("pointerup", document.getElementById("body")!, 500, 100);
    pointer("pointerdown", document.getElementById("title")!, 300, 200);
    expect(read).toHaveBeenCalledTimes(1);
  });

  it("stops listening after teardown", () => {
    const dialog = mountSheet();
    attachSheetSwipe()();
    const title = document.getElementById("title")!;

    pointer("pointerdown", title, 300, 0);
    pointer("pointermove", title, 600, 9000);

    expect(dialog.hasAttribute("data-dragging")).toBe(false);
  });
});
