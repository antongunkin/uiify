import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Spinner } from "./Spinner.js";
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
it("preserves default spinner DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <>
          <Spinner showLabel />
          <Spinner value={70} delay={500} size="sm" align="center" />
        </>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets native props override spinner ARIA, state and generated label defaults", () => {
  render(
    <Spinner
      value={30}
      showLabel
      data-testid="root"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This tests the consumer role override.
      role="status"
      // oxlint-disable-next-line jsx-a11y/role-supports-aria-props -- This tests the consumer value override.
      aria-valuenow={12}
      // oxlint-disable-next-line jsx-a11y/role-supports-aria-props -- This tests removal of the generated minimum.
      aria-valuemin={undefined}
      aria-label={undefined}
      data-state="custom"
      data-uiify-spinner={undefined}
      slotProps={{ label: { "data-part": "caption", "data-testid": "label" } }}
    />,
  );
  const root = screen.getByTestId("root");
  expect(root.getAttribute("role")).toBe("status");
  expect(root.getAttribute("aria-valuenow")).toBe("12");
  expect(root.hasAttribute("aria-valuemin")).toBe(false);
  expect(root.hasAttribute("aria-label")).toBe(false);
  expect(root.getAttribute("data-state")).toBe("custom");
  expect(root.hasAttribute("data-uiify-spinner")).toBe(false);
  expect(screen.getByTestId("label").getAttribute("data-part")).toBe("caption");
  expect(screen.getByTestId("label").textContent).toBe("Loading");
});
