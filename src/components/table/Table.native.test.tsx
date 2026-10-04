import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./index.js";

describe("native Table", () => {
  it("renders headers, footer, row headers and explicit logical sticky seams", () => {
    const { container } = render(
      <Table.Root
        aria-label="Invoices"
        layout="fixed"
        size="sm"
        variant="outline"
        data-uiify-table="override"
      >
        <Table.Header sticky>
          <Table.Row id="head">
            <Table.ColumnHeader id="name" sticky="start">
              Name
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row id="a" sticky>
            <Table.RowHeader sticky="start">Alice</Table.RowHeader>
          </Table.Row>
        </Table.Body>
        <Table.Footer sticky>
          <Table.Row id="total">
            <Table.Cell>Total</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );
    expect(screen.getByRole("table").getAttribute("data-uiify-table")).toBe("");
    expect(screen.getByRole("table").getAttribute("data-layout")).toBe("fixed");
    expect(screen.getByRole("rowheader").getAttribute("scope")).toBe("row");
    expect(screen.getByRole("rowheader").getAttribute("data-sticky")).toBe("start");
    expect(container.querySelector("tfoot")?.getAttribute("data-sticky")).toBe("");
    expect(container.querySelector("thead")?.getAttribute("data-part")).toBe("header");
  });
});

it("owns logical alignment for each native cell part", () => {
  render(
    <Table.Root>
      <Table.Header>
        <Table.Row id="head">
          <Table.ColumnHeader id="amount" align="end">
            Amount
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row id="item">
          <Table.RowHeader align="center">Item</Table.RowHeader>
          <Table.Cell align="end" data-align="start">
            42
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
  expect(screen.getByRole("columnheader").getAttribute("data-align")).toBe("end");
  expect(screen.getByRole("rowheader").getAttribute("data-align")).toBe("center");
  expect(screen.getByRole("cell").getAttribute("data-align")).toBe("end");
});
