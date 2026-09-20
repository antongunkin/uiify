import { describe, expect, it, vi } from "vitest";
import { createCollectionStore } from "./collection-store.js";

describe("collection store", () => {
  it("caches snapshots and updates data without re-registering", () => {
    const store = createCollectionStore<{ label: string }>();
    const listener = vi.fn();
    store.subscribe(listener);
    const unregister = store.register({
      data: { label: "One" },
      element: null,
      id: "one",
    });
    const first = store.getSnapshot();
    expect(store.getSnapshot()).toBe(first);
    store.update("one", { label: "Updated" });
    expect(store.getSnapshot()[0]?.data.label).toBe("Updated");
    unregister();
    expect(store.getSnapshot()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("sorts connected elements by DOM order", () => {
    const store = createCollectionStore<null>();
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    store.register({ data: null, element: second, id: "second" });
    store.register({ data: null, element: first, id: "first" });
    expect(store.getSnapshot().map((item) => item.id)).toEqual(["first", "second"]);
  });
});
