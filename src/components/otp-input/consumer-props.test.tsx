import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { OtpInput } from "./OtpInput.js";
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
        <OtpInput.Root defaultValue="12" length={2} mask>
          <OtpInput.Slot index={0} />
          <OtpInput.Slot index={1} />
          <OtpInput.HiddenInput />
        </OtpInput.Root>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets native OTP props override defaults and hidden-input styles", () => {
  const rootAutofocus = { autoFocus: true };
  const inputAutofocus = { autoFocus: undefined };
  render(
    <OtpInput.Root {...rootAutofocus} defaultValue="12" length={2} data-complete="custom">
      <OtpInput.Slot index={0} aria-hidden={false} data-index="custom" data-testid="slot" />
      <OtpInput.HiddenInput
        id={undefined}
        {...inputAutofocus}
        aria-label={undefined}
        type="email"
        value="custom"
        maxLength={8}
        style={{ opacity: 1, position: "static" }}
        data-testid="input"
      />
    </OtpInput.Root>,
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
