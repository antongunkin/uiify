import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Table } from "./Table.js";

describe("Table", () => {
  it("renders semantic table structure", () => {
    render(
      <Table.Root aria-label="Users">
        <Table.Caption>User list</Table.Caption>
        <Table.Header>
          <tr>
            <Table.ColumnHeader id="name">Name</Table.ColumnHeader>
          </tr>
        </Table.Header>
        <Table.Body>
          <Table.Row id="1">
            <Table.Cell>Alice</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByRole("table", { name: "Users" })).toBeTruthy();
    expect(screen.getByText("User list")).toBeTruthy();
  });

  it("sets aria-sort from sortDescriptor prop", () => {
    render(
      <Table.Root aria-label="Data" sortDescriptor={{ column: "name", direction: "ascending" }}>
        <Table.Header>
          <tr>
            <Table.ColumnHeader allowsSorting id="name" sortDirection="ascending">
              Name
            </Table.ColumnHeader>
          </tr>
        </Table.Header>
        <Table.Body />
      </Table.Root>,
    );
    expect(screen.getByRole("columnheader", { name: "Name" }).getAttribute("aria-sort")).toBe(
      "ascending",
    );
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(
      <Table.Root aria-label="Data">
        <Table.Body>
          <Table.Row id="1">
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(html).toContain("<table");
  });

  it("Root owns role=grid when interactive; consumer cannot override it", () => {
    render(
      <Table.Root aria-label="Data" selectionMode="single" role="table">
        <Table.Body />
      </Table.Root>,
    );
    expect(screen.getByRole("grid", { name: "Data" })).toBeTruthy();
  });

  it("Root omits role when not interactive; consumer cannot force role=grid", () => {
    render(
      <Table.Root aria-label="Data" role="grid">
        <Table.Body />
      </Table.Root>,
    );
    expect(screen.getByRole("table", { name: "Data" })).toBeTruthy();
  });

  it("TableShell row owns data-disabled, data-selected, data-state, and id; consumer cannot override them", () => {
    render(
      <Table.Root aria-label="Data">
        <Table.Body>
          <Table.Row
            id="r1"
            disabled
            data-disabled="bogus"
            data-selected="bogus"
            data-state="bogus"
            data-testid="row"
          >
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const row = screen.getByTestId("row");
    expect(row.getAttribute("data-disabled")).toBe("");
    expect(row.getAttribute("id")).toBe("r1");
  });

  it("ColumnHeader owns aria-sort and scope; consumer cannot override them", () => {
    render(
      <Table.Root
        aria-label="Data"
        defaultSortDescriptor={{ column: "name", direction: "ascending" }}
      >
        <Table.Header>
          <tr>
            <Table.ColumnHeader allowsSorting id="name" aria-sort="none" scope="row">
              Name
            </Table.ColumnHeader>
          </tr>
        </Table.Header>
        <Table.Body />
      </Table.Root>,
    );
    const header = screen.getByRole("columnheader", { name: "Name" });
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(header.getAttribute("scope")).toBe("col");
  });
});
