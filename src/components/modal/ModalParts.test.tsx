import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalGrabber,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./ModalParts.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("Modal native parts", () => {
  it("renders the anatomy parts with modal identity and data-part", () => {
    const html = renderToStaticMarkup(
      <>
        <ModalGrabber />
        <ModalHeader className="h">
          <ModalTitle id="t">Title</ModalTitle>
          <ModalDescription id="d">Description</ModalDescription>
        </ModalHeader>
        <ModalBody>Body</ModalBody>
        <ModalFooter>Footer</ModalFooter>
      </>,
    );
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(
      root.querySelector('div[data-part="grabber"][data-uiify-modal][aria-hidden="true"]'),
    ).not.toBeNull();
    expect(root.querySelector('div.h[data-part="header"][data-uiify-modal]')).not.toBeNull();
    expect(root.querySelector('h2#t[data-part="title"][data-uiify-modal]')?.textContent).toBe(
      "Title",
    );
    expect(root.querySelector('p#d[data-part="description"][data-uiify-modal]')?.textContent).toBe(
      "Description",
    );
    expect(root.querySelector('div[data-part="body"][data-uiify-modal]')?.textContent).toBe("Body");
    expect(root.querySelector('div[data-part="footer"][data-uiify-modal]')?.textContent).toBe(
      "Footer",
    );
  });

  it("does not let consumers override a part's identity", () => {
    const html = renderToStaticMarkup(<ModalBody data-part="other" />);
    expect(html).toContain('data-part="body"');
    expect(html).not.toContain('data-part="other"');
  });

  it("renders a show-modal invoker, a plain dialog and a request-close invoker without a Root", () => {
    const html = renderToStaticMarkup(
      <>
        <ModalTrigger className="custom" target="settings">
          Open
        </ModalTrigger>
        <section>
          <ModalContent aria-labelledby="settings-title" id="settings">
            <h2 id="settings-title">Settings</h2>
            <ModalClose target="settings">Close</ModalClose>
          </ModalContent>
        </section>
      </>,
    );

    expect(html).toContain('command="show-modal"');
    expect(html).toContain('commandfor="settings"');
    expect(html).toContain('command="request-close"');
    expect(html).toContain('class="custom"');
    expect(html).toContain('<h2 id="settings-title">Settings</h2>');
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    expect(parsed.querySelector('[data-uiify-modal][data-part="content"]')).not.toBeNull();
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-state=");
    expect(html).not.toContain("<dialog open");
  });

  it("owns type=button and the invoker attributes", () => {
    render(
      <ModalTrigger target="settings" onClick={() => {}}>
        Open
      </ModalTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("command")).toBe("show-modal");
    expect(button.getAttribute("commandfor")).toBe("settings");
    expect(button.getAttribute("data-uiify-modal")).toBe("");
    expect(button.getAttribute("data-uiify-button")).toBe("");
    expect(button.getAttribute("data-part")).toBe("trigger");
  });

  it("calls the consumer onClick once and lets it cancel the native action", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <ModalTrigger target="settings" onClick={onClick}>
        Open
      </ModalTrigger>,
    );
    const notCancelled = fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
  });

  it("forwards a single ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ModalClose ref={ref} target="settings">
        Close
      </ModalClose>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "Close" }));
    expect(ref.current?.getAttribute("command")).toBe("request-close");
    expect(ref.current?.getAttribute("data-uiify-button")).toBe("");
    expect(ref.current?.getAttribute("data-variant")).toBe("ghost");
  });

  it("renders a custom button component as the invoker and keeps its own props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ModalTrigger as={FancyButton} ref={ref} target="settings" variant="ghost">
        Open
      </ModalTrigger>,
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
      <ModalContent aria-label="Settings" className="panel" id="settings" ref={ref}>
        Body
      </ModalContent>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBe(ref.current);
    expect(dialog.className).toBe("panel");
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("maps appearance props to attributes and omits the defaults", () => {
    const defaults = renderToStaticMarkup(<ModalContent id="a" />);
    expect(defaults).toContain('closedby="any"');
    expect(defaults).not.toContain("data-size");
    expect(defaults).not.toContain("data-align");
    expect(defaults).not.toContain("data-backdrop");

    const explicitDefaults = renderToStaticMarkup(
      <ModalContent align="center" backdrop="opaque" id="a" size="md" />,
    );
    expect(explicitDefaults).not.toContain("data-size");
    expect(explicitDefaults).not.toContain("data-align");
    expect(explicitDefaults).not.toContain("data-backdrop");

    const custom = renderToStaticMarkup(
      <ModalContent align="start" backdrop="blur" dismiss="none" id="a" size="lg" />,
    );
    expect(custom).toContain('closedby="none"');
    expect(custom).toContain('data-size="lg"');
    expect(custom).toContain('data-align="start"');
    expect(custom).toContain('data-backdrop="blur"');
  });
});
