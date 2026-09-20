import { StrictMode, useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DismissableLayer } from "./dismissable-layer.js";
import { FocusScope } from "./focus-scope.js";

describe("fallback interaction primitives", () => {
  it("contains focus and loops tab order", () => {
    render(
      <>
        <button>Outside</button>
        <FocusScope>
          <button>First</button>
          <button>Last</button>
        </FocusScope>
      </>,
    );
    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });
    expect(document.activeElement).toBe(first);
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    screen.getByRole("button", { name: "Outside" }).focus();
    expect(document.activeElement).toBe(first);
  });

  it("dismisses only for outside interactions", () => {
    const onDismiss = vi.fn();
    render(
      <>
        <button>Outside</button>
        <DismissableLayer onDismiss={onDismiss}>
          <button>Inside</button>
        </DismissableLayer>
      </>,
    );
    fireEvent.pointerDown(screen.getByRole("button", { name: "Inside" }));
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(onDismiss.mock.calls[0]?.[0].reason).toBe("outside-press");
  });

  it("allows focus in a registered branch", () => {
    const branch = document.createElement("button");
    branch.textContent = "Branch";
    document.body.append(branch);
    render(
      <FocusScope branches={new Set([branch])}>
        <button>Scoped</button>
      </FocusScope>,
    );
    branch.focus();
    expect(document.activeElement).toBe(branch);
  });

  it("dismisses on Escape", () => {
    const onDismiss = vi.fn();
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <button>Inside</button>
      </DismissableLayer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onDismiss.mock.calls[0]?.[0].reason).toBe("escape-key");
  });

  it("owns FocusScope's tabIndex, not overridable by the consumer", () => {
    render(
      <FocusScope data-testid="scope" tabIndex={3}>
        <button>First</button>
      </FocusScope>,
    );
    expect(screen.getByTestId("scope").tabIndex).toBe(-1);
  });

  it("lets a consumer onKeyDown veto FocusScope's Tab-loop trapping", () => {
    render(
      <>
        <button>Outside</button>
        <FocusScope onKeyDown={(event) => event.preventDefault()}>
          <button>First</button>
          <button>Last</button>
        </FocusScope>
      </>,
    );
    const last = screen.getByRole("button", { name: "Last" });
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(document.activeElement).toBe(last);
  });

  it("merges FocusScope's internal ref with the consumer's ref, cleaning up on replacement and unmount under StrictMode", () => {
    const seen: Array<HTMLElement | null> = [];

    function Harness() {
      const ref = useRef<HTMLElement | null>(null);
      const [mounted, setMounted] = useState(true);
      return (
        <>
          {mounted && (
            <FocusScope
              ref={(element: HTMLElement | null) => {
                seen.push(element);
                ref.current = element;
                return () => {
                  seen.push(null);
                };
              }}
            >
              <button>Inside</button>
            </FocusScope>
          )}
          <button onClick={() => setMounted(false)}>Unmount</button>
        </>
      );
    }
    Harness.displayName = "Harness";

    render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
    // StrictMode double-invokes the ref callback (attach, detach, attach) on mount.
    expect(seen.filter(Boolean).length).toBeGreaterThan(0);
    const attachCount = seen.length;

    fireEvent.click(screen.getByRole("button", { name: "Unmount" }));
    expect(seen.length).toBeGreaterThan(attachCount);
    expect(seen.at(-1)).toBeNull();
  });

  it("merges DismissableLayer's internal ref with the consumer's ref, cleaning up on unmount under StrictMode", () => {
    let lastSeen: HTMLElement | null | undefined;

    function Harness() {
      const [mounted, setMounted] = useState(true);
      return (
        <>
          {mounted && (
            <DismissableLayer
              ref={(element: HTMLElement | null) => {
                lastSeen = element;
                return () => {
                  lastSeen = null;
                };
              }}
            >
              <button>Inside</button>
            </DismissableLayer>
          )}
          <button onClick={() => setMounted(false)}>Unmount</button>
        </>
      );
    }
    Harness.displayName = "Harness";

    render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
    expect(lastSeen).toBeInstanceOf(HTMLElement);

    fireEvent.click(screen.getByRole("button", { name: "Unmount" }));
    expect(lastSeen).toBeNull();
  });
});
