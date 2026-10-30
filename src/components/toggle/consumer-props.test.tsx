import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Toggle } from "./Toggle.js";
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
it("preserves default toggle DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <>
          <Toggle id="plain" label="Plain" />
          <Toggle id="pressed" label="Pressed" defaultPressed disabled />
          <Toggle id="controlled" label="Controlled" pressed />
        </>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets native control and label props override toggle defaults", () => {
  render(
    <Toggle
      id="bold"
      label="Bold"
      pressed
      disabled
      data-testid="root"
      data-uiify-toggle={undefined}
      data-disabled="consumer"
      slotProps={{
        control: {
          type: "radio",
          id: "consumer-input",
          checked: false,
          disabled: false,
          "aria-labelledby": undefined,
          "aria-label": "Native",
          "data-state": "custom",
          onChange: () => {},
        },
        label: {
          id: "consumer-label",
          htmlFor: "consumer-input",
          "data-variant": "ghost",
          "data-part": undefined,
        },
      }}
    />,
  );
  const input = screen.getByRole("radio", { name: "Native" });
  expect(input.id).toBe("consumer-input");
  expect(input.getAttribute("data-state")).toBe("custom");
  expect(input.hasAttribute("checked")).toBe(false);
  expect(input.hasAttribute("disabled")).toBe(false);
  expect(input.hasAttribute("aria-labelledby")).toBe(false);
  const label = screen.getByText("Bold");
  expect(label.id).toBe("consumer-label");
  expect(label.getAttribute("for")).toBe("consumer-input");
  expect(label.getAttribute("data-variant")).toBe("ghost");
  expect(label.hasAttribute("data-part")).toBe(false);
  expect(screen.getByTestId("root").hasAttribute("data-uiify-toggle")).toBe(false);
  expect(screen.getByTestId("root").getAttribute("data-disabled")).toBe("consumer");
});
