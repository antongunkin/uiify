import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { HoverCard } from "./HoverCard.js";

// jsdom does not implement the Popover API — stub it the same way
// components/enhance/invoker-fallback.test.ts and tooltip/Tooltip.test.tsx do,
// so showPopover's wiring is observable instead of silently caught.
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

beforeEach(() => {
  showPopover.mockClear();
  hidePopover.mockClear();
});

async function loadClientHoverCard() {
  return import("./HoverCard.js");
}

function renderHoverCard(
  props: {
    closeDelay?: number;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    openDelay?: number;
  } = {},
) {
  return render(
    <HoverCard.Root {...props}>
      <HoverCard.Trigger>Profile</HoverCard.Trigger>
      <HoverCard.Content side="top" align="start">
        Extra details
      </HoverCard.Content>
    </HoverCard.Root>,
  );
}

describe("HoverCard", () => {
  it("renders the structural shell from the main export", () => {
    renderHoverCard();
    const trigger = screen.getByRole("button", { name: "Profile" });
    const content = screen.getByText("Extra details");
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens after openDelay on hover", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    vi.useFakeTimers();
    render(
      <ClientHoverCard.Root openDelay={700}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content side="top" align="start">
          Extra details
        </ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(699);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
    vi.useRealTimers();
  });

  it("closes after closeDelay when pointer leaves", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    vi.useFakeTimers();
    render(
      <ClientHoverCard.Root openDelay={0} closeDelay={300} defaultOpen>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content side="top" align="start">
          Extra details
        </ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
    vi.useRealTimers();
  });

  it("cancels close when pointer moves into the card", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    vi.useFakeTimers();
    render(
      <ClientHoverCard.Root openDelay={0} closeDelay={300} defaultOpen>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content side="top" align="start">
          Extra details
        </ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    const content = screen.getByText("Extra details");
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    fireEvent.pointerEnter(content, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(content.getAttribute("data-state")).toBe("open");
    vi.useRealTimers();
  });

  it("opens on focus without waiting for openDelay", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    render(
      <ClientHoverCard.Root openDelay={700}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content side="top" align="start">
          Extra details
        </ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    fireEvent.focus(screen.getByRole("button", { name: "Profile" }));
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
  });

  it("lets a consumer onFocus veto the open intent (policy #5: pointer-intent open/close veto)", () => {
    render(
      <HoverCard.Root>
        <HoverCard.Trigger onFocus={(event) => event.preventDefault()}>Profile</HoverCard.Trigger>
        <HoverCard.Content>Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    fireEvent.focus(screen.getByRole("button", { name: "Profile" }));
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
  });

  it("exposes placement data attributes", () => {
    renderHoverCard({ defaultOpen: true });
    const content = screen.getByText("Extra details");
    expect(content.getAttribute("data-side")).toBe("top");
    expect(content.getAttribute("data-align")).toBe("start");
  });

  it("supports controlled open state", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    const onOpenChange = vi.fn();
    const { rerender } = render(
      <ClientHoverCard.Root open={false} onOpenChange={onOpenChange}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content side="top" align="start">
          Extra details
        </ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
    rerender(
      <ClientHoverCard.Root open onOpenChange={onOpenChange}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content>Extra details</ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
  });

  it("uses the default openDelay (700) and closeDelay (300) when neither is specified", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    vi.useFakeTimers();
    render(
      <ClientHoverCard.Root>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content>Extra details</ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(699);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");

    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
    vi.useRealTimers();
  });

  it("uses an updated openDelay after a re-render with new props", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    vi.useFakeTimers();
    const { rerender } = render(
      <ClientHoverCard.Root openDelay={700}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content>Extra details</ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    rerender(
      <ClientHoverCard.Root openDelay={50}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content>Extra details</ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
    vi.useRealTimers();
  });

  it("renders open by default when defaultOpen is true, without any interaction", () => {
    renderHoverCard({ defaultOpen: true });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <HoverCard.Root>
        <HoverCard.Trigger>Profile</HoverCard.Trigger>
        <HoverCard.Content>Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    expect(markup).toContain("Profile");
    expect(markup).toContain('data-state="closed"');
  });

  it("owns HoverCardTrigger's data-anchor and does not let a consumer override it", () => {
    render(
      <HoverCard.Root>
        <HoverCard.Trigger data-anchor="consumer-anchor">Profile</HoverCard.Trigger>
        <HoverCard.Content>Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    expect(trigger.getAttribute("data-anchor")).toBeTruthy();
    expect(trigger.getAttribute("data-anchor")).not.toBe("consumer-anchor");
  });

  it("owns HoverCardTrigger's aria-controls/aria-expanded and does not let a consumer override them", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger aria-controls="consumer-controls" aria-expanded={false}>
          Profile
        </HoverCard.Trigger>
        <HoverCard.Content>Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Profile" });
    expect(trigger.getAttribute("aria-controls")).not.toBe("consumer-controls");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("lets a consumer onPointerEnter veto the open intent (policy #5)", () => {
    render(
      <HoverCard.Root openDelay={0}>
        <HoverCard.Trigger onPointerEnter={(event) => event.preventDefault()}>
          Profile
        </HoverCard.Trigger>
        <HoverCard.Content>Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Profile" }), {
      pointerType: "mouse",
    });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("closed");
  });

  it("lets a consumer onBlur veto the close intent (policy #5)", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger onBlur={(event) => event.preventDefault()}>Profile</HoverCard.Trigger>
        <HoverCard.Content>Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    fireEvent.blur(screen.getByRole("button", { name: "Profile" }));
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
  });

  it("owns HoverCardContent's positioning data-* attributes and does not let a consumer override them", () => {
    renderHoverCard({ defaultOpen: true });
    const content = screen.getByText("Extra details");
    // renderHoverCard already sets side="top" align="start"; also confirm data-positioning/data-anchor.
    expect(content.getAttribute("data-positioning")).toBe("native");
    expect(content.getAttribute("data-anchor")).toBeTruthy();
  });

  it("does not let a consumer override HoverCardContent's positioning data-* attributes", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>Profile</HoverCard.Trigger>
        <HoverCard.Content
          align="end"
          side="top"
          data-align="consumer-align"
          data-side="consumer-side"
          data-anchor="consumer-anchor"
          data-positioning="consumer-positioning"
        >
          Extra details
        </HoverCard.Content>
      </HoverCard.Root>,
    );
    const content = screen.getByText("Extra details");
    expect(content.getAttribute("data-align")).toBe("end");
    expect(content.getAttribute("data-side")).toBe("top");
    expect(content.getAttribute("data-positioning")).toBe("native");
    expect(content.getAttribute("data-anchor")).not.toBe("consumer-anchor");
  });

  it("owns HoverCardContent's popover/data-state and does not let a consumer override them", () => {
    render(
      <HoverCard.Root>
        <HoverCard.Trigger>Profile</HoverCard.Trigger>
        <HoverCard.Content popover="auto" data-state="consumer-state">
          Extra details
        </HoverCard.Content>
      </HoverCard.Root>,
    );
    const content = screen.getByText("Extra details");
    expect(content.getAttribute("popover")).toBe("manual");
    expect(content.getAttribute("data-state")).toBe("closed");
  });

  it("lets a consumer onPointerLeave veto the close intent on the content (policy #5)", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>Profile</HoverCard.Trigger>
        <HoverCard.Content onPointerLeave={(event) => event.preventDefault()}>
          Extra details
        </HoverCard.Content>
      </HoverCard.Root>,
    );
    fireEvent.pointerLeave(screen.getByText("Extra details"), { pointerType: "mouse" });
    expect(screen.getByText("Extra details").getAttribute("data-state")).toBe("open");
  });

  it("prefers a consumer-supplied non-empty id on HoverCardContent over the generated one", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>Profile</HoverCard.Trigger>
        <HoverCard.Content id="consumer-card-id">Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    expect(screen.getByText("Extra details").id).toBe("consumer-card-id");
  });

  it("falls back to a generated id on HoverCardContent when the consumer supplies an empty string", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>Profile</HoverCard.Trigger>
        <HoverCard.Content id="">Extra details</HoverCard.Content>
      </HoverCard.Root>,
    );
    expect(screen.getByText("Extra details").id.length).toBeGreaterThan(0);
  });

  it("calls showPopover when the content opens", async () => {
    const { HoverCard: ClientHoverCard } = await loadClientHoverCard();

    vi.useFakeTimers();
    render(
      <ClientHoverCard.Root openDelay={0}>
        <ClientHoverCard.Trigger>Profile</ClientHoverCard.Trigger>
        <ClientHoverCard.Content>Extra details</ClientHoverCard.Content>
      </ClientHoverCard.Root>,
    );
    expect(showPopover).not.toHaveBeenCalled();
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Profile" }), {
      pointerType: "mouse",
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(showPopover).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("carries popover='manual' on the content regardless of open state", () => {
    renderHoverCard();
    expect(screen.getByText("Extra details").getAttribute("popover")).toBe("manual");
  });
});
