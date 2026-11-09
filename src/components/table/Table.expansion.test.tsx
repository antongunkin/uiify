import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Table,
  TableBody,
  TableCell,
  TableExpandedRow,
  TableExpandTrigger,
  TableRow,
  TableRowSelect,
} from "./client.js";

describe("Table expansion", () => {
  it("renders a semantic sibling row and respects controlled expansion", () => {
    const onExpandedChange = vi.fn();
    function Example({ keys }: { keys: readonly string[] }) {
      return (
        <Table expandedKeys={keys} onExpandedChange={onExpandedChange} aria-label="Invoices">
          <TableBody>
            <TableRow id="invoice">
              <TableCell>
                <TableExpandTrigger rowId="invoice">Details</TableExpandTrigger>
              </TableCell>
            </TableRow>
            <TableExpandedRow rowId="invoice">
              <TableCell colSpan={1}>Invoice details</TableCell>
            </TableExpandedRow>
          </TableBody>
        </Table>
      );
    }
    Example.displayName = "Example";

    const { rerender, container } = render(<Example keys={[]} />);
    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(onExpandedChange).toHaveBeenCalledWith(new Set(["invoice"]));
    expect(screen.queryByRole("cell", { name: "Invoice details" })).toBeNull();
    rerender(<Example keys={["invoice"]} />);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("cell", { name: "Invoice details" })).toBeTruthy();
    expect(container.querySelector("tr tr")).toBeNull();
    expect(trigger.getAttribute("aria-controls")).toBe(
      screen.getByRole("cell", { name: "Invoice details" }).parentElement?.id,
    );
  });
});

it("leaves descendant button and checkbox keyboard events to their native controls", () => {
  const selection = vi.fn();
  render(
    <Table selectionMode="multiple" onSelectionChange={selection}>
      <TableBody>
        <TableRow id="keyboard-row">
          <TableCell>
            <TableExpandTrigger rowId="keyboard-row">Open details</TableExpandTrigger>
            <TableRowSelect rowId="keyboard-row" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const button = screen.getByRole("button", { name: "Open details" });
  expect(fireEvent.keyDown(button, { key: " " })).toBe(true);
  expect(fireEvent.keyDown(button, { key: "ArrowDown" })).toBe(true);
  expect(selection).not.toHaveBeenCalled();
  expect(fireEvent.keyDown(screen.getByRole("checkbox"), { key: " " })).toBe(true);
  expect(selection).not.toHaveBeenCalled();
});

it("forwards body render and row refs in selectable tables", () => {
  const ref = createRef<HTMLTableRowElement>();
  const renderBody = vi.fn((props) => <tbody {...props} data-testid="rendered-body" />);
  render(
    <Table selectionMode="multiple">
      <TableBody render={renderBody}>
        <TableRow id="ref-row" ref={ref}>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(renderBody).toHaveBeenCalled();
  expect(screen.getByTestId("rendered-body")).toBeTruthy();
  expect(ref.current?.tagName).toBe("TR");
});
