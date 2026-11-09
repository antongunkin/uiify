import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowSelect,
  TableSelectAll,
} from "./client/Table.js";
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
        <Table selectionMode="multiple">
          <TableHeader>
            <tr>
              <TableHead id="select">
                <TableSelectAll />
              </TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow id="row">
              <TableCell>
                <TableRowSelect rowId="row" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets table selection slots replace native defaults and veto selection", () => {
  render(
    <Table selectionMode="multiple">
      <TableHeader>
        <tr>
          <TableHead id="select">
            <TableSelectAll
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
          </TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        <TableRow id="row">
          <TableCell>
            <TableRowSelect
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
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
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
