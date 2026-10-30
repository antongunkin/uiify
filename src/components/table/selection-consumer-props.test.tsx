import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Table } from "./client/Table.js";
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
it("preserves default table DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <Table.Root selectionMode="multiple">
          <Table.Header>
            <tr>
              <Table.ColumnHeader id="select">
                <Table.SelectAll />
              </Table.ColumnHeader>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row id="row">
              <Table.Cell>
                <Table.RowSelect rowId="row" />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets table selection slots replace native defaults and veto selection", () => {
  render(
    <Table.Root selectionMode="multiple">
      <Table.Header>
        <tr>
          <Table.ColumnHeader id="select">
            <Table.SelectAll
              slotProps={{
                input: {
                  id: "select-native",
                  "aria-labelledby": undefined,
                  "aria-label": "All native",
                  "data-part": "all-input",
                  onChange: (event) => event.preventDefault(),
                },
                label: { id: "all-label", "data-uiify-checkbox": "custom" },
              }}
            />
          </Table.ColumnHeader>
        </tr>
      </Table.Header>
      <Table.Body>
        <Table.Row id="row">
          <Table.Cell>
            <Table.RowSelect
              rowId="row"
              slotProps={{
                input: {
                  "aria-labelledby": undefined,
                  "aria-label": "Row native",
                  "data-state": "custom",
                  disabled: true,
                  onChange: (event) => event.preventDefault(),
                },
              }}
            />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
  const all = screen.getByRole("checkbox", { name: "All native" });
  const row = screen.getByRole("checkbox", { name: "Row native" });
  expect(all.id).toBe("select-native");
  expect(all.getAttribute("data-part")).toBe("all-input");
  expect(all.parentElement?.id).toBe("all-label");
  expect(all.parentElement?.getAttribute("data-uiify-checkbox")).toBe("custom");
  expect(row.getAttribute("data-state")).toBe("custom");
  expect(row.hasAttribute("disabled")).toBe(true);
  fireEvent.click(all);
  expect(all.getAttribute("data-state")).toBe("unchecked");
  expect(row.closest("tr")?.getAttribute("aria-selected")).toBe("false");
});
