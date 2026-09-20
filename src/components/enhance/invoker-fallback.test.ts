import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { attachInvokerFallback, supportsInvokerCommands } from "./invoker-fallback.js";

// jsdom 29 implements neither invoker commands nor the dialog/popover methods,
// which makes it the perfect stand-in for a browser below the baseline.
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});
const requestClose = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});
const togglePopover = vi.fn();
const showPopover = vi.fn();
const hidePopover = vi.fn();

let detach: (() => void) | undefined;

beforeAll(() => {
  for (const [name, value] of [
    ["showModal", showModal],
    ["close", close],
    ["requestClose", requestClose],
  ] as const) {
    Object.defineProperty(HTMLDialogElement.prototype, name, { configurable: true, value });
  }
  for (const [name, value] of [
    ["togglePopover", togglePopover],
    ["showPopover", showPopover],
    ["hidePopover", hidePopover],
  ] as const) {
    Object.defineProperty(HTMLElement.prototype, name, { configurable: true, value });
  }
});

beforeEach(() => {
  for (const fn of [showModal, close, requestClose, togglePopover, showPopover, hidePopover]) {
    fn.mockClear();
  }
});

afterEach(() => {
  detach?.();
  detach = undefined;
  document.body.innerHTML = "";
});

function click(id: string): boolean {
  return document
    .getElementById(id)!
    .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("invoker fallback", () => {
  it("reports that jsdom lacks invoker commands", () => {
    expect(supportsInvokerCommands()).toBe(false);
  });

  it("runs dialog commands from delegated clicks", () => {
    document.body.innerHTML = `
      <button id="open" type="button" command="show-modal" commandfor="d">Open</button>
      <dialog id="d">
        <button id="request" type="button" command="request-close" commandfor="d">Close</button>
        <button id="close" type="button" command="close" commandfor="d">Close now</button>
      </dialog>
    `;
    detach = attachInvokerFallback();

    expect(click("open")).toBe(false);
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(click("request")).toBe(false);
    expect(requestClose).toHaveBeenCalledTimes(1);
    (document.getElementById("d") as HTMLDialogElement).open = true;
    expect(click("close")).toBe(false);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("copies the invoker's value into the dialog's returnValue on close and request-close", () => {
    document.body.innerHTML = `
      <dialog id="d">
        <button id="request" type="button" command="request-close" commandfor="d" value="cancel">Cancel</button>
        <button id="close" type="button" command="close" commandfor="d" value="confirm">Confirm</button>
      </dialog>
    `;
    detach = attachInvokerFallback();
    const dialog = document.getElementById("d") as HTMLDialogElement;

    dialog.open = true;
    click("request");
    expect(requestClose).toHaveBeenCalledWith("cancel");

    dialog.open = true;
    click("close");
    expect(close).toHaveBeenCalledWith("confirm");
  });

  it("runs popover commands from delegated clicks", () => {
    document.body.innerHTML = `
      <button id="toggle" type="button" command="toggle-popover" commandfor="p">Toggle</button>
      <button id="show" type="button" command="show-popover" commandfor="p">Show</button>
      <button id="hide" type="button" command="hide-popover" commandfor="p">Hide</button>
      <div id="p" popover="auto">Panel</div>
    `;
    detach = attachInvokerFallback();

    click("toggle");
    click("show");
    click("hide");
    expect(togglePopover).toHaveBeenCalledTimes(1);
    expect(showPopover).toHaveBeenCalledTimes(1);
    expect(hidePopover).toHaveBeenCalledTimes(1);
  });

  it("ignores disabled buttons, unknown commands, missing targets and cancelled clicks", () => {
    document.body.innerHTML = `
      <button id="disabled" type="button" disabled command="show-modal" commandfor="d">Open</button>
      <button id="unknown" type="button" command="--custom" commandfor="d">Custom</button>
      <button id="missing" type="button" command="show-modal" commandfor="nope">Missing</button>
      <button id="vetoed" type="button" command="show-modal" commandfor="d">Vetoed</button>
      <dialog id="d"></dialog>
    `;
    document.getElementById("vetoed")!.addEventListener("click", (event) => event.preventDefault());
    detach = attachInvokerFallback();

    click("disabled");
    click("unknown");
    click("missing");
    click("vetoed");
    expect(showModal).not.toHaveBeenCalled();
  });

  it("stops after teardown", () => {
    document.body.innerHTML = `
      <button id="open" type="button" command="show-modal" commandfor="d">Open</button>
      <dialog id="d"></dialog>
    `;
    const stop = attachInvokerFallback();
    stop();
    click("open");
    expect(showModal).not.toHaveBeenCalled();
  });

  it("attaches nothing when the engine implements invoker commands", () => {
    Object.defineProperty(HTMLButtonElement.prototype, "commandForElement", {
      configurable: true,
      value: null,
    });
    try {
      document.body.innerHTML = `
        <button id="open" type="button" command="show-modal" commandfor="d">Open</button>
        <dialog id="d"></dialog>
      `;
      detach = attachInvokerFallback();
      click("open");
      expect(showModal).not.toHaveBeenCalled();
    } finally {
      delete (HTMLButtonElement.prototype as { commandForElement?: unknown }).commandForElement;
    }
  });
});
