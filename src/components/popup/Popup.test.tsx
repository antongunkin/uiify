import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Popup } from "./Popup.js";

describe("Popup (server)", () => {
  it("links trigger and content with commandfor and anchor positioning attrs", () => {
    render(
      <Popup.Root id="actions">
        <Popup.Trigger>Open</Popup.Trigger>
        <Popup.Content side="top" align="start">
          Panel
        </Popup.Content>
      </Popup.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    const panel = screen.getByText("Panel");

    expect(trigger.getAttribute("commandfor")).toBe("actions");
    expect(trigger.getAttribute("command")).toBe("toggle-popover");
    expect(trigger.getAttribute("aria-controls")).toBe("actions");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.id).toBe("actions");
    expect(panel.getAttribute("popover")).toBe("auto");
    expect(panel.getAttribute("data-side")).toBe("top");
    expect(panel.getAttribute("data-align")).toBe("start");
    expect(panel.getAttribute("data-positioning")).toBe("native");
    expect(trigger.style.getPropertyValue("--uiify-anchor")).toBe("--actions-anchor");
    expect(panel.style.getPropertyValue("--uiify-anchor")).toBe("--actions-anchor");
  });

  it("keeps a consumer style alongside the anchor custom property", () => {
    render(
      <Popup.Root id="styled">
        <Popup.Trigger style={{ color: "red" }}>Open</Popup.Trigger>
        <Popup.Content style={{ zIndex: 5 }}>Panel</Popup.Content>
      </Popup.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    const panel = screen.getByText("Panel");

    expect(trigger.style.color).toBe("red");
    expect(trigger.style.getPropertyValue("--uiify-anchor")).toBe("--styled-anchor");
    expect(panel.style.zIndex).toBe("5");
    expect(panel.style.getPropertyValue("--uiify-anchor")).toBe("--styled-anchor");
  });

  it("never claims expanded — popovers have no declarative open state", () => {
    render(
      <Popup.Root id="menu">
        <Popup.Trigger>Open</Popup.Trigger>
        <Popup.Content>Panel</Popup.Content>
      </Popup.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    const panel = screen.getByText("Panel");
    expect(panel.hasAttribute("open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("wires Close with hide-popover command", () => {
    render(
      <Popup.Root id="menu">
        <Popup.Trigger>Open</Popup.Trigger>
        <Popup.Content>
          <Popup.Close>Dismiss</Popup.Close>
        </Popup.Content>
      </Popup.Root>,
    );

    const close = screen.getByRole("button", { name: "Dismiss", hidden: true });
    expect(close.getAttribute("commandfor")).toBe("menu");
    expect(close.getAttribute("command")).toBe("hide-popover");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Popup.Root id="menu">
        <Popup.Trigger>Open</Popup.Trigger>
        <Popup.Content>Panel</Popup.Content>
      </Popup.Root>,
    );
    expect(markup).toContain('commandfor="menu"');
    expect(markup).toContain('command="toggle-popover"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('popover="auto"');
    expect(markup).toContain('data-positioning="native"');
  });
});
