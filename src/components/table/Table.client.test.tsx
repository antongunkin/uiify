import { createRef, type KeyboardEvent, type MouseEvent } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createTableStore } from "./table-store.js";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowSelect,
  TableSelectAll,
} from "./client/Table.js";

describe("createTableStore", () => {
  it("toggles single selection", () => {
    const store = createTableStore({ selectionMode: "single" });
    store.setRowIds(["a", "b"]);
    store.toggleRow("a");
    expect(store.isRowSelected("a")).toBe(true);
    store.toggleRow("b");
    expect(store.isRowSelected("a")).toBe(false);
    expect(store.isRowSelected("b")).toBe(true);
  });

  it("supports multiple selection with meta key toggle", () => {
    const store = createTableStore({ selectionMode: "multiple" });
    store.setRowIds(["a", "b", "c"]);
    store.toggleRow("a");
    store.toggleRow("b", { metaKey: true });
    expect(store.getSelectedKeys().size).toBe(2);
  });

  it("selects range with shift key", () => {
    const store = createTableStore({ selectionMode: "multiple" });
    store.setRowIds(["a", "b", "c", "d"]);
    store.toggleRow("a");
    store.toggleRow("c", { shiftKey: true });
    expect(store.getSelectedKeys()).toEqual(new Set(["a", "b", "c"]));
  });

  it("toggles sort descriptor asc → desc → none", () => {
    const onSortChange = vi.fn();
    const store = createTableStore({ onSortChange });
    store.toggleSort("name");
    expect(store.getSortSnapshot()).toEqual({ column: "name", direction: "ascending" });
    store.toggleSort("name");
    expect(store.getSortSnapshot()).toEqual({ column: "name", direction: "descending" });
    store.toggleSort("name");
    expect(store.getSortSnapshot()).toBeNull();
  });

  it("reports tri-state selection", () => {
    const store = createTableStore({ selectionMode: "multiple" });
    store.setRowIds(["a", "b"]);
    expect(store.getSelectionState()).toBe("none");
    store.toggleRow("a");
    expect(store.getSelectionState()).toBe("some");
    store.toggleSelectAll();
    expect(store.getSelectionState()).toBe("all");
  });

  it("tracks registered rows in mount order, idempotently, and on unregister", () => {
    const store = createTableStore({ selectionMode: "multiple" });
    const unregisterA = store.registerRow("a");
    store.registerRow("b");
    store.registerRow("a");
    expect(store.getRowIds()).toEqual(["a", "b"]);

    store.toggleRow("a");
    store.toggleRow("b", { shiftKey: true });
    expect(store.getSelectedKeys()).toEqual(new Set(["a", "b"]));

    unregisterA();
    expect(store.getRowIds()).toEqual(["b"]);
    unregisterA();
    expect(store.getRowIds()).toEqual(["b"]);
  });

  it("excludes disabled rows from select-all, tri-state, and shift range", () => {
    const store = createTableStore({ selectionMode: "multiple" });
    store.setRowIds(["a", "b", "c"]);
    store.setRowDisabled("b", true);

    store.toggleSelectAll();
    expect(store.getSelectedKeys()).toEqual(new Set(["a", "c"]));
    expect(store.getSelectionState()).toBe("all");

    store.toggleSelectAll();
    expect(store.getSelectedKeys()).toEqual(new Set());

    store.toggleRow("a");
    store.toggleRow("c", { shiftKey: true });
    expect(store.getSelectedKeys()).toEqual(new Set(["a", "c"]));
  });
});

describe("Table client", () => {
  it("forwards slot props to its generated sort button and selection controls", () => {
    const onSortChange = vi.fn();
    const sortButtonRef = createRef<HTMLButtonElement>();
    const sortButtonProps = {
      className: "sort-button",
      "data-testid": "sort-button",
      onClick: (event: MouseEvent<HTMLButtonElement>) => event.preventDefault(),
      ref: sortButtonRef,
    };
    const selectAllProps = {
      slotProps: {
        input: { className: "select-all-input", "data-testid": "select-all-input" },
        label: { className: "select-all-label", "data-testid": "select-all-label" },
      },
    };
    const rowSelectProps = {
      rowId: "r1",
      slotProps: {
        input: { className: "row-select-input", "data-testid": "row-select-input" },
        label: { className: "row-select-label", "data-testid": "row-select-label" },
      },
    };

    render(
      <Table aria-label="Data" onSortChange={onSortChange} selectionMode="multiple">
        <TableHeader>
          <tr>
            <TableHead allowsSorting id="name" slotProps={{ sortButton: sortButtonProps }}>
              Name
            </TableHead>
            <TableHead id="selection">
              <TableSelectAll {...selectAllProps} />
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow id="r1">
            <TableCell>Alice</TableCell>
            <TableCell>
              <TableRowSelect {...rowSelectProps} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    for (const [testId, className] of [
      ["sort-button", "sort-button"],
      ["select-all-input", "select-all-input"],
      ["select-all-label", "select-all-label"],
      ["row-select-input", "row-select-input"],
      ["row-select-label", "row-select-label"],
    ] as const) {
      expect(screen.getByTestId(testId).className).toContain(className);
    }
    expect(sortButtonRef.current).toBe(screen.getByTestId("sort-button"));

    fireEvent.click(screen.getByTestId("sort-button"));
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it("selects row on click in multiple mode", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableBody>
          <TableRow id="r1">
            <TableCell>
              <TableRowSelect rowId="r1" />
              Row 1
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select row" }));
    expect(screen.getByRole("checkbox", { name: "Select row" }).getAttribute("data-state")).toBe(
      "checked",
    );
  });

  it("keeps the select-all header in sync with none, some and all", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableHeader>
          <tr>
            <TableHead id="select">
              <TableSelectAll />
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow id="r1">
            <TableCell>
              <TableRowSelect rowId="r1" />
              Row 1
            </TableCell>
          </TableRow>
          <TableRow id="r2">
            <TableCell>
              <TableRowSelect rowId="r2" />
              Row 2
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const selectAll = () =>
      screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    expect(selectAll().indeterminate).toBe(false);
    expect(selectAll().getAttribute("data-state")).toBe("unchecked");

    fireEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
    expect(selectAll().indeterminate).toBe(true);
    expect(selectAll().getAttribute("aria-checked")).toBe("mixed");
    expect(selectAll().getAttribute("data-state")).toBe("indeterminate");

    fireEvent.click(selectAll());
    expect(selectAll().indeterminate).toBe(false);
    expect(selectAll().hasAttribute("aria-checked")).toBe(false);
    expect(selectAll().getAttribute("data-state")).toBe("checked");

    fireEvent.click(selectAll());
    expect(selectAll().indeterminate).toBe(false);
    expect(selectAll().getAttribute("data-state")).toBe("unchecked");
  });

  it("selects all mounted rows through the component API", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableHeader>
          <tr>
            <TableHead id="select">
              <TableSelectAll />
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow id="r1">
            <TableCell>
              <TableRowSelect rowId="r1" />
              Row 1
            </TableCell>
          </TableRow>
          <TableRow id="r2">
            <TableCell>
              <TableRowSelect rowId="r2" />
              Row 2
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));

    for (const checkbox of screen.getAllByRole("checkbox", { name: "Select row" })) {
      expect(checkbox.getAttribute("data-state")).toBe("checked");
    }
  });

  it("skips disabled rows when selecting all through the component API", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableHeader>
          <tr>
            <TableHead id="select">
              <TableSelectAll />
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow id="r1">
            <TableCell>
              <TableRowSelect rowId="r1" />
              Row 1
            </TableCell>
          </TableRow>
          <TableRow disabled id="r2">
            <TableCell>
              <TableRowSelect rowId="r2" />
              Row 2
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));

    const [r1, r2] = screen.getAllByRole("checkbox", { name: "Select row" });
    expect(r1!.getAttribute("data-state")).toBe("checked");
    expect(r2!.getAttribute("data-state")).not.toBe("checked");
    expect(
      screen.getByRole("checkbox", { name: "Select all rows" }).getAttribute("data-state"),
    ).toBe("checked");
  });

  it("selects a row range with shift-click through the component API", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableBody>
          <TableRow id="r1">
            <TableCell>
              <TableRowSelect rowId="r1" />
              Row 1
            </TableCell>
          </TableRow>
          <TableRow id="r2">
            <TableCell>
              <TableRowSelect rowId="r2" />
              Row 2
            </TableCell>
          </TableRow>
          <TableRow id="r3">
            <TableCell>
              <TableRowSelect rowId="r3" />
              Row 3
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    fireEvent.click(screen.getByText("Row 1").closest("tr")!);
    fireEvent.click(screen.getByText("Row 3").closest("tr")!, { shiftKey: true });

    for (const checkbox of screen.getAllByRole("checkbox", { name: "Select row" })) {
      expect(checkbox.getAttribute("data-state")).toBe("checked");
    }
  });

  it("does not echo controlled selection prop sync through onSelectionChange", () => {
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <Table
        aria-label="Data"
        onSelectionChange={onSelectionChange}
        selectedKeys={new Set(["r1"])}
        selectionMode="multiple"
      >
        <TableBody>
          <TableRow id="r1">
            <TableCell>Row 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    rerender(
      <Table
        aria-label="Data"
        onSelectionChange={onSelectionChange}
        selectedKeys={new Set(["r2"])}
        selectionMode="multiple"
      >
        <TableBody>
          <TableRow id="r2">
            <TableCell>Row 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("sets aria-sort on sortable column header", () => {
    render(
      <Table aria-label="Data" defaultSortDescriptor={{ column: "name", direction: "ascending" }}>
        <TableHeader>
          <tr>
            <TableHead allowsSorting id="name">
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

  it("fires onSortChange when column header clicked", () => {
    const onSortChange = vi.fn();
    render(
      <Table aria-label="Data" onSortChange={onSortChange}>
        <TableHeader>
          <tr>
            <TableHead allowsSorting id="name">
              Name
            </TableHead>
          </tr>
        </TableHeader>
        <TableBody />
      </Table>,
    );
    fireEvent.click(screen.getByRole("columnheader", { name: "Name" }));
    expect(onSortChange).toHaveBeenCalledWith({ column: "name", direction: "ascending" });
  });

  it("owns aria-selected on interactive rows; consumer cannot override it", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableBody>
          <TableRow id="r1" aria-selected="true" data-testid="row">
            <TableCell>
              <TableRowSelect rowId="r1" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("row").getAttribute("aria-selected")).toBe("false");
  });

  it("owns row selection data-attributes even when the consumer attempts to override them", () => {
    render(
      <Table aria-label="Data" selectionMode="multiple">
        <TableBody>
          <TableRow id="r1" data-selected="bogus" data-state="bogus" data-testid="row">
            <TableCell>
              <TableRowSelect rowId="r1" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select row" }));
    const row = screen.getByTestId("row");
    expect(row.getAttribute("data-selected")).toBe("");
    expect(row.getAttribute("data-state")).toBe("selected");
  });

  it("consumer onClick can veto row toggle on interactive rows", () => {
    const onSelectionChange = vi.fn();
    render(
      <Table aria-label="Data" selectionMode="single" onSelectionChange={onSelectionChange}>
        <TableBody>
          <TableRow id="r1" onClick={(event) => event.preventDefault()} data-testid="row">
            <TableCell>Row 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    fireEvent.click(screen.getByTestId("row"));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  describe("TableRow keyboard composition (T5 three-way nested merge)", () => {
    it("Space toggles the row (roving-focus does not preventDefault for Space)", () => {
      render(
        <Table aria-label="Data" selectionMode="single">
          <TableBody>
            <TableRow id="r1" data-testid="row">
              <TableCell>Row 1</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row = screen.getByTestId("row");
      fireEvent.keyDown(row, { key: " " });
      expect(row.getAttribute("aria-selected")).toBe("true");
    });

    it("Arrow key does not toggle the row; it moves roving focus instead", () => {
      render(
        <Table aria-label="Data" selectionMode="single">
          <TableBody>
            <TableRow id="r1" data-testid="row1">
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow id="r2" data-testid="row2">
              <TableCell>Row 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row1 = screen.getByTestId("row1");
      const row2 = screen.getByTestId("row2");
      expect(row1.tabIndex).toBe(0);
      expect(row2.tabIndex).toBe(-1);

      fireEvent.keyDown(row1, { key: "ArrowDown" });

      expect(row1.getAttribute("aria-selected")).toBe("false");
      expect(row2.getAttribute("aria-selected")).toBe("false");
      expect(row2.tabIndex).toBe(0);
      expect(row1.tabIndex).toBe(-1);
    });

    it("consumer onKeyDown vetoes only the internal Space-toggle (the innermost layer)", () => {
      const consumerKeyDown = vi.fn((event: KeyboardEvent) => event.preventDefault());
      render(
        <Table aria-label="Data" selectionMode="single">
          <TableBody>
            <TableRow id="r1" onKeyDown={consumerKeyDown} data-testid="row">
              <TableCell>Row 1</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row = screen.getByTestId("row");
      fireEvent.keyDown(row, { key: " " });
      expect(consumerKeyDown).toHaveBeenCalledTimes(1);
      expect(row.getAttribute("aria-selected")).toBe("false");
    });

    it("without a veto, the consumer handler and the internal Space-toggle both run in order", () => {
      const calls: string[] = [];
      const consumerKeyDown = vi.fn(() => calls.push("consumer"));
      render(
        <Table aria-label="Data" selectionMode="single">
          <TableBody>
            <TableRow id="r1" onKeyDown={consumerKeyDown} data-testid="row">
              <TableCell>Row 1</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row = screen.getByTestId("row");
      fireEvent.keyDown(row, { key: " " });
      expect(consumerKeyDown).toHaveBeenCalledTimes(1);
      expect(row.getAttribute("aria-selected")).toBe("true");
    });

    it("roving-focus's arrow navigation runs before the consumer handler and is unaffected by it (outermost layer, chained first)", () => {
      const consumerKeyDown = vi.fn((event: KeyboardEvent) => event.preventDefault());
      render(
        <Table aria-label="Data" selectionMode="single">
          <TableBody>
            <TableRow id="r1" onKeyDown={consumerKeyDown} data-testid="row1">
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow id="r2" data-testid="row2">
              <TableCell>Row 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row1 = screen.getByTestId("row1");
      fireEvent.keyDown(row1, { key: "ArrowDown" });
      // roving-focus's own onKeyDown calls preventDefault() for Arrow keys before the
      // consumer's handler ever runs, so the chained inner layers (real consumer +
      // this row's Space-toggle) never execute for Arrow keys at all.
      expect(consumerKeyDown).not.toHaveBeenCalled();
      expect(screen.getByTestId("row2").tabIndex).toBe(0);
    });
  });

  it("limits row selection rerenders in a 1,000-row table", { timeout: 30_000 }, () => {
    const renders = Array.from({ length: 1000 }, () => 0);
    function Row({ id }: { readonly id: string }) {
      renders[Number(id)] = (renders[Number(id)] ?? 0) + 1;
      return (
        <TableRow id={id}>
          <TableCell>
            <TableRowSelect rowId={id} />
          </TableCell>
        </TableRow>
      );
    }
    Row.displayName = "Row";

    const { container } = render(
      <Table aria-label="Large" selectionMode="multiple">
        <TableBody>
          {renders.map((_, index) => (
            <Row id={String(index)} key={index} />
          ))}
        </TableBody>
      </Table>,
    );
    renders.fill(0);
    // Query inside the first row: a page-wide role query computes roles and names for all
    // 1,000 rows, ~10 s under a loaded run, which is what timed this test out.
    const firstRow = container.querySelector<HTMLElement>("tbody tr")!;
    fireEvent.click(within(firstRow).getByRole("checkbox", { name: "Select row" }));
    expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(3);
  });
});

it("keeps header and footer rows outside body selection and roving focus", () => {
  const onSelectionChange = vi.fn();
  render(
    <Table selectionMode="multiple" onSelectionChange={onSelectionChange}>
      <TableHeader>
        <TableRow id="header">
          <TableHead id="select">
            <TableSelectAll />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow id="member">
          <TableCell>Member</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow id="footer">
          <TableCell>Total</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );
  fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
  expect(onSelectionChange).toHaveBeenCalledWith(new Set(["member"]));
});
