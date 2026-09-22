import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { MouseEvent, PointerEvent, ReactElement, SyntheticEvent } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Drawer } from "./Drawer.js";
import { DrawerPanel } from "./DrawerNative.js";

describe("DrawerPanel (native shell)", () => {
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

  it("renders native dialog semantics during SSR with no popover markup", () => {
    const markup = renderToStaticMarkup(
      <DrawerPanel
        id="settings"
        trigger="Open"
        title="Settings"
        description="Update preferences."
      />,
    );

    expect(markup).toContain('<dialog aria-describedby="settings-description"');
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
  it("only accepts Trigger's type as library-computed — the type system rejects a consumer override", () => {
    const elements: ReactElement[] = [
      <Drawer.Trigger key="ok">Open</Drawer.Trigger>,
      // @ts-expect-error -- the library owns type=button.
      <Drawer.Trigger key="type" type="submit">
        Open
      </Drawer.Trigger>,
    ];
    expect(elements).toHaveLength(2);
  });

  it("owns Trigger's aria-controls, aria-expanded, and aria-haspopup even when a consumer forces them through (TypeScript allows aria-* on any JSX element)", () => {
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
    expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
    expect(trigger.getAttribute("aria-controls")).not.toBe("not-the-content");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
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

  it("only accepts Content's id as library-computed — the type system rejects a consumer override", () => {
    const elements: ReactElement[] = [
      <Drawer.Content key="ok" />,
      // @ts-expect-error -- the library owns id.
      <Drawer.Content key="id" id="not-the-content" />,
    ];
    expect(elements).toHaveLength(2);
  });

  it("owns Content's aria-describedby/aria-labelledby/aria-modal/data-side/data-state/data-snap-enabled even when a consumer forces them through (TypeScript allows aria-*/data-* on any JSX element)", () => {
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
    expect(dialog.getAttribute("aria-labelledby")).not.toBe("bogus");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).not.toBe("bogus");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("data-side")).toBe("left");
    expect(dialog.getAttribute("data-state")).toBe("open");
    expect(dialog.hasAttribute("data-snap-enabled")).toBe(false);
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
