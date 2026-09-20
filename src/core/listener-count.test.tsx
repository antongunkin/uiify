import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DismissableLayer } from "./dismissable-layer.js";

describe("dismissable layer listener budget", () => {
  it("uses one listener set for 100 layers", () => {
    const addEventListener = vi.spyOn(document, "addEventListener");
    render(
      <>
        {Array.from({ length: 100 }, (_, index) => (
          <DismissableLayer key={index}>Layer {index}</DismissableLayer>
        ))}
      </>,
    );

    const coreListeners = addEventListener.mock.calls.filter(([type]) =>
      ["keydown", "pointerdown", "focusin"].includes(type),
    );
    expect(coreListeners.map(([type]) => type).sort()).toEqual([
      "focusin",
      "keydown",
      "pointerdown",
    ]);
    addEventListener.mockRestore();
  });
});
