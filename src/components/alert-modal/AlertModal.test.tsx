import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { AlertModal } from "./AlertModal.js";
import type { AlertModalProps, AlertModalSlotProps } from "./types.js";

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

  it("filters hostile JavaScript props without losing native alertdialog behavior", () => {
    const dangerousHtml = { dangerouslySetInnerHTML: { __html: "injected" } };
    const hostileSlots = {
      trigger: {
        ...dangerousHtml,
        command: "request-close",
        commandfor: "wrong",
        popoverTarget: "wrong",
        type: "submit",
      },
      content: {
        ...dangerousHtml,
        "aria-describedby": "wrong-description",
        "aria-labelledby": "wrong-title",
        id: "wrong-id",
        open: true,
        popover: "auto",
        role: "dialog",
      },
      title: { ...dangerousHtml, id: "wrong-title" },
      description: { ...dangerousHtml, id: "wrong-description" },
      cancel: { ...dangerousHtml, command: "show-modal", type: "submit", value: "confirm" },
      action: { ...dangerousHtml, command: "show-modal", type: "submit", value: "cancel" },
    } as unknown as AlertModalSlotProps;
    const hostileRoot = {
      className: "root-class",
      "data-testid": "safe-root",
      "data-part": "wrong",
      "data-uiify-alert-modal": "wrong",
      ...dangerousHtml,
    } as unknown as AlertModalProps;
    render(
      <AlertModal
        {...hostileRoot}
        description="Description"
        id="safe-alert"
        slotProps={hostileSlots}
        title="Confirm deletion"
        trigger="Delete"
      >
        Body
      </AlertModal>,
    );

    const root = screen.getByTestId("safe-root");
    const trigger = screen.getByRole("button", { name: "Delete" });
    const dialog = screen.getByRole("alertdialog", { hidden: true });
    const cancel = screen.getByRole("button", { name: "Cancel", hidden: true });
    const action = screen.getByRole("button", { name: "Confirm", hidden: true });
    expect(root.textContent).not.toContain("injected");
    expect(root.getAttribute("data-part")).toBe("root");
    expect(trigger.getAttribute("command")).toBe("show-modal");
    expect(trigger.getAttribute("commandfor")).toBe("safe-alert");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.hasAttribute("popovertarget")).toBe(false);
    expect(dialog.id).toBe("safe-alert");
    expect(dialog.getAttribute("role")).toBe("alertdialog");
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("popover")).toBe(false);
    expect(dialog.getAttribute("aria-labelledby")).toBe("safe-alert-title");
    expect(dialog.getAttribute("aria-describedby")).toBe("safe-alert-description");
    expect(cancel.getAttribute("value")).toBe("cancel");
    expect(cancel.getAttribute("command")).toBe("request-close");
    expect(action.getAttribute("value")).toBe("confirm");
    expect(action.getAttribute("command")).toBe("request-close");
  });
});
