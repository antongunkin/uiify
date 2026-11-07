import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./AlertDialogParts.js";

describe("AlertDialog native parts", () => {
  it("renders an alertdialog opened by show-modal and closed by request-close", () => {
    const html = renderToStaticMarkup(
      <>
        <AlertDialogTrigger target="delete">Delete</AlertDialogTrigger>
        <AlertDialogContent aria-labelledby="delete-title" id="delete">
          <h2 id="delete-title">Delete item?</h2>
          <AlertDialogCancel target="delete" value="cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction target="delete" value="confirm">
            Confirm
          </AlertDialogAction>
        </AlertDialogContent>
      </>,
    );

    expect(html).toContain('command="show-modal"');
    expect(html).toContain('commandfor="delete"');
    expect(html).toContain('role="alertdialog"');
    const parsed = document.createElement("div");
    parsed.innerHTML = html;
    expect(parsed.querySelector(".uiify-alert-dialog-content")).not.toBeNull();
    expect(html).toContain('value="cancel"');
    expect(html).toContain('value="confirm"');
    expect((html.match(/command="request-close"/g) ?? []).length).toBe(2);
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("<form");
  });

  it("forwards refs and marks each part", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <AlertDialogAction ref={ref} target="delete">
        Confirm
      </AlertDialogAction>,
    );
    const button = screen.getByRole("button", { name: "Confirm" });
    expect(ref.current).toBe(button);
    expect(button.hasAttribute("data-uiify-alert-dialog")).toBe(false);
    expect(button.classList.contains("uiify-button")).toBe(true);
    expect(button.classList.contains("uiify-alert-dialog-action")).toBe(true);
    expect(button.getAttribute("data-variant")).toBe("destructive");
    expect(button.getAttribute("type")).toBe("button");
  });

  it("marks cancel as a shared ghost button", () => {
    render(
      <AlertDialogCancel ref={createRef<HTMLButtonElement>()} target="delete">
        Cancel
      </AlertDialogCancel>,
    );
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button.classList.contains("uiify-button")).toBe(true);
    expect(button.getAttribute("data-variant")).toBe("secondary");
  });

  it("lets direct parts override defaults", () => {
    const contentRef = createRef<HTMLDialogElement>();
    const contentRole = "dialog";
    render(
      <>
        <AlertDialogTrigger
          target="alert"
          type="submit"
          command="request-close"
          commandfor="other"
          data-part="custom"
        >
          Open
        </AlertDialogTrigger>
        <AlertDialogContent
          id="alert"
          role={contentRole}
          data-uiify-alert-dialog="custom"
          ref={contentRef}
        >
          Content
        </AlertDialogContent>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.getAttribute("type")).toBe("submit");
    expect(trigger.getAttribute("command")).toBe("request-close");
    expect(trigger.getAttribute("commandfor")).toBe("other");
    expect(trigger.getAttribute("data-part")).toBe("custom");
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBe(contentRef.current);
    expect(dialog.getAttribute("data-uiify-alert-dialog")).toBe("custom");
  });

  it("rejects dangerous HTML on native parts at the type level", () => {
    const elements = [
      <AlertDialogTrigger key="trigger" target="dialog">
        Open
      </AlertDialogTrigger>,
      <AlertDialogContent
        key="content"
        id="dialog"
        // @ts-expect-error -- the part renders its own children.
        dangerouslySetInnerHTML={{ __html: "unsafe" }}
      />,
    ];
    expect(elements).toHaveLength(2);
  });
});
