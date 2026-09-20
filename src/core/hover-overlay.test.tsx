import { act, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHoverOverlay } from "./hover-overlay.js";
import type { UseHoverOverlayOptions } from "./hover-overlay.js";

function TestOverlay(props: Partial<UseHoverOverlayOptions>): ReactElement {
  const overlay = useHoverOverlay({
    closeDelay: 100,
    idPrefix: "test-overlay",
    openDelay: 300,
    ...props,
  });
  return (
    <div>
      <button type="button" onClick={() => overlay.openOverlay()}>
        open
      </button>
      <button type="button" onClick={() => overlay.openOverlay(true)}>
        open-immediate
      </button>
      <button type="button" onClick={() => overlay.closeOverlay()}>
        close
      </button>
      <div data-testid="state">{overlay.open ? "open" : "closed"}</div>
      <div data-testid="anchor-id">{overlay.anchorId}</div>
      <div data-testid="content-id">{overlay.contentId}</div>
    </div>
  );
}
TestOverlay.displayName = "TestOverlay";

describe("useHoverOverlay", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens after the configured delay", () => {
    render(<TestOverlay />);
    act(() => {
      screen.getByText("open").click();
    });
    expect(screen.getByTestId("state").textContent).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByTestId("state").textContent).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("opens immediately when openOverlay(true) is called", () => {
    render(<TestOverlay />);
    act(() => {
      screen.getByText("open-immediate").click();
    });
    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("skips the delay when shouldSkipDelay returns true", () => {
    render(<TestOverlay shouldSkipDelay={() => true} />);
    act(() => {
      screen.getByText("open").click();
    });
    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("does not skip the delay when shouldSkipDelay returns false", () => {
    render(<TestOverlay shouldSkipDelay={() => false} />);
    act(() => {
      screen.getByText("open").click();
    });
    expect(screen.getByTestId("state").textContent).toBe("closed");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("calls onOpened only after the overlay actually opens, not before", () => {
    const onOpened = vi.fn();
    render(<TestOverlay onOpened={onOpened} />);
    act(() => {
      screen.getByText("open").click();
    });
    expect(onOpened).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onOpened).toHaveBeenCalledOnce();
  });

  it("calls onOpened immediately when the delay is skipped", () => {
    const onOpened = vi.fn();
    render(<TestOverlay onOpened={onOpened} shouldSkipDelay={() => true} />);
    act(() => {
      screen.getByText("open").click();
    });
    expect(onOpened).toHaveBeenCalledOnce();
  });

  it("closeOverlay cancels a pending open", () => {
    render(<TestOverlay />);
    act(() => {
      screen.getByText("open").click();
    });
    act(() => {
      screen.getByText("close").click();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("state").textContent).toBe("closed");
  });

  it("clears pending timers on unmount", () => {
    const onOpened = vi.fn();
    const { unmount } = render(<TestOverlay onOpened={onOpened} />);
    act(() => {
      screen.getByText("open").click();
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onOpened).not.toHaveBeenCalled();
  });

  it("passes reason: 'programmatic' to onOpenChange", () => {
    const onOpenChange = vi.fn();
    render(<TestOverlay onOpenChange={onOpenChange} />);
    act(() => {
      screen.getByText("open-immediate").click();
    });
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: "programmatic" }),
    );
  });

  it("uses the provided id instead of generating one", () => {
    render(<TestOverlay id="custom-id" />);
    expect(screen.getByTestId("anchor-id").textContent).toBe("custom-id");
    expect(screen.getByTestId("content-id").textContent).toBe("custom-id-content");
  });
});
