import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogGrabber,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./DialogParts.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("Dialog native parts", () => {
  it("renders the anatomy parts with modal identity and data-part", () => {
    const html = renderToStaticMarkup(
      <>
        <DialogGrabber />
        <DialogHeader className="h">
          <DialogTitle id="t">Title</DialogTitle>
          <DialogDescription id="d">Description</DialogDescription>
        </DialogHeader>
        <DialogBody>Body</DialogBody>
        <DialogFooter>Footer</DialogFooter>
      </>,
    );
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(root.querySelector('div.uiify-dialog-grabber[aria-hidden="true"]')).not.toBeNull();
    expect(root.querySelector("div.h.uiify-dialog-header")).not.toBeNull();
    expect(root.querySelector("h2#t.uiify-dialog-title")?.textContent).toBe("Title");
    expect(root.querySelector("p#d.uiify-dialog-description")?.textContent).toBe("Description");
    expect(root.querySelector("div.uiify-dialog-body")?.textContent).toBe("Body");
    expect(root.querySelector("div.uiify-dialog-footer")?.textContent).toBe("Footer");
  });

  it("lets consumers replace a part's markers", () => {
    const html = renderToStaticMarkup(<DialogBody data-part="other" />);
    expect(html).toContain('data-part="other"');
    expect(html).not.toContain('data-part="body"');
    expect(html).toContain("uiify-dialog");
  });

  it("lets consumers replace the grabber's aria-hidden and the dialog's closedby", () => {
    const html = renderToStaticMarkup(
      <>
        <DialogGrabber aria-hidden={false} />
        <DialogContent aria-label="Settings" closedby="none" id="settings" />
      </>,
    );
    expect(html).toContain('aria-hidden="false"');
    expect(html).toContain('closedby="none"');
  });

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
    expect(html).toContain('class="uiify-dialog-trigger uiify-button custom"');
    expect(html).toContain('<h2 id="settings-title">Settings</h2>');
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    expect(parsed.querySelector(".uiify-dialog-content")).not.toBeNull();
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-state=");
    expect(html).not.toContain("<dialog open");
  });

  it("lets consumers replace type and the invoker target", () => {
    render(
      <DialogTrigger target="settings" type="submit" {...{ commandfor: "other" }}>
        Open
      </DialogTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("submit");
    expect(button.getAttribute("commandfor")).toBe("other");
  });

  it("writes type=button and the invoker attributes by default", () => {
    render(
      <DialogTrigger target="settings" onClick={() => {}}>
        Open
      </DialogTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("command")).toBe("show-modal");
    expect(button.getAttribute("commandfor")).toBe("settings");
    expect(button.classList.contains("uiify-dialog-trigger")).toBe(true);
    expect(button.classList.contains("uiify-button")).toBe(true);
    expect(button.hasAttribute("data-part")).toBe(false);
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
    expect(ref.current?.classList.contains("uiify-button")).toBe(true);
    expect(ref.current?.getAttribute("data-variant")).toBe("ghost");
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
    expect(dialog.className).toBe("uiify-dialog uiify-dialog-content panel");
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("maps appearance props to attributes and omits the defaults", () => {
    const defaults = renderToStaticMarkup(<DialogContent id="a" />);
    expect(defaults).toContain('closedby="any"');
    expect(defaults).not.toContain("data-size");
    expect(defaults).not.toContain("data-align");
    expect(defaults).not.toContain("data-backdrop");

    const explicitDefaults = renderToStaticMarkup(
      <DialogContent align="center" backdrop="opaque" id="a" size="md" />,
    );
    expect(explicitDefaults).not.toContain("data-size");
    expect(explicitDefaults).not.toContain("data-align");
    expect(explicitDefaults).not.toContain("data-backdrop");

    const custom = renderToStaticMarkup(
      <DialogContent align="start" backdrop="blur" dismiss="none" id="a" size="lg" />,
    );
    expect(custom).toContain('closedby="none"');
    expect(custom).toContain('data-size="lg"');
    expect(custom).toContain('data-align="start"');
    expect(custom).toContain('data-backdrop="blur"');
  });
});

it("emits recipe identity on content and composes consumer classes", () => {
  const html = renderToStaticMarkup(<DialogContent className="custom" id="identity" />);
  expect(html).toContain('class="uiify-dialog uiify-dialog-content custom"');
  expect(html).not.toContain("data-uiify-dialog");
  expect(html).not.toContain("data-part");
});
