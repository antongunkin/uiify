import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Combobox, type ComboboxItemData } from "./combobox/Combobox.js";
import { Modal } from "./modal/Modal.js";
import { DropdownMenu } from "./dropdown-menu/DropdownMenu.js";
import { RadioGroup } from "./radio-group/RadioGroup.js";
import { Select } from "./select/Select.js";
import { Slider } from "./slider/Slider.js";
import { Switch } from "./switch/Switch.js";
import { Tabs } from "./tabs/index.js";
import { Toast, useToast } from "./toast/index.js";
import { Toggle } from "./toggle/Toggle.js";
import { ToggleGroup } from "./toggle-group/ToggleGroup.js";
import { createRenderCounter } from "./test-utils/RenderCounter.js";

describe("Phase 3 render-count roll-up", () => {
  it("limits Toggle Group arrow-key rerenders", () => {
    render(
      <ToggleGroup
        id="render-toggle"
        type="single"
        items={[
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ]}
      />,
    );
    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(2);
  });

  it("limits Dropdown Menu arrow-key rerenders in a 1,000-item menu", { timeout: 30_000 }, () => {
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
  });

  it("limits Radio Group selection rerenders", () => {
    render(
      <RadioGroup
        id="plan"
        defaultValue="a"
        items={[
          { value: "a", label: "Plan a" },
          { value: "b", label: "Plan b" },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Plan b" }));
    expect((screen.getByRole("radio", { name: "Plan b" }) as HTMLInputElement).checked).toBe(true);
  });

  it("limits Tabs arrow-key rerenders", () => {
    render(
      <Tabs
        id="tabs-render-count"
        defaultValue="a"
        items={[
          { value: "a", label: "Tab a", panel: <>A</> },
          { value: "b", label: "Tab b", panel: <>B</> },
        ]}
      />,
    );
    expect(screen.getByLabelText("Tab a")).toBeTruthy();
  });

  it("limits Combobox active-option rerenders in a large list", () => {
    const largeItems: ComboboxItemData[] = Array.from({ length: 1000 }, (_, index) => ({
      label: `Item ${index}`,
      value: String(index),
    }));
    const renders = Array.from({ length: 1000 }, () => 0);

    function Item({ item }: { readonly item: ComboboxItemData }) {
      const index = Number(item.value);
      renders[index] = (renders[index] ?? 0) + 1;
      return <Combobox.Item item={item} />;
    }
    Item.displayName = "Item";

    render(
      <Combobox.Root defaultOpen inputValue="" items={largeItems} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Items" />
        <Combobox.Content>
          {(filteredItems) => filteredItems.map((item) => <Item item={item} key={item.value} />)}
        </Combobox.Content>
      </Combobox.Root>,
    );
    renders.fill(0);
    const input = screen.getByRole("combobox");
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(2);
  });

  it("limits Toast enqueue rerenders to the provider owner", () => {
    let providerRenders = 0;
    function Harness() {
      providerRenders++;
      const { toast } = useToast();
      return (
        <>
          <button onClick={() => toast({ title: "Saved" })} type="button">
            Show
          </button>
          <Toast.Viewport />
        </>
      );
    }
    Harness.displayName = "Harness";

    render(
      <Toast.Provider>
        <Harness />
      </Toast.Provider>,
    );
    providerRenders = 0;
    fireEvent.click(screen.getByRole("button", { name: "Show" }));
    expect(providerRenders).toBeLessThanOrEqual(2);
  });

  it("keeps uncontrolled native Slider updates out of React", () => {
    const counter = createRenderCounter();
    render(
      <counter.Wrapper>
        <Slider aria-label="Volume" defaultValue={40} />
      </counter.Wrapper>,
    );
    counter.reset();
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volume" }), { key: "ArrowRight" });
    expect(counter.getCommitCount()).toBe(0);
  });

  it("keeps uncontrolled native Select updates out of React", () => {
    const counter = createRenderCounter();
    render(
      <counter.Wrapper>
        <Select.Root aria-label="Plan" defaultValue="free">
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Root>
      </counter.Wrapper>,
    );
    counter.reset();
    fireEvent.change(screen.getByRole("combobox", { name: "Plan" }), {
      target: { value: "pro" },
    });
    expect(counter.getCommitCount()).toBe(0);
  });

  it("keeps uncontrolled native Switch updates out of React", () => {
    const counter = createRenderCounter();
    render(
      <counter.Wrapper>
        <Switch aria-label="Notifications" defaultChecked />
      </counter.Wrapper>,
    );
    counter.reset();
    fireEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(counter.getCommitCount()).toBe(0);
  });

  it("lets native Toggle state update without a React commit", () => {
    const counter = createRenderCounter();
    render(
      <counter.Wrapper>
        <Toggle id="bold" label="Bold" />
      </counter.Wrapper>,
    );
    counter.reset();
    fireEvent.click(screen.getByRole("checkbox", { name: "Bold" }));
    expect(counter.getCommitCount()).toBe(0);
  });

  it("does not need React state when focus moves inside a Modal", () => {
    const counter = createRenderCounter();
    render(
      <counter.Wrapper>
        <Modal id="settings" trigger="Open settings" title="Settings">
          <button type="button">First</button>
          <button type="button">Second</button>
        </Modal>
      </counter.Wrapper>,
    );
    counter.reset();
    screen.getByRole("button", { hidden: true, name: "First" }).focus();
    screen.getByRole("button", { hidden: true, name: "Second" }).focus();
    expect(counter.getCommitCount()).toBe(0);
  });

  it("keeps Modal open state in native markup", () => {
    const counter = createRenderCounter();
    render(
      <counter.Wrapper>
        <Modal id="settings" trigger="Open settings" title="Settings" />
      </counter.Wrapper>,
    );

    counter.reset();
    expect(screen.getByRole("dialog", { hidden: true }).hasAttribute("data-state")).toBe(false);
    expect(counter.getCommitCount()).toBe(0);
  });
});
