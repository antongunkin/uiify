import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent, ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { PopoverClose, PopoverContent, PopoverTrigger } from "./PopoverParts.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("Popover native parts", () => {
  it("links trigger, surface and close by id with no Root and no anchor name", () => {
    const html = renderToStaticMarkup(
      <>
        <PopoverTrigger className="help-trigger" target="help">
          Help
        </PopoverTrigger>
        <section>
          <div>
            <PopoverContent id="help">
              Text
              <PopoverClose target="help">Close</PopoverClose>
            </PopoverContent>
          </div>
        </section>
      </>,
    );

    // React 19.2's SSR string output serializes the known `popoverTarget`/
    // `popoverTargetAction` DOM properties verbatim in their camelCase JSX
    // spelling (confirmed directly against react-dom/server, independent of
    // this file's code) — unlike `className`/`htmlFor`, they have no entry in
    // react-dom's attribute-alias table used by the string renderer. A real
    // HTML parser lowercases all HTML attribute names regardless of source
    // casing, so this is only a literal-string-match hazard, not a pre-
    // hydration correctness gap: parse the markup the way a browser would
    // before asserting on the attribute.
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    const trigger = parsed.querySelector(".uiify-popover-trigger");
    const close = parsed.querySelector(".uiify-popover-close");
    expect(trigger?.getAttribute("popovertarget")).toBe("help");
    expect(trigger?.getAttribute("popovertargetaction")).toBe("toggle");
    expect(close?.getAttribute("popovertargetaction")).toBe("hide");
    expect(html).toContain('id="help"');
    expect(html).toContain('popover="auto"');
    expect(html).toContain('data-side="bottom"');
    expect(html).toContain('data-align="center"');
    expect(html).toContain('data-positioning="native"');
    expect(html).toContain('class="uiify-button uiify-popover-trigger help-trigger"');
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-anchor");
    expect(html).not.toContain("--uiify-anchor");
    expect(html).not.toContain("commandfor=");
  });

  it("renders manual mode, side/align and a consumer style", () => {
    render(
      <PopoverContent align="start" id="notes" mode="manual" side="top" style={{ zIndex: 5 }}>
        Notes
      </PopoverContent>,
    );
    const panel = screen.getByText("Notes");
    expect(panel.getAttribute("popover")).toBe("manual");
    expect(panel.getAttribute("data-side")).toBe("top");
    expect(panel.getAttribute("data-align")).toBe("start");
    expect(panel.style.zIndex).toBe("5");
    expect(panel.classList.contains("uiify-popover-content")).toBe(true);
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
    expect(button.classList.contains("uiify-popover-trigger")).toBe(true);
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

  it("rejects non-button intrinsic tags and hint mode at the type level", () => {
    const elements: ReactElement[] = [
      // @ts-expect-error -- an anchor cannot invoke a popover.
      <PopoverTrigger key="anchor" as="a" target="help">
        Help
      </PopoverTrigger>,
      // @ts-expect-error -- target is required.
      <PopoverTrigger key="missing">Help</PopoverTrigger>,
      // @ts-expect-error -- the library owns the popover attribute.
      <PopoverContent key="popover" id="help" popover="manual">
        Text
      </PopoverContent>,
    ];
    expect(elements).toHaveLength(3);
  });
});
