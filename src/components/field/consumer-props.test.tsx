/* oxlint-disable jsx-a11y/control-has-associated-label -- controls are labelled by FieldLabel htmlFor, which the rule cannot follow */
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "./index.js";
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

it("lets field native props replace default roles, ARIA and markers", () => {
  render(
    <Field role="none" data-orientation="custom" data-testid="field">
      <FieldLabel htmlFor="control" required data-required="no">
        Name
      </FieldLabel>
      <input id="control" aria-describedby="help" />
      <FieldDescription id="help">Hint</FieldDescription>
      <FieldError role="note" data-invalid="no">
        Error
      </FieldError>
    </Field>,
  );
  expect(screen.getByTestId("field").getAttribute("role")).toBe("none");
  expect(screen.getByTestId("field").getAttribute("data-orientation")).toBe("custom");
  expect(screen.getByText("Name").getAttribute("for")).toBe("control");
  expect(screen.getByText("Name").getAttribute("data-required")).toBe("no");
  expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe("help");
  expect(screen.getByText("Error").getAttribute("role")).toBe("note");
  expect(screen.getByText("Error").getAttribute("data-invalid")).toBe("no");
});

it("preserves default shadcn-shaped field DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <Field orientation="horizontal" invalid>
          <input id="code" aria-describedby="code-description code-error" aria-invalid="true" />
          <FieldContent>
            <FieldLabel htmlFor="code" required>
              <FieldTitle as="span">Code</FieldTitle>
            </FieldLabel>
            <FieldDescription id="code-description">Sent to your phone.</FieldDescription>
            <FieldError id="code-error">Enter the code.</FieldError>
          </FieldContent>
        </Field>,
      ),
    ),
  ).toEqual([
    'div class="uiify-field" data-invalid="" data-orientation="horizontal" role="group"',
    'input aria-describedby="code-description code-error" aria-invalid="true" id="code"',
    'div class="uiify-field-content"',
    'label class="uiify-field-label" data-required="" for="code"',
    'span class="uiify-field-title"',
    'p class="uiify-field-description" id="code-description"',
    'p class="uiify-field-error" data-invalid="" id="code-error" role="alert"',
  ]);
});
