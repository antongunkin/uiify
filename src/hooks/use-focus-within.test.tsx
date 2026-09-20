import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { useFocusWithin } from "./use-focus-within.js";

function Probe() {
  const { isFocusWithin, focusWithinProps } = useFocusWithin();
  return (
    <div {...focusWithinProps} data-testid="wrap" data-focus={String(isFocusWithin)}>
      <input data-testid="input" aria-label="probe" />
    </div>
  );
}
Probe.displayName = "Probe";

describe("useFocusWithin", () => {
  it("flips true when a descendant gains focus", () => {
    const { getByTestId } = render(<Probe />);
    const input = getByTestId("input") as HTMLInputElement;
    act(() => input.focus());
    expect(getByTestId("wrap").getAttribute("data-focus")).toBe("true");
    act(() => input.blur());
    expect(getByTestId("wrap").getAttribute("data-focus")).toBe("false");
  });
});
