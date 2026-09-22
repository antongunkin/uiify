import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./Dialog.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("Dialog", () => {
  it("renders a show-modal invoker, a plain dialog and a request-close invoker without a Root", () => {
    const html = renderToStaticMarkup(
      <>
        <DialogTrigger className="custom" target="settings">
          Open
        </DialogTrigger>
        <section>
          <DialogContent aria-labelledby="settings-title" id="settings">
            <h2 id="settings-title">Settings</h2>
            <DialogClose target="settings">Close</DialogClose>
          </DialogContent>
        </section>
      </>,
    );

    expect(html).toContain('command="show-modal"');
    expect(html).toContain('commandfor="settings"');
    expect(html).toContain('command="request-close"');
    expect(html).toContain('class="custom"');
    expect(html).toContain('<h2 id="settings-title">Settings</h2>');
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const content = parsed.querySelector('[data-uiify-dialog][data-part="content"]');
    expect(content).not.toBeNull();
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-state=");
    expect(html).not.toContain("<dialog open");
  });

  it("owns type=button and the invoker attributes", () => {
    render(
      <DialogTrigger target="settings" onClick={() => {}}>
        Open
      </DialogTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("command")).toBe("show-modal");
    expect(button.getAttribute("commandfor")).toBe("settings");
    expect(button.getAttribute("data-uiify-dialog")).toBe("");
    expect(button.getAttribute("data-part")).toBe("trigger");
  });

  it("calls the consumer onClick once and lets it cancel the native action", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <DialogTrigger target="settings" onClick={onClick}>
        Open
      </DialogTrigger>,
    );
    const notCancelled = fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
  });

  it("forwards a single ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <DialogClose ref={ref} target="settings">
        Close
      </DialogClose>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "Close" }));
    expect(ref.current?.getAttribute("command")).toBe("request-close");
    expect(ref.current?.getAttribute("data-uiify-dialog")).toBe("");
    expect(ref.current?.getAttribute("data-part")).toBe("close");
  });

  it("renders a custom button component as the invoker and keeps its own props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <DialogTrigger as={FancyButton} ref={ref} target="settings" variant="ghost">
        Open
      </DialogTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("data-variant")).toBe("ghost");
    expect(button.getAttribute("command")).toBe("show-modal");
    expect(button.getAttribute("type")).toBe("button");
    expect(ref.current).toBe(button);
  });

  it("forwards dialog attributes and the ref to the dialog element", () => {
    const ref = createRef<HTMLDialogElement>();
    render(
      <DialogContent aria-label="Settings" className="panel" id="settings" ref={ref}>
        Body
      </DialogContent>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBe(ref.current);
    expect(dialog.className).toBe("panel");
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("popover")).toBe(false);
  });

  it("accepts aria-labelledby as the alternative accessible name", () => {
    render(
      <DialogContent aria-labelledby="settings-title" id="settings">
        <h2 id="settings-title">Settings</h2>
      </DialogContent>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("aria-labelledby")).toBe("settings-title");
    expect(dialog.hasAttribute("aria-label")).toBe(false);
  });

  it("exposes the same parts through the Dialog compound object", () => {
    expect(Dialog.Trigger).toBe(DialogTrigger);
    expect(Dialog.Content).toBe(DialogContent);
    expect(Dialog.Close).toBe(DialogClose);
  });
});
