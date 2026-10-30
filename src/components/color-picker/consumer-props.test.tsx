import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { ColorPicker } from "./ColorPicker.js";
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

it("preserves default color picker DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <ColorPicker id="brand" label="Brand" defaultValue="#2563eb" required />,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets color picker native slots replace defaults and consumer styles win", () => {
  render(
    <ColorPicker
      id="brand"
      label="Brand"
      required
      data-uiify-color-picker="custom"
      slotProps={{
        label: { id: "custom-label", htmlFor: "custom-input", "data-part": "caption" },
        surface: {
          "data-value": "custom",
          style: { "--uiify-color-picker-value": "#ffffff" } as React.CSSProperties,
          "data-testid": "surface",
        },
        control: {
          id: "display",
          type: "password",
          value: "custom",
          "aria-describedby": undefined,
          "data-testid": "control",
        },
        input: {
          id: "custom-input",
          type: "text",
          value: "native custom",
          required: false,
          "aria-labelledby": undefined,
          "data-testid": "input",
        },
      }}
    />,
  );
  expect(screen.getByText("Brand").id).toBe("custom-label");
  expect(screen.getByTestId("surface").style.getPropertyValue("--uiify-color-picker-value")).toBe(
    "#ffffff",
  );
  expect(screen.getByTestId("control").id).toBe("display");
  expect(screen.getByTestId("control").getAttribute("type")).toBe("password");
  expect(screen.getByTestId("control").hasAttribute("aria-describedby")).toBe(false);
  expect(screen.getByTestId("input").id).toBe("custom-input");
  expect(screen.getByTestId("input").getAttribute("type")).toBe("text");
  expect(screen.getByTestId("input").hasAttribute("required")).toBe(false);
});
