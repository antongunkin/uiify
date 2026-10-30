import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  ContextMenuCheckboxItemOwnProps,
  ContextMenuRootSlotProps,
  ContextMenuRadioItemOwnProps,
  ContextMenuSubTriggerOwnProps,
} from "./types.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { ContextMenu } from "./ContextMenu.js";

describe("ContextMenu", () => {
  it("forwards slot props to the generated virtual anchor and lets consumer positioning replace defaults", () => {
    const anchorRef = { current: null as HTMLSpanElement | null };
    const slotProps = {
      virtualAnchor: {
        className: "virtual-anchor",
        "data-testid": "context-anchor",
        "data-virtual-anchor": "consumer",
        "aria-hidden": false,
        "data-anchor": "consumer-anchor",
        "data-uiify-menu": "consumer-menu",
        style: { color: "red", position: "absolute" },
        ref: anchorRef,
      },
    } satisfies ContextMenuRootSlotProps;
    const { container } = render(
      <ContextMenu.Root slotProps={slotProps}>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const anchor = container.querySelector("[data-testid=context-anchor]");
    expect(anchor?.className).toBe("virtual-anchor");
    expect(anchor?.getAttribute("data-virtual-anchor")).toBe("consumer");
    expect(anchor?.getAttribute("data-anchor")).toBe("consumer-anchor");
    expect(anchor?.getAttribute("data-uiify-menu")).toBe("consumer-menu");
    expect(anchor?.textContent).toBe("");
    expect(anchor?.querySelector("b")).toBeNull();
    expect(anchor?.getAttribute("aria-hidden")).toBe("false");
    expect(anchorRef.current).toBe(anchor);
    expect((anchor as HTMLElement | null)?.style.color).toBe("red");
    expect((anchor as HTMLElement | null)?.style.position).toBe("absolute");
    fireEvent.contextMenu(screen.getByText("Area"), { clientX: 120, clientY: 80 });
    expect(anchorRef.current?.style.getPropertyValue("--uiify-context-menu-x")).toBe("120px");
    expect(anchorRef.current?.style.getPropertyValue("--uiify-context-menu-y")).toBe("80px");
  });

  it("uses Root id for the popup", () => {
    render(
      <ContextMenu.Root id="context-popup" defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    expect(document.getElementById("context-popup")?.getAttribute("role")).toBe("menu");
  });

  it("keeps the latest consumer coordinate styles when opening at the pointer", () => {
    const initialStyle = {
      color: "red",
      "--uiify-context-menu-x": "17px",
      "--uiify-context-menu-y": "29px",
    };
    const view = render(
      <ContextMenu.Root slotProps={{ virtualAnchor: { style: initialStyle } }}>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    const anchor = view.container.querySelector<HTMLElement>("[data-virtual-anchor]")!;
    fireEvent.contextMenu(screen.getByText("Area"), { clientX: 120, clientY: 80 });
    expect(anchor.style.getPropertyValue("--uiify-context-menu-x")).toBe("17px");
    expect(anchor.style.getPropertyValue("--uiify-context-menu-y")).toBe("29px");

    const updatedStyle = {
      color: "red",
      "--uiify-context-menu-x": 0,
      "--uiify-context-menu-y": undefined,
    };
    view.rerender(
      <ContextMenu.Root slotProps={{ virtualAnchor: { style: updatedStyle } }}>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    fireEvent.contextMenu(screen.getByText("Area"), { clientX: 300, clientY: 400 });
    expect(anchor.style.getPropertyValue("--uiify-context-menu-x")).toBe("0");
    expect(anchor.style.getPropertyValue("--uiify-context-menu-y")).toBe("");

    view.rerender(
      <ContextMenu.Root slotProps={{ virtualAnchor: { style: { color: "red" } } }}>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    fireEvent.contextMenu(screen.getByText("Area"), { clientX: 300, clientY: 400 });
    expect(anchor.style.getPropertyValue("--uiify-context-menu-x")).toBe("300px");
    expect(anchor.style.getPropertyValue("--uiify-context-menu-y")).toBe("400px");
  });

  it("forwards native props, class, and ref to each generated submenu and selection part", () => {
    const checkboxRef = { current: null as HTMLDivElement | null };
    const radioRef = { current: null as HTMLDivElement | null };
    const subTriggerRef = { current: null as HTMLDivElement | null };
    const subContentRef = { current: null as HTMLDivElement | null };
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem
            className="checkbox-item"
            data-testid="checkbox-item"
            ref={checkboxRef}
          >
            Bold
          </ContextMenu.CheckboxItem>
          <ContextMenu.RadioItem
            value="compact"
            className="radio-item"
            data-testid="radio-item"
            ref={radioRef}
          >
            Compact
          </ContextMenu.RadioItem>
          <ContextMenu.Sub>
            <ContextMenu.Sub.Trigger
              className="sub-trigger"
              data-testid="sub-trigger"
              ref={subTriggerRef}
            >
              More
            </ContextMenu.Sub.Trigger>
            <ContextMenu.Sub.Content
              className="sub-content"
              data-testid="sub-content"
              ref={subContentRef}
            >
              <ContextMenu.Item>Nested</ContextMenu.Item>
            </ContextMenu.Sub.Content>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const subTrigger = screen.getByTestId("sub-trigger");
    fireEvent.focus(subTrigger);
    const checkbox = screen.getByTestId("checkbox-item");
    const radio = screen.getByTestId("radio-item");
    const subContent = screen.getByTestId("sub-content");
    expect(checkbox.className).toBe("checkbox-item");
    expect(radio.className).toBe("radio-item");
    expect(subTrigger.className).toBe("sub-trigger");
    expect(subContent.className).toBe("sub-content");
    expect(checkbox.querySelector("b")).toBeNull();
    expect(subContent.querySelector("b")).toBeNull();
    expect(checkboxRef.current).toBe(checkbox);
    expect(radioRef.current).toBe(radio);
    expect(subTriggerRef.current).toBe(subTrigger);
    expect(subContentRef.current).toBe(subContent);
  });

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

  it("lets consumer Content attributes override defaults", () => {
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

    const content = screen.getByRole("alert");
    expect(content.getAttribute("data-state")).toBe("bogus");
    expect(content.getAttribute("data-uiify-menu")).toBe("");
    expect(content.getAttribute("data-part")).toBe("content");
    expect(content.id).toBe("my-id");
    expect(content.getAttribute("data-align")).toBe("end");
    expect(content.getAttribute("data-side")).toBe("top");
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

  it("lets consumer Item role override the default", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item role="button">Cut</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    expect(screen.getByRole("button", { name: "Cut" })).toBeTruthy();
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

  it("lets consumer CheckboxItem attributes override defaults", () => {
    const overrides = {
      checked: true,
      role: "menuitem",
      "aria-checked": false,
      "data-state": "unchecked",
    } satisfies ContextMenuCheckboxItemOwnProps;
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem {...overrides}>Bold</ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );

    const item = screen.getByRole("menuitem", { name: "Bold" });
    expect(item.getAttribute("aria-checked")).toBe("false");
    expect(item.getAttribute("data-state")).toBe("unchecked");
  });

  it("lets a consumer onClick veto CheckboxItem selection, leaving checked value unchanged", () => {
    const onCheckedChange = vi.fn();
    const overrides = {
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    };
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

  it("lets consumer RadioItem attributes override defaults", () => {
    const overrides = {
      role: "menuitem",
      "aria-checked": true,
      "data-state": "unchecked",
    } satisfies Omit<ContextMenuRadioItemOwnProps, "value">;
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

    const item = screen.getByRole("menuitem", { name: "A" });
    expect(item.getAttribute("aria-checked")).toBe("true");
    expect(item.getAttribute("data-state")).toBe("unchecked");
  });

  it("lets a consumer onClick veto RadioItem selection, leaving the radio value unchanged", () => {
    const overrides = {
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    };
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

  it("lets consumer SubTrigger attributes override defaults", () => {
    const overrides = {
      role: "menuitem",
      "aria-haspopup": false,
      "aria-expanded": true,
    } satisfies ContextMenuSubTriggerOwnProps;
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
    expect(trigger.getAttribute("aria-haspopup")).toBe("false");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
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

  describe("submenu keys", () => {
    function SubMenu({ dir }: { readonly dir?: "rtl" }) {
      return (
        <div {...(dir ? { dir } : {})}>
          <ContextMenu.Root defaultOpen>
            <ContextMenu.Trigger>Area</ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item>First</ContextMenu.Item>
              <ContextMenu.Sub>
                <ContextMenu.Sub.Trigger>More</ContextMenu.Sub.Trigger>
                <ContextMenu.Sub.Content>
                  <ContextMenu.Item>Nested</ContextMenu.Item>
                </ContextMenu.Sub.Content>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </div>
      );
    }
    SubMenu.displayName = "SubMenu";

    it("opens with ArrowLeft, not ArrowRight, in rtl", () => {
      render(<SubMenu dir="rtl" />);
      const trigger = screen.getByRole("menuitem", { name: "More" });
      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    it.each(["ArrowLeft", "Escape"])("closes with %s in ltr and refocuses the trigger", (key) => {
      render(<SubMenu />);
      const trigger = screen.getByRole("menuitem", { name: "More" });
      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      fireEvent.keyDown(screen.getByRole("menuitem", { name: "Nested" }), { key });
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
      expect(screen.getByRole("menuitem", { name: "First" })).toBeTruthy();
    });

    it("closes with ArrowRight in rtl", () => {
      render(<SubMenu dir="rtl" />);
      const trigger = screen.getByRole("menuitem", { name: "More" });
      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      fireEvent.keyDown(screen.getByRole("menuitem", { name: "Nested" }), { key: "ArrowRight" });
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
    });
  });
  it("lets consumer submenu attributes replace defaults", () => {
    render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>First</ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.Sub.Trigger>More</ContextMenu.Sub.Trigger>
            <ContextMenu.Sub.Content
              data-testid="sub"
              role="note"
              data-state="custom"
              data-part="custom-part"
              hidden
            >
              Nested
            </ContextMenu.Sub.Content>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    fireEvent.focus(screen.getByRole("menuitem", { name: "More" }));
    const content = screen.getByTestId("sub");
    expect(content.getAttribute("role")).toBe("note");
    expect(content.getAttribute("data-state")).toBe("custom");
    expect(content.getAttribute("data-part")).toBe("custom-part");
    expect(content.hidden).toBe(true);
  });
});
