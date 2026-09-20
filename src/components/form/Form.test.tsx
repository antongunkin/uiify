import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Form } from "./Form.js";

describe("Form", () => {
  it("uses native validation by default", () => {
    render(<Form data-testid="form" />);
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.noValidate).toBe(false);
    expect(form.getAttribute("data-validation-behavior")).toBe("native");
  });

  it("sets noValidate when validationBehavior is aria", () => {
    render(
      <Form validationBehavior="aria" data-testid="form">
        <button type="submit">Submit</button>
      </Form>,
    );

    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.noValidate).toBe(true);
    expect(form.getAttribute("data-validation-behavior")).toBe("aria");
  });

  it("owns noValidate and data-validation-behavior when aria; consumer cannot override them", () => {
    render(
      <Form
        validationBehavior="aria"
        noValidate={false}
        data-validation-behavior="native"
        data-testid="form"
      />,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.noValidate).toBe(true);
    expect(form.getAttribute("data-validation-behavior")).toBe("aria");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Form validationBehavior="aria">
        <input name="email" aria-label="Email" />
      </Form>,
    );
    expect(markup).toContain('data-validation-behavior="aria"');
  });
});
