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
});
