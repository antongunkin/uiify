import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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

  it("forwards props and refs to the root and each generated part", () => {
    const refs = {
      root: createRef<HTMLDivElement>(),
      trigger: createRef<HTMLButtonElement>(),
      content: createRef<HTMLDialogElement>(),
      title: createRef<HTMLHeadingElement>(),
      description: createRef<HTMLParagraphElement>(),
      cancel: createRef<HTMLButtonElement>(),
      action: createRef<HTMLButtonElement>(),
    };
    render(
      <AlertModal
        className="root-class"
        data-testid="root"
        description="Description"
        id="slot-test"
        ref={refs.root}
        slotProps={{
          trigger: {
            className: "trigger-class",
            "data-testid": "trigger",
            "data-variant": "outline",
            ref: refs.trigger,
          },
          content: { className: "content-class", "data-testid": "content", ref: refs.content },
          title: { className: "title-class", "data-testid": "title", ref: refs.title },
          description: {
            className: "description-class",
            "data-testid": "description",
            ref: refs.description,
          },
          cancel: { className: "cancel-class", "data-testid": "cancel", ref: refs.cancel },
          action: { className: "action-class", "data-testid": "action", ref: refs.action },
        }}
        title="Confirm deletion"
        trigger="Delete"
      >
        Body
      </AlertModal>,
    );

    const slotExpectations: readonly [keyof typeof refs, string, string][] = [
      ["root", "root", "root-class"],
      ["trigger", "trigger", "trigger-class"],
      ["content", "content", "content-class"],
      ["title", "title", "title-class"],
      ["description", "description", "description-class"],
      ["cancel", "cancel", "cancel-class"],
      ["action", "action", "action-class"],
    ];
    for (const [slot, testId, className] of slotExpectations) {
      expect(screen.getByTestId(testId).getAttribute("class")).toContain(className);
      expect(refs[slot].current).toBe(screen.getByTestId(testId));
    }
    expect(screen.getByTestId("trigger").getAttribute("commandfor")).toBe("slot-test");
    expect(screen.getByTestId("trigger").getAttribute("data-variant")).toBe("outline");
    expect(screen.getByTestId("content").getAttribute("aria-labelledby")).toBe("slot-test-title");
    expect(screen.getByTestId("content").getAttribute("aria-describedby")).toBe(
      "slot-test-description",
    );
    expect(screen.getByTestId("title").id).toBe("slot-test-title");
    expect(screen.getByTestId("description").id).toBe("slot-test-description");
    expect(screen.getByTestId("cancel").getAttribute("value")).toBe("cancel");
    expect(screen.getByTestId("action").getAttribute("value")).toBe("confirm");
    expect(screen.getByTestId("title").getAttribute("data-part")).toBe("title");
    expect(screen.getByTestId("description").getAttribute("data-part")).toBe("description");
  });

  it("lets slots override native defaults and remove markers", () => {
    render(
      <AlertModal
        id="alert"
        trigger="Delete"
        title="Delete item"
        description="Description"
        data-testid="root"
        data-part="custom-root"
        data-uiify-alert-modal="custom"
        slotProps={{
          trigger: {
            type: "submit",
            command: "request-close",
            commandfor: "other",
            "data-part": undefined,
          },
          content: {
            role: "dialog",
            "aria-labelledby": "custom-title",
            "aria-describedby": undefined,
          },
          title: { id: "custom-title" },
          description: { id: "custom-description" },
          cancel: { value: "custom-cancel", "data-variant": "outline" },
          action: { command: "show-modal", value: "custom-action" },
        }}
      />,
    );
    expect(screen.getByTestId("root").getAttribute("data-part")).toBe("custom-root");
    const trigger = screen.getByRole("button", { name: "Delete" });
    expect(trigger.getAttribute("type")).toBe("submit");
    expect(trigger.getAttribute("command")).toBe("request-close");
    expect(trigger.getAttribute("commandfor")).toBe("other");
    expect(trigger.hasAttribute("data-part")).toBe(false);
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("aria-labelledby")).toBe("custom-title");
    expect(dialog.hasAttribute("aria-describedby")).toBe(false);
    expect(screen.getByText("Delete item").id).toBe("custom-title");
    expect(screen.getByText("Description").id).toBe("custom-description");
    expect(screen.getByRole("button", { name: "Cancel", hidden: true }).getAttribute("value")).toBe(
      "custom-cancel",
    );
    expect(
      screen.getByRole("button", { name: "Confirm", hidden: true }).getAttribute("command"),
    ).toBe("show-modal");
  });
  it("lets explicit undefined remove native invoker defaults", () => {
    render(
      <AlertModal
        id="alert"
        trigger="Open"
        title="Title"
        slotProps={{ trigger: { command: undefined, commandfor: undefined } }}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.hasAttribute("command")).toBe(false);
    expect(trigger.hasAttribute("commandfor")).toBe(false);
  });
});
