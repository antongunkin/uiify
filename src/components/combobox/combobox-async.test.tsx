import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./Combobox.js";

const items = [{ label: "Ada Lovelace", value: "ada" }];

describe("Combobox async status protocol", () => {
  it("marks stale results busy and selectable while suppressing Empty during loading", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root defaultOpen loading items={items} onValueChange={onValueChange}>
        <Combobox.Input aria-label="People" />
        <Combobox.Content>
          {(filteredItems) => (
            <>
              {filteredItems.map((item) => (
                <Combobox.Item item={item} key={item.value} />
              ))}
              <Combobox.Empty>No matches</Combobox.Empty>
            </>
          )}
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByRole("listbox").getAttribute("aria-busy")).toBe("true");
    expect(screen.queryByText("No matches")).toBeNull();
    fireEvent.click(screen.getByRole("option", { name: "Ada Lovelace" }));
    expect(onValueChange).toHaveBeenCalledWith("ada");
  });

  it("renders Empty when loading ends with no results", () => {
    render(
      <Combobox.Root defaultOpen loading={false} items={[]}>
        <Combobox.Input aria-label="People" />
        <Combobox.Content>
          {(filteredItems) => (
            <>
              {filteredItems.map((item) => (
                <Combobox.Item item={item} key={item.value} />
              ))}
              <Combobox.Empty>No matches</Combobox.Empty>
            </>
          )}
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByText("No matches")).toBeTruthy();
    expect(screen.getByRole("listbox").hasAttribute("aria-busy")).toBe(false);
  });

  it("provides a stable status part with overridable native live-region defaults", () => {
    const { rerender } = render(
      <Combobox.Root items={items}>
        <Combobox.Status data-testid="status">Loading people</Combobox.Status>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const status = screen.getByTestId("status");
    expect(status.getAttribute("role")).toBe("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("aria-atomic")).toBe("true");
    expect(status.classList.contains("uiify-combobox-status")).toBe(true);

    rerender(
      <Combobox.Root items={items}>
        <Combobox.Status
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This tests the consumer live-region role override.
          role="region"
          aria-live="assertive"
          aria-atomic={false}
        >
          Loading people
        </Combobox.Status>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    expect(screen.getByText("Loading people").getAttribute("role")).toBe("region");
    expect(screen.getByText("Loading people").getAttribute("aria-live")).toBe("assertive");
    expect(screen.getByText("Loading people").getAttribute("aria-atomic")).toBe("false");
  });
});
