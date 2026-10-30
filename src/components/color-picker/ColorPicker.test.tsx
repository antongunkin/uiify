import { createRef, type ChangeEvent } from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { ColorPicker } from "./ColorPicker.js";

describe("ColorPicker", () => {
  it("renders a Field value input and one labeled native color input", () => {
    const { container } = render(
      <ColorPicker defaultValue="#2563eb" label="Brand color" name="brand" />,
    );

    expect(container.querySelectorAll('input[type="color"]')).toHaveLength(1);
    const nativeInput = container.querySelector<HTMLInputElement>('input[type="color"]');
    expect(nativeInput).not.toBeNull();
    expect(nativeInput?.getAttribute("name")).toBe("brand");
    expect(container.querySelector<HTMLInputElement>("[data-uiify-input]")?.value).toBe("#2563eb");
  });

  it("updates the Field value and callback when the native picker changes", () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => event.currentTarget.value);
    const { container } = render(
      <ColorPicker
        defaultValue="#2563eb"
        label="Brand color"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(container.querySelector('input[type="color"]') as HTMLInputElement, {
      target: { value: "#dc2626" },
    });

    expect(container.querySelector<HTMLInputElement>("[data-uiify-input]")?.value).toBe("#dc2626");
    expect(onValueChange).toHaveBeenCalledWith("#dc2626");
    expect(onChange.mock.results[0]?.value).toBe("#dc2626");
  });

  it("forwards native form props and root style props", () => {
    const { container } = render(
      <form id="settings">
        <ColorPicker
          className="brand-color"
          data-layout="compact"
          defaultValue="#2563eb"
          disabled
          form="settings"
          label="Brand color"
          name="brand"
          required
          style={{ inlineSize: "12rem" }}
        />
      </form>,
    );

    const nativeInput = container.querySelector('input[type="color"]') as HTMLInputElement;
    const root = nativeInput.closest("[data-uiify-color-picker]");
    expect(nativeInput.disabled).toBe(true);
    expect(nativeInput.required).toBe(true);
    expect(nativeInput.name).toBe("brand");
    expect(nativeInput.form?.id).toBe("settings");
    expect(root?.classList.contains("brand-color")).toBe(true);
    expect(root?.getAttribute("data-layout")).toBe("compact");
    expect((root as HTMLElement).style.inlineSize).toBe("12rem");
  });

  it("forwards slot props to generated label, surface, value control, and native input", () => {
    const labelRef = createRef<HTMLLabelElement>();
    const fieldRef = createRef<HTMLDivElement>();
    const surfaceRef = createRef<HTMLDivElement>();
    const controlRef = createRef<HTMLInputElement>();
    const inputRef = createRef<HTMLInputElement>();
    const onSlotChange = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <ColorPicker
        className="picker-root"
        defaultValue="#2563eb"
        label="Brand color"
        onValueChange={onValueChange}
        required
        slotProps={{
          field: {
            className: "picker-field-slot",
            "data-testid": "picker-field-slot",
            ref: fieldRef,
            style: { marginBlockStart: "1rem" },
          },
          label: {
            className: "picker-label",
            "data-testid": "picker-label",
            "data-part": "override",
            ref: labelRef,
          },
          surface: {
            className: "picker-surface",
            "data-testid": "picker-surface",
            "data-part": "override",
            "data-value": "#000000",
            ref: surfaceRef,
            style: { outlineWidth: "1px" },
          },
          control: {
            className: "picker-control",
            "data-testid": "picker-control",
            ref: controlRef,
          },
          input: {
            className: "picker-input",
            "data-testid": "picker-input",
            "data-part": "override",
            required: false,
            onChange: onSlotChange,
            ref: inputRef,
          },
        }}
      />,
    );

    const field = container.querySelector("[data-uiify-color-picker]") as HTMLDivElement;
    expect(field.className).toBe("picker-root picker-field-slot");
    expect(field.style.inlineSize).toBe("");
    expect(field.style.marginBlockStart).toBe("1rem");
    expect(fieldRef.current).toBe(field);
    expect(container.querySelector("label")?.className).toBe("picker-label");
    expect(container.querySelector("label")?.getAttribute("data-part")).toBe("override");
    expect(container.querySelector("[data-testid='picker-surface']")?.className).toBe(
      "picker-surface",
    );
    expect(
      container.querySelector("[data-testid='picker-surface']")?.getAttribute("style"),
    ).toContain("outline-width: 1px");
    expect(
      container.querySelector("[data-testid='picker-surface']")?.getAttribute("style"),
    ).toContain("--uiify-color-picker-value: #2563eb");
    expect(
      container.querySelector("[data-testid='picker-surface']")?.getAttribute("data-value"),
    ).toBe("#000000");
    expect(container.querySelector("[data-testid='picker-control']")?.className).toBe(
      "picker-control",
    );
    expect(
      (container.querySelector("[data-testid='picker-control']") as HTMLInputElement).type,
    ).toBe("text");
    expect(
      (container.querySelector("[data-testid='picker-control']") as HTMLInputElement).value,
    ).toBe("#2563eb");
    expect(
      (container.querySelector("[data-testid='picker-control']") as HTMLInputElement).defaultValue,
    ).toBe("#2563eb");
    const input = container.querySelector("input[type='color']") as HTMLInputElement;
    expect(input.className).toBe("picker-input");
    expect(input.getAttribute("data-part")).toBe("override");
    expect(input.required).toBe(false);
    expect(labelRef.current).toBe(container.querySelector("label"));
    expect(surfaceRef.current).toBe(container.querySelector("[data-testid='picker-surface']"));
    expect(controlRef.current).toBe(container.querySelector("[data-testid='picker-control']"));
    expect(inputRef.current).toBe(input);

    fireEvent.change(input, { target: { value: "#dc2626" } });
    expect(onValueChange).toHaveBeenCalledWith("#dc2626");
    expect(onSlotChange).toHaveBeenCalledOnce();
  });

  it("keeps native color hints on the actual picker input", () => {
    const { container } = render(
      <ColorPicker alpha colorSpace="display-p3" label="Brand color" list="brand-colors" />,
    );

    const input = container.querySelector('input[type="color"]') as HTMLInputElement;
    expect(input).toHaveProperty("type", "color");
    expect(input.hasAttribute("alpha")).toBe(true);
    expect(input.getAttribute("colorspace")).toBe("display-p3");
    expect(input.getAttribute("list")).toBe("brand-colors");
  });

  it("lets native-input slot handlers cancel the internal value update", () => {
    const onChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => event.preventDefault());
    const onSlotChange = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <ColorPicker
        defaultValue="#2563eb"
        label="Brand color"
        onChange={onChange}
        onValueChange={onValueChange}
        slotProps={{ input: { onChange: onSlotChange } }}
      />,
    );

    fireEvent.change(container.querySelector("input[type='color']") as HTMLInputElement, {
      target: { value: "#dc2626" },
    });

    expect(onChange).toHaveBeenCalledOnce();
    expect(onSlotChange).toHaveBeenCalledOnce();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the native color input", () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<ColorPicker label="Brand color" ref={ref} />);

    expect(ref.current).toBe(container.querySelector('input[type="color"]'));
    expect(ref.current?.type).toBe("color");
  });

  it("renders the Field value input and native color input in server markup", () => {
    const markup = renderToStaticMarkup(
      <ColorPicker defaultValue="#2563eb" label="Brand color" name="brand" />,
    );

    expect(markup).toContain('type="color"');
    expect(markup).toContain('type="text"');
    expect(markup).toContain('readOnly=""');
    expect(markup).toContain('data-value="#2563eb"');
    expect(markup).toContain('name="brand"');
    expect(markup).toContain('data-uiify-color-picker=""');
  });
});
