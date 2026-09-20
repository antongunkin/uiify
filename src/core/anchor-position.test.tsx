import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAnchorPosition } from "./anchor-position.js";
import { Anchor, AnchorRoot, Positioner } from "./anchor.js";

function Fixture() {
  const position = useAnchorPosition({ align: "start", side: "right" });
  return (
    <>
      <button {...position.anchorProps}>Anchor</button>
      <div {...position.positionerProps}>Positioner</div>
    </>
  );
}
Fixture.displayName = "Fixture";

describe("useAnchorPosition", () => {
  it("exposes native positioning attributes without reading layout", () => {
    const layoutRead = vi.spyOn(Element.prototype, "getBoundingClientRect");
    const { getByText } = render(<Fixture />);
    const anchor = getByText("Anchor");
    const positioner = getByText("Positioner");
    expect(positioner.dataset.positioning).toBe("native");
    expect(positioner.dataset.anchor).toBe(anchor.dataset.anchor);
    expect(layoutRead).not.toHaveBeenCalled();
    layoutRead.mockRestore();
  });

  it("provides clone-free compound components", () => {
    const { getByRole } = render(
      <AnchorRoot align="end" id="demo" side="top">
        <Anchor>Trigger</Anchor>
        <Positioner as="section" aria-label="Popup">
          Popup
        </Positioner>
      </AnchorRoot>,
    );
    expect(getByRole("button", { name: "Trigger" })).toBeTruthy();
    expect(getByRole("region", { name: "Popup" }).dataset.side).toBe("top");
  });

  it("owns Anchor's data-anchor and native type, not overridable by the consumer", () => {
    const { getByRole } = render(
      <AnchorRoot id="owned-anchor">
        <Anchor data-anchor="consumer-anchor" type="submit">
          Trigger
        </Anchor>
      </AnchorRoot>,
    );
    const trigger = getByRole("button", { name: "Trigger" });
    expect(trigger.dataset.anchor).toBe("--owned-anchor-anchor");
    expect(trigger.getAttribute("type")).toBe("button");
  });

  it("owns Positioner's positioning data-* attributes, not overridable by the consumer", () => {
    const { getByRole } = render(
      <AnchorRoot align="end" id="owned-positioner" side="top">
        <Anchor>Trigger</Anchor>
        <Positioner
          as="section"
          aria-label="Popup"
          data-align="start"
          data-anchor="consumer-anchor"
          data-positioning="fixed"
          data-side="left"
        >
          Popup
        </Positioner>
      </AnchorRoot>,
    );
    const positioner = getByRole("region", { name: "Popup" });
    expect(positioner.dataset.align).toBe("end");
    expect(positioner.dataset.anchor).toBe("--owned-positioner-anchor");
    expect(positioner.dataset.positioning).toBe("native");
    expect(positioner.dataset.side).toBe("top");
  });
});
