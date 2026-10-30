import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Collapsible } from "./Collapsible.js";
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
it("preserves default collapsible DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <>
          <Collapsible id="closed" label="Closed" content="Panel" />
          <Collapsible id="open" label="Open" content="Panel" disabled defaultOpen />
        </>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets native details and slots override disclosure defaults", () => {
  render(
    <Collapsible
      id="filters"
      label="Filters"
      content="Panel"
      disabled
      defaultOpen
      open={false}
      name="filters-group"
      data-uiify-collapsible={undefined}
      data-uiify-details="native"
      data-disabled={undefined}
      data-testid="root"
      slotProps={{
        trigger: { "aria-disabled": false, tabIndex: 0, "data-part": "summary" },
        panel: { "data-part": undefined },
      }}
    />,
  );
  const root = screen.getByTestId("root");
  expect(root.hasAttribute("open")).toBe(false);
  expect(root.getAttribute("name")).toBe("filters-group");
  expect(root.getAttribute("data-uiify-details")).toBe("native");
  expect(root.hasAttribute("data-uiify-collapsible")).toBe(false);
  expect(root.hasAttribute("data-disabled")).toBe(false);
  expect(screen.getByText("Filters").getAttribute("aria-disabled")).toBe("false");
  expect(screen.getByText("Filters").tabIndex).toBe(0);
  expect(screen.getByText("Filters").getAttribute("data-part")).toBe("summary");
  expect(screen.getByText("Panel").hasAttribute("data-part")).toBe(false);
});
