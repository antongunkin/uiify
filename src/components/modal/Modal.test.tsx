import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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

  it("allows the close label to be localized while closeLabel keeps priority", () => {
    const { rerender } = render(
      <Modal id="settings" trigger="Open" title="Settings" labels={{ close: "إغلاق" }} />,
    );
    expect(screen.getByRole("button", { name: "إغلاق", hidden: true })).toBeTruthy();

    rerender(
      <Modal
        id="settings"
        trigger="Open"
        title="Settings"
        labels={{ close: "إغلاق" }}
        closeLabel="Dismiss"
      />,
    );
    expect(screen.getByRole("button", { name: "Dismiss", hidden: true })).toBeTruthy();
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

  it("renders header (title, description, close), body and footer in order", () => {
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
    expect(close?.childNodes).toHaveLength(0);
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

  it("forwards slot props to every generated element while keeping owned semantics", () => {
    const refs = {
      root: createRef<HTMLDivElement>(),
      trigger: createRef<HTMLButtonElement>(),
      content: createRef<HTMLDialogElement>(),
      grabber: createRef<HTMLDivElement>(),
      header: createRef<HTMLDivElement>(),
      title: createRef<HTMLHeadingElement>(),
      description: createRef<HTMLParagraphElement>(),
      close: createRef<HTMLButtonElement>(),
      body: createRef<HTMLDivElement>(),
      footer: createRef<HTMLDivElement>(),
    };
    render(
      <Modal
        className="root-class"
        data-testid="root"
        ref={refs.root}
        description="Details"
        footer="Actions"
        id="slot-test"
        slotProps={{
          trigger: { className: "trigger-class", "data-testid": "trigger", ref: refs.trigger },
          content: { className: "content-class", "data-testid": "content", ref: refs.content },
          grabber: { className: "grabber-class", "data-testid": "grabber", ref: refs.grabber },
          header: { className: "header-class", "data-testid": "header", ref: refs.header },
          title: { className: "title-class", "data-testid": "title", ref: refs.title },
          description: {
            className: "description-class",
            "data-testid": "description",
            ref: refs.description,
          },
          close: { className: "close-class", "data-testid": "close", ref: refs.close },
          body: { className: "body-class", "data-testid": "body", ref: refs.body },
          footer: { className: "footer-class", "data-testid": "footer", ref: refs.footer },
        }}
        title="Preferences"
        trigger="Open"
      >
        Content
      </Modal>,
    );

    const slotExpectations: readonly [keyof typeof refs, string, string][] = [
      ["root", "root", "root-class"],
      ["trigger", "trigger", "trigger-class"],
      ["content", "content", "content-class"],
      ["grabber", "grabber", "grabber-class"],
      ["header", "header", "header-class"],
      ["title", "title", "title-class"],
      ["description", "description", "description-class"],
      ["close", "close", "close-class"],
      ["body", "body", "body-class"],
      ["footer", "footer", "footer-class"],
    ];
    for (const [slot, testId, className] of slotExpectations) {
      expect(screen.getByTestId(testId).getAttribute("class")).toContain(className);
      expect(refs[slot].current).toBe(screen.getByTestId(testId));
    }
    expect(screen.getByTestId("trigger").getAttribute("commandfor")).toBe("slot-test");
    expect(screen.getByTestId("content").getAttribute("aria-labelledby")).toBe("slot-test-title");
    expect(screen.getByTestId("content").getAttribute("aria-describedby")).toBe(
      "slot-test-description",
    );
    expect(screen.getByTestId("title").id).toBe("slot-test-title");
    expect(screen.getByTestId("description").id).toBe("slot-test-description");
    expect(screen.getByTestId("close").getAttribute("aria-label")).toBe("Close");
  });

  it("keeps library defaults when slot props do not override them", () => {
    render(<Modal id="m" trigger="Open" title="Preferences" description="Details" />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(trigger.getAttribute("command")).toBe("show-modal");
    expect(trigger.getAttribute("commandfor")).toBe("m");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(dialog.id).toBe("m");
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.getAttribute("closedby")).toBe("any");
    expect(dialog.getAttribute("aria-labelledby")).toBe("m-title");
  });

  it("lets slot props override any library default", () => {
    render(
      <Modal
        id="m"
        trigger="Open"
        title="Preferences"
        slotProps={{
          trigger: { type: "submit", "data-part": "opener" },
          content: { closedby: "none", "aria-labelledby": "custom-title" },
          title: { id: "custom-title" },
          grabber: { "aria-hidden": false, "data-testid": "grabber" },
          header: { "data-part": undefined, "data-testid": "header" },
        }}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(trigger.getAttribute("type")).toBe("submit");
    expect(trigger.getAttribute("data-part")).toBe("opener");
    expect(dialog.getAttribute("closedby")).toBe("none");
    expect(dialog.getAttribute("aria-labelledby")).toBe("custom-title");
    expect(screen.getByText("Preferences").id).toBe("custom-title");
    expect(screen.getByTestId("grabber").getAttribute("aria-hidden")).toBe("false");
    expect(screen.getByTestId("header").hasAttribute("data-part")).toBe(false);
  });
});
