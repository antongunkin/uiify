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
      <Pagination.Root count={5} defaultPage={1} onPageChange={onChange}>
        <Pagination.List />
      </Pagination.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("formats visible page numbers with locale without changing callback values", () => {
    const onChange = vi.fn();
    render(
      <Pagination.Root count={5} defaultPage={3} locale="ar-EG" onPageChange={onChange}>
        <Pagination.List />
      </Pagination.Root>,
    );

    expect(screen.getByRole("button", { name: "Page ٤" }).textContent).toBe("٤");
    fireEvent.click(screen.getByRole("button", { name: "Page ٤" }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("formats the localized page accessible name from a serializable template", () => {
    render(
      <Pagination.Root count={5} defaultPage={3} locale="ar-EG" labels={{ page: "الصفحة {page}" }}>
        <Pagination.List />
      </Pagination.Root>,
    );

    expect(screen.getByRole("button", { name: "الصفحة ٤" }).textContent).toBe("٤");
  });

  it("replaces every page placeholder in an accessible name template", () => {
    render(
      <Pagination.Root count={5} defaultPage={3} labels={{ page: "Page {page} of {page}" }}>
        <Pagination.List />
      </Pagination.Root>,
    );

    expect(screen.getByRole("button", { name: "Page 3 of 3" })).toBeTruthy();
  });

  it("uses label overrides for controls", () => {
    render(
      <Pagination.Root
        count={5}
        defaultPage={2}
        labels={{ next: "الصفحة التالية", nextText: "التالي" }}
      >
        <Pagination.List />
      </Pagination.Root>,
    );

    expect(screen.getByRole("button", { name: "الصفحة التالية" }).textContent).toBe("التالي");
  });

  it("lets a consumer onClick veto the page change", () => {
    const onChange = vi.fn();
    render(
      <Pagination.Root count={5} defaultPage={1} onPageChange={onChange}>
        <Pagination.Link page={2} onClick={(event) => event.preventDefault()} />
      </Pagination.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
