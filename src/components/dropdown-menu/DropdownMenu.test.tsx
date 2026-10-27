import { Profiler, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import type { DropdownMenuBarProps, DropdownMenuRootProps } from "./types.js";
import { DropdownMenu } from "./DropdownMenu.js";

function RtlSubmenu({ side }: { readonly side?: "left" | "right" }) {
  return (
    <div dir="rtl">
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent {...(side ? { side } : {})}>
              <DropdownMenu.Item>Copy link</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
RtlSubmenu.displayName = "RtlSubmenu";

describe("DropdownMenu", () => {
  it("forwards native props, class, style, and ref to Root while protecting its marker", () => {
    const rootRef = { current: null as HTMLDivElement | null };
    const rootProps = {
      className: "menu-root",
      "data-testid": "menu-root",
      "data-uiify-menu": "consumer",
      dangerouslySetInnerHTML: { __html: "<b>unwanted root markup</b>" },
      style: { color: "red" },
      ref: rootRef,
    } as unknown as DropdownMenuRootProps;
    render(
      <DropdownMenu.Root {...rootProps}>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const root = screen.getByTestId("menu-root");
    expect(root.className).toBe("menu-root");
    expect(root.style.color).toBe("red");
    expect(root.getAttribute("data-uiify-menu")).toBe("");
    expect(root.querySelector("b")).toBeNull();
    expect(rootRef.current).toBe(root);
  });

  it("uses Root id for the popup and its trigger relationship", () => {
    render(
      <DropdownMenu.Root id="actions-popup">
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-controls")).toBe(
      "actions-popup",
    );
    expect(document.getElementById("actions-popup")?.getAttribute("role")).toBe("menu");
  });

  it("forwards native props, class, and ref to Bar", () => {
    const barRef = { current: null as HTMLDivElement | null };
    const barProps = {
      className: "bar",
      "data-testid": "menu-bar",
      dangerouslySetInnerHTML: { __html: "<b>unwanted bar markup</b>" },
      ref: barRef,
    } as unknown as DropdownMenuBarProps;
    render(
      <DropdownMenu.Bar {...barProps}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Cut</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </DropdownMenu.Bar>,
    );

    const bar = screen.getByTestId("menu-bar");
    expect(bar.className).toBe("bar");
    expect(bar.getAttribute("role")).toBe("menubar");
    expect(bar.tabIndex).toBe(-1);
    expect(bar.querySelector("b")).toBeNull();
    expect(barRef.current).toBe(bar);
  });

  it("lets the Bar key handler veto delegated arrow navigation", () => {
    const onKeyDown = vi.fn((event: ReactKeyboardEvent<HTMLDivElement>) => event.preventDefault());
    render(
      <DropdownMenu.Bar onKeyDown={onKeyDown}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>File</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>New</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Edit</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Undo</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </DropdownMenu.Bar>,
    );

    const file = screen.getByRole("button", { name: "File" });
    const edit = screen.getByRole("button", { name: "Edit" });
    file.focus();
    fireEvent.keyDown(file, { key: "ArrowRight" });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(file);
    expect(edit.tabIndex).toBe(-1);
  });

  it("marks handled Bar navigation as prevented for ancestor handlers", () => {
    const parentOnKeyDown = vi.fn();
    render(
      <div aria-label="Commands" onKeyDown={parentOnKeyDown} role="toolbar" tabIndex={-1}>
        <DropdownMenu.Bar>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>File</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>New</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>Edit</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>Undo</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </DropdownMenu.Bar>
      </div>,
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "File" }), { key: "ArrowRight" });
    expect(parentOnKeyDown.mock.calls[0]?.[0].defaultPrevented).toBe(true);
  });

  it("opens from the trigger and selects an item", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelect}>Cut</DropdownMenu.Item>
          <DropdownMenu.Item>Copy</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Cut" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("cancels selection when preventDefault is called", () => {
    const onSelect = vi.fn((event) => event.preventDefault());
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelect}>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Cut" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.getByRole("menuitem", { name: "Cut", hidden: true })).toBeTruthy();
  });

  it("lets a consumer onClick veto item selection before handleSelect runs (policy #3: menu item selection veto)", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelect} onClick={(event) => event.preventDefault()}>
            Cut
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Cut" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("lets a consumer onKeyDown veto keyboard-driven opening (policy #4: menu/trigger keyboard-open veto)", () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger onKeyDown={(event) => event.preventDefault()}>
          Menu
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("lets a consumer onClick veto the trigger's open/close toggle", () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger onClick={(event) => event.preventDefault()}>
          Menu
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("moves focus with arrow keys inside the menu", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item textValue="Alpha">Alpha</DropdownMenu.Item>
          <DropdownMenu.Item textValue="Beta">Beta</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const alpha = screen.getByRole("menuitem", { name: "Alpha" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Beta" }));
  });

  it("rerenders at most two item subtrees when moving focus", () => {
    const renders = Array.from({ length: 100 }, () => 0);
    function Item({ index }: { readonly index: number }) {
      return (
        <Profiler
          id={String(index)}
          onRender={() => {
            renders[index] = (renders[index] ?? 0) + 1;
          }}
        >
          <DropdownMenu.Item textValue={`Item ${index}`}>Item {index}</DropdownMenu.Item>
        </Profiler>
      );
    }
    Item.displayName = "Item";

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {renders.map((_, index) => (
            <Item index={index} key={index} />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    renders.fill(0);
    const first = screen.getByRole("menuitem", { name: "Item 0" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Item 1" }));
    expect(renders.slice(2).every((count) => count === 0)).toBe(true);
    expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(2);
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    expect(markup).toContain('aria-haspopup="menu"');
    expect(markup).toContain('role="menu"');
  });

  it("owns Trigger's aria-controls, aria-expanded, type, aria-haspopup, and data-anchor regardless of consumer override", () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          aria-controls="bogus"
          aria-expanded="true"
          type="submit"
          aria-haspopup="dialog"
          data-anchor="bogus"
        >
          Menu
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger.getAttribute("aria-controls")).not.toBe("bogus");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("data-anchor")).not.toBe("bogus");
  });

  it("owns Content's role, data-align, data-side, and data-state regardless of consumer override", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content role="alert" data-align="end" data-side="top" data-state="bogus">
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const content = screen.getByRole("menu");
    expect(content.getAttribute("data-align")).toBe("start");
    expect(content.getAttribute("data-side")).toBe("bottom");
    expect(content.getAttribute("data-state")).toBe("open");
  });

  it("owns Item's role regardless of consumer override", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item role="button">Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    expect(screen.getByRole("menuitem", { name: "Cut" })).toBeTruthy();
  });

  it("lets a consumer onKeyDown veto arrow navigation on an Item without suppressing Enter-driven selection", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            textValue="Alpha"
            onSelect={onSelect}
            onKeyDown={(event) => {
              if (event.key.startsWith("Arrow")) event.preventDefault();
            }}
          >
            Alpha
          </DropdownMenu.Item>
          <DropdownMenu.Item textValue="Beta">Beta</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const alpha = screen.getByRole("menuitem", { name: "Alpha" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowDown" });
    expect(document.activeElement).toBe(alpha);

    fireEvent.keyDown(alpha, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("renders Separator, Group and Label with their fixed roles", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Group>
            <DropdownMenu.Item>Cut</DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    expect(screen.getByRole("separator")).toBeTruthy();
    expect(screen.getByRole("group")).toBeTruthy();
    expect(screen.getByRole("presentation", { hidden: true })).toBeTruthy();
  });

  it("renders rich item parts with stable data-part hooks", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>
            <DropdownMenu.ItemIcon>Icon</DropdownMenu.ItemIcon>
            <DropdownMenu.ItemText>
              Edit<DropdownMenu.ItemDescription>Change content</DropdownMenu.ItemDescription>
            </DropdownMenu.ItemText>
            <DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    expect(document.querySelector('[data-part="item-icon"]')).toBeTruthy();
    expect(document.querySelector('[data-part="item-text"]')).toBeTruthy();
    expect(document.querySelector('[data-part="item-description"]')).toBeTruthy();
    expect(document.querySelector('[data-part="shortcut"]')).toBeTruthy();
  });

  it("toggles an indeterminate checkbox without closing by default", () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem
            defaultChecked="indeterminate"
            onCheckedChange={onCheckedChange}
          >
            <DropdownMenu.ItemIndicator />
            Show details
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox");
    expect(item.getAttribute("aria-checked")).toBe("mixed");
    fireEvent.click(item);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Actions" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("keeps radio selection exclusive and the menu open", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.RadioGroup defaultValue="comfortable">
            <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const compact = screen.getByRole("menuitemradio", { name: "Compact" });
    fireEvent.click(compact);
    expect(compact.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("button", { name: "Actions" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("renders a native click-open submenu", () => {
    const markup = renderToStaticMarkup(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Archive</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    expect(markup).toContain('data-part="sub-trigger"');
    expect(markup).toContain('command="toggle-popover"');
    expect(markup).toContain('data-part="sub-content"');
  });

  it.each([
    ["click", (trigger: HTMLElement) => fireEvent.click(trigger)],
    ["Enter", (trigger: HTMLElement) => fireEvent.keyDown(trigger, { key: "Enter" })],
    ["hover", (trigger: HTMLElement) => fireEvent.pointerEnter(trigger)],
  ])("opens a submenu by %s", async (_, activate) => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Copy link</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("menuitem", { name: "Share" });
    activate(trigger);
    await vi.waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
  });

  it("keeps a hover-opened submenu open when its trigger is clicked", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Copy link</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("menuitem", { name: "Share" });
    fireEvent.pointerEnter(trigger);
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens to the first item on ArrowDown from a closed trigger", async () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Alpha</DropdownMenu.Item>
          <DropdownMenu.Item>Beta</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Alpha" }));
    });
  });

  it("opens to the last item on ArrowUp from a closed trigger", async () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Alpha</DropdownMenu.Item>
          <DropdownMenu.Item>Beta</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Beta" }));
    });
  });

  it("opens on Enter from the trigger", () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens on Space from the trigger", () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: " " });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes and refocuses the trigger on Escape from an open trigger", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes and refocuses the trigger on Escape from inside the content", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    const item = screen.getByRole("menuitem", { name: "Cut" });
    item.focus();
    fireEvent.keyDown(item, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("supports a render callback for Content", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content
          render={(contentProps, state) => (
            <ul
              {...(contentProps as object)}
              data-custom-content=""
              data-was-open={String(state.open)}
            >
              <DropdownMenu.Item>Cut</DropdownMenu.Item>
            </ul>
          )}
        />
      </DropdownMenu.Root>,
    );
    const content = screen.getByRole("menu");
    expect(content.tagName).toBe("UL");
    expect(content.getAttribute("data-custom-content")).toBe("");
    expect(content.getAttribute("data-was-open")).toBe("true");
  });

  it("supports a render callback for Item", () => {
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            render={(itemProps) => (
              <li {...(itemProps as object)} data-custom-item="">
                Cut
              </li>
            )}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const item = screen.getByRole("menuitem", { name: "Cut" });
    expect(item.tagName).toBe("LI");
    expect(item.getAttribute("data-custom-item")).toBe("");
  });

  it("skips a disabled item when opening to the first item", async () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item disabled>Alpha</DropdownMenu.Item>
          <DropdownMenu.Item>Beta</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Beta" }));
    });
  });

  it("can open to a checkbox item", async () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content
          render={(contentProps) => (
            <div {...(contentProps as object)}>
              <div role="menuitemcheckbox" tabIndex={-1}>
                Show hidden files
              </div>
            </div>
          )}
        />
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("menuitemcheckbox"));
    });
  });

  it("opens on pointer enter and closes after the hover delay when openOnHover is set", () => {
    vi.useFakeTimers();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger openOnHover>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.pointerEnter(trigger);
    expect(trigger.getAttribute("data-state")).toBe("open");

    fireEvent.pointerLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(trigger.getAttribute("data-state")).toBe("closed");
    vi.useRealTimers();
  });

  it("binds no pointer behavior without openOnHover", () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.pointerEnter(trigger);
    expect(trigger.getAttribute("data-state")).toBe("closed");
  });

  it("does not let a stale close timer close a sibling menu", () => {
    vi.useFakeTimers();
    function Bar() {
      const [openMenu, setOpenMenu] = useState<string>();
      return (
        <>
          <DropdownMenu.Root
            open={openMenu === "file"}
            onOpenChange={(next) => setOpenMenu(next ? "file" : undefined)}
          >
            <DropdownMenu.Trigger openOnHover>File</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>New</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root
            open={openMenu === "edit"}
            onOpenChange={(next) => setOpenMenu(next ? "edit" : undefined)}
          >
            <DropdownMenu.Trigger openOnHover>Edit</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>Undo</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </>
      );
    }
    Bar.displayName = "Bar";
    render(<Bar />);

    const file = screen.getByRole("button", { name: "File" });
    const edit = screen.getByRole("button", { name: "Edit" });

    fireEvent.pointerEnter(file);
    fireEvent.pointerLeave(file);
    fireEvent.pointerEnter(edit);
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(edit.getAttribute("data-state")).toBe("open");
    vi.useRealTimers();
  });

  it("stays open while the pointer travels from trigger into content", () => {
    vi.useFakeTimers();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger openOnHover>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Cut</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.pointerEnter(trigger);
    const content = screen.getByRole("menu");

    fireEvent.pointerLeave(trigger);
    fireEvent.pointerEnter(content);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(trigger.getAttribute("data-state")).toBe("open");

    fireEvent.pointerLeave(content);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(trigger.getAttribute("data-state")).toBe("closed");
    vi.useRealTimers();
  });

  describe("rtl submenus", () => {
    const subContent = () => document.querySelector<HTMLElement>('[data-part="sub-content"]');

    it("opens with ArrowLeft, not ArrowRight, and defaults the side to left", async () => {
      render(<RtlSubmenu />);
      const trigger = screen.getByRole("menuitem", { name: "Share" });
      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await vi.waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
      expect(subContent()?.getAttribute("data-side")).toBe("left");
    });

    it("closes with ArrowRight and refocuses the trigger", async () => {
      render(<RtlSubmenu />);
      const trigger = screen.getByRole("menuitem", { name: "Share" });
      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await vi.waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
      fireEvent.keyDown(screen.getByText("Copy link"), { key: "ArrowRight" });
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
    });

    it("keeps an explicit side", async () => {
      render(<RtlSubmenu side="right" />);
      const trigger = screen.getByRole("menuitem", { name: "Share" });
      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await vi.waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
      expect(subContent()?.getAttribute("data-side")).toBe("right");
    });
  });
});
