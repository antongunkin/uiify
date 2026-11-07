import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../../test-utils/ssr.js";
import { ChoiceGroup } from "./ChoiceGroup.js";
import type { ChoiceItem } from "./types.js";

const items: readonly ChoiceItem[] = [
  { value: "a", label: "Item A" },
  { value: "b", label: "Item B", disabled: true },
];

describe("ChoiceGroup", () => {
  for (const kind of ["single", "multiple"] as const) {
    it(`renders a valid ${kind} group`, () => {
      const markup = renderToStaticMarkup(
        <ChoiceGroup
          id="group"
          items={items}
          kind={kind}
          namespace="test"
          orientation="horizontal"
          isChecked={(item) => item.value === "a"}
        />,
      );

      const inputType = kind === "single" ? "radio" : "checkbox";
      expect(markup).toContain(`type="${inputType}"`);
      expect(markup).not.toMatch(/data-uiify-|data-part=/);
      expect(markup).toContain('id="group-control-a"');
      expect(markup).toContain('id="group-control-b"');
      expect(markup).toContain('for="group-control-a"');
      expect(markup).toContain('aria-labelledby="group-label-a"');
      expect(markup).toContain('id="group-label-a"');
      expect(markup).toContain("checked");
      expect(markup).toContain("disabled");

      const groupName = kind === "single" ? "group" : "group-multiple";
      expect(markup).toContain(`name="${groupName}"`);

      expect(markup).not.toContain("group-panel-a");

      // input precedes label — required for `peer-checked` label styles.
      const inputIndex = markup.indexOf('id="group-control-a"');
      const labelIndex = markup.indexOf('id="group-label-a"');
      expect(inputIndex).toBeGreaterThan(-1);
      expect(labelIndex).toBeGreaterThan(inputIndex);
    });
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

  it("marks single-choice controls as radios without changing multiple-choice controls", () => {
    const single = renderToStaticMarkup(
      <ChoiceGroup
        id="single"
        items={items}
        kind="single"
        namespace="test"
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

    expect(single).toContain('type="radio"');
    expect(single).not.toContain('data-uiify-radio=""');
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
