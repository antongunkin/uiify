import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../../test-utils/ssr.js";
import { ChoiceGroup } from "./ChoiceGroup.js";
import type { ChoicePanelItem } from "./types.js";

const items: readonly ChoicePanelItem[] = [
  { value: "a", label: "Item A", panel: "Panel A" },
  { value: "b", label: "Item B", disabled: true, panel: "Panel B" },
];

describe("ChoiceGroup", () => {
  for (const kind of ["single", "multiple"] as const) {
    for (const withPanel of [false, true]) {
      it(`renders a valid ${kind} group ${withPanel ? "with" : "without"} a panel`, () => {
        const markup = renderToStaticMarkup(
          <ChoiceGroup
            id="group"
            items={items}
            kind={kind}
            namespace="test"
            orientation="horizontal"
            isChecked={(item) => item.value === "a"}
            {...(withPanel ? { renderPanel: (item: ChoicePanelItem) => item.panel } : {})}
          />,
        );

        const inputType = kind === "single" ? "radio" : "checkbox";
        expect(markup).toContain(`type="${inputType}"`);
        expect(markup).toContain(kind === "single" ? 'data-uiify-radio=""' : 'data-part="control"');
        expect(markup).toContain('id="group-control-a"');
        expect(markup).toContain('id="group-control-b"');
        expect(markup).toContain('for="group-control-a"');
        expect(markup).toContain('aria-labelledby="group-label-a"');
        expect(markup).toContain('id="group-label-a"');
        expect(markup).toContain("checked");
        expect(markup).toContain("disabled");

        const groupName = kind === "single" ? "group" : "group-multiple";
        expect(markup).toContain(`name="${groupName}"`);

        if (withPanel) {
          expect(markup).toContain('id="group-panel-a"');
          expect(markup).toContain("Panel A");
        } else {
          expect(markup).not.toContain("group-panel-a");
        }

        // input precedes label precedes (optional) panel — required for `input:checked ~ panel`.
        const inputIndex = markup.indexOf('id="group-control-a"');
        const labelIndex = markup.indexOf('id="group-label-a"');
        expect(inputIndex).toBeGreaterThan(-1);
        expect(labelIndex).toBeGreaterThan(inputIndex);
        if (withPanel) {
          const panelIndex = markup.indexOf('id="group-panel-a"');
          expect(panelIndex).toBeGreaterThan(labelIndex);
        }
      });
    }
  }

  it("marks the disabled item's input", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    const bIndex = markup.indexOf('id="group-control-b"');
    const surrounding = markup.slice(Math.max(0, bIndex - 200), bIndex + 20);
    expect(surrounding).toContain("disabled");
  });

  it("lets a name override replace the derived group name", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        name="custom-name"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(markup).toContain('name="custom-name"');
  });

  it("applies the namespace as the root data attribute", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="widget"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(markup).toContain("data-uiify-widget=");
  });

  it("uses a custom item part name when given", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        itemPart="step"
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(markup).toContain('data-part="step"');
    expect(markup).not.toContain('data-part="item"');
  });

  it("spreads per-item wrapper attributes from itemWrapperAttributes", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        itemWrapperAttributes={(item) => ({
          "data-complete": item.value === "a" ? "true" : undefined,
        })}
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    const aIndex = markup.indexOf('data-complete="true"');
    expect(markup.slice(aIndex, aIndex + 300)).toContain('data-complete="true"');
  });

  it("applies itemInputClassName per item", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        itemInputClassName={(item) => `hook-${item.value}`}
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(markup).toContain('class="hook-a"');
    expect(markup).toContain('class="hook-b"');
  });

  it("spreads extra root attributes from rootAttributes", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="test"
        orientation="horizontal"
        rootAttributes={{ "data-full-width": "", "aria-label": "Custom label" }}
        isChecked={() => false}
      />,
    );
    expect(markup).toContain("data-full-width=");
    expect(markup).toContain('aria-label="Custom label"');
  });

  it("renders an append slot after the mapped items", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        append={<button type="button">Extra</button>}
        id="group"
        items={items}
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    const appendIndex = markup.indexOf("Extra");
    const lastItemIndex = markup.lastIndexOf("group-control-b");
    expect(appendIndex).toBeGreaterThan(lastItemIndex);
    expect(markup).toContain('data-part="append"');
  });

  it("uses renderLabel to customize label content when given", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="test"
        orientation="horizontal"
        renderLabel={(item) => `Custom: ${item.label}`}
        isChecked={() => false}
      />,
    );
    expect(markup).toContain("Custom: Item A");
  });

  it("marks the label as a trigger when the trigger anatomy is requested", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="tabs"
        orientation="horizontal"
        labelPart
        isChecked={() => false}
      />,
    );
    expect(markup).toContain('data-part="trigger"');
  });

  it("leaves a plain choice label without trigger anatomy by default", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(markup).toContain('data-part="label"');
  });

  it("marks the input as the control anatomy", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="stepper"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(markup).toContain('data-part="control"');
  });

  it("marks single-choice controls as radios without changing multiple-choice controls", () => {
    const single = renderToStaticMarkup(
      <ChoiceGroup
        id="single"
        items={items}
        kind="single"
        namespace="radio-group"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    const multiple = renderToStaticMarkup(
      <ChoiceGroup
        id="multiple"
        items={items}
        kind="multiple"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );

    expect(single).toContain('data-uiify-radio=""');
    expect(multiple).not.toContain('data-uiify-radio=""');
  });

  it("fires onItemChange with the selected item when an input changes", () => {
    const onItemChange = vi.fn();
    render(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="test"
        onItemChange={onItemChange}
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    fireEvent.click(screen.getByDisplayValue("a"));
    expect(onItemChange).toHaveBeenCalledExactlyOnceWith(items[0]);
  });

  it("omits the onChange handler entirely when onItemChange is not given", () => {
    render(
      <ChoiceGroup
        id="group"
        items={items}
        kind="single"
        namespace="test"
        orientation="horizontal"
        isChecked={() => false}
      />,
    );
    expect(() => fireEvent.click(screen.getByDisplayValue("a"))).not.toThrow();
  });
});
