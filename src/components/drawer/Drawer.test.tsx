import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { MouseEvent, PointerEvent, ReactElement, SyntheticEvent } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Drawer } from "./Drawer.js";
import {
  DrawerNativeClose,
  DrawerNativeContent,
  DrawerNativeTrigger,
  DrawerPanel,
} from "./DrawerNative.js";

describe("DrawerPanel (native shell)", () => {
  it("provides native dismissal, size and complete dialog anatomy", () => {
    const { container } = render(
      <DrawerPanel
        id="anatomy"
        trigger="Open"
        title="Settings"
        size="lg"
        dismiss="any"
        footer={<span>Actions</span>}
      >
        <p>Content</p>
      </DrawerPanel>,
    );
    const dialog = container.querySelector("dialog");
    expect(dialog?.getAttribute("closedby")).toBe("any");
    expect(dialog?.getAttribute("data-size")).toBe("lg");
    for (const part of ["header", "title", "body", "footer", "grabber", "close"])
      expect(dialog?.querySelector(`[data-part="${part}"]`)).toBeTruthy();
    expect(dialog?.querySelector('[data-part="close"]')?.getAttribute("aria-label")).toBe("Close");
  });
  it("renders a show-modal trigger and a request-close invoker", () => {
    render(<DrawerPanel id="settings" side="right" trigger="Open" title="Settings" />);

    const dialog = screen.getByRole("dialog", { hidden: true });
    const trigger = screen.getByRole("button", { name: "Open" });
    const close = screen.getByRole("button", { name: "Close", hidden: true });
    expect(dialog.dataset.side).toBe("right");
    expect(trigger.getAttribute("command")).toBe("show-modal");
    expect(trigger.getAttribute("commandfor")).toBe("settings");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("data-uiify-button")).toBe("");
    expect(close.getAttribute("command")).toBe("request-close");
    expect(close.getAttribute("commandfor")).toBe("settings");
    expect(close.getAttribute("data-uiify-button")).toBe("");
    expect(close.getAttribute("data-variant")).toBe("ghost");
    expect(dialog.hasAttribute("popover")).toBe(false);
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("allows the close label to be localized while closeLabel keeps priority", () => {
    const { rerender } = render(
      <DrawerPanel id="settings" trigger="Open" title="Settings" labels={{ close: "إغلاق" }} />,
    );
    expect(screen.getByRole("button", { name: "إغلاق", hidden: true })).toBeTruthy();

    rerender(
      <DrawerPanel
        id="settings"
        trigger="Open"
        title="Settings"
        labels={{ close: "إغلاق" }}
        closeLabel="Dismiss"
      />,
    );
    expect(screen.getByRole("button", { name: "Dismiss", hidden: true })).toBeTruthy();
  });

  it("renders native dialog semantics during SSR with no popover markup", () => {
    const markup = renderToStaticMarkup(
      <DrawerPanel
        id="settings"
        trigger="Open"
        title="Settings"
        description="Update preferences."
      />,
    );

    expect(markup).toContain('aria-describedby="settings-description"');
    expect(markup).toContain('data-side="bottom"');
    expect(markup).toContain('command="show-modal"');
    expect(markup).toContain('command="request-close"');
    expect(markup).toContain('commandfor="settings"');
    expect(markup).not.toContain("popover=");
    expect(markup).not.toContain("toggle-popover");
    expect(markup).not.toContain("hide-popover");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<dialog open");
  });

  it("forwards props and refs to the root and each generated part", () => {
    const refs = {
      root: createRef<HTMLDivElement>(),
      trigger: createRef<HTMLButtonElement>(),
      content: createRef<HTMLDialogElement>(),
      grabber: createRef<HTMLDivElement>(),
      header: createRef<HTMLDivElement>(),
      title: createRef<HTMLHeadingElement>(),
      description: createRef<HTMLParagraphElement>(),
      close: createRef<HTMLButtonElement>(),
      body: createRef<HTMLDivElement>(),
      footer: createRef<HTMLDivElement>(),
    };
    render(
      <DrawerPanel
        className="root-class"
        data-testid="root"
        description="Description"
        footer="Actions"
        id="slot-test"
        ref={refs.root}
        side="left"
        slotProps={{
          trigger: { className: "trigger-class", "data-testid": "trigger", ref: refs.trigger },
          content: { className: "content-class", "data-testid": "content", ref: refs.content },
          grabber: { className: "grabber-class", "data-testid": "grabber", ref: refs.grabber },
          header: { className: "header-class", "data-testid": "header", ref: refs.header },
          title: { className: "title-class", "data-testid": "title", ref: refs.title },
          description: {
            className: "description-class",
            "data-testid": "description",
            ref: refs.description,
          },
          close: { className: "close-class", "data-testid": "close", ref: refs.close },
          body: { className: "body-class", "data-testid": "body", ref: refs.body },
          footer: { className: "footer-class", "data-testid": "footer", ref: refs.footer },
        }}
        title="Drawer title"
        trigger="Open"
      >
        Body
      </DrawerPanel>,
    );

    const slotExpectations: readonly [keyof typeof refs, string, string][] = [
      ["root", "root", "root-class"],
      ["trigger", "trigger", "trigger-class"],
      ["content", "content", "content-class"],
      ["grabber", "grabber", "grabber-class"],
      ["header", "header", "header-class"],
      ["title", "title", "title-class"],
      ["description", "description", "description-class"],
      ["close", "close", "close-class"],
      ["body", "body", "body-class"],
      ["footer", "footer", "footer-class"],
    ];
    for (const [slot, testId, className] of slotExpectations) {
      expect(screen.getByTestId(testId).getAttribute("class")).toContain(className);
      expect(refs[slot].current).toBe(screen.getByTestId(testId));
    }
    expect(screen.getByTestId("root").getAttribute("data-side")).toBe("left");
    expect(screen.getByTestId("trigger").getAttribute("commandfor")).toBe("slot-test");
    expect(screen.getByTestId("content").getAttribute("aria-labelledby")).toBe("slot-test-title");
    expect(screen.getByTestId("content").getAttribute("aria-describedby")).toBe(
      "slot-test-description",
    );
    expect(screen.getByTestId("title").id).toBe("slot-test-title");
    expect(screen.getByTestId("description").id).toBe("slot-test-description");
    expect(screen.getByTestId("close").getAttribute("aria-label")).toBe("Close");
  });

  it("lets native shell slots replace defaults", () => {
    render(
      <DrawerPanel
        id="drawer"
        trigger="Open"
        title="Settings"
        description="Description"
        data-testid="root"
        data-side="right"
        data-part="custom-root"
        slotProps={{
          trigger: { type: "submit", command: "request-close", commandfor: "other" },
          content: { closedby: "none", "data-side": "left", "aria-labelledby": "custom-title" },
          title: { id: "custom-title" },
          description: { id: "custom-description" },
          grabber: { "aria-hidden": false },
          close: { "aria-label": "Dismiss", type: "submit", command: "show-modal" },
        }}
      />,
    );
    expect(screen.getByTestId("root").getAttribute("data-side")).toBe("right");
    expect(screen.getByTestId("root").getAttribute("data-part")).toBe("custom-root");
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.getAttribute("type")).toBe("submit");
    expect(trigger.getAttribute("command")).toBe("request-close");
    expect(trigger.getAttribute("commandfor")).toBe("other");
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("closedby")).toBe("none");
    expect(dialog.getAttribute("data-side")).toBe("left");
    expect(dialog.getAttribute("aria-labelledby")).toBe("custom-title");
    expect(
      screen.getByRole("button", { name: "Dismiss", hidden: true }).getAttribute("command"),
    ).toBe("show-modal");
  });

  it("lets direct native aliases replace defaults and keeps refs", () => {
    const ref = createRef<HTMLDialogElement>();
    render(
      <>
        <DrawerNativeTrigger
          target="drawer"
          command="request-close"
          commandfor="other"
          type="submit"
        >
          Open
        </DrawerNativeTrigger>
        <DrawerNativeContent id="drawer" closedby="none" data-part="custom" ref={ref}>
          Body
        </DrawerNativeContent>
        <DrawerNativeClose target="drawer" type="submit">
          Close
        </DrawerNativeClose>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.getAttribute("type")).toBe("submit");
    expect(trigger.getAttribute("command")).toBe("request-close");
    expect(trigger.getAttribute("commandfor")).toBe("other");
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBe(ref.current);
    expect(dialog.getAttribute("closedby")).toBe("none");
    expect(dialog.getAttribute("data-part")).toBe("custom");
    expect(screen.getByRole("button", { name: "Close" }).getAttribute("type")).toBe("submit");
  });
});

// jsdom 29 implements neither showModal()/close() modality nor requestClose();
// stub the native methods so the compound's calls are observable. Real
// modality is covered by e2e/specs/no-js.spec.ts in three engines.
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});
const requestClose = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: showModal,
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: close });
  Object.defineProperty(HTMLDialogElement.prototype, "requestClose", {
    configurable: true,
    value: requestClose,
  });
});

beforeEach(() => {
  showModal.mockClear();
  close.mockClear();
  requestClose.mockClear();
});

describe("Drawer compound — props ownership", () => {
  it("accepts native invoker props", () => {
    const elements: ReactElement[] = [
      <DrawerNativeTrigger key="safe" target="dialog">
        Open
      </DrawerNativeTrigger>,
      <DrawerNativeClose key="unsafe" target="dialog" type="submit" />,
    ];
    expect(elements).toHaveLength(2);
  });

  it("accepts the native Trigger type", () => {
    const elements: ReactElement[] = [
      <Drawer.Trigger key="ok">Open</Drawer.Trigger>,
      <Drawer.Trigger key="type" type="submit">
        Open
      </Drawer.Trigger>,
    ];
    expect(elements).toHaveLength(2);
  });

  it("lets consumer ARIA override Trigger defaults", () => {
    render(
      <Drawer.Root>
        <Drawer.Trigger aria-controls="not-the-content" aria-expanded aria-haspopup="menu">
          Open
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBeTruthy();
    expect(trigger.getAttribute("aria-controls")).toBe("not-the-content");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
  });

  it("renders Trigger's owned type/aria-controls/aria-expanded/aria-haspopup and syncs aria-expanded with open state", () => {
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("lets a consumer onClick veto Trigger's open action (policy #1-style consumer-first veto)", () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <Drawer.Root onOpenChange={onOpenChange}>
        <Drawer.Trigger onClick={onClick}>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("opens normally when the consumer's onClick does not veto", () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn();
    render(
      <Drawer.Root onOpenChange={onOpenChange}>
        <Drawer.Trigger onClick={onClick}>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: "trigger-press" }),
    );
  });

  it("still merges Trigger's internal ref with a consumer ref (T6 — ref ownership unchanged)", () => {
    const consumerRef = createRef<HTMLButtonElement>();
    render(
      <Drawer.Root>
        <Drawer.Trigger ref={consumerRef}>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(consumerRef.current).toBe(screen.getByRole("button", { name: "Open" }));
  });

  it("accepts a native Content id", () => {
    const elements: ReactElement[] = [
      <Drawer.Content key="ok" />,
      <Drawer.Content key="id" id="not-the-content" />,
    ];
    expect(elements).toHaveLength(2);
  });

  it("lets consumer Content attributes override defaults", () => {
    render(
      <Drawer.Root defaultOpen side="left">
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content
          aria-describedby="bogus"
          aria-labelledby="bogus"
          aria-modal={false}
          data-side="right"
          data-state="bogus"
          data-snap-enabled="bogus"
        >
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("aria-labelledby")).toBe("bogus");
    expect(dialog.getAttribute("aria-describedby")).toBe("bogus");
    expect(dialog.getAttribute("aria-modal")).toBe("false");
    expect(dialog.getAttribute("data-side")).toBe("right");
    expect(dialog.getAttribute("data-state")).toBe("bogus");
    expect(dialog.getAttribute("data-snap-enabled")).toBe("bogus");
  });

  it("joins a consumer style with the snap-point CSS vars instead of replacing it", () => {
    let resizeCallback: ((entries: Array<{ contentRect: DOMRectReadOnly }>) => void) | null = null;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: (entries: Array<{ contentRect: DOMRectReadOnly }>) => void) {
          resizeCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    try {
      const { container } = render(
        <Drawer.Root defaultOpen side="bottom" snapPoints={[0.5, 1]}>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content style={{ color: "red" }}>
            <Drawer.Title>Settings</Drawer.Title>
            <Drawer.Handle className="handle" />
          </Drawer.Content>
        </Drawer.Root>,
      );
      act(() => {
        resizeCallback?.([{ contentRect: { height: 200, width: 200 } as DOMRectReadOnly }]);
      });
      const handle = container.querySelector(".handle") as HTMLElement;
      stubPointerCapture(handle);
      fireEvent.pointerDown(handle, { pointerId: 1, clientY: 10 });
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: 60 });

      const dialog = screen.getByRole("dialog", { hidden: true });
      expect(dialog.style.getPropertyValue("--uiify-drawer-transform")).not.toBe("");
      expect(dialog.style.color).toBe("red");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("forwards handle pointer events when snap-point dragging is disabled", () => {
    const handlers = {
      onPointerDown: vi.fn(),
      onPointerMove: vi.fn(),
      onPointerUp: vi.fn(),
      onPointerCancel: vi.fn(),
    };
    const { container } = render(
      <Drawer.Root>
        <Drawer.Content>
          <Drawer.Handle {...handlers} />
        </Drawer.Content>
      </Drawer.Root>,
    );
    const handle = container.querySelector('[data-part="handle"]');
    expect(handle).not.toBeNull();
    fireEvent.pointerDown(handle as HTMLElement, { pointerId: 1 });
    fireEvent.pointerMove(handle as HTMLElement, { pointerId: 1 });
    fireEvent.pointerUp(handle as HTMLElement, { pointerId: 1 });
    fireEvent.pointerCancel(handle as HTMLElement, { pointerId: 1 });
    expect(handlers.onPointerDown).toHaveBeenCalledOnce();
    expect(handlers.onPointerMove).toHaveBeenCalledOnce();
    expect(handlers.onPointerUp).toHaveBeenCalledOnce();
    expect(handlers.onPointerCancel).toHaveBeenCalledOnce();
  });

  it("lets a consumer onCancel veto Content's close-reason bookkeeping", () => {
    const onOpenChange = vi.fn();
    const onCancel = vi.fn((event: SyntheticEvent<HTMLDialogElement>) => event.preventDefault());
    render(
      <Drawer.Root defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content onCancel={onCancel}>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });

  it("runs Content's default close bookkeeping when the consumer's onCancel does not veto", () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer.Root defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content onCancel={() => {}}>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: "escape-key" }),
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it("lets a consumer onClose veto Content's open-state sync", () => {
    const onOpenChange = vi.fn();
    const onClose = vi.fn((event: SyntheticEvent<HTMLDialogElement>) => event.preventDefault());
    render(
      <Drawer.Root defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content onClose={onClose}>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent(dialog, new Event("close", { bubbles: false, cancelable: true }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("still merges Content's internal refs with a consumer ref (T6 — ref ownership unchanged)", () => {
    const consumerRef = createRef<HTMLDialogElement>();
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content ref={consumerRef}>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(consumerRef.current).toBe(screen.getByRole("dialog", { hidden: true }));
  });

  it("lets a consumer onClick veto Close's close() call", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Close onClick={(event) => event.preventDefault()}>Dismiss</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(close).not.toHaveBeenCalled();
    expect(requestClose).not.toHaveBeenCalled();
  });

  it("closes normally when the consumer's onClick does not veto", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Close onClick={() => {}}>Dismiss</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(close.mock.calls.length + requestClose.mock.calls.length).toBeGreaterThan(0);
  });

  function stubPointerCapture(element: Element) {
    const setPointerCapture = vi.fn();
    const hasPointerCapture = vi.fn(() => false);
    const releasePointerCapture = vi.fn();
    Object.assign(element, { setPointerCapture, hasPointerCapture, releasePointerCapture });
    return { setPointerCapture, hasPointerCapture, releasePointerCapture };
  }

  it("lets a consumer onPointerDown veto Handle's drag start (policy #6: dismiss/drag veto)", () => {
    const onPointerDown = vi.fn((event: PointerEvent<HTMLDivElement>) => event.preventDefault());
    const { container } = render(
      <Drawer.Root snapPoints={[0.5, 1]}>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Handle className="handle" onPointerDown={onPointerDown} />
        </Drawer.Content>
      </Drawer.Root>,
    );
    const handle = container.querySelector(".handle") as HTMLElement;
    const { setPointerCapture } = stubPointerCapture(handle);
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 10 });
    expect(onPointerDown).toHaveBeenCalledOnce();
    expect(handle.hasAttribute("data-dragging")).toBe(false);
    expect(setPointerCapture).not.toHaveBeenCalled();
  });

  it("starts dragging when the consumer's onPointerDown does not veto", () => {
    const { container } = render(
      <Drawer.Root snapPoints={[0.5, 1]}>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Handle className="handle" onPointerDown={() => {}} />
        </Drawer.Content>
      </Drawer.Root>,
    );
    const handle = container.querySelector(".handle") as HTMLElement;
    const { setPointerCapture } = stubPointerCapture(handle);
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 10 });
    expect(handle.getAttribute("data-dragging")).toBe("");
    expect(setPointerCapture).toHaveBeenCalledOnce();
  });
});
