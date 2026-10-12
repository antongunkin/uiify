import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { DropdownMenu } from "./DropdownMenu.js";

describe("DropdownMenu", () => {
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

  it(
    "rerenders at most two items when moving across a 1,000-item menu",
    { timeout: 30_000 },
    () => {
      const renders = Array.from({ length: 1000 }, () => 0);
      function Item({ index }: { readonly index: number }) {
        renders[index] = (renders[index] ?? 0) + 1;
        return <DropdownMenu.Item textValue={`Item ${index}`}>Item {index}</DropdownMenu.Item>;
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
      expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(2);
    },
  );

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
});
