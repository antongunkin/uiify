import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  NativePopover,
  NativePopoverClose,
  NativePopoverSurface,
  NativePopoverTrigger,
} from "./NativePopover.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("NativePopover", () => {
  it("links trigger, surface and close by id with no anchor name", () => {
    const html = renderToStaticMarkup(
      <>
        <NativePopoverTrigger className="help-trigger" target="help">
          Help
        </NativePopoverTrigger>
        <section>
          <div>
            <NativePopoverSurface id="help">
              Text
              <NativePopoverClose target="help">Close</NativePopoverClose>
            </NativePopoverSurface>
          </div>
        </section>
      </>,
    );

    // See NativePopover.tsx's renderInvoker comment: React's SSR string renderer has no
    // case-mapping for popoverTarget/popoverTargetAction, so parse the markup the
    // way a browser would before asserting on the attribute.
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    const trigger = parsed.querySelector(".uiify-native-popover-trigger");
    const close = parsed.querySelector(".uiify-native-popover-close");
    expect(trigger?.getAttribute("popovertarget")).toBe("help");
    expect(trigger?.getAttribute("popovertargetaction")).toBe("toggle");
    expect(close?.getAttribute("popovertargetaction")).toBe("hide");
    expect(html).toContain('id="help"');
    expect(html).toContain('popover="auto"');
    expect(html).toContain('data-side="bottom"');
    expect(html).toContain('data-align="center"');
    expect(html).toContain('data-positioning="native"');
    expect(html).toContain('class="uiify-native-popover-trigger help-trigger"');
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-anchor");
    expect(html).not.toContain("--uiify-anchor");
    expect(html).not.toContain("commandfor=");
  });

  it("renders manual mode, side/align and a consumer style", () => {
    render(
      <NativePopoverSurface align="start" id="notes" mode="manual" side="top" style={{ zIndex: 5 }}>
        Notes
      </NativePopoverSurface>,
    );
    const panel = screen.getByText("Notes");
    expect(panel.getAttribute("popover")).toBe("manual");
    expect(panel.getAttribute("data-side")).toBe("top");
    expect(panel.getAttribute("data-align")).toBe("start");
    expect(panel.style.zIndex).toBe("5");
    expect(panel.className).toBe("uiify-native-popover-surface");
    expect(panel.classList.contains("uiify-popover-content")).toBe(false);
    expect(panel.hasAttribute("data-part")).toBe(false);
  });

  it("owns type=button and the popovertarget attributes on the invoker", () => {
    render(
      <NativePopoverTrigger target="help" onClick={() => {}}>
        Help
      </NativePopoverTrigger>,
    );
    const button = screen.getByRole("button", { name: "Help" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("popovertarget")).toBe("help");
    expect(button.getAttribute("popovertargetaction")).toBe("toggle");
    expect(button.className).toBe("uiify-native-popover-trigger");
  });

  it("supports the show and hide actions", () => {
    render(
      <>
        <NativePopoverTrigger action="show" target="help">
          Show
        </NativePopoverTrigger>
        <NativePopoverTrigger action="hide" target="help">
          Hide
        </NativePopoverTrigger>
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
      <NativePopoverClose target="help" onClick={onClick}>
        Close
      </NativePopoverClose>,
    );
    const notCancelled = fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
  });

  it("renders a custom button component and forwards the ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NativePopoverTrigger as={FancyButton} ref={ref} target="help" variant="ghost">
        Help
      </NativePopoverTrigger>,
    );
    const button = screen.getByRole("button", { name: "Help" });
    expect(button.getAttribute("data-variant")).toBe("ghost");
    expect(button.getAttribute("popovertarget")).toBe("help");
    expect(ref.current).toBe(button);
  });

  it("exposes the same parts through the NativePopover compound object", () => {
    expect(NativePopover.Trigger).toBe(NativePopoverTrigger);
    expect(NativePopover.Surface).toBe(NativePopoverSurface);
    expect(NativePopover.Close).toBe(NativePopoverClose);
  });
  it("lets consumer native invoker and surface values replace defaults", () => {
    render(
      <>
        <NativePopoverTrigger
          target="help"
          type="submit"
          popoverTarget="other"
          popoverTargetAction="show"
        >
          Help
        </NativePopoverTrigger>
        <NativePopoverSurface id="help" popover="manual" data-side="custom">
          Body
        </NativePopoverSurface>
        <NativePopoverClose target="help" popoverTarget={undefined} type="reset">
          Close
        </NativePopoverClose>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Help" });
    expect(trigger.getAttribute("type")).toBe("submit");
    expect(trigger.getAttribute("popovertarget")).toBe("other");
    expect(trigger.getAttribute("popovertargetaction")).toBe("show");
    const surface = screen.getByText("Body");
    expect(surface.getAttribute("popover")).toBe("manual");
    expect(surface.getAttribute("data-side")).toBe("custom");
    expect(surface.className).toBe("uiify-native-popover-surface");
    expect(screen.getByRole("button", { name: "Close" }).hasAttribute("popovertarget")).toBe(false);
  });
});
