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
      data-record="custom"
      data-variant={undefined}
      data-testid="root"
      slotProps={{
        symbol: { "data-record": "glyph", "aria-hidden": undefined, "data-testid": "symbol" },
      }}
    >
      <AlertTitle data-record="heading">Notice</AlertTitle>
      <AlertDescription aria-label="Details label">Details</AlertDescription>
    </Alert>,
  );
  expect(screen.getByTestId("root").getAttribute("data-record")).toBe("custom");
  expect(screen.getByTestId("root").hasAttribute("data-variant")).toBe(false);
  expect(screen.getByTestId("symbol").getAttribute("data-record")).toBe("glyph");
  expect(screen.getByTestId("symbol").hasAttribute("aria-hidden")).toBe(false);
  expect(screen.getByText("Notice").getAttribute("data-record")).toBe("heading");
  expect(screen.getByText("Details").getAttribute("aria-label")).toBe("Details label");
});
