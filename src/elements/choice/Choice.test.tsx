import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Choice, ChoiceGroup, ChoiceItem } from "./Choice.js";

describe("Choice", () => {
  it("renders a radio input, label and panel per item", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem groupId="plan" kind="single" label="Free" value="free" />
        <ChoiceItem
          groupId="plan"
          kind="single"
          label="Pro"
          panel={<p>Everything in Free, plus.</p>}
          value="pro"
        />
      </ChoiceGroup>,
    );
    expect(markup).toContain('type="radio"');
    expect(markup).toContain('name="plan"');
    expect(markup).toContain('id="plan-control-free"');
    expect(markup).toContain('id="plan-label-pro"');
    expect(markup).toContain('id="plan-panel-pro"');
    expect(markup).toContain("data-uiify-choice");
    const parsed = new DOMParser().parseFromString(markup, "text/html");
    expect(parsed.querySelector('[data-uiify-choice][data-part="item"]')).not.toBeNull();
    expect(markup).toContain('data-part="item"');
    expect(markup).not.toContain('data-part="panel"><');
  });

  it("renders checkboxes and a suffixed group name for kind=multiple", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup id="days" kind="multiple">
        <ChoiceItem groupId="days" kind="multiple" label="Mon" value="mon" />
      </ChoiceGroup>,
    );
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('name="days-multiple"');
  });

  it("applies defaultChecked and lets the browser own state after that", () => {
    render(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem defaultChecked groupId="plan" kind="single" label="Free" value="free" />
      </ChoiceGroup>,
    );
    const input = screen.getByRole("radio", { name: "Free" }) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("marks a disabled item without disabling the group", () => {
    render(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem disabled groupId="plan" kind="single" label="Free" value="free" />
        <ChoiceItem groupId="plan" kind="single" label="Pro" value="pro" />
      </ChoiceGroup>,
    );
    const free = screen.getByRole("radio", { name: "Free" }) as HTMLInputElement;
    const pro = screen.getByRole("radio", { name: "Pro" }) as HTMLInputElement;
    expect(free.disabled).toBe(true);
    expect(pro.disabled).toBe(false);
  });

  it("adds data-part='label' only when labelPart is set", () => {
    const withLabelPart = renderToStaticMarkup(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem groupId="plan" kind="single" label="Free" labelPart value="free" />
      </ChoiceGroup>,
    );
    expect(withLabelPart).toContain('data-part="label"');

    const withoutLabelPart = renderToStaticMarkup(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem groupId="plan" kind="single" label="Free" value="free" />
      </ChoiceGroup>,
    );
    expect(withoutLabelPart).not.toContain('data-part="label"');
  });

  it("spreads inputProps/labelProps/panelProps onto their elements without overriding owned attributes", () => {
    render(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem
          groupId="plan"
          inputProps={{ "data-consumer-input": "", type: "hijacked" }}
          kind="single"
          label="Free"
          labelProps={{ "data-consumer-label": "" }}
          panel={<p>Body</p>}
          panelProps={{ "data-consumer-panel": "free" }}
          value="free"
        />
      </ChoiceGroup>,
    );
    const input = screen.getByRole("radio", { name: "Free" });
    expect(input.hasAttribute("data-consumer-input")).toBe(true);
    expect(input.getAttribute("type")).toBe("radio");
    const label = screen.getByText("Free");
    expect(label.hasAttribute("data-consumer-label")).toBe(true);
    const panel = screen.getByText("Body").closest("[data-part='panel']");
    expect(panel?.getAttribute("data-consumer-panel")).toBe("free");
  });

  it("supports a custom wrapper part name", () => {
    render(
      <ChoiceGroup id="steps" kind="single">
        <ChoiceItem groupId="steps" kind="single" label="One" part="step" value="1" />
      </ChoiceGroup>,
    );
    const label = screen.getByText("One");
    expect(label.closest("[data-part='step']")).not.toBeNull();
  });

  it("calls onChange with the item's value on the native change event", () => {
    const onChange = vi.fn();
    render(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem groupId="plan" kind="single" label="Free" onChange={onChange} value="free" />
      </ChoiceGroup>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(onChange).toHaveBeenCalledWith("free");
  });

  it("emits data-orientation on the group, default horizontal", () => {
    const markup = renderToStaticMarkup(
      <ChoiceGroup id="plan" kind="single">
        <ChoiceItem groupId="plan" kind="single" label="Free" value="free" />
      </ChoiceGroup>,
    );
    expect(markup).toContain('data-orientation="horizontal"');
  });

  it("exposes the same parts through the Choice compound object", () => {
    expect(Choice.Group).toBe(ChoiceGroup);
    expect(Choice.Item).toBe(ChoiceItem);
  });
});
