import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  attachBackdropClose,
  isOutside,
  requestCloseDialog,
  supportsClosedBy,
} from "./dialog-dismiss.js";

const requestClose = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

let detach: (() => void) | undefined;
let deferBoxes = false;
let pendingBoxes: (() => void)[] = [];

beforeEach(() => {
  deferBoxes = false;
  pendingBoxes = [];
  Object.defineProperty(HTMLDialogElement.prototype, "requestClose", {
    configurable: true,
    value: requestClose,
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: close });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private readonly callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        const deliver = () =>
          this.callback(
            [
              {
                target,
                boundingClientRect: { left: 100, right: 300, top: 100, bottom: 300, height: 200 },
              } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver,
          );
        if (deferBoxes) pendingBoxes.push(deliver);
        else deliver();
      }
      unobserve() {}
      disconnect() {}
    },
  );
  requestClose.mockClear();
  close.mockClear();
});

afterEach(() => {
  detach?.();
  detach = undefined;
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
  delete (HTMLDialogElement.prototype as { closedBy?: unknown }).closedBy;
});

function mount(closedby = "any"): HTMLDialogElement {
  document.body.innerHTML = `<dialog open closedby="${closedby}" data-uiify-modal data-part="content" id="d"><p id="inside">Body</p></dialog>`;
  const dialog = document.getElementById("d") as HTMLDialogElement;
  dialog.getBoundingClientRect = () =>
    ({
      left: 100,
      right: 300,
      top: 100,
      bottom: 300,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      toJSON() {},
    }) as DOMRect;
  return dialog;
}

function press(target: Element, downAt: [number, number], upAt: [number, number] = downAt): void {
  target.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      clientX: downAt[0],
      clientY: downAt[1],
    }),
  );
  target.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: upAt[0],
      clientY: upAt[1],
    }),
  );
}

describe("isOutside", () => {
  const box = { left: 10, right: 20, top: 10, bottom: 20 };
  it("is true only outside the border box", () => {
    expect(isOutside(box, 15, 15)).toBe(false);
    expect(isOutside(box, 5, 15)).toBe(true);
    expect(isOutside(box, 25, 15)).toBe(true);
    expect(isOutside(box, 15, 5)).toBe(true);
    expect(isOutside(box, 15, 25)).toBe(true);
  });
});

describe("requestCloseDialog", () => {
  it("prefers requestClose so a cancel handler can veto", () => {
    const dialog = mount();
    requestCloseDialog(dialog);
    expect(requestClose).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
  });

  it("falls back to close() where requestClose is missing", () => {
    Object.defineProperty(HTMLDialogElement.prototype, "requestClose", {
      configurable: true,
      value: undefined,
    });
    const dialog = mount();
    requestCloseDialog(dialog);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe("attachBackdropClose", () => {
  it("waits for browser geometry when down and click arrive before delivery", () => {
    deferBoxes = true;
    const dialog = mount();
    detach = attachBackdropClose();
    press(dialog, [10, 10]);
    expect(dialog.open).toBe(true);
    pendingBoxes.forEach((deliver) => deliver());
    expect(dialog.open).toBe(false);
  });

  it("discards pending geometry after teardown", () => {
    deferBoxes = true;
    const dialog = mount();
    const cleanup = attachBackdropClose();
    press(dialog, [10, 10]);
    cleanup();
    pendingBoxes.forEach((deliver) => deliver());
    expect(dialog.open).toBe(true);
  });

  it("also closes drawers when both presses land on their backdrop", () => {
    const dialog = mount();
    dialog.removeAttribute("data-uiify-modal");
    dialog.setAttribute("data-uiify-drawer", "");
    detach = attachBackdropClose();
    dialog.dispatchEvent(
      new MouseEvent("pointerdown", { bubbles: true, clientX: 900, clientY: 900 }),
    );
    dialog.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 900, clientY: 900 }));
    expect(requestClose).toHaveBeenCalledOnce();
  });

  it("closes a backdrop press without synchronously measuring the dialog", () => {
    const dialog = mount();
    detach = attachBackdropClose();
    const read = vi.spyOn(dialog, "getBoundingClientRect");
    press(dialog, [10, 10]);
    expect(requestClose).toHaveBeenCalledTimes(1);
    expect(read).not.toHaveBeenCalled();
  });

  it("ignores clicks inside the dialog box and on its children", () => {
    const dialog = mount();
    detach = attachBackdropClose();
    press(dialog, [150, 150]);
    press(document.getElementById("inside")!, [10, 10]);
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("ignores dialogs that do not opt in to backdrop dismissal", () => {
    const dialog = mount("closerequest");
    detach = attachBackdropClose();
    press(dialog, [10, 10]);
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("ignores a press that started inside and was released on the backdrop", () => {
    const dialog = mount();
    detach = attachBackdropClose();
    press(dialog, [150, 150], [10, 10]);
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("ignores a click that another handler already cancelled", () => {
    const dialog = mount();
    dialog.addEventListener("click", (event) => event.preventDefault());
    detach = attachBackdropClose();
    press(dialog, [10, 10]);
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("attaches nothing where the engine has closedBy", () => {
    Object.defineProperty(HTMLDialogElement.prototype, "closedBy", {
      configurable: true,
      value: "any",
    });
    expect(supportsClosedBy()).toBe(true);
    const dialog = mount();
    detach = attachBackdropClose();
    press(dialog, [10, 10]);
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("stops listening after teardown", () => {
    const dialog = mount();
    attachBackdropClose()();
    press(dialog, [10, 10]);
    expect(requestClose).not.toHaveBeenCalled();
  });
});
