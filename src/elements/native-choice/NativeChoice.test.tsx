import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { NativeChoice, NativeChoiceGroup, NativeChoiceItem } from "./NativeChoice.js";

describe("NativeChoice", () => {
  it("renders a radio input, label and panel per item", () => {
    const markup = renderToStaticMarkup(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem groupId="plan" kind="single" label="Free" value="free" />
        <NativeChoiceItem
          groupId="plan"
          kind="single"
          label="Pro"
          panel={<p>Everything in Free, plus.</p>}
          value="pro"
        />
      </NativeChoiceGroup>,
    );
    expect(markup).toContain('type="radio"');
    expect(markup).toContain('name="plan"');
    expect(markup).toContain('id="plan-control-free"');
    expect(markup).toContain('id="plan-label-pro"');
    expect(markup).toContain('id="plan-panel-pro"');
    const parsed = new DOMParser().parseFromString(markup, "text/html");
    expect(
      parsed.querySelector("div.uiify-native-choice > div.uiify-native-choice-item"),
    ).not.toBeNull();
    expect(parsed.querySelectorAll(".uiify-native-choice-panel")).toHaveLength(1);
    expect(markup).not.toContain("data-part");
    expect(markup).not.toContain("data-uiify-");
  });

  it("renders checkboxes and a suffixed group name for kind=multiple", () => {
    const markup = renderToStaticMarkup(
      <NativeChoiceGroup id="days" kind="multiple">
        <NativeChoiceItem groupId="days" kind="multiple" label="Mon" value="mon" />
      </NativeChoiceGroup>,
    );
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('name="days-multiple"');
  });

  it("applies defaultChecked and lets the browser own state after that", () => {
    render(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem defaultChecked groupId="plan" kind="single" label="Free" value="free" />
      </NativeChoiceGroup>,
    );
    const input = screen.getByRole("radio", { name: "Free" }) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("marks a disabled item without disabling the group", () => {
    render(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem disabled groupId="plan" kind="single" label="Free" value="free" />
        <NativeChoiceItem groupId="plan" kind="single" label="Pro" value="pro" />
      </NativeChoiceGroup>,
    );
    const free = screen.getByRole("radio", { name: "Free" }) as HTMLInputElement;
    const pro = screen.getByRole("radio", { name: "Pro" }) as HTMLInputElement;
    expect(free.disabled).toBe(true);
    expect(pro.disabled).toBe(false);
  });

  it("joins consumer classes with the identity classes", () => {
    const markup = renderToStaticMarkup(
      <NativeChoiceGroup className="plans" id="plan" kind="single">
        <NativeChoiceItem
          className="plan"
          groupId="plan"
          kind="single"
          label="Free"
          panel="Body"
          slotProps={{ panel: { className: "plan-panel" } }}
          value="free"
        />
      </NativeChoiceGroup>,
    );
    expect(markup).toContain('class="uiify-native-choice plans"');
    expect(markup).toContain('class="uiify-native-choice-item plan"');
    expect(markup).toContain('class="uiify-native-choice-panel plan-panel"');
  });

  it("spreads slotProps onto their elements", () => {
    render(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem
          groupId="plan"
          kind="single"
          label="Free"
          panel={<p>Body</p>}
          slotProps={{
            input: {
              "data-consumer-input": "",
            },
            label: { "data-consumer-label": "" },
            panel: { "data-consumer-panel": "free" },
          }}
          value="free"
        />
      </NativeChoiceGroup>,
    );
    const input = screen.getByRole("radio", { name: "Free" });
    expect(input.hasAttribute("data-consumer-input")).toBe(true);
    expect(input.getAttribute("type")).toBe("radio");
    const label = screen.getByText("Free");
    expect(label.hasAttribute("data-consumer-label")).toBe(true);
    const panel = screen.getByText("Body").closest(".uiify-native-choice-panel");
    expect(panel?.getAttribute("data-consumer-panel")).toBe("free");
  });

  it("runs the input slot change handler before onValueChange and honors cancellation", () => {
    const events: string[] = [];
    render(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem
          groupId="plan"
          kind="single"
          label="Free"
          onValueChange={() => events.push("value")}
          slotProps={{
            input: {
              onChange: (event) => {
                events.push("slot");
                event.preventDefault();
              },
            },
          }}
          value="free"
        />
      </NativeChoiceGroup>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(events).toEqual(["slot"]);
  });

  it("lets input slot props override the generated name", () => {
    const { rerender } = render(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem groupId="plan" kind="single" label="Free" value="free" />
      </NativeChoiceGroup>,
    );
    expect((screen.getByRole("radio", { name: "Free" }) as HTMLInputElement).name).toBe("plan");

    rerender(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem
          groupId="plan"
          kind="single"
          label="Free"
          slotProps={{ input: { name: "custom" } }}
          value="free"
        />
      </NativeChoiceGroup>,
    );
    expect((screen.getByRole("radio", { name: "Free" }) as HTMLInputElement).name).toBe("custom");
  });

  it("lets the component built on it name the wrapper with its own attributes", () => {
    render(
      <NativeChoiceGroup id="steps" kind="single">
        <NativeChoiceItem data-step="" groupId="steps" kind="single" label="One" value="1" />
      </NativeChoiceGroup>,
    );
    const label = screen.getByText("One");
    expect(label.closest(".uiify-native-choice-item[data-step]")).not.toBeNull();
  });

  it("calls onValueChange with the item's value on the native change event", () => {
    const onChange = vi.fn();
    render(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem
          groupId="plan"
          kind="single"
          label="Free"
          onValueChange={onChange}
          value="free"
        />
      </NativeChoiceGroup>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(onChange).toHaveBeenCalledWith("free");
  });

  it("emits data-orientation on the group, default horizontal", () => {
    const markup = renderToStaticMarkup(
      <NativeChoiceGroup id="plan" kind="single">
        <NativeChoiceItem groupId="plan" kind="single" label="Free" value="free" />
      </NativeChoiceGroup>,
    );
    expect(markup).toContain('data-orientation="horizontal"');
  });

  it("exposes the same parts through the NativeChoice compound object", () => {
    expect(NativeChoice.Group).toBe(NativeChoiceGroup);
    expect(NativeChoice.Item).toBe(NativeChoiceItem);
  });
});
