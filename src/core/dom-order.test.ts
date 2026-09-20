import { describe, expect, it } from "vitest";
import { sortByDocumentOrder } from "./dom-order.js";

describe("sortByDocumentOrder", () => {
  it("orders items by DOM position", () => {
    const parent = document.createElement("div");
    const first = document.createElement("button");
    const second = document.createElement("button");
    const third = document.createElement("button");
    parent.append(first, third, second);
    document.body.append(parent);

    const items = [
      { id: "b", element: second },
      { id: "a", element: first },
      { id: "c", element: third },
    ];

    expect(sortByDocumentOrder(items, (item) => item.element).map((item) => item.id)).toEqual([
      "a",
      "c",
      "b",
    ]);

    parent.remove();
  });

  it("treats missing elements as equal", () => {
    const first = document.createElement("button");
    const items = [
      { id: "a", element: first },
      { id: "b", element: null },
    ];
    expect(sortByDocumentOrder(items, (item) => item.element).map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
  });
});
