import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./client/Table.js";

describe("Table", () => {
  it("renders semantic table structure", () => {
    render(
      <Table aria-label="Users">
        <TableCaption>User list</TableCaption>
        <TableHeader>
          <tr>
            <TableHead id="name">Name</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow id="1">
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("table", { name: "Users" })).toBeTruthy();
    expect(screen.getByText("User list")).toBeTruthy();
  });

  it("sets aria-sort from sortDescriptor prop", () => {
    render(
      <Table aria-label="Data" sortDescriptor={{ column: "name", direction: "ascending" }}>
        <TableHeader>
          <tr>
            <TableHead allowsSorting id="name" sortDirection="ascending">
              Name
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody />
      </Table>,
    );
    expect(screen.getByRole("columnheader", { name: "Name" }).getAttribute("aria-sort")).toBe(
      "ascending",
    );
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(
      <Table aria-label="Data">
        <TableBody>
          <TableRow id="1">
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(html).toContain("<table");
  });

  it("Root owns role=grid when interactive; consumer cannot override it", () => {
    render(
      <Table
        aria-label="Data"
        selectionMode="single"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The interactive table owns its grid role.
        role="table"
      >
        <TableBody />
      </Table>,
    );
    expect(screen.getByRole("grid", { name: "Data" })).toBeTruthy();
  });

  it("Root omits role when not interactive; consumer cannot force role=grid", () => {
    render(
      <Table aria-label="Data" role="grid">
        <TableBody />
      </Table>,
    );
    expect(screen.getByRole("table", { name: "Data" })).toBeTruthy();
  });

  it("TableShell row owns data-disabled, data-selected, data-state, and id; consumer cannot override them", () => {
    render(
      <Table aria-label="Data">
        <TableBody>
          <TableRow
            id="r1"
            disabled
            data-disabled="bogus"
            data-selected="bogus"
            data-state="bogus"
            data-testid="row"
          >
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const row = screen.getByTestId("row");
    expect(row.getAttribute("data-disabled")).toBe("");
    expect(row.getAttribute("id")).toBe("r1");
  });

  it("ColumnHeader owns aria-sort and scope; consumer cannot override them", () => {
    render(
      <Table aria-label="Data" defaultSortDescriptor={{ column: "name", direction: "ascending" }}>
        <TableHeader>
          <tr>
            <TableHead allowsSorting id="name" aria-sort="none" scope="row">
              Name
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody />
      </Table>,
    );
    const header = screen.getByRole("columnheader", { name: "Name" });
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(header.getAttribute("scope")).toBe("col");
  });
});
