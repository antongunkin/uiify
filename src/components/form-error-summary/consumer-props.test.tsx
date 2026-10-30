import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { FormErrorSummary } from "./FormErrorSummary.js";
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
it("preserves default form-error-summary DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <FormErrorSummary
          title="Errors"
          errors={[
            { href: "#email", message: "Invalid email" },
            { href: "#name", message: "Enter name" },
          ]}
        />,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets native and per-error slots override summary defaults", () => {
  render(
    <FormErrorSummary
      title="Errors"
      data-uiify-form-error-summary={undefined}
      data-testid="root"
      errors={[
        { href: "#email", message: "Email" },
        { href: "#name", message: "Name" },
      ]}
      slotProps={{
        title: { "data-part": "heading" },
        list: { "data-part": undefined },
        item: { "data-part": "entry", byItemValue: { "#email": { "data-part": "email-entry" } } },
        link: {
          href: "#common",
          "data-part": "destination",
          byItemValue: { "#email": { href: undefined } },
        },
      }}
    />,
  );
  expect(screen.getByTestId("root").hasAttribute("data-uiify-form-error-summary")).toBe(false);
  expect(screen.getByText("Errors").getAttribute("data-part")).toBe("heading");
  expect(screen.getByText("Email").hasAttribute("href")).toBe(false);
  expect(screen.getByText("Name").getAttribute("href")).toBe("#common");
  expect(screen.getByText("Email").parentElement?.getAttribute("data-part")).toBe("email-entry");
  expect(screen.getByText("Name").parentElement?.parentElement?.hasAttribute("data-part")).toBe(
    false,
  );
});
