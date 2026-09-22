import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DropdownMenuBar } from "./DropdownMenuBar.js";

function Item({ label, disabled }: { readonly label: string; readonly disabled?: boolean }) {
  return (
    <div data-uiify-menu="">
      <button data-part="trigger" disabled={disabled} type="button">
        {label}
      </button>
    </div>
  );
}
Item.displayName = "Item";

describe("DropdownMenuBar", () => {
  it("exposes role=menubar and gives only one item a tab stop", () => {
    render(
      <DropdownMenuBar>
        <Item label="File" />
        <Item label="Edit" />
      </DropdownMenuBar>,
    );
    expect(screen.getByRole("menubar")).toBeTruthy();
    const file = screen.getByRole("button", { name: "File" });
    const edit = screen.getByRole("button", { name: "Edit" });
    expect(file.tabIndex).toBe(0);
    expect(edit.tabIndex).toBe(-1);
  });

  it("moves the tab stop with ArrowRight and ArrowLeft and loops", () => {
    render(
      <DropdownMenuBar>
        <Item label="File" />
        <Item label="Edit" />
      </DropdownMenuBar>,
    );
    const file = screen.getByRole("button", { name: "File" });
    const edit = screen.getByRole("button", { name: "Edit" });
    file.focus();
    fireEvent.keyDown(file, { key: "ArrowRight" });
    expect(document.activeElement).toBe(edit);
    fireEvent.keyDown(edit, { key: "ArrowRight" });
    expect(document.activeElement).toBe(file);
    fireEvent.keyDown(file, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(edit);
  });

  it("stops at the ends when loop is false", () => {
    render(
      <DropdownMenuBar loop={false}>
        <Item label="File" />
        <Item label="Edit" />
      </DropdownMenuBar>,
    );
    const file = screen.getByRole("button", { name: "File" });
    const edit = screen.getByRole("button", { name: "Edit" });
    file.focus();
    fireEvent.keyDown(file, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(file);
    edit.focus();
    fireEvent.keyDown(edit, { key: "ArrowRight" });
    expect(document.activeElement).toBe(edit);
  });

  it("skips a disabled item", () => {
    render(
      <DropdownMenuBar>
        <Item label="File" />
        <Item disabled label="Edit" />
        <Item label="View" />
      </DropdownMenuBar>,
    );
    const file = screen.getByRole("button", { name: "File" });
    const view = screen.getByRole("button", { name: "View" });
    file.focus();
    fireEvent.keyDown(file, { key: "ArrowRight" });
    expect(document.activeElement).toBe(view);
  });

  it("reverses ArrowLeft and ArrowRight in rtl", () => {
    render(
      <DropdownMenuBar dir="rtl">
        <Item label="File" />
        <Item label="Edit" />
      </DropdownMenuBar>,
    );
    const file = screen.getByRole("button", { name: "File" });
    const edit = screen.getByRole("button", { name: "Edit" });
    file.focus();
    fireEvent.keyDown(file, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(edit);
  });

  it("moves to the first and last item with Home and End", () => {
    render(
      <DropdownMenuBar>
        <Item label="File" />
        <Item label="Edit" />
        <Item label="View" />
      </DropdownMenuBar>,
    );
    const file = screen.getByRole("button", { name: "File" });
    const view = screen.getByRole("button", { name: "View" });
    file.focus();
    fireEvent.keyDown(file, { key: "End" });
    expect(document.activeElement).toBe(view);
    fireEvent.keyDown(view, { key: "Home" });
    expect(document.activeElement).toBe(file);
  });

  it("leaves ArrowDown for the item's own handler", () => {
    render(
      <DropdownMenuBar>
        <Item label="File" />
        <Item label="Edit" />
      </DropdownMenuBar>,
    );
    const file = screen.getByRole("button", { name: "File" });
    file.focus();
    // fireEvent returns false only when some handler called preventDefault().
    expect(fireEvent.keyDown(file, { key: "ArrowDown" })).toBe(true);
    expect(document.activeElement).toBe(file);
  });
});
