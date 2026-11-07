import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroupClient } from "./CheckboxGroupClient.js";

const items = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
] as const;

describe("CheckboxGroupClient", () => {
  it("reports unchecked and checked values in item order", () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroupClient
        defaultValue={["email"]}
        id="contact"
        items={items}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Email" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);

    fireEvent.click(screen.getByRole("checkbox", { name: "Text message" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["sms"]);
  });

  it("follows a controlled value", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <CheckboxGroupClient
        id="contact"
        items={items}
        onValueChange={onValueChange}
        value={["email"]}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Text message" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"]);

    rerender(
      <CheckboxGroupClient
        id="contact"
        items={items}
        onValueChange={onValueChange}
        value={["sms"]}
      />,
    );
    expect((screen.getByRole("checkbox", { name: "Email" }) as HTMLInputElement).checked).toBe(
      false,
    );
    expect(
      (screen.getByRole("checkbox", { name: "Text message" }) as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("renders a mixed select-all and leaves disabled values alone", () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroupClient
        defaultValue={["post", "email"]}
        id="contact"
        items={[...items, { value: "post", label: "Post", disabled: true }]}
        onValueChange={onValueChange}
        selectAll
      />,
    );

    const selectAll = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(selectAll.indeterminate).toBe(true);
    expect(selectAll.getAttribute("aria-checked")).toBe("mixed");
    expect(selectAll.getAttribute("data-state")).toBe("indeterminate");

    fireEvent.click(selectAll);
    expect(onValueChange).toHaveBeenLastCalledWith(["post", "email", "sms"]);
    expect((screen.getByRole("checkbox", { name: "Post" }) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["post"]);
    expect((screen.getByRole("checkbox", { name: "Post" }) as HTMLInputElement).checked).toBe(true);
  });

  it("does not submit the aggregate or duplicate the group name", () => {
    const { container } = render(
      <form>
        <CheckboxGroupClient
          defaultValue={["email"]}
          id="contact"
          items={items}
          name="contact"
          selectAll
        />
      </form>,
    );

    const selectAll = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(selectAll.hasAttribute("name")).toBe(false);
    expect(selectAll.hasAttribute("value")).toBe(false);
    expect([...new FormData(container.querySelector("form")!).getAll("contact")]).toEqual([
      "email",
    ]);
  });

  it("disables the aggregate when no item is enabled", () => {
    render(
      <CheckboxGroupClient
        id="contact"
        items={[
          { value: "email", label: "Email", disabled: true },
          { value: "sms", label: "Text message", disabled: true },
        ]}
        selectAll
      />,
    );

    const selectAll = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(selectAll.disabled).toBe(true);
    expect(selectAll.checked).toBe(false);
    expect(selectAll.indeterminate).toBe(false);
  });

  it("accepts a localized select-all label", () => {
    render(
      <CheckboxGroupClient
        id="contact"
        items={items}
        labels={{ selectAll: "Alle auswählen" }}
        selectAll
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Alle auswählen" })).toBeTruthy();
  });

  it("passes the static group states and slots through", () => {
    render(
      <CheckboxGroupClient
        disabled
        id="contact"
        invalid
        items={items}
        label="Contact preferences"
        required
        selectAll
        slotProps={{ selectAll: { className: "select-all-wrap" } }}
      />,
    );

    const group = screen.getByRole("group", { name: "Contact preferences" });
    expect(group.getAttribute("data-disabled")).toBe("");
    expect(group.getAttribute("data-required")).toBe("");
    expect(group.getAttribute("data-invalid")).toBe("");
    expect(screen.getByText("Select all").closest(".select-all-wrap")).not.toBeNull();
  });
});
