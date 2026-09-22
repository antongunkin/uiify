import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Field } from "./Field.js";

function Wrapper({ children }: { children: ReactNode }) {
  return <div data-testid="wrapper">{children}</div>;
}
Wrapper.displayName = "Wrapper";

describe("Field", () => {
  it("wires label htmlFor to control id", () => {
    render(
      <Field.Root id="name-field">
        <Field.Label fieldId="name-field">Name</Field.Label>
        <Field.Control fieldId="name-field" as="input" aria-label="Name" />
      </Field.Root>,
    );

    const label = screen.getByText("Name");
    const control = screen.getByRole("textbox");
    expect(label.getAttribute("for")).toBe(control.id);
    expect(control.getAttribute("data-uiify-input")).toBe("");
  });

  it("wires aria-describedby to description and error", () => {
    render(
      <Field.Root id="email-field" invalid>
        <Field.Label fieldId="email-field">Email</Field.Label>
        <Field.Control fieldId="email-field" invalid as="input" aria-label="Email" />
        <Field.Description fieldId="email-field">Work email only</Field.Description>
        <Field.Error fieldId="email-field" invalid>
          Required
        </Field.Error>
      </Field.Root>,
    );

    const control = screen.getByRole("textbox");
    const describedBy = control.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ").length).toBe(2);
    expect(control.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Required");
  });

  it("omits error node when not invalid", () => {
    render(
      <Field.Root id="field">
        <Field.Error fieldId="field">Hidden</Field.Error>
      </Field.Root>,
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("propagates required and disabled data attributes", () => {
    render(
      <Field.Root id="field" required disabled invalid>
        <Field.Label fieldId="field" required disabled>
          Field
        </Field.Label>
      </Field.Root>,
    );
    expect(screen.getByText("Field").hasAttribute("data-required")).toBe(true);
    expect(screen.getByText("Field").hasAttribute("data-disabled")).toBe(true);
  });

  it("keeps working when a part is wrapped in a Fragment or an intermediate component — no child traversal to break", () => {
    render(
      <Field.Root id="wrapped-field">
        <>
          <Field.Label fieldId="wrapped-field">Name</Field.Label>
        </>
        <Wrapper>
          <Field.Control fieldId="wrapped-field" as="input" aria-label="Name" />
        </Wrapper>
      </Field.Root>,
    );

    const label = screen.getByText("Name");
    const control = screen.getByRole("textbox");
    expect(label.getAttribute("for")).toBe(control.id);
    expect(control.id).toBe("wrapped-field-control");
  });

  it("Root owns data-disabled, data-invalid, data-required and data-uiify-field; consumer cannot override them", () => {
    render(
      <Field.Root
        id="field"
        required
        disabled
        invalid
        data-disabled="no"
        data-invalid="no"
        data-required="no"
        data-uiify-field="bogus"
        data-testid="root"
      />,
    );
    const root = screen.getByTestId("root");
    expect(root.getAttribute("data-disabled")).toBe("");
    expect(root.getAttribute("data-invalid")).toBe("");
    expect(root.getAttribute("data-required")).toBe("");
    expect(root.getAttribute("data-uiify-field")).toBe("");
  });

  it("Label owns id, htmlFor, data-disabled and data-required; consumer cannot override them", () => {
    const bogusHtmlFor = { htmlFor: "bogus-for" } as { htmlFor?: string };
    render(
      <Field.Root id="field" required disabled>
        <Field.Label
          fieldId="field"
          required
          disabled
          id="bogus-id"
          data-disabled="no"
          data-required="no"
          {...bogusHtmlFor}
        >
          Name
        </Field.Label>
        <Field.Control fieldId="field" as="input" aria-label="Name" />
      </Field.Root>,
    );
    const label = screen.getByText("Name");
    const control = screen.getByRole("textbox");
    expect(label.id).toBe("field-label");
    expect(label.getAttribute("for")).toBe(control.id);
    expect(label.getAttribute("for")).not.toBe("bogus-for");
    expect(label.getAttribute("data-disabled")).toBe("");
    expect(label.getAttribute("data-required")).toBe("");
  });

  it("Control owns id, aria wiring, and data attributes; consumer cannot override them", () => {
    render(
      <Field.Root id="field" required invalid disabled>
        <Field.Control
          fieldId="field"
          required
          invalid
          disabled
          as="input"
          aria-label="Name"
          id="bogus-id"
          aria-labelledby="bogus"
          aria-describedby="bogus"
          aria-invalid={false}
          aria-required={false}
          data-disabled="no"
          data-invalid="no"
          data-required="no"
        />
      </Field.Root>,
    );
    const control = screen.getByRole("textbox");
    expect(control.id).toBe("field-control");
    expect(control.getAttribute("aria-labelledby")).toBe("field-label");
    expect(control.getAttribute("aria-describedby")).toBe("field-description field-error");
    expect(control.getAttribute("aria-invalid")).toBe("true");
    expect(control.getAttribute("aria-required")).toBe("true");
    expect(control.getAttribute("data-disabled")).toBe("");
    expect(control.getAttribute("data-invalid")).toBe("");
    expect(control.getAttribute("data-required")).toBe("");
  });

  it("Description owns id and data-disabled; consumer cannot override them", () => {
    render(
      <Field.Root id="field" disabled>
        <Field.Description fieldId="field" disabled id="bogus-id" data-disabled="no">
          Hint
        </Field.Description>
      </Field.Root>,
    );
    const description = screen.getByText("Hint");
    expect(description.id).toBe("field-description");
    expect(description.getAttribute("data-disabled")).toBe("");
  });

  it("Error owns id, role and data-invalid; consumer cannot override them", () => {
    render(
      <Field.Root id="field" invalid>
        <Field.Error fieldId="field" invalid id="bogus-id" role="note" data-invalid="no">
          Required
        </Field.Error>
      </Field.Root>,
    );
    const error = screen.getByText("Required");
    expect(error.id).toBe("field-error");
    expect(error.getAttribute("role")).toBe("alert");
    expect(error.getAttribute("data-invalid")).toBe("");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Field.Root id="email-field" invalid>
        <Field.Label fieldId="email-field">Email</Field.Label>
        <Field.Control fieldId="email-field" invalid>
          <input aria-label="Email" />
        </Field.Control>
        <Field.Description fieldId="email-field">Hint</Field.Description>
        <Field.Error fieldId="email-field" invalid>
          Error
        </Field.Error>
      </Field.Root>,
    );
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("aria-describedby");
  });
});
