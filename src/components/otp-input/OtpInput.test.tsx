import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { OtpInput } from "./OtpInput.js";

function renderOtp(props: Partial<ComponentProps<typeof OtpInput.Root>> = {}) {
  const length = props.length ?? 6;
  return render(
    <OtpInput.Root {...props}>
      {Array.from({ length }, (_, index) => (
        <OtpInput.Slot key={index} index={index} />
      ))}
      <OtpInput.HiddenInput />
    </OtpInput.Root>,
  );
}

describe("OtpInput", () => {
  it("advances cells while typing", () => {
    renderOtp();
    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("123");
    expect(screen.getAllByText("1")[0]).toBeTruthy();
  });

  it("handles backspace", () => {
    renderOtp({ defaultValue: "12" });
    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(input.value).toBe("1");
  });

  it("fills all cells on paste and calls onComplete", () => {
    const onComplete = vi.fn();
    renderOtp({ onComplete });
    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.paste(input, { clipboardData: { getData: () => "654321" } });
    expect(input.value).toBe("654321");
    expect(onComplete).toHaveBeenCalledWith("654321");
  });

  it("filters non-numeric input by default", () => {
    renderOtp();
    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "a1b2" } });
    expect(input.value).toBe("12");
  });

  it("supports alphanumeric type", () => {
    renderOtp({ type: "alphanumeric" });
    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "a1B2" } });
    expect(input.value).toBe("a1B2");
  });

  it("masks filled slots", () => {
    renderOtp({ mask: true, defaultValue: "12" });
    expect(screen.getAllByText("•").length).toBeGreaterThan(0);
  });

  it("reflects controlled value", () => {
    const { rerender } = render(
      <OtpInput.Root value="123456" length={6}>
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput />
      </OtpInput.Root>,
    );
    expect((screen.getByLabelText("One-time code") as HTMLInputElement).value).toBe("123456");

    rerender(
      <OtpInput.Root value="000000" length={6}>
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput />
      </OtpInput.Root>,
    );
    expect((screen.getByLabelText("One-time code") as HTMLInputElement).value).toBe("000000");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <OtpInput.Root defaultValue="12" length={2}>
        <OtpInput.Slot index={0} />
        <OtpInput.Slot index={1} />
        <OtpInput.HiddenInput />
      </OtpInput.Root>,
    );
    expect(markup).toContain("one-time-code");
  });

  it("owns Root's data-disabled and data-complete regardless of consumer override", () => {
    const { container } = render(
      <OtpInput.Root
        disabled
        defaultValue="123456"
        length={6}
        data-disabled="bogus"
        data-complete="bogus"
        data-testid="root"
      >
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput />
      </OtpInput.Root>,
    );

    const root = container.querySelector("[data-testid='root']");
    expect(root?.getAttribute("data-disabled")).toBe("");
    expect(root?.getAttribute("data-complete")).toBe("");
  });

  it("lets a consumer onClick veto focusing the hidden input", () => {
    const { container } = render(
      <OtpInput.Root onClick={(event) => event.preventDefault()} data-testid="root">
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput />
      </OtpInput.Root>,
    );

    const input = screen.getByLabelText("One-time code");
    const root = container.querySelector("[data-testid='root']") as HTMLElement;
    fireEvent.click(root);
    expect(document.activeElement).not.toBe(input);
  });

  it("owns Slot's aria-hidden, data-active, data-disabled, data-filled, data-index, and children regardless of consumer override", () => {
    const { container } = render(
      <OtpInput.Root defaultValue="1" length={2}>
        <OtpInput.Slot
          index={0}
          aria-hidden="false"
          data-active="bogus"
          data-disabled="bogus"
          data-filled="bogus"
          data-index="bogus"
          data-testid="slot0"
        >
          bogus
        </OtpInput.Slot>
        <OtpInput.HiddenInput />
      </OtpInput.Root>,
    );

    const slot = container.querySelector("[data-testid='slot0']");
    expect(slot?.getAttribute("aria-hidden")).toBe("true");
    expect(slot?.getAttribute("data-filled")).toBe("");
    expect(slot?.getAttribute("data-index")).toBe("0");
    expect(slot?.textContent).toBe("1");
  });

  it("owns HiddenInput's value, type, and maxLength regardless of consumer override", () => {
    render(
      <OtpInput.Root defaultValue="123" length={6}>
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput value="bogus" type="email" maxLength={2} />
      </OtpInput.Root>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    expect(input.value).toBe("123");
    expect(input.type).toBe("text");
    expect(input.maxLength).toBe(6);
  });

  it("owns HiddenInput's visually-hidden style regardless of consumer override", () => {
    render(
      <OtpInput.Root>
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput style={{ position: "static", opacity: 1, color: "red" }} />
      </OtpInput.Root>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    expect(input.style.position).toBe("absolute");
    expect(input.style.opacity).toBe("0");
    expect(input.style.color).toBe("red");
  });

  it("lets a consumer onChange veto value sync, leaving the committed value unchanged (policy #1: form-control change veto)", () => {
    render(
      <OtpInput.Root defaultValue="">
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput onChange={(event) => event.preventDefault()} />
      </OtpInput.Root>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("");
  });

  it("lets a consumer onKeyDown veto backspace handling without suppressing paste-splitting", () => {
    render(
      <OtpInput.Root defaultValue="12" length={6}>
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput onKeyDown={(event) => event.preventDefault()} />
      </OtpInput.Root>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(input.value).toBe("12");

    fireEvent.paste(input, { clipboardData: { getData: () => "999999" } });
    expect(input.value).toBe("999999");
  });

  it("lets a consumer onPaste veto paste-splitting", () => {
    render(
      <OtpInput.Root defaultValue="">
        <OtpInput.Slot index={0} />
        <OtpInput.HiddenInput onPaste={(event) => event.preventDefault()} />
      </OtpInput.Root>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.paste(input, { clipboardData: { getData: () => "999999" } });
    expect(input.value).toBe("");
  });
});
