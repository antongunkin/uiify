import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Modal } from "./Modal.js";

describe("Modal", () => {
  it("renders a native modal dialog with a show-modal invoker", () => {
    render(
      <Modal
        id="settings"
        trigger="Open settings"
        title="Settings"
        description="Update your profile."
        closeLabel="Close"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open settings" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(trigger.getAttribute("commandfor")).toBe("settings");
    expect(trigger.getAttribute("command")).toBe("show-modal");
    expect(dialog.getAttribute("aria-labelledby")).toBe("settings-title");
    expect(dialog.getAttribute("aria-describedby")).toBe("settings-description");
    expect(dialog.hasAttribute("popover")).toBe(false);
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("data-state")).toBe(false);
    expect(trigger.closest("[data-uiify-modal]")).not.toBeNull();
  });

  it("closes through a request-close invoker instead of a dialog form", () => {
    render(<Modal id="settings" trigger="Open" title="Settings" closeLabel="Dismiss" />);
    const close = screen.getByRole("button", { name: "Dismiss", hidden: true });
    expect(close.getAttribute("command")).toBe("request-close");
    expect(close.getAttribute("commandfor")).toBe("settings");
    expect(close.closest("form")).toBeNull();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Modal id="settings" trigger="Open" title="Settings" closeLabel="Close" />,
    );
    expect(markup).toContain("<dialog");
    expect(markup).toContain('command="show-modal"');
    expect(markup).toContain('command="request-close"');
    expect(markup).toContain('aria-labelledby="settings-title"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("popover=");
  });

  it("renders header (title, description, close icon), body and footer in order", () => {
    render(
      <Modal
        closeLabel="Dismiss"
        description="Update"
        footer={<span>Actions</span>}
        id="settings"
        title="Settings"
        trigger="Open"
      >
        <p>Body copy</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.querySelector('[data-part="grabber"]')).not.toBeNull();
    const header = dialog.querySelector('[data-part="header"]');
    expect(header?.querySelector('h2[data-part="title"]')?.id).toBe("settings-title");
    expect(header?.querySelector('p[data-part="description"]')?.id).toBe("settings-description");
    const close = header?.querySelector('button[data-part="close"]');
    expect(close?.getAttribute("aria-label")).toBe("Dismiss");
    expect(close?.getAttribute("command")).toBe("request-close");
    expect(close?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(dialog.querySelector('[data-part="body"]')?.textContent).toBe("Body copy");
    expect(dialog.querySelector('[data-part="footer"]')?.textContent).toBe("Actions");
    const order = [...dialog.children].map((child) => child.getAttribute("data-part"));
    expect(order).toEqual(["grabber", "header", "body", "footer"]);
  });

  it("omits the description, body and footer when they are not provided", () => {
    render(<Modal id="settings" title="Settings" trigger="Open" />);
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.querySelector('[data-part="description"]')).toBeNull();
    expect(dialog.querySelector('[data-part="body"]')).toBeNull();
    expect(dialog.querySelector('[data-part="footer"]')).toBeNull();
    expect(dialog.hasAttribute("aria-describedby")).toBe(false);
  });

  it("treats null description, body and footer like missing ones", () => {
    render(
      <Modal description={null} footer={null} id="settings" title="Settings" trigger="Open">
        {null}
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.querySelector('[data-part="description"]')).toBeNull();
    expect(dialog.querySelector('[data-part="body"]')).toBeNull();
    expect(dialog.querySelector('[data-part="footer"]')).toBeNull();
    expect(dialog.hasAttribute("aria-describedby")).toBe(false);
  });

  it("forwards appearance props to the dialog", () => {
    render(
      <Modal
        align="start"
        backdrop="none"
        dismiss="closerequest"
        id="settings"
        size="full"
        title="Settings"
        trigger="Open"
      />,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("data-size")).toBe("full");
    expect(dialog.getAttribute("data-align")).toBe("start");
    expect(dialog.getAttribute("data-backdrop")).toBe("none");
    expect(dialog.getAttribute("closedby")).toBe("closerequest");
  });
});
