import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { ContextMenu } from "./ContextMenu.js";

describe("ContextMenu", () => {
  it("opens at pointer coordinates on contextmenu", () => {
    const { container } = render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const trigger = screen.getByText("Area");
    fireEvent.contextMenu(trigger, { clientX: 120, clientY: 80 });
    expect(screen.getByRole("menuitem", { name: "Copy" })).toBeTruthy();
    expect(trigger.getAttribute("data-anchor")).toBeNull();
    expect(container.querySelector("[data-virtual-anchor]")?.getAttribute("data-anchor")).toBe(
      container.querySelector("[role=menu]")?.getAttribute("data-anchor"),
    );
  });

  it("anchors default-open menus to their trigger instead of the viewport origin", () => {
    const { container } = render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const trigger = screen.getByText("Area");
    const virtualAnchor = container.querySelector("[data-virtual-anchor]");
    const content = screen.getByRole("menu");

    expect(trigger.getAttribute("data-anchor")).toBeTruthy();
    expect(virtualAnchor?.getAttribute("data-anchor")).toBeNull();
    expect(content.getAttribute("data-anchor")).toBe(trigger.getAttribute("data-anchor"));
  });

  it("selects an item and closes the menu", () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onSelect}>Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Cut" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("moves focus with arrow keys", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item textValue="Alpha">Alpha</ContextMenu.Item>
          <ContextMenu.Item textValue="Beta">Beta</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const alpha = screen.getByRole("menuitem", { name: "Alpha" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Beta" }));
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    expect(markup).toContain('data-virtual-anchor=""');
    expect(markup).toContain('role="menu"');
  });

  it("lets a consumer onContextMenu veto opening at pointer (policy #6: dismiss veto)", () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger onContextMenu={(event) => event.preventDefault()}>
          Area
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText("Area"), { clientX: 120, clientY: 80 });
    expect(screen.queryByRole("menuitem", { name: "Copy" })).toBeNull();
  });

  it("owns Content's role, data-state, and positioning attributes regardless of consumer override", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content
          role="alert"
          data-state="bogus"
          id="my-id"
          data-align="end"
          data-side="top"
        >
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const content = screen.getByRole("menu");
    expect(content.getAttribute("data-state")).toBe("open");
    expect(content.getAttribute("data-uiify-menu")).toBe("");
    expect(content.getAttribute("data-part")).toBe("content");
    expect(content.id).not.toBe("my-id");
    expect(content.getAttribute("data-align")).toBe("start");
    expect(content.getAttribute("data-side")).toBe("bottom");
  });

  it("lets a consumer onKeyDown veto Escape-to-close on Content (policy #4)", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content onKeyDown={(event) => event.preventDefault()}>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.getByRole("menuitem", { name: "Copy" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Copy" }).getAttribute("data-part")).toBe("item");
  });

  it("owns Item's role regardless of consumer override", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item role="button">Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    expect(screen.getByRole("menuitem", { name: "Cut" })).toBeTruthy();
  });

  it("lets a consumer onClick veto item selection (policy #3), leaving the menu open", () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onSelect} onClick={(event) => event.preventDefault()}>
            Cut
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Cut" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menuitem", { name: "Cut" })).toBeTruthy();
  });

  it("lets a consumer onKeyDown veto arrow navigation without suppressing Enter-driven selection", () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item
            textValue="Alpha"
            onSelect={onSelect}
            onKeyDown={(event) => {
              if (event.key.startsWith("Arrow")) event.preventDefault();
            }}
          >
            Alpha
          </ContextMenu.Item>
          <ContextMenu.Item textValue="Beta">Beta</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const alpha = screen.getByRole("menuitem", { name: "Alpha" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowDown" });
    expect(document.activeElement).toBe(alpha);

    fireEvent.keyDown(alpha, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("owns CheckboxItem's role, aria-checked, and data-state regardless of consumer override", () => {
    // CheckboxItem's public prop type has no native-attribute pass-through, but the
    // implementation still spreads unrecognized keys into consumerProps at runtime —
    // the `as any` below exercises that path the same way an untyped/JS consumer would.
    const overrides = {
      checked: true,
      role: "menuitem",
      "aria-checked": false,
      "data-state": "unchecked",
    } as any;
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem {...overrides}>Bold</ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const item = screen.getByRole("menuitemcheckbox", { name: "Bold" });
    expect(item.getAttribute("aria-checked")).toBe("true");
    expect(item.getAttribute("data-state")).toBe("checked");
  });

  it("lets a consumer onClick veto CheckboxItem selection, leaving checked value unchanged", () => {
    const onCheckedChange = vi.fn();
    const overrides = {
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    } as any;
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
            {...overrides}
          >
            Bold
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Bold" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Bold" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("owns RadioItem's role, aria-checked, and data-state regardless of consumer override", () => {
    const overrides = { role: "menuitem", "aria-checked": true, "data-state": "unchecked" } as any;
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.RadioItem value="a" {...overrides}>
            A
          </ContextMenu.RadioItem>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const item = screen.getByRole("menuitemradio", { name: "A" });
    expect(item.getAttribute("aria-checked")).toBe("false");
    expect(item.getAttribute("data-state")).toBe("unchecked");
  });

  it("lets a consumer onClick veto RadioItem selection, leaving the radio value unchanged", () => {
    const overrides = {
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    } as any;
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.RadioItem value="a" {...overrides}>
            A
          </ContextMenu.RadioItem>
          <ContextMenu.RadioItem value="b">B</ContextMenu.RadioItem>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitemradio", { name: "A" }));
    expect(screen.getByRole("menuitemradio", { name: "A" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("owns SubTrigger's role, aria-haspopup, and aria-expanded regardless of consumer override", () => {
    const overrides = { role: "menuitem", "aria-haspopup": false, "aria-expanded": true } as any;
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          {/* A leading plain item avoids Content's mount-time auto-focus landing on
              SubTrigger itself, which would flip sub.open via its own (unrelated,
              pre-existing) onFocus handler before this assertion runs. */}
          <ContextMenu.Item>First</ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.Sub.Trigger {...overrides}>More</ContextMenu.Sub.Trigger>
            <ContextMenu.Sub.Content>
              <ContextMenu.Item>Nested</ContextMenu.Item>
            </ContextMenu.Sub.Content>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const trigger = screen.getByRole("menuitem", { name: "More" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("selects a RadioItem, checking it and closing the menu", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.RadioItem value="a">A</ContextMenu.RadioItem>
          <ContextMenu.RadioItem value="b">B</ContextMenu.RadioItem>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitemradio", { name: "B" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on Escape from Content", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("calls .focus() on the trigger element when Content closes via Escape — a no-op for the default div trigger (it carries no tabIndex, pre-existing and out of this task's scope), but observable when the trigger is a focusable element", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger as="button">Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Area" });
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("skips a disabled item when opening at the pointer — the behavior ContextMenu did not have", () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item disabled>Alpha</ContextMenu.Item>
          <ContextMenu.Item>Beta</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText("Area"), { clientX: 10, clientY: 10 });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Beta" }));
  });
});
