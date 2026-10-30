import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { NumberField } from "./NumberField.js";
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

it("preserves default number field DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <NumberField.Root defaultValue={5} min={0} max={10}>
          <NumberField.Group>
            <NumberField.Decrement aria-label="Decrease" />
            <NumberField.Input aria-label="Amount" />
            <NumberField.Increment aria-label="Increase" />
          </NumberField.Group>
        </NumberField.Root>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets number field native props replace defaults and composes the input ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <NumberField.Root defaultValue={5} disabled data-uiify-number-field="custom">
      <NumberField.Group data-part="controls">
        <NumberField.Input
          aria-label="Amount"
          id={undefined}
          ref={ref}
          aria-valuenow={99}
          disabled={false}
          value="42"
        />
        <NumberField.Increment aria-label="Increase" type="submit" tabIndex={0} disabled={false} />
      </NumberField.Group>
    </NumberField.Root>,
  );
  expect(screen.getByRole("spinbutton").hasAttribute("id")).toBe(false);
  expect(screen.getByRole("spinbutton").getAttribute("aria-valuenow")).toBe("99");
  expect(screen.getByRole("spinbutton").hasAttribute("disabled")).toBe(false);
  expect(ref.current).toBe(screen.getByRole("spinbutton"));
  expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  expect(screen.getByRole("button").tabIndex).toBe(0);
});
