import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Popover, PopoverClose, PopoverSurface, PopoverTrigger } from "./Popover.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("Popover", () => {
  it("links trigger, surface and close by id with no anchor name", () => {
    const html = renderToStaticMarkup(
      <>
        <PopoverTrigger className="help-trigger" target="help">
          Help
        </PopoverTrigger>
        <section>
          <div>
            <PopoverSurface id="help">
              Text
              <PopoverClose target="help">Close</PopoverClose>
            </PopoverSurface>
          </div>
        </section>
      </>,
    );

    // See Popover.tsx's renderInvoker comment: React's SSR string renderer has no
    // case-mapping for popoverTarget/popoverTargetAction, so parse the markup the
    // way a browser would before asserting on the attribute.
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    const trigger = parsed.querySelector("[data-uiify-popover-trigger]");
    const close = parsed.querySelector("[data-uiify-popover-close]");
    expect(trigger?.getAttribute("popovertarget")).toBe("help");
    expect(trigger?.getAttribute("popovertargetaction")).toBe("toggle");
    expect(close?.getAttribute("popovertargetaction")).toBe("hide");
    expect(html).toContain('id="help"');
    expect(html).toContain('popover="auto"');
    expect(html).toContain('data-side="bottom"');
    expect(html).toContain('data-align="center"');
    expect(html).toContain('data-positioning="native"');
    expect(html).toContain('class="help-trigger"');
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-anchor");
    expect(html).not.toContain("--uiify-anchor");
    expect(html).not.toContain("commandfor=");
  });

  it("renders manual mode, side/align and a consumer style", () => {
    render(
      <PopoverSurface align="start" id="notes" mode="manual" side="top" style={{ zIndex: 5 }}>
        Notes
      </PopoverSurface>,
    );
    const panel = screen.getByText("Notes");
    expect(panel.getAttribute("popover")).toBe("manual");
    expect(panel.getAttribute("data-side")).toBe("top");
    expect(panel.getAttribute("data-align")).toBe("start");
    expect(panel.style.zIndex).toBe("5");
    expect(panel.hasAttribute("data-uiify-popover-surface")).toBe(true);
  });

  it("owns type=button and the popovertarget attributes on the invoker", () => {
    render(
      <PopoverTrigger target="help" onClick={() => {}}>
        Help
      </PopoverTrigger>,
    );
    const button = screen.getByRole("button", { name: "Help" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("popovertarget")).toBe("help");
    expect(button.getAttribute("popovertargetaction")).toBe("toggle");
    expect(button.hasAttribute("data-uiify-popover-trigger")).toBe(true);
  });

  it("supports the show and hide actions", () => {
    render(
      <>
        <PopoverTrigger action="show" target="help">
          Show
        </PopoverTrigger>
        <PopoverTrigger action="hide" target="help">
          Hide
        </PopoverTrigger>
      </>,
    );
    expect(screen.getByRole("button", { name: "Show" }).getAttribute("popovertargetaction")).toBe(
      "show",
    );
    expect(screen.getByRole("button", { name: "Hide" }).getAttribute("popovertargetaction")).toBe(
      "hide",
    );
  });

  it("calls the consumer onClick once and lets it cancel the native action", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <PopoverClose target="help" onClick={onClick}>
        Close
      </PopoverClose>,
    );
    const notCancelled = fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
  });

  it("renders a custom button component and forwards the ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <PopoverTrigger as={FancyButton} ref={ref} target="help" variant="ghost">
        Help
      </PopoverTrigger>,
    );
    const button = screen.getByRole("button", { name: "Help" });
    expect(button.getAttribute("data-variant")).toBe("ghost");
    expect(button.getAttribute("popovertarget")).toBe("help");
    expect(ref.current).toBe(button);
  });

  it("exposes the same parts through the Popover compound object", () => {
    expect(Popover.Trigger).toBe(PopoverTrigger);
    expect(Popover.Surface).toBe(PopoverSurface);
    expect(Popover.Close).toBe(PopoverClose);
  });
});
