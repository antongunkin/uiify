import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  NativeDialog,
  NativeDialogClose,
  NativeDialogContent,
  NativeDialogTrigger,
} from "./NativeDialog.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("NativeDialog", () => {
  it("renders a show-modal invoker, a plain dialog and a request-close invoker without a Root", () => {
    const html = renderToStaticMarkup(
      <>
        <NativeDialogTrigger className="custom" target="settings">
          Open
        </NativeDialogTrigger>
        <section>
          <NativeDialogContent aria-labelledby="settings-title" id="settings">
            <h2 id="settings-title">Settings</h2>
            <NativeDialogClose target="settings">Close</NativeDialogClose>
          </NativeDialogContent>
        </section>
      </>,
    );

    expect(html).toContain('command="show-modal"');
    expect(html).toContain('commandfor="settings"');
    expect(html).toContain('command="request-close"');
    expect(html).toContain('class="uiify-native-dialog-trigger custom"');
    expect(html).toContain('<h2 id="settings-title">Settings</h2>');
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const content = parsed.querySelector("dialog.uiify-native-dialog-content");
    expect(content).not.toBeNull();
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("aria-expanded=");
    expect(html).not.toContain("data-state=");
    expect(html).not.toContain("<dialog open");
  });

  it("lets consumer props replace the invoker defaults", () => {
    render(
      <NativeDialogTrigger
        {...{ command: "request-close", commandfor: "other" }}
        data-part="opener"
        target="settings"
        type="submit"
      >
        Open
      </NativeDialogTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("submit");
    expect(button.getAttribute("command")).toBe("request-close");
    expect(button.getAttribute("commandfor")).toBe("other");
    expect(button.getAttribute("data-part")).toBe("opener");
    expect(button.className).toBe("uiify-native-dialog-trigger");
  });

  it("writes type=button and the invoker attributes by default", () => {
    render(
      <NativeDialogTrigger target="settings" onClick={() => {}}>
        Open
      </NativeDialogTrigger>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("command")).toBe("show-modal");
    expect(button.getAttribute("commandfor")).toBe("settings");
    expect(button.className).toBe("uiify-native-dialog-trigger");
    expect(button.hasAttribute("data-part")).toBe(false);
  });

  it("calls the consumer onClick once and lets it cancel the native action", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <NativeDialogTrigger target="settings" onClick={onClick}>
        Open
      </NativeDialogTrigger>,
    );
    const notCancelled = fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
  });

  it("forwards a single ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NativeDialogClose ref={ref} target="settings">
        Close
      </NativeDialogClose>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "Close" }));
    expect(ref.current?.getAttribute("command")).toBe("request-close");
    expect(ref.current?.className).toBe("uiify-native-dialog-close");
  });

  it("renders a custom button component as the invoker and keeps its own props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NativeDialogTrigger as={FancyButton} ref={ref} target="settings" variant="ghost">
        Open
      </NativeDialogTrigger>,
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
      <NativeDialogContent aria-label="Settings" className="panel" id="settings" ref={ref}>
        Body
      </NativeDialogContent>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBe(ref.current);
    expect(dialog.className).toBe("uiify-native-dialog-content panel");
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("popover")).toBe(false);
  });

  it("accepts aria-labelledby as the alternative accessible name", () => {
    render(
      <NativeDialogContent aria-labelledby="settings-title" id="settings">
        <h2 id="settings-title">Settings</h2>
      </NativeDialogContent>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("aria-labelledby")).toBe("settings-title");
    expect(dialog.hasAttribute("aria-label")).toBe(false);
  });

  it("exposes the same parts through the NativeDialog compound object", () => {
    expect(NativeDialog.Trigger).toBe(NativeDialogTrigger);
    expect(NativeDialog.Content).toBe(NativeDialogContent);
    expect(NativeDialog.Close).toBe(NativeDialogClose);
  });
  it("keeps the identity class when consumers add their own markers", () => {
    render(
      <NativeDialogContent aria-label="Settings" id="settings" data-part="custom">
        Body
      </NativeDialogContent>,
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.getAttribute("data-part")).toBe("custom");
    expect(dialog.className).toBe("uiify-native-dialog-content");
  });
});
