/* oxlint-disable jsx-a11y/control-has-associated-label -- controls are labelled by FieldLabel htmlFor, which the rule cannot follow */
/* oxlint-disable jsx-a11y/aria-role -- role={undefined} proves a consumer can remove the default group role */
import { createElement, createRef, Fragment } from "react";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, expectTypeOf, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  type FieldDescriptionProps,
  type FieldErrorProps,
  type FieldLabelProps,
} from "./index.js";

function Wrapper({ children }: { children: ReactNode }) {
  return <div data-testid="wrapper">{children}</div>;
}
Wrapper.displayName = "Wrapper";

describe("Field", () => {
  it("Field has no legacy parts", () => {
    const namespace = Field as unknown as Record<string, unknown>;
    for (const member of ["Root", "Label", "Control", "Description", "Error"]) {
      expect(namespace[member]).toBeUndefined();
    }
  });

  it("FieldLabel has no fieldId prop", () => {
    expectTypeOf<FieldLabelProps>().not.toHaveProperty("fieldId");
    expectTypeOf<FieldDescriptionProps>().not.toHaveProperty("fieldId");
    expectTypeOf<FieldErrorProps>().not.toHaveProperty("fieldId");
    // @ts-expect-error fieldId is not a FieldLabel prop: name the control with htmlFor
    const label = <FieldLabel fieldId="email">Email</FieldLabel>;
    expect(label).toBeTruthy();
  });

  it("joins identity classes on every part without legacy markers", () => {
    const { container } = render(
      <Field className="custom-root">
        <FieldLabel htmlFor="identity" className="custom-label">
          Notes
        </FieldLabel>
        <textarea id="identity" />
        <FieldDescription className="custom-description">Help</FieldDescription>
        <FieldError className="custom-error">Error</FieldError>
      </Field>,
    );
    for (const part of ["root", "label", "description", "error"]) {
      const element = container.querySelector(`.custom-${part}`)!;
      expect(
        element.classList.contains(part === "root" ? "uiify-field" : `uiify-field-${part}`),
      ).toBe(true);
      expect(element.hasAttribute("data-part")).toBe(false);
      expect(element.hasAttribute("data-uiify-field")).toBe(false);
    }
  });

  it("forwards refs to label, description, and error parts", () => {
    const labelRef = createRef<HTMLLabelElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const errorRef = createRef<HTMLParagraphElement>();
    render(
      <Field invalid>
        <FieldLabel htmlFor="ref-field" ref={labelRef} data-testid="field-label">
          Name
        </FieldLabel>
        <input id="ref-field" />
        <FieldDescription ref={descriptionRef} data-testid="field-description">
          Help
        </FieldDescription>
        <FieldError ref={errorRef} data-testid="field-error">
          Required
        </FieldError>
      </Field>,
    );
    expect(labelRef.current).toBe(screen.getByTestId("field-label"));
    expect(descriptionRef.current).toBe(screen.getByTestId("field-description"));
    expect(errorRef.current).toBe(screen.getByTestId("field-error"));
  });

  it("wires aria-describedby to description and error by consumer ids", () => {
    render(
      <Field invalid>
        <FieldLabel htmlFor="email-field">Email</FieldLabel>
        <input
          id="email-field"
          aria-invalid="true"
          aria-describedby="email-description email-error"
        />
        <FieldDescription id="email-description">Work email only</FieldDescription>
        <FieldError id="email-error">Required</FieldError>
      </Field>,
    );

    const control = screen.getByRole("textbox", { name: "Email" });
    expect(control).toHaveProperty("id", "email-field");
    expect(screen.getByRole("textbox", { description: "Work email only Required" })).toBe(control);
    expect(screen.getByRole("alert").textContent).toBe("Required");
  });

  it("propagates required and disabled data attributes", () => {
    render(
      <FieldLabel required disabled>
        Field
      </FieldLabel>,
    );
    expect(screen.getByText("Field").hasAttribute("data-required")).toBe(true);
    expect(screen.getByText("Field").hasAttribute("data-disabled")).toBe(true);
  });

  it("keeps working when a part is wrapped in a Fragment or an intermediate component", () => {
    render(
      <Field>
        {createElement(Fragment, null, <FieldLabel htmlFor="wrapped-field">Name</FieldLabel>)}
        <Wrapper>
          <input id="wrapped-field" />
        </Wrapper>
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Name" }).id).toBe("wrapped-field");
  });

  it("allows label native overrides", () => {
    render(
      <FieldLabel required disabled id="bogus-id" data-disabled="no" data-required="no">
        Name
      </FieldLabel>,
    );
    const label = screen.getByText("Name");
    expect(label.id).toBe("bogus-id");
    expect(label.getAttribute("data-disabled")).toBe("no");
    expect(label.getAttribute("data-required")).toBe("no");
  });

  it("allows description native overrides", () => {
    render(
      <FieldDescription disabled id="bogus-id" data-disabled="no">
        Hint
      </FieldDescription>,
    );
    const description = screen.getByText("Hint");
    expect(description.id).toBe("bogus-id");
    expect(description.getAttribute("data-disabled")).toBe("no");
  });

  it("allows error native overrides", () => {
    render(
      <FieldError id="bogus-id" role="note" data-invalid="no">
        Required
      </FieldError>,
    );
    const error = screen.getByText("Required");
    expect(error.id).toBe("bogus-id");
    expect(error.getAttribute("role")).toBe("note");
    expect(error.getAttribute("data-invalid")).toBe("no");
  });
});

describe("FieldSeparator", () => {
  it("renders the text between two decorative lines", () => {
    const { container } = render(<FieldSeparator>or</FieldSeparator>);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe("DIV");
    expect(root.className).toBe("uiify-field-separator");
    expect(root.hasAttribute("data-content")).toBe(true);
    expect(root.hasAttribute("role")).toBe(false);
    const kids = Array.from(root.children);
    expect(kids.map((kid) => kid.tagName)).toEqual(["HR", "SPAN", "HR"]);
    for (const line of [kids[0]!, kids[2]!]) {
      expect(line.className).toBe("uiify-field-separator-line");
      expect(line.getAttribute("role")).toBe("none");
    }
    expect(kids[1]!.className).toBe("uiify-field-separator-content");
    expect(kids[1]!.textContent).toBe("or");
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("renders a single semantic hr without children", () => {
    const { container } = render(<FieldSeparator />);
    const root = container.firstElementChild!;
    expect(root.hasAttribute("data-content")).toBe(false);
    expect(root.children).toHaveLength(1);
    const line = root.firstElementChild!;
    expect(line.tagName).toBe("HR");
    expect(line.className).toBe("uiify-field-separator-line");
    expect(line.hasAttribute("role")).toBe(false);
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });

  it("composes slotProps classes after defaults and spreads attributes on every line", () => {
    const lineRef = createRef<HTMLHRElement>();
    const { container } = render(
      <FieldSeparator
        slotProps={{
          line: { className: "dashed", "data-slot": "line", ref: lineRef },
          content: { className: "caps", id: "label" },
        }}
      >
        or
      </FieldSeparator>,
    );
    const lines = Array.from(container.querySelectorAll("hr"));
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line.className).toBe("uiify-field-separator-line dashed");
      expect(line.getAttribute("data-slot")).toBe("line");
    }
    // One ref object is attached to both lines, so it ends on the last one.
    expect(lineRef.current).toBe(lines[1]);
    const content = container.querySelector("span")!;
    expect(content.className).toBe("uiify-field-separator-content caps");
    expect(content.id).toBe("label");
  });

  it("forwards ref, className and attributes to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FieldSeparator ref={ref} className="mine" data-testid="root">
        or
      </FieldSeparator>,
    );
    const root = screen.getByTestId("root");
    expect(ref.current).toBe(root);
    expect(root.className).toBe("uiify-field-separator mine");
  });
});

describe("Field (shadcn shape)", () => {
  it("Field renders role=group with orientation", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<Field ref={ref} className="mine" data-testid="field" />);
    const root = screen.getByTestId("field");
    expect(ref.current).toBe(root);
    expect(root.tagName).toBe("DIV");
    expect(root.getAttribute("role")).toBe("group");
    expect(root.className).toBe("uiify-field mine");
    expect(root.getAttribute("data-orientation")).toBe("vertical");
    expect(root.hasAttribute("data-invalid")).toBe(false);
    expect(root.hasAttribute("id")).toBe(false);
    for (const orientation of ["horizontal", "responsive"] as const) {
      rerender(<Field orientation={orientation} invalid data-testid="field" />);
      expect(screen.getByTestId("field").getAttribute("data-orientation")).toBe(orientation);
      expect(screen.getByTestId("field").getAttribute("data-invalid")).toBe("");
    }
    rerender(<Field role={undefined} data-orientation="custom" data-testid="field" />);
    expect(screen.getByTestId("field").hasAttribute("role")).toBe(false);
    expect(screen.getByTestId("field").getAttribute("data-orientation")).toBe("custom");
  });

  it("Field variant card writes data-variant; unset omits it", () => {
    const { rerender } = render(<Field data-testid="field" />);
    expect(screen.getByTestId("field").hasAttribute("data-variant")).toBe(false);
    rerender(<Field variant="card" data-testid="field" />);
    expect(screen.getByTestId("field").getAttribute("data-variant")).toBe("card");
    rerender(<Field variant="card" data-variant="custom" data-testid="field" />);
    expect(screen.getByTestId("field").getAttribute("data-variant")).toBe("custom");
  });

  it("FieldLabel keeps consumer htmlFor", () => {
    render(
      <Field>
        <FieldLabel htmlFor="email" required>
          Email
        </FieldLabel>
        <input id="email" />
      </Field>,
    );
    const label = screen.getByText("Email");
    expect(label.tagName).toBe("LABEL");
    expect(label.className).toBe("uiify-field-label");
    expect(label.getAttribute("for")).toBe("email");
    expect(label.hasAttribute("id")).toBe(false);
    expect(label.getAttribute("data-required")).toBe("");
    expect(screen.getByRole("textbox", { name: "Email" }).id).toBe("email");
  });

  it("FieldDescription keeps the consumer id", () => {
    render(
      <Field>
        <input aria-describedby="hint" aria-label="Email" />
        <FieldDescription id="hint">We never share it.</FieldDescription>
        <FieldDescription>No id</FieldDescription>
      </Field>,
    );
    expect(screen.getByText("We never share it.").id).toBe("hint");
    expect(screen.getByText("No id").hasAttribute("id")).toBe(false);
    expect(screen.getByRole("textbox", { description: "We never share it." })).toBeTruthy();
  });

  it("FieldError renders only with content", () => {
    const { rerender, container } = render(
      <FieldError id="code-error">Enter the code.</FieldError>,
    );
    const error = screen.getByRole("alert");
    expect(error.tagName).toBe("P");
    expect(error.className).toBe("uiify-field-error");
    expect(error.id).toBe("code-error");
    expect(error.getAttribute("data-invalid")).toBe("");
    for (const empty of [undefined, null, false, "", []]) {
      rerender(<FieldError>{empty}</FieldError>);
      expect(container.innerHTML).toBe("");
    }
    rerender(<FieldError>{["", "Too short."]}</FieldError>);
    expect(screen.getByRole("alert").textContent).toBe("Too short.");
    rerender(<FieldError>{0}</FieldError>);
    expect(screen.getByRole("alert").textContent).toBe("0");
  });

  it("FieldContent, FieldTitle and FieldGroup render their tags and classes", () => {
    const groupRef = createRef<HTMLDivElement>();
    const { container } = render(
      <FieldGroup ref={groupRef} className="g" data-testid="group">
        <Field orientation="horizontal">
          <input id="terms" type="checkbox" />
          <FieldContent className="c" data-testid="content">
            <FieldLabel htmlFor="terms">
              <FieldTitle as="span" data-testid="title">
                Terms
              </FieldTitle>
            </FieldLabel>
          </FieldContent>
        </Field>
        <FieldTitle data-testid="block-title">Block</FieldTitle>
      </FieldGroup>,
    );
    const group = screen.getByTestId("group");
    expect(groupRef.current).toBe(group);
    expect(group.tagName).toBe("DIV");
    expect(group.className).toBe("uiify-field-group g");
    expect(screen.getByTestId("content").tagName).toBe("DIV");
    expect(screen.getByTestId("content").className).toBe("uiify-field-content c");
    expect(screen.getByTestId("title").tagName).toBe("SPAN");
    expect(screen.getByTestId("title").className).toBe("uiify-field-title");
    expect(screen.getByTestId("block-title").tagName).toBe("DIV");
    expect(screen.getByRole("checkbox", { name: "Terms" })).toBeTruthy();
    expect(container.querySelector("label div")).toBeNull();
  });

  it("FieldLegend variant label", () => {
    render(
      <>
        <FieldSet>
          <FieldLegend variant="label">Plan</FieldLegend>
          <input type="radio" name="plan" aria-label="Basic" />
        </FieldSet>
        <FieldSet>
          <FieldLegend>Notifications</FieldLegend>
        </FieldSet>
      </>,
    );
    const plan = screen.getByRole("group", { name: "Plan" });
    expect(plan.tagName).toBe("FIELDSET");
    expect(plan.className).toBe("uiify-field-set");
    const legend = screen.getByText("Plan");
    expect(legend.className).toBe("uiify-field-set-legend");
    expect(legend.getAttribute("data-variant")).toBe("label");
    expect(screen.getByText("Notifications").hasAttribute("data-variant")).toBe(false);
  });

  it("renders the sign-up composition on the server", () => {
    const markup = renderToStaticMarkup(
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" aria-describedby="email-description" />
          <FieldDescription id="email-description">We never share it.</FieldDescription>
        </Field>
      </FieldGroup>,
    );
    expect(markup).toBe(
      '<div class="uiify-field-group"><div role="group" data-orientation="vertical" class="uiify-field"><label for="email" class="uiify-field-label">Email</label><input id="email" aria-describedby="email-description"/><p id="email-description" class="uiify-field-description">We never share it.</p></div></div>',
    );
  });
});
