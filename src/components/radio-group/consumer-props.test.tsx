/* oxlint-disable jsx-a11y/aria-role -- role overrides prove consumer props replace library defaults */
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { RadioGroup, RadioGroupItem } from "./index.js";

it("lets RadioGroup native props replace the default role and orientation marker", () => {
  render(<RadioGroup role="none" data-orientation="custom" data-testid="group" />);
  const group = screen.getByTestId("group");
  expect(group.getAttribute("role")).toBe("none");
  expect(group.getAttribute("data-orientation")).toBe("custom");
});

it("composes RadioGroup className and style", () => {
  render(
    <RadioGroup aria-label="Plan" className="custom" style={{ gap: 4 }} data-testid="group" />,
  );
  const group = screen.getByTestId("group");
  expect(group.className).toBe("uiify-radio-group custom");
  expect(group.style.gap).toBe("4px");
});

it("lets RadioGroupItem consumer id and aria win and composes className, ref and handlers", () => {
  const ref = createRef<HTMLInputElement>();
  const calls: string[] = [];
  render(
    <RadioGroupItem
      ref={ref}
      name="plan"
      value="pro"
      id="custom-id"
      className="custom"
      aria-label="Pro"
      aria-describedby="hint"
      disabled={false}
      required
      form="checkout"
      onChange={() => calls.push("change")}
    />,
  );
  const radio = screen.getByRole("radio", { name: "Pro" });
  expect(ref.current).toBe(radio);
  expect(radio.id).toBe("custom-id");
  expect(radio.getAttribute("aria-describedby")).toBe("hint");
  expect(radio.className).toBe("uiify-radio-group-control custom");
  expect(radio.hasAttribute("required")).toBe(true);
  expect(radio.getAttribute("form")).toBe("checkout");
  fireEvent.click(radio);
  expect(calls).toEqual(["change"]);
});
