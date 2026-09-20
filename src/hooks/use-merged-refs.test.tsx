import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render } from "@testing-library/react";
import { useMergedRefs } from "./use-merged-refs.js";

function Probe({ cb }: { cb: (node: HTMLDivElement | null) => void }) {
  const objectRef = createRef<HTMLDivElement>();
  const merged = useMergedRefs<HTMLDivElement>(objectRef, cb);
  return <div ref={merged} data-object={objectRef.current ? "set" : "unset"} />;
}
Probe.displayName = "Probe";

describe("useMergedRefs", () => {
  it("assigns the node to every provided ref (object + callback)", () => {
    const cb = vi.fn();
    const { container } = render(<Probe cb={cb} />);
    const node = container.querySelector("div");
    expect(cb).toHaveBeenCalledWith(node);
  });

  it("runs React 19 callback-ref cleanups and clears object refs", () => {
    const objectRef = createRef<HTMLDivElement>();
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);

    function CleanupProbe() {
      const merged = useMergedRefs<HTMLDivElement>(objectRef, callbackRef);
      return <div ref={merged} />;
    }
    CleanupProbe.displayName = "CleanupProbe";

    const { unmount } = render(<CleanupProbe />);
    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(objectRef.current).toBeNull();
  });
});
