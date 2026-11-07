/* oxlint-disable jsx-a11y/control-has-associated-label -- radios are labelled by FieldLabel htmlFor, which the rule cannot follow */
import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { RadioGroup, RadioGroupItem } from "./index.js";

describe("RadioGroup", () => {
  it("children mode renders role=radiogroup", () => {
    render(
      <RadioGroup aria-label="Density" data-testid="group">
        <RadioGroupItem name="density" value="compact" aria-label="Compact" />
        <RadioGroupItem name="density" value="comfortable" aria-label="Comfortable" />
      </RadioGroup>,
    );

    const group = screen.getByRole("radiogroup", { name: "Density" });
    expect(group).toBe(screen.getByTestId("group"));
    expect(group.localName).toBe("div");
    expect(group.getAttribute("data-orientation")).toBe("vertical");
    expect(group.className).toBe("uiify-radio-group");
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("writes orientation as data-orientation", () => {
    render(<RadioGroup aria-label="Size" orientation="horizontal" data-testid="group" />);
    expect(screen.getByTestId("group").getAttribute("data-orientation")).toBe("horizontal");
  });

  it("forwards the root ref and native div props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadioGroup aria-label="Plan" ref={ref} title="Plans" data-testid="group" />);
    expect(ref.current).toBe(screen.getByTestId("group"));
    expect(ref.current?.getAttribute("title")).toBe("Plans");
  });
});

describe("RadioGroupItem", () => {
  it("RadioGroupItem renders a native radio with name/value/defaultChecked", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <RadioGroupItem
        ref={ref}
        name="plan"
        value="pro"
        id="plan-pro"
        defaultChecked
        aria-label="Pro"
      />,
    );

    const radio = screen.getByRole("radio", { name: "Pro" }) as HTMLInputElement;
    expect(ref.current).toBe(radio);
    expect(radio.type).toBe("radio");
    expect(radio.name).toBe("plan");
    expect(radio.value).toBe("pro");
    expect(radio.id).toBe("plan-pro");
    expect(radio.checked).toBe(true);
    expect(radio.className).toBe("uiify-radio-group-control");
  });

  it("lets the browser own selection without React state", () => {
    render(
      <RadioGroup aria-label="Plan">
        <RadioGroupItem name="plan" value="a" aria-label="Plan A" defaultChecked />
        <RadioGroupItem name="plan" value="b" aria-label="Plan B" />
      </RadioGroup>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Plan B" }));

    expect((screen.getByRole("radio", { name: "Plan B" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "Plan A" }) as HTMLInputElement).checked).toBe(false);
  });

  it("renders the documented server markup", () => {
    expect(
      renderToStaticMarkup(
        <RadioGroup aria-label="Plan">
          <RadioGroupItem name="plan" value="pro" id="plan-pro" defaultChecked />
        </RadioGroup>,
      ),
    ).toBe(
      '<div role="radiogroup" data-orientation="vertical" aria-label="Plan" class="uiify-radio-group"><input type="radio" id="plan-pro" class="uiify-radio-group-control" name="plan" checked="" value="pro"/></div>',
    );
  });
});
