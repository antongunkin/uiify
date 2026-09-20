import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// jsdom does not implement the Popover API at all (no showPopover/hidePopover,
// and `.matches(":popover-open")` always reports false) — stub it the same
// way components/enhance/invoker-fallback.test.ts does for the same reason,
// so the wiring (does showPopover get called when the content opens?) is
// actually observable instead of silently swallowed by the try/catch that
// protects against a disconnected node in real browsers.
const showPopover = vi.fn();
const hidePopover = vi.fn();

beforeAll(() => {
  for (const [name, value] of [
    ["showPopover", showPopover],
    ["hidePopover", hidePopover],
  ] as const) {
    Object.defineProperty(HTMLElement.prototype, name, { configurable: true, value });
  }
});

async function loadClientTooltip() {
  return import("./Tooltip.js");
}

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    showPopover.mockClear();
    hidePopover.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens after delayDuration on hover and immediately on focus", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider delayDuration={300}>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    const trigger = screen.getByRole("button", { name: "Help" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("closed");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("open");
    expect(trigger.getAttribute("aria-describedby")).toBe(
      screen.getByRole("tooltip", { hidden: true }).id,
    );

    fireEvent.blur(trigger);
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("open");
  });

  it("opens the second tooltip immediately within skipDelayDuration", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider delayDuration={300} skipDelayDuration={300}>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>First</ClientTooltip.Trigger>
          <ClientTooltip.Content>First hint</ClientTooltip.Content>
        </ClientTooltip.Root>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>Second</ClientTooltip.Trigger>
          <ClientTooltip.Content>Second hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    fireEvent.pointerEnter(screen.getByRole("button", { name: "First" }), {
      pointerType: "mouse",
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => {
      fireEvent.pointerLeave(screen.getByRole("button", { name: "First" }), {
        pointerType: "mouse",
      });
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      fireEvent.pointerEnter(screen.getByRole("button", { name: "Second" }), {
        pointerType: "mouse",
      });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByText("Second hint").getAttribute("data-state")).toBe("open");
  });

  it("keeps the tooltip open while moving from trigger to content", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider delayDuration={0}>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    const trigger = screen.getByRole("button", { name: "Help" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => {
      fireEvent.pointerEnter(tooltip, { pointerType: "mouse" });
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(tooltip.getAttribute("data-state")).toBe("open");
  });

  it("closes after the grace period when the pointer leaves the trigger and never enters the content", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider delayDuration={0}>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    const trigger = screen.getByRole("button", { name: "Help" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    expect(tooltip.getAttribute("data-state")).toBe("open");
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(tooltip.getAttribute("data-state")).toBe("closed");
  });

  it("closes on Escape and does not expose a tab stop on content", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider delayDuration={0}>
        <ClientTooltip.Root defaultOpen>
          <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    expect(tooltip.getAttribute("tabindex")).toBeNull();

    fireEvent.keyDown(screen.getByRole("button", { name: "Help" }), { key: "Escape" });
    expect(tooltip.getAttribute("data-state")).toBe("closed");
  });

  it("invokes a consumer trigger handler exactly once", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    const onPointerEnter = vi.fn();
    render(
      <ClientTooltip.Provider delayDuration={0}>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger onPointerEnter={onPointerEnter}>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    fireEvent.pointerEnter(screen.getByRole("button", { name: "Help" }), {
      pointerType: "mouse",
    });
    expect(onPointerEnter).toHaveBeenCalledTimes(1);
  });

  it("calls showPopover when the content opens", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider delayDuration={0}>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );

    expect(showPopover).not.toHaveBeenCalled();
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Help" }), {
      pointerType: "mouse",
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(showPopover).toHaveBeenCalledTimes(1);
  });

  it("carries popover='manual' on the content regardless of open state", async () => {
    const { Tooltip: ClientTooltip } = await loadClientTooltip();

    render(
      <ClientTooltip.Provider>
        <ClientTooltip.Root>
          <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
          <ClientTooltip.Content>Hint</ClientTooltip.Content>
        </ClientTooltip.Root>
      </ClientTooltip.Provider>,
    );
    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("popover")).toBe("manual");
  });

  describe("client variant (Tooltip.tsx) props ownership", () => {
    it("owns TooltipTrigger's data-anchor and does not let a consumer override it", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root>
            <ClientTooltip.Trigger data-anchor="consumer-anchor">Help</ClientTooltip.Trigger>
            <ClientTooltip.Content>Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      const trigger = screen.getByRole("button", { name: "Help" });
      expect(trigger.getAttribute("data-anchor")).toBeTruthy();
      expect(trigger.getAttribute("data-anchor")).not.toBe("consumer-anchor");
    });

    it("owns TooltipTrigger's aria-describedby/type and does not let a consumer override them", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root defaultOpen>
            <ClientTooltip.Trigger type="submit" aria-describedby="consumer-describedby">
              Help
            </ClientTooltip.Trigger>
            <ClientTooltip.Content>Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      const trigger = screen.getByRole("button", { name: "Help" });
      expect(trigger.getAttribute("type")).toBe("button");
      expect(trigger.getAttribute("aria-describedby")).not.toBe("consumer-describedby");
      expect(trigger.getAttribute("aria-describedby")).toBe(
        screen.getByRole("tooltip", { hidden: true }).id,
      );
    });

    it("lets a consumer onPointerEnter veto the open intent on the trigger (policy #5)", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider delayDuration={0}>
          <ClientTooltip.Root>
            <ClientTooltip.Trigger onPointerEnter={(event) => event.preventDefault()}>
              Help
            </ClientTooltip.Trigger>
            <ClientTooltip.Content>Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      fireEvent.pointerEnter(screen.getByRole("button", { name: "Help" }), {
        pointerType: "mouse",
      });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe(
        "closed",
      );
    });

    it("lets a consumer onFocus veto the open intent on the trigger (policy #5)", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root>
            <ClientTooltip.Trigger onFocus={(event) => event.preventDefault()}>
              Help
            </ClientTooltip.Trigger>
            <ClientTooltip.Content>Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      fireEvent.focus(screen.getByRole("button", { name: "Help" }));
      expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe(
        "closed",
      );
    });

    it("lets a consumer onKeyDown veto Escape-close on the trigger (policy #5)", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root defaultOpen>
            <ClientTooltip.Trigger onKeyDown={(event) => event.preventDefault()}>
              Help
            </ClientTooltip.Trigger>
            <ClientTooltip.Content>Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      fireEvent.keyDown(screen.getByRole("button", { name: "Help" }), { key: "Escape" });
      expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("open");
    });

    it("owns TooltipContent's positioning data-* attributes and does not let a consumer override them", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root defaultOpen>
            <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
            <ClientTooltip.Content
              align="end"
              side="top"
              data-align="consumer-align"
              data-side="consumer-side"
              data-anchor="consumer-anchor"
              data-positioning="consumer-positioning"
            >
              Hint
            </ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip.getAttribute("data-align")).toBe("end");
      expect(tooltip.getAttribute("data-side")).toBe("top");
      expect(tooltip.getAttribute("data-positioning")).toBe("native");
      expect(tooltip.getAttribute("data-anchor")).not.toBe("consumer-anchor");
    });

    it("owns TooltipContent's popover/role/data-state and does not let a consumer override them", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root>
            <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
            <ClientTooltip.Content popover="auto" role="note" data-state="consumer-state">
              Hint
            </ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip.getAttribute("popover")).toBe("manual");
      expect(tooltip.getAttribute("role")).toBe("tooltip");
      expect(tooltip.getAttribute("data-state")).toBe("closed");
    });

    it("lets a consumer onPointerLeave veto the close intent on the content (policy #5)", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root defaultOpen>
            <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
            <ClientTooltip.Content onPointerLeave={(event) => event.preventDefault()}>
              Hint
            </ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      fireEvent.pointerLeave(screen.getByRole("tooltip", { hidden: true }), {
        pointerType: "mouse",
      });
      expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("data-state")).toBe("open");
    });

    it("prefers a consumer-supplied non-empty id on TooltipContent over the generated one", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root defaultOpen>
            <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
            <ClientTooltip.Content id="consumer-tooltip-id">Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      expect(screen.getByRole("tooltip", { hidden: true }).id).toBe("consumer-tooltip-id");
    });

    it("falls back to a generated id on TooltipContent when the consumer supplies an empty string", async () => {
      const { Tooltip: ClientTooltip } = await loadClientTooltip();
      render(
        <ClientTooltip.Provider>
          <ClientTooltip.Root defaultOpen>
            <ClientTooltip.Trigger>Help</ClientTooltip.Trigger>
            <ClientTooltip.Content id="">Hint</ClientTooltip.Content>
          </ClientTooltip.Root>
        </ClientTooltip.Provider>,
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip.id.length).toBeGreaterThan(0);
    });
  });
});
