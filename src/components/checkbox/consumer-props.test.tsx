import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Checkbox } from "./Checkbox.js";
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}
it("preserves default checkbox DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <>
          <Checkbox id="plain" label="Plain" />
          <Checkbox id="checked" label="Checked" defaultChecked disabled />
          <Checkbox id="mixed" checked="indeterminate" aria-label="Mixed" />
        </>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets native checkbox slots override input identity, state and label wiring", () => {
  render(
    <Checkbox
      id="terms"
      label="Terms"
      checked
      disabled
      name="terms"
      value="yes"
      slotProps={{
        input: {
          type: "radio",
          id: "native-input",
          checked: false,
          disabled: false,
          name: "choice",
          value: "native",
          "aria-labelledby": undefined,
          "aria-label": "Native",
          "data-state": "custom",
        },
        label: { id: "native-label", htmlFor: "native-input", "data-uiify-checkbox": undefined },
      }}
    />,
  );
  const input = screen.getByRole("radio", { name: "Native" });
  expect(input.id).toBe("native-input");
  expect(input.hasAttribute("checked")).toBe(false);
  expect(input.hasAttribute("disabled")).toBe(false);
  expect(input.getAttribute("name")).toBe("choice");
  expect(input.getAttribute("value")).toBe("native");
  expect(input.getAttribute("data-state")).toBe("custom");
  expect(input.hasAttribute("aria-labelledby")).toBe(false);
  expect(screen.getByText("Terms").id).toBe("native-label");
  expect(screen.getByText("Terms").getAttribute("for")).toBe("native-input");
  expect(screen.getByText("Terms").hasAttribute("data-uiify-checkbox")).toBe(false);
});

it("composes checkbox label classes, input refs and consumer-first change handlers", () => {
  const calls: string[] = [];
  const ref = createRef<HTMLInputElement>();
  render(
    <Checkbox
      id="composed"
      label="Composed"
      className="root-class"
      onCheckedChange={() => calls.push("library")}
      slotProps={{
        input: { ref, onChange: () => calls.push("consumer") },
        label: { className: "slot-class" },
      }}
    />,
  );
  const input = screen.getByRole("checkbox", { name: "Composed" });
  expect(ref.current).toBe(input);
  expect(input.parentElement?.className).toBe("root-class slot-class");
  fireEvent.click(input);
  expect(calls).toEqual(["consumer", "library"]);
});
