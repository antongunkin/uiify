import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { InputOTP, InputOTPHiddenInput, InputOTPSlot } from "./InputOtp.js";

function renderOtp(props: Partial<ComponentProps<typeof InputOTP>> = {}) {
  const length = props.length ?? 6;
  return render(
    <InputOTP {...props}>
      {Array.from({ length }, (_, index) => (
        <InputOTPSlot key={index} index={index} />
      ))}
      <InputOTPHiddenInput />
    </InputOTP>,
  );
}

describe("InputOTP", () => {
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

  it("does not delete during input method composition", () => {
    renderOtp({ defaultValue: "12" });
    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Backspace", isComposing: true });
    fireEvent.keyDown(input, { key: "Backspace", keyCode: 229 });
    expect(input.value).toBe("12");
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
      <InputOTP value="123456" length={6}>
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput />
      </InputOTP>,
    );
    expect((screen.getByLabelText("One-time code") as HTMLInputElement).value).toBe("123456");

    rerender(
      <InputOTP value="000000" length={6}>
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput />
      </InputOTP>,
    );
    expect((screen.getByLabelText("One-time code") as HTMLInputElement).value).toBe("000000");
  });

  it("allows direct styling, refs, and data attributes on each public part", () => {
    const rootRef = createRef<HTMLDivElement>();
    const slotRef = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLInputElement>();
    render(
      <InputOTP ref={rootRef} className="otp-root" data-testid="otp-root">
        <InputOTPSlot index={0} ref={slotRef} className="otp-slot" data-testid="otp-slot" />
        <InputOTPHiddenInput ref={inputRef} className="otp-input" data-testid="otp-input" />
      </InputOTP>,
    );

    expect(screen.getByTestId("otp-root").className).toContain("otp-root");
    expect(screen.getByTestId("otp-slot").className).toContain("otp-slot");
    expect(screen.getByTestId("otp-input").className).toContain("otp-input");
    expect(rootRef.current).toBe(screen.getByTestId("otp-root"));
    expect(slotRef.current).toBe(screen.getByTestId("otp-slot"));
    expect(inputRef.current).toBe(screen.getByTestId("otp-input"));
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <InputOTP defaultValue="12" length={2}>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPHiddenInput />
      </InputOTP>,
    );
    expect(markup).toContain("one-time-code");
  });

  it("accepts root state marker overrides", () => {
    const { container } = render(
      <InputOTP
        disabled
        defaultValue="123456"
        length={6}
        data-disabled="bogus"
        data-complete="bogus"
        data-testid="root"
      >
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput />
      </InputOTP>,
    );

    const root = container.querySelector("[data-testid='root']");
    expect(root?.getAttribute("data-disabled")).toBe("bogus");
    expect(root?.getAttribute("data-complete")).toBe("bogus");
  });

  it("lets a consumer onClick veto focusing the hidden input", () => {
    const { container } = render(
      <InputOTP onClick={(event) => event.preventDefault()} data-testid="root">
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput />
      </InputOTP>,
    );

    const input = screen.getByLabelText("One-time code");
    const root = container.querySelector("[data-testid='root']") as HTMLElement;
    fireEvent.click(root);
    expect(document.activeElement).not.toBe(input);
  });

  it("accepts slot native overrides while rendering its generated content", () => {
    const { container } = render(
      <InputOTP defaultValue="1" length={2}>
        <InputOTPSlot
          index={0}
          aria-hidden="false"
          data-active="bogus"
          data-disabled="bogus"
          data-filled="bogus"
          data-index="bogus"
          data-testid="slot0"
        >
          bogus
        </InputOTPSlot>
        <InputOTPHiddenInput />
      </InputOTP>,
    );

    const slot = container.querySelector("[data-testid='slot0']");
    expect(slot?.getAttribute("aria-hidden")).toBe("false");
    expect(slot?.getAttribute("data-filled")).toBe("bogus");
    expect(slot?.getAttribute("data-index")).toBe("bogus");
    expect(slot?.textContent).toBe("1");
  });

  it("accepts hidden-input native value and type overrides", () => {
    render(
      <InputOTP defaultValue="123" length={6}>
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput value="bogus" type="email" maxLength={2} />
      </InputOTP>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    expect(input.value).toBe("bogus");
    expect(input.type).toBe("email");
    expect(input.maxLength).toBe(2);
  });

  it("merges consumer hidden-input styles after library defaults", () => {
    render(
      <InputOTP>
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput style={{ position: "static", opacity: 1, color: "red" }} />
      </InputOTP>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    expect(input.style.position).toBe("static");
    expect(input.style.opacity).toBe("1");
    expect(input.style.color).toBe("red");
  });

  it("lets a consumer onChange veto value sync, leaving the committed value unchanged (policy #1: form-control change veto)", () => {
    render(
      <InputOTP defaultValue="">
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput onChange={(event) => event.preventDefault()} />
      </InputOTP>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("");
  });

  it("lets a consumer onKeyDown veto backspace handling without suppressing paste-splitting", () => {
    render(
      <InputOTP defaultValue="12" length={6}>
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput onKeyDown={(event) => event.preventDefault()} />
      </InputOTP>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(input.value).toBe("12");

    fireEvent.paste(input, { clipboardData: { getData: () => "999999" } });
    expect(input.value).toBe("999999");
  });

  it("lets a consumer onPaste veto paste-splitting", () => {
    render(
      <InputOTP defaultValue="">
        <InputOTPSlot index={0} />
        <InputOTPHiddenInput onPaste={(event) => event.preventDefault()} />
      </InputOTP>,
    );

    const input = screen.getByLabelText("One-time code") as HTMLInputElement;
    fireEvent.paste(input, { clipboardData: { getData: () => "999999" } });
    expect(input.value).toBe("");
  });
});
