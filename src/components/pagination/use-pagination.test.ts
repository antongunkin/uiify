import { describe, expect, it } from "vitest";
import { buildPaginationItems } from "./pagination-engine.js";

describe("buildPaginationItems", () => {
  it("returns all pages when count is small", () => {
    const items = buildPaginationItems(5, 1, 1, 1, false, false);
    const pages = items.filter((item) => item.type === "page");
    expect(pages.map((item) => item.page)).toEqual([1, 2, 3, 4, 5]);
  });

  it("disables previous on first page", () => {
    const items = buildPaginationItems(10, 1, 1, 1, false, false);
    const prev = items.find((item) => item.type === "previous");
    expect(prev?.disabled).toBe(true);
  });

  it("disables next on last page", () => {
    const items = buildPaginationItems(10, 10, 1, 1, false, false);
    const next = items.find((item) => item.type === "next");
    expect(next?.disabled).toBe(true);
  });

  it("inserts ellipsis for large page counts in the middle", () => {
    const items = buildPaginationItems(20, 10, 1, 1, false, false);
    expect(items.some((item) => item.type === "ellipsis")).toBe(true);
  });

  it("marks the current page as selected", () => {
    const items = buildPaginationItems(5, 3, 1, 1, false, false);
    const current = items.find((item) => item.type === "page" && item.page === 3);
    expect(current?.selected).toBe(true);
  });

  it("handles count=0 with disabled ellipsis", () => {
    const items = buildPaginationItems(0, 1, 1, 1, false, false);
    expect(items.some((item) => item.type === "ellipsis" && item.disabled)).toBe(true);
  });

  it("handles count=1", () => {
    const items = buildPaginationItems(1, 1, 1, 1, false, false);
    const pages = items.filter((item) => item.type === "page");
    expect(pages).toHaveLength(1);
    expect(pages[0]?.selected).toBe(true);
  });

  it("includes first/last when showFirstLast is true", () => {
    const items = buildPaginationItems(10, 5, 1, 1, false, true);
    expect(items.some((item) => item.type === "first")).toBe(true);
    expect(items.some((item) => item.type === "last")).toBe(true);
  });

  it("respects boundaryCount at both ends", () => {
    const items = buildPaginationItems(20, 10, 1, 2, false, false);
    const pages = items.filter((item) => item.type === "page").map((item) => item.page);
    expect(pages).toContain(1);
    expect(pages).toContain(2);
    expect(pages).toContain(19);
    expect(pages).toContain(20);
  });
});
