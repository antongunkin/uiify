import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { AlertModal } from "./AlertModal.js";

describe("AlertModal", () => {
  it("renders an alertdialog opened modally by a native invoker", () => {
    render(
      <AlertModal
        id="delete-item"
        trigger="Delete item"
        title="Delete item"
        description="This action cannot be undone."
      />,
    );

    const dialog = screen.getByRole("alertdialog", { hidden: true });
    const trigger = screen.getByRole("button", { name: "Delete item" });
    expect(trigger.getAttribute("commandfor")).toBe("delete-item");
    expect(trigger.getAttribute("command")).toBe("show-modal");
    expect(dialog.getAttribute("aria-labelledby")).toBe("delete-item-title");
    expect(dialog.getAttribute("aria-describedby")).toBe("delete-item-description");
    expect(dialog.hasAttribute("popover")).toBe(false);
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(trigger.closest("[data-uiify-alert-modal]")).not.toBeNull();
  });

  it("renders cancel and action as request-close invokers with their values", () => {
    render(<AlertModal id="delete-item" trigger="Delete" title="Delete item" />);

    const confirm = screen.getByRole("button", { name: "Confirm", hidden: true });
    const cancel = screen.getByRole("button", { name: "Cancel", hidden: true });
    expect(confirm.getAttribute("value")).toBe("confirm");
    expect(confirm.getAttribute("command")).toBe("request-close");
    expect(cancel.getAttribute("value")).toBe("cancel");
    expect(cancel.getAttribute("command")).toBe("request-close");
  });

  it("renders the same native semantics during SSR", () => {
    const markup = renderToStaticMarkup(
      <AlertModal
        id="delete-item"
        trigger="Delete"
        title="Delete item"
        description="Cannot undo."
      />,
    );

    expect(markup).toContain('command="show-modal"');
    expect(markup).toContain('role="alertdialog"');
    expect(markup).toContain('aria-describedby="delete-item-description"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("popover=");
  });
});
