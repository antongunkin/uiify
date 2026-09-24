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
