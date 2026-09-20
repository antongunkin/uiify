import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "./use-click-outside.js";

function Probe({ onOutside }: { onOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        inside
      </div>
      <button data-testid="outside">outside</button>
    </div>
  );
}
Probe.displayName = "Probe";

function pointerDown(el: Element) {
  el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
}

describe("useClickOutside", () => {
  it("fires for outside pointerdown, not for inside", () => {
    const onOutside = vi.fn();
    const { getByTestId } = render(<Probe onOutside={onOutside} />);
    pointerDown(getByTestId("inside"));
    expect(onOutside).not.toHaveBeenCalled();
    pointerDown(getByTestId("outside"));
    expect(onOutside).toHaveBeenCalledTimes(1);
  });
});
