import { describe, expect, it } from "vitest";
import { Accordion } from "./accordion/Accordion.js";
import { Button } from "./button/Button.js";
import { Checkbox } from "./checkbox/Checkbox.js";
import { Combobox } from "./combobox/Combobox.js";
import { Modal } from "./modal/Modal.js";
import { DropdownMenu } from "./dropdown-menu/DropdownMenu.js";
import { Input } from "./input/Input.js";
import { Popup } from "./popup/Popup.js";
import { RadioGroup } from "./radio-group/RadioGroup.js";
import { Select } from "./select/Select.js";
import { Slider } from "./slider/Slider.js";
import { Switch } from "./switch/Switch.js";
import { Tabs } from "./tabs/Tabs.js";
import { Textarea } from "./textarea/Textarea.js";
import { Toast } from "./toast/Toast.js";
import { ToggleGroup } from "./toggle-group/ToggleGroup.js";
import { Toggle } from "./toggle/Toggle.js";
import { Tooltip } from "./tooltip/Tooltip.js";
import { assertSSRRenderable } from "./test-utils/ssr.js";

describe("SSR smoke — all shipped components", () => {
  it("renders Button", () => {
    expect(assertSSRRenderable(<Button>Save</Button>)).toContain("<button");
  });

  it("renders Input", () => {
    expect(assertSSRRenderable(<Input aria-label="Name" defaultValue="a" />)).toContain("<input");
  });

  it("renders Textarea", () => {
    expect(assertSSRRenderable(<Textarea aria-label="Notes" defaultValue="a" />)).toContain(
      "<textarea",
    );
  });

  it("renders Checkbox", () => {
    expect(assertSSRRenderable(<Checkbox id="terms" label="Terms" defaultChecked />)).toContain(
      'type="checkbox"',
    );
  });

  it("renders RadioGroup", () => {
    expect(
      assertSSRRenderable(<RadioGroup id="plan" items={[{ value: "a", label: "A" }]} />),
    ).toContain('type="radio"');
  });

  it("renders Switch", () => {
    expect(assertSSRRenderable(<Switch aria-label="Airplane mode" />)).toContain('role="switch"');
  });

  it("renders Toggle", () => {
    expect(assertSSRRenderable(<Toggle id="bold" label="Bold" />)).toContain('type="checkbox"');
  });

  it("renders ToggleGroup", () => {
    expect(
      assertSSRRenderable(
        <ToggleGroup id="ssr-toggle" type="single" items={[{ value: "left", label: "L" }]} />,
      ),
    ).toContain("L");
  });

  it("renders Slider", () => {
    expect(assertSSRRenderable(<Slider aria-label="Volume" defaultValue={50} />)).toContain(
      'type="range"',
    );
  });

  it("renders Modal", () => {
    expect(assertSSRRenderable(<Modal id="ssr-dialog" trigger="Open" title="Title" />)).toContain(
      "<dialog",
    );
  });

  it("renders Popup", () => {
    expect(
      assertSSRRenderable(
        <Popup.Root id="ssr-popover">
          <Popup.Trigger>Open</Popup.Trigger>
          <Popup.Content>Body</Popup.Content>
        </Popup.Root>,
      ),
    ).toContain("Body");
  });

  it("renders Tooltip", () => {
    expect(
      assertSSRRenderable(
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>Hover</Tooltip.Trigger>
            <Tooltip.Content>Tip</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>,
      ),
    ).toContain("Hover");
  });

  it("renders DropdownMenu", () => {
    expect(
      assertSSRRenderable(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Cut</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      ),
    ).toContain('role="menu"');
  });

  it("renders Tabs", () => {
    expect(
      assertSSRRenderable(
        <Tabs
          id="ssr-tabs"
          defaultValue="a"
          items={[{ value: "a", label: "A", panel: <>Panel</> }]}
        />,
      ),
    ).toContain('type="radio"');
  });

  it("renders Accordion", () => {
    expect(
      assertSSRRenderable(
        <Accordion
          id="ssr-smoke"
          items={[{ value: "one", label: "One", panel: <>Body</> }]}
          type="single"
        />,
      ),
    ).toContain("<details");
  });

  it("renders Toast", () => {
    expect(
      assertSSRRenderable(
        <Toast.Provider>
          <Toast.Viewport />
        </Toast.Provider>,
      ),
    ).toContain("<section");
  });

  it("renders Select", () => {
    expect(
      assertSSRRenderable(
        <Select.Root name="plan">
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
          </Select.Content>
        </Select.Root>,
      ),
    ).toContain("<select");
  });

  it("renders Combobox", () => {
    expect(
      assertSSRRenderable(
        <Combobox.Root inputValue="" items={[]} onInputValueChange={() => {}}>
          <Combobox.Input aria-label="Search" />
          <Combobox.Content>{() => null}</Combobox.Content>
        </Combobox.Root>,
      ),
    ).toContain('role="combobox"');
  });
});
