import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination.js";

describe("Pagination client", () => {
  it("disables previous on first page", () => {
    render(
      <Pagination.Root count={5} defaultPage={1}>
        <Pagination.List />
      </Pagination.Root>,
    );
    expect(screen.getByRole("button", { name: "Previous page" }).hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("disables next on last page", () => {
    render(
      <Pagination.Root count={5} defaultPage={5}>
        <Pagination.List />
      </Pagination.Root>,
    );
    expect(screen.getByRole("button", { name: "Next page" }).hasAttribute("disabled")).toBe(true);
  });

  it("changes page on click", () => {
    const onChange = vi.fn();
    render(
      <Pagination.Root count={5} defaultPage={1} onChange={onChange}>
        <Pagination.List />
      </Pagination.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("lets a consumer onClick veto the page change", () => {
    const onChange = vi.fn();
    render(
      <Pagination.Root count={5} defaultPage={1} onChange={onChange}>
        <Pagination.Link page={2} onClick={(event) => event.preventDefault()} />
      </Pagination.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
