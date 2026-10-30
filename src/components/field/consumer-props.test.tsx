import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Field } from "./Field.js";
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

it("preserves default field DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <Field.Root id="field" invalid required disabled>
          <Field.Label fieldId="field" required disabled>
            Name
          </Field.Label>
          <Field.Control fieldId="field" as="input" invalid required disabled />
          <Field.Description fieldId="field">Hint</Field.Description>
          <Field.Error fieldId="field" invalid>
            Error
          </Field.Error>
        </Field.Root>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets field native props replace derived labels, ARIA and markers", () => {
  render(
    <Field.Root id="field" data-uiify-field="custom">
      <Field.Label fieldId="field" id="label" htmlFor="control">
        Name
      </Field.Label>
      <Field.Control
        fieldId="field"
        as="input"
        id="control"
        aria-labelledby={undefined}
        aria-describedby="help"
        data-part="editor"
      />
      <Field.Description fieldId="field" id="help">
        Hint
      </Field.Description>
      <Field.Error fieldId="field" invalid role="note" id={undefined}>
        Error
      </Field.Error>
    </Field.Root>,
  );
  expect(screen.getByText("Name").getAttribute("for")).toBe("control");
  expect(screen.getByRole("textbox").id).toBe("control");
  expect(screen.getByRole("textbox").hasAttribute("aria-labelledby")).toBe(false);
  expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe("help");
  expect(screen.getByText("Error").getAttribute("role")).toBe("note");
  expect(screen.getByText("Error").hasAttribute("id")).toBe(false);
});
