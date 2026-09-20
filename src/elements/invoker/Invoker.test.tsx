import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Invoker } from "./Invoker.js";
import type { NativeCommand } from "./types.js";

function FancyButton(props: ComponentPropsWithRef<"button"> & { readonly variant?: string }) {
  const { variant = "solid", ...rest } = props;
  return <button {...rest} data-variant={variant} />;
}
FancyButton.displayName = "FancyButton";

describe("Invoker", () => {
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
      <Invoker command={command} commandfor="target-id">
        Open
      </Invoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("command")).toBe(command);
    expect(button.getAttribute("commandfor")).toBe("target-id");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.hasAttribute("data-uiify-invoker")).toBe(true);
  });

  it("renders the same attributes during SSR", () => {
    const markup = renderToStaticMarkup(
      <Invoker command="show-modal" commandfor="settings">
        Open settings
      </Invoker>,
    );
    expect(markup).toContain('command="show-modal"');
    expect(markup).toContain('commandfor="settings"');
    expect(markup).toContain('type="button"');
    expect(markup).toContain("data-uiify-invoker");
  });

  it("forwards the ref to the native button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Invoker command="show-modal" commandfor="settings" ref={ref}>
        Open
      </Invoker>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "Open" }));
  });

  it("renders a custom button component and forwards its own props", () => {
    render(
      <Invoker as={FancyButton} command="show-modal" commandfor="settings" variant="ghost">
        Open
      </Invoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.getAttribute("data-variant")).toBe("ghost");
    expect(button.getAttribute("command")).toBe("show-modal");
  });

  it("calls the consumer onClick once and lets it cancel the native action", () => {
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <Invoker command="hide-popover" commandfor="menu" onClick={onClick}>
        Close
      </Invoker>,
    );
    const cancelled = fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(cancelled).toBe(false);
  });

  it("keeps a consumer className alongside the marker attribute", () => {
    render(
      <Invoker className="my-invoker" command="show-modal" commandfor="settings">
        Open
      </Invoker>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button.className).toBe("my-invoker");
    expect(button.hasAttribute("data-uiify-invoker")).toBe(true);
  });
});
