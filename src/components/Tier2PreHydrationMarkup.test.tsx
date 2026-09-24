import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Combobox } from "./combobox/index.js";
import { ContextMenu } from "./context-menu/index.js";
import { DropdownMenu } from "./dropdown-menu/index.js";
import { OtpInput } from "./otp-input/index.js";
import { TagsInput } from "./tags-input/index.js";

describe("Tier 2 pre-hydration SSR markup", () => {
  it("links dropdown trigger and menu with native popover invokers", () => {
    const html = renderToStaticMarkup(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Copy</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    expect(html).toContain('command="toggle-popover"');
    expect(html).toContain('popover="auto"');
    expect(html).toMatch(/commandfor="[^"]+"/);
  });

  it("renders the combobox list in SSR output when open", () => {
    const items = [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ];
    const html = renderToStaticMarkup(
      <Combobox.Root defaultOpen items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(allItems) => allItems.map((item) => <Combobox.Item item={item} key={item.value} />)}
        </Combobox.Content>
      </Combobox.Root>,
    );
    expect(html.match(/role="option"/g)?.length).toBe(2);
  });

  it("keeps context-menu content in the SSR tree", () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    expect(screen.getByText("Right-click area").getAttribute("oncontextmenu")).toBeNull();
    expect(screen.getByRole("menu", { hidden: true })).toBeTruthy();
  });

  it("renders static tag and OTP values", () => {
    render(
      <>
        <TagsInput.Root defaultValue={["Design", "React"]}>
          <TagsInput.List>
            <TagsInput.Input aria-label="Add tag" />
          </TagsInput.List>
        </TagsInput.Root>
        <OtpInput.Root length={4} defaultValue="12">
          <OtpInput.Slot index={0} />
          <OtpInput.Slot index={1} />
          <OtpInput.HiddenInput />
        </OtpInput.Root>
      </>,
    );
    expect(screen.getByText("Design")).toBeTruthy();
    // aria-label is owned (see props-ownership migration): "One-time code" always wins.
    expect((screen.getByRole("textbox", { name: "One-time code" }) as HTMLInputElement).value).toBe(
      "12",
    );
  });
});
