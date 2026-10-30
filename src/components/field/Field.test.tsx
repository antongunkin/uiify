import { createRef } from "react";
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
  it("forwards refs to generated label, description, and error parts", () => {
    const labelRef = createRef<HTMLLabelElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const errorRef = createRef<HTMLParagraphElement>();
    render(
      <Field.Root id="ref-field" invalid>
        <Field.Label fieldId="ref-field" ref={labelRef} data-testid="field-label">
          Name
        </Field.Label>
        <Field.Control fieldId="ref-field" as="input" aria-label="Name" />
        <Field.Description fieldId="ref-field" ref={descriptionRef} data-testid="field-description">
          Help
        </Field.Description>
        <Field.Error fieldId="ref-field" ref={errorRef} invalid data-testid="field-error">
          Required
        </Field.Error>
      </Field.Root>,
    );
    expect(labelRef.current).toBe(screen.getByTestId("field-label"));
    expect(descriptionRef.current).toBe(screen.getByTestId("field-description"));
    expect(errorRef.current).toBe(screen.getByTestId("field-error"));
  });
  it("applies native required validation and excludes disabled controls from FormData", () => {
    const { container } = render(
      <form>
        <Field.Control
          as="input"
          fieldId="required"
          name="required"
          aria-label="Required"
          required
        />
        <Field.Control
          as="input"
          fieldId="disabled"
          name="disabled"
          aria-label="Disabled"
          disabled
          defaultValue="ignored"
        />
      </form>,
    );
    expect((screen.getByLabelText("Required") as HTMLInputElement).checkValidity()).toBe(false);
    expect((screen.getByLabelText("Disabled") as HTMLInputElement).disabled).toBe(true);
    expect(new FormData(container.querySelector("form")!).has("disabled")).toBe(false);
  });
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

  it("allows root marker overrides", () => {
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
    expect(root.getAttribute("data-disabled")).toBe("no");
    expect(root.getAttribute("data-invalid")).toBe("no");
    expect(root.getAttribute("data-required")).toBe("no");
    expect(root.getAttribute("data-uiify-field")).toBe("bogus");
  });

  it("allows label native overrides", () => {
    render(
      <Field.Root id="field" required disabled>
        <Field.Label
          fieldId="field"
          required
          disabled
          id="bogus-id"
          data-disabled="no"
          data-required="no"
          htmlFor="bogus-for"
        >
          Name
        </Field.Label>
        <Field.Control fieldId="field" as="input" aria-label="Name" />
      </Field.Root>,
    );
    const label = screen.getByText("Name");
    expect(label.id).toBe("bogus-id");
    expect(label.getAttribute("for")).toBe("bogus-for");
    expect(label.getAttribute("data-disabled")).toBe("no");
    expect(label.getAttribute("data-required")).toBe("no");
  });

  it("allows control native overrides", () => {
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
    expect(control.id).toBe("bogus-id");
    expect(control.getAttribute("aria-labelledby")).toBe("bogus");
    expect(control.getAttribute("aria-describedby")).toBe("bogus");
    expect(control.getAttribute("aria-invalid")).toBe("false");
    expect(control.getAttribute("aria-required")).toBe("false");
    expect(control.getAttribute("data-disabled")).toBe("no");
    expect(control.getAttribute("data-invalid")).toBe("no");
    expect(control.getAttribute("data-required")).toBe("no");
  });

  it("allows description native overrides", () => {
    render(
      <Field.Root id="field" disabled>
        <Field.Description fieldId="field" disabled id="bogus-id" data-disabled="no">
          Hint
        </Field.Description>
      </Field.Root>,
    );
    const description = screen.getByText("Hint");
    expect(description.id).toBe("bogus-id");
    expect(description.getAttribute("data-disabled")).toBe("no");
  });

  it("allows error native overrides", () => {
    render(
      <Field.Root id="field" invalid>
        <Field.Error fieldId="field" invalid id="bogus-id" role="note" data-invalid="no">
          Required
        </Field.Error>
      </Field.Root>,
    );
    const error = screen.getByText("Required");
    expect(error.id).toBe("bogus-id");
    expect(error.getAttribute("role")).toBe("note");
    expect(error.getAttribute("data-invalid")).toBe("no");
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
