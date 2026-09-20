import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Presence } from "./presence.js";

describe("Presence", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("does not mount initially absent content", () => {
    render(<Presence present={false}>{({ ref }) => <div ref={ref}>Content</div>}</Presence>);
    expect(screen.queryByText("Content")).toBeNull();
  });

  it("waits for active animations before unmounting", async () => {
    let finish: (() => void) | undefined;
    const finished = new Promise<void>((resolve) => {
      finish = resolve;
    });
    const { rerender } = render(
      <Presence present>
        {({ presence, ref }) => (
          <div
            ref={(element) => {
              if (element) {
                element.getAnimations = () => [{ finished }] as unknown as Animation[];
              }
              ref(element);
            }}
          >
            {presence}
          </div>
        )}
      </Presence>,
    );

    rerender(
      <Presence present={false}>{({ presence, ref }) => <div ref={ref}>{presence}</div>}</Presence>,
    );
    expect(screen.getByText("closing")).toBeTruthy();
    await act(async () => finish?.());
    expect(screen.queryByText("closing")).toBeNull();
  });

  it("unmounts immediately when the platform reports no animations", () => {
    const { rerender } = render(
      <Presence present>{({ ref }) => <div ref={ref}>No animation</div>}</Presence>,
    );
    rerender(<Presence present={false}>{({ ref }) => <div ref={ref}>No animation</div>}</Presence>);
    expect(screen.queryByText("No animation")).toBeNull();
  });
});
