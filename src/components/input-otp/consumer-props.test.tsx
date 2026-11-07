import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { InputOTP, InputOTPHiddenInput, InputOTPSlot } from "./InputOtp.js";
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

it("preserves default OTP input DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <InputOTP defaultValue="12" length={2} mask>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPHiddenInput />
        </InputOTP>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets native OTP props override defaults and hidden-input styles", () => {
  const rootAutofocus = { autoFocus: true };
  const inputAutofocus = { autoFocus: undefined };
  render(
    <InputOTP {...rootAutofocus} defaultValue="12" length={2} data-complete="custom">
      <InputOTPSlot index={0} aria-hidden={false} data-index="custom" data-testid="slot" />
      <InputOTPHiddenInput
        id={undefined}
        {...inputAutofocus}
        aria-label={undefined}
        type="email"
        value="custom"
        maxLength={8}
        style={{ opacity: 1, position: "static" }}
        data-testid="input"
      />
    </InputOTP>,
  );
  expect(screen.getByTestId("slot").getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByTestId("slot").getAttribute("data-index")).toBe("custom");
  expect(screen.getByTestId("input").hasAttribute("id")).toBe(false);
  expect(screen.getByTestId("input").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("input").hasAttribute("autofocus")).toBe(false);
  expect(screen.getByTestId("input").getAttribute("type")).toBe("email");
  expect(screen.getByTestId("input").style.opacity).toBe("1");
  expect(screen.getByTestId("input").style.position).toBe("static");
});
