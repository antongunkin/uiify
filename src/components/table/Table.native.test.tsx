import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from "./index.js";

describe("native Table", () => {
  it("renders headers, footer, row headers and explicit logical sticky seams", () => {
    const { container } = render(
      <Table aria-label="Invoices" layout="fixed" size="sm" variant="outline">
        <TableHeader sticky>
          <TableRow id="head">
            <TableHead id="name" sticky="start">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow id="a" sticky>
            <TableRowHeader sticky="start">Alice</TableRowHeader>
          </TableRow>
        </TableBody>
        <TableFooter sticky>
          <TableRow id="total">
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    expect(screen.getByRole("table").classList.contains("uiify-table")).toBe(true);
    expect(screen.getByRole("table").getAttribute("data-layout")).toBe("fixed");
    expect(screen.getByRole("rowheader").getAttribute("scope")).toBe("row");
    expect(screen.getByRole("rowheader").getAttribute("data-sticky")).toBe("start");
    expect(container.querySelector("tfoot")?.getAttribute("data-sticky")).toBe("");
    expect(container.querySelector("thead")?.classList.contains("uiify-table-header")).toBe(true);
  });
});

it("owns logical alignment for each native cell part", () => {
  render(
    <Table>
      <TableHeader>
        <TableRow id="head">
          <TableHead id="amount" align="end">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="item">
          <TableRowHeader align="center">Item</TableRowHeader>
          <TableCell align="end" data-align="start">
            42
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(screen.getByRole("columnheader").getAttribute("data-align")).toBe("end");
  expect(screen.getByRole("rowheader").getAttribute("data-align")).toBe("center");
  expect(screen.getByRole("cell").getAttribute("data-align")).toBe("end");
});
