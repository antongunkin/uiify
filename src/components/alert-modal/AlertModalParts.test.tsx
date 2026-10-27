import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  AlertModalAction,
  AlertModalCancel,
  AlertModalContent,
  AlertModalTrigger,
} from "./AlertModalParts.js";
import type { AlertModalContentProps, AlertModalTriggerProps } from "./types.js";

describe("AlertModal native parts", () => {
  it("renders an alertdialog opened by show-modal and closed by request-close", () => {
    const html = renderToStaticMarkup(
      <>
        <AlertModalTrigger target="delete">Delete</AlertModalTrigger>
        <AlertModalContent aria-labelledby="delete-title" id="delete">
          <h2 id="delete-title">Delete item?</h2>
          <AlertModalCancel target="delete" value="cancel">
            Cancel
          </AlertModalCancel>
          <AlertModalAction target="delete" value="confirm">
            Confirm
          </AlertModalAction>
        </AlertModalContent>
      </>,
    );

    expect(html).toContain('command="show-modal"');
    expect(html).toContain('commandfor="delete"');
    expect(html).toContain('role="alertdialog"');
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    expect(parsed.querySelector('[data-uiify-alert-modal][data-part="content"]')).not.toBeNull();
    expect(html).toContain('value="cancel"');
    expect(html).toContain('value="confirm"');
    expect((html.match(/command="request-close"/g) ?? []).length).toBe(2);
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("<form");
  });

  it("forwards refs and marks each part", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <AlertModalAction ref={ref} target="delete">
        Confirm
      </AlertModalAction>,
    );
    const button = screen.getByRole("button", { name: "Confirm" });
    expect(ref.current).toBe(button);
    expect(button.getAttribute("data-uiify-alert-modal")).toBe("");
    expect(button.getAttribute("data-uiify-button")).toBe("");
    expect(button.getAttribute("data-part")).toBe("action");
    expect(button.getAttribute("data-variant")).toBe("destructive");
    expect(button.getAttribute("type")).toBe("button");
  });

  it("marks cancel as a shared ghost button", () => {
    render(
      <AlertModalCancel ref={createRef<HTMLButtonElement>()} target="delete">
        Cancel
      </AlertModalCancel>,
    );
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button.getAttribute("data-uiify-button")).toBe("");
    expect(button.getAttribute("data-variant")).toBe("secondary");
  });

  it("keeps direct parts customizable while filtering hostile native behavior props", () => {
    const triggerProps = {
      target: "direct-alert",
      command: "request-close",
      commandfor: "wrong",
      dangerouslySetInnerHTML: { __html: "injected trigger" },
      popoverTarget: "wrong",
      type: "submit",
      className: "direct-trigger",
    } as unknown as AlertModalTriggerProps;
    const contentRef = createRef<HTMLDialogElement>();
    const contentProps = {
      id: "direct-alert",
      open: true,
      popover: "auto",
      role: "dialog",
      dangerouslySetInnerHTML: { __html: "injected content" },
      className: "direct-content",
      ref: contentRef,
    } as unknown as AlertModalContentProps;
    render(
      <>
        <AlertModalTrigger {...triggerProps}>Open</AlertModalTrigger>
        <AlertModalContent {...contentProps}>Safe content</AlertModalContent>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = screen.getByRole("alertdialog", { hidden: true });
    expect(trigger.className).toContain("direct-trigger");
    expect(trigger.getAttribute("command")).toBe("show-modal");
    expect(trigger.getAttribute("commandfor")).toBe("direct-alert");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.hasAttribute("popovertarget")).toBe(false);
    expect(dialog).toBe(contentRef.current);
    expect(dialog.className).toContain("direct-content");
    expect(dialog.getAttribute("role")).toBe("alertdialog");
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("popover")).toBe(false);
    expect(dialog.textContent).toBe("Safe content");
  });

  it("rejects dangerous HTML on native parts at the type level", () => {
    const elements = [
      <AlertModalTrigger key="trigger" target="dialog">
        Open
      </AlertModalTrigger>,
      <AlertModalContent
        key="content"
        id="dialog"
        // @ts-expect-error -- the part renders its own children.
        dangerouslySetInnerHTML={{ __html: "unsafe" }}
      />,
    ];
    expect(elements).toHaveLength(2);
  });
});
