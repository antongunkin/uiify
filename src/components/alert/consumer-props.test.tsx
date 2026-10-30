import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Alert, AlertTitle, AlertDescription } from "./Alert.js";
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
it("preserves default alert DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <Alert variant="warning">
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>Details</AlertDescription>
        </Alert>,
      ),
    ),
  ).toMatchSnapshot();
});
it("allows native overrides and explicit undefined on alert parts and symbol", () => {
  render(
    <Alert
      data-uiify-alert="custom"
      data-variant={undefined}
      data-testid="root"
      slotProps={{
        symbol: { "data-part": "glyph", "aria-hidden": undefined, "data-testid": "symbol" },
      }}
    >
      <AlertTitle data-part="heading" data-uiify-alert-title={undefined}>
        Notice
      </AlertTitle>
      <AlertDescription data-part={undefined}>Details</AlertDescription>
    </Alert>,
  );
  expect(screen.getByTestId("root").getAttribute("data-uiify-alert")).toBe("custom");
  expect(screen.getByTestId("root").hasAttribute("data-variant")).toBe(false);
  expect(screen.getByTestId("symbol").getAttribute("data-part")).toBe("glyph");
  expect(screen.getByTestId("symbol").hasAttribute("aria-hidden")).toBe(false);
  expect(screen.getByText("Notice").getAttribute("data-part")).toBe("heading");
  expect(screen.getByText("Notice").hasAttribute("data-uiify-alert-title")).toBe(false);
  expect(screen.getByText("Details").hasAttribute("data-part")).toBe(false);
});
