import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { NativeInvoker } from "./NativeInvoker.js";
import type { NativeCommand } from "./types.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("NativeInvoker", () => {
  it.each<NativeCommand>([
    "show-modal",
    "request-close",
    "close",
    "show-popover",
    "hide-popover",
    "toggle-popover",
    "--custom-thing",
  ])("renders %s with commandfor and the marker attribute", (command) => {
    render(
      <NativeInvoker command={command} commandfor="target-id">
        Open
      </NativeInvoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("command")).toBe(command);
    expect(button.getAttribute("commandfor")).toBe("target-id");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toBe("uiify-native-invoker");
  });

  it("lets consumer props replace type and keeps the identity class", () => {
    render(
      <NativeInvoker command="show-modal" commandfor="settings" type="submit">
        Open
      </NativeInvoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("type")).toBe("submit");
    expect(button.className).toBe("uiify-native-invoker");
    expect(button.getAttribute("command")).toBe("show-modal");
  });

  it("renders the same attributes during SSR", () => {
    const markup = renderToStaticMarkup(
      <NativeInvoker command="show-modal" commandfor="settings">
        Open settings
      </NativeInvoker>,
    );
    expect(markup).toContain('command="show-modal"');
    expect(markup).toContain('commandfor="settings"');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('class="uiify-native-invoker"');
  });

  it("forwards the ref to the native button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NativeInvoker command="show-modal" commandfor="settings" ref={ref}>
        Open
      </NativeInvoker>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "Open" }));
  });

  it("renders a custom button component and forwards its own props", () => {
    render(
      <NativeInvoker as={FancyButton} command="show-modal" commandfor="settings" variant="ghost">
        Open
      </NativeInvoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("data-variant")).toBe("ghost");
    expect(button.getAttribute("command")).toBe("show-modal");
  });

  it("calls the consumer onClick once and lets it cancel the native action", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <NativeInvoker command="hide-popover" commandfor="menu" onClick={onClick}>
        Close
      </NativeInvoker>,
    );
    const cancelled = fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(cancelled).toBe(false);
  });

  it("joins a consumer className with the identity class", () => {
    render(
      <NativeInvoker className="my-invoker" command="show-modal" commandfor="settings">
        Open
      </NativeInvoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.className).toBe("uiify-native-invoker my-invoker");
  });
});
