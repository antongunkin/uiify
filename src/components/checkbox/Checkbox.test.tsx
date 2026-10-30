import { createRef, type ChangeEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Checkbox } from "./Checkbox.js";
import type { CheckboxProps } from "./types.js";

describe("Checkbox", () => {
  it("forwards slot props to its generated input and label", () => {
    const inputRef = createRef<HTMLInputElement>();
    const labelRef = createRef<HTMLLabelElement>();
    const props = {
      id: "terms",
      label: "Terms",
      slotProps: {
        input: { className: "checkbox-input", "data-testid": "checkbox-input", ref: inputRef },
        label: { className: "checkbox-label", "data-testid": "checkbox-label", ref: labelRef },
      },
    };

    render(<Checkbox {...props} />);

    const input = screen.getByTestId("checkbox-input");
    const label = screen.getByTestId("checkbox-label");
    expect(input.className).toBe("checkbox-input");
    expect(label.className).toBe("checkbox-label");
    expect(inputRef.current).toBe(input);
    expect(labelRef.current).toBe(label);
  });

  it("lets the input slot prevent the checked-state update", () => {
    const onCheckedChange = vi.fn();
    const onChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => event.preventDefault());
    render(
      <Checkbox
        id="terms"
        label="Terms"
        onCheckedChange={onCheckedChange}
        slotProps={{ input: { onChange } }}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Terms" }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("lets native slots override checkbox identity and state", () => {
    const nativeProps: Pick<CheckboxProps, "slotProps"> = {
      slotProps: {
        input: {
          checked: true,
          "data-state": "custom",
          id: "native",
          type: "radio",
          "aria-labelledby": "native-label",
        },
        label: { "data-uiify-checkbox": "custom", htmlFor: "native", id: "native-label" },
      },
    };
    render(<Checkbox id="terms" label="Terms" {...nativeProps} />);
    const input = screen.getByRole("radio", { name: "Terms" });
    expect(input.id).toBe("native");
    expect(input.getAttribute("checked")).toBe("");
    expect(input.getAttribute("data-state")).toBe("custom");
    expect(input.parentElement?.id).toBe("native-label");
    expect(input.parentElement?.getAttribute("data-uiify-checkbox")).toBe("custom");
  });

  it("renders a native checkbox and label from data props", () => {
    render(<Checkbox id="terms" label="Accept terms" defaultChecked />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox.getAttribute("id")).toBe("terms");
    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });

  it("renders a server-readable indeterminate state", () => {
    render(<Checkbox id="all" label="Select all" checked="indeterminate" />);
    const checkbox = screen.getByRole("checkbox", { name: "Select all" });

    expect(checkbox.getAttribute("data-state")).toBe("indeterminate");
    expect(checkbox.getAttribute("aria-checked")).toBe("mixed");
  });

  it("maps disabled through to the native input", () => {
    render(<Checkbox id="terms" label="Terms" disabled />);
    expect((screen.getByRole("checkbox", { name: "Terms" }) as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it("forwards name and value for native form submission", () => {
    render(<Checkbox id="email" label="Email" name="contact" value="email" defaultChecked />);

    const checkbox = screen.getByRole("checkbox", { name: "Email" }) as HTMLInputElement;
    expect(checkbox.name).toBe("contact");
    expect(checkbox.value).toBe("email");
  });

  it("keeps the consumer class on the label and exposes the identity marker", () => {
    render(<Checkbox id="terms" label="Terms" className="custom-checkbox" />);

    const checkbox = screen.getByRole("checkbox", { name: "Terms" });
    expect(checkbox.className).toBe("");
    expect(checkbox.parentElement?.className).toBe("custom-checkbox");
    expect(checkbox.parentElement?.getAttribute("data-uiify-checkbox")).toBe("");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Checkbox id="terms" label="Terms" defaultChecked />);
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('aria-labelledby="terms-label"');
    expect(markup).toContain('id="terms-label"');
  });
});
