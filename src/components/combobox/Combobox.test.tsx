import { createRef, Profiler, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Combobox, type ComboboxItemData } from "./Combobox.js";
import type { ComboboxRootMultiProps } from "./types.js";

const items: ComboboxItemData[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

type MultiComboboxProps = Omit<ComboboxRootMultiProps, "children" | "items" | "multiple">;

function MultiCombobox(props: MultiComboboxProps) {
  const { defaultOpen = true, ...rootProps } = props;

  return (
    <Combobox.Root multiple defaultOpen={defaultOpen} items={items} {...rootProps}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filteredItems) =>
          filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
        }
      </Combobox.Content>
    </Combobox.Root>
  );
}
MultiCombobox.displayName = "MultiCombobox";

describe("Combobox", () => {
  it("uses null for no selection while preserving an empty-string item ID", () => {
    const onValueChange = vi.fn();
    const emptyIdItems = [{ label: "Empty ID option", value: "" }];
    render(
      <Combobox.Root
        defaultValue={null}
        defaultOpen
        items={emptyIdItems}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Choice" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    const option = screen.getByRole("option", { name: "Empty ID option" });
    expect(input.value).toBe("");
    expect(option.getAttribute("aria-selected")).toBe("false");
    fireEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(input.value).toBe("Empty ID option");
    expect(option.getAttribute("aria-selected")).toBe("true");
  });

  it("uses the selected label for its initial query unless defaultInputValue is explicit", () => {
    const selected = [{ label: "Apple", value: "apple" }];
    const markup = renderToStaticMarkup(
      <Combobox.Root defaultValue="apple" items={selected}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const overridden = renderToStaticMarkup(
      <Combobox.Root defaultValue="apple" defaultInputValue="Search instead" items={selected}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    expect(markup).toContain('value="Apple"');
    expect(overridden).toContain('value="Search instead"');
  });

  it("syncs external values and label refreshes without overwriting a dirty query", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Combobox.Root
        value="apple"
        items={[{ label: "Apple", value: "apple" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Apple");

    rerender(
      <Combobox.Root
        value="apple"
        items={[{ label: "Red Apple", value: "apple" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    expect(input.value).toBe("Red Apple");

    fireEvent.change(input, { target: { value: "draft" } });
    rerender(
      <Combobox.Root
        value="apple"
        items={[{ label: "Fresh Apple", value: "apple" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    expect(input.value).toBe("draft");

    rerender(
      <Combobox.Root
        value="banana"
        items={[{ label: "Banana", value: "banana" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    expect(input.value).toBe("Banana");
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <Combobox.Root
        inputValue="Controlled query"
        value="apple"
        items={[{ label: "Apple", value: "apple" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    rerender(
      <Combobox.Root
        inputValue="Controlled query"
        value="banana"
        items={[{ label: "Banana", value: "banana" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    expect(input.value).toBe("Controlled query");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not optimistically change a fully controlled value when the owner refuses", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root defaultOpen value={null} items={items} onValueChange={onValueChange}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Apple" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("apple");
    expect(input.value).toBe("Apple");
    expect(document.querySelector('[role="option"]')?.getAttribute("aria-selected")).toBe("false");
  });

  it("keeps every mutation path disabled when the root is disabled", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        disabled
        multiple
        defaultOpen
        defaultValue={["apple"]}
        items={items}
        onValueChange={onValueChange}
      >
        <Combobox.Control>
          <Combobox.Tags />
          <Combobox.Input aria-label="Fruit" disabled={false} />
          <Combobox.Trigger>Toggle options</Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    const trigger = screen.getByRole("button", { name: "Toggle options" });
    const remove = screen.getByRole("button", { name: "Remove Apple" });
    expect(input.disabled).toBe(false);
    expect(trigger.hasAttribute("disabled")).toBe(true);
    expect(remove.hasAttribute("disabled")).toBe(true);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Backspace" });
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    fireEvent.click(remove);
    fireEvent.click(trigger);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("follows native disabled fieldset state without blocking its first legend", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <fieldset disabled>
        <Combobox.Root defaultOpen items={items} onValueChange={onValueChange}>
          <Combobox.Input aria-label="Fruit" />
          <Combobox.Content>
            {(filteredItems) =>
              filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
            }
          </Combobox.Content>
        </Combobox.Root>
      </fieldset>,
    );
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <fieldset>
        <Combobox.Root defaultOpen items={items} onValueChange={onValueChange}>
          <Combobox.Input aria-label="Fruit" />
          <Combobox.Content>
            {(filteredItems) =>
              filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
            }
          </Combobox.Content>
        </Combobox.Root>
      </fieldset>,
    );
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("apple");

    rerender(
      <fieldset disabled>
        <legend>
          <Combobox.Root defaultOpen items={items} onValueChange={onValueChange}>
            <Combobox.Input aria-label="Fruit" />
            <Combobox.Content>
              {(filteredItems) =>
                filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
              }
            </Combobox.Content>
          </Combobox.Root>
        </legend>
      </fieldset>,
    );
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("commits an enabled exact match or a validated custom single value on Enter", () => {
    const onValueChange = vi.fn();
    const customItems = [
      { label: "Disabled match", value: "blocked", disabled: true },
      { label: "Duplicate", value: "first" },
      { label: "Duplicate", value: "second" },
    ];
    render(
      <Combobox.Root defaultOpen allowCustomValue items={customItems} onValueChange={onValueChange}>
        <Combobox.Input aria-label="Choice" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "Duplicate" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith("first");

    fireEvent.change(input, { target: { value: "  New value  " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith("New value");
    expect((input as HTMLInputElement).value).toBe("New value");
    expect(document.querySelector('[role="listbox"]')?.getAttribute("data-state")).toBe("closed");

    fireEvent.change(input, { target: { value: "Disabled match" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: "   " } });
    const enter = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Enter" });
    input.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("keeps controlled selection authoritative when a custom commit is refused", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        defaultOpen
        allowCustomValue
        value={null}
        items={[]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Choice" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Draft" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("Draft");
    expect(input.value).toBe("Draft");
    expect(screen.getByRole("listbox").getAttribute("data-state")).toBe("open");
  });

  it("does not create a single custom value on blur, Tab, Escape, or IME confirmation", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root defaultOpen allowCustomValue items={[]} onValueChange={onValueChange}>
        <Combobox.Input aria-label="Choice" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "First" } });
    fireEvent.blur(input);
    fireEvent.keyDown(input, { key: "Tab" });
    fireEvent.keyDown(input, { key: "Escape" });
    fireEvent.change(input, { target: { value: "Second" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true, keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("blocks invalid custom Enter but preserves native submit for unmatched default mode", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Combobox.Root
        defaultOpen
        allowCustomValue
        validateValue={() => false}
        items={[]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Choice" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Rejected" } });
    const invalidEnter = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
    });
    input.dispatchEvent(invalidEnter);
    expect(invalidEnter.defaultPrevented).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("Rejected");

    rerender(
      <Combobox.Root defaultOpen items={[]} onValueChange={onValueChange}>
        <Combobox.Input aria-label="Choice" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const defaultInput = screen.getByRole("combobox");
    fireEvent.change(defaultInput, { target: { value: "Unmatched" } });
    const nativeSubmit = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
    });
    defaultInput.dispatchEvent(nativeSubmit);
    expect(nativeSubmit.defaultPrevented).toBe(false);
  });

  it("forwards a declared root id to the rendered root element", () => {
    const rootRef = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <Combobox.Root
        id="fruit-picker"
        className="fruit-root"
        style={{ color: "red" }}
        data-testid="fruit-root"
        data-purpose="picker"
        data-uiify-combobox="consumer-value"
        onClick={onClick}
        ref={rootRef}
        items={items}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const root = screen.getByTestId("fruit-root");
    expect(root.id).toBe("fruit-picker");
    expect(root.classList.contains("fruit-root")).toBe(true);
    expect((root as HTMLDivElement).style.color).toBe("red");
    expect(root.getAttribute("data-purpose")).toBe("picker");
    expect(root.getAttribute("data-uiify-combobox")).toBe("consumer-value");
    expect(rootRef.current).toBe(root);
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders control and chip data parts with accessible combobox linkage", () => {
    const controlRef = createRef<HTMLElement>();

    render(
      <Combobox.Root multiple defaultValue={["apple"]} items={items}>
        <Combobox.Control
          as="section"
          className="fruit-control"
          data-testid="control"
          ref={controlRef}
        >
          <Combobox.Tags
            slotProps={{
              tag: {
                byItemValue: { apple: { className: "apple-tag", "data-testid": "apple-tag" } },
              },
              remove: {
                byItemValue: {
                  apple: { className: "apple-remove", "data-testid": "apple-remove" },
                },
              },
            }}
          />
          <Combobox.Input aria-label="Fruit" />
        </Combobox.Control>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const control = screen.getByTestId("control");
    const input = screen.getByRole("combobox");
    expect(control.tagName).toBe("SECTION");
    expect(control.classList.contains("fruit-control")).toBe(true);
    expect(control.classList.contains("uiify-combobox-control")).toBe(true);
    expect(controlRef.current).toBe(control);
    expect(control.querySelector(".uiify-combobox-tags")).not.toBeNull();
    expect(screen.getByTestId("apple-tag").classList.contains("apple-tag")).toBe(true);
    expect(screen.getByTestId("apple-remove").classList.contains("apple-remove")).toBe(true);
    expect(screen.getByText("Apple").classList.contains("uiify-combobox-tag")).toBe(true);
    expect(
      screen
        .getByRole("button", { name: "Remove Apple" })
        .classList.contains("uiify-combobox-tag-remove"),
    ).toBe(true);
    expect(input.getAttribute("aria-controls")).not.toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("removes a chip without taking the input out of use", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        multiple
        defaultValue={["apple", "banana"]}
        items={items}
        onValueChange={onValueChange}
      >
        <Combobox.Control>
          <Combobox.Tags />
          <Combobox.Input aria-label="Fruit" />
        </Combobox.Control>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    const removeApple = screen.getByRole("button", { name: "Remove Apple" });
    input.focus();
    const pointerEvent = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    removeApple.dispatchEvent(pointerEvent);
    fireEvent.click(removeApple);

    expect(pointerEvent.defaultPrevented).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(["banana"]);
    expect(screen.queryByRole("button", { name: "Remove Apple" })).toBeNull();
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: "ch" } });
    expect(input.value).toBe("ch");
  });

  it("renders no tags container in single-value mode", () => {
    const renderTags = vi.fn(() => <div />);
    const { container } = render(
      <Combobox.Root defaultValue="apple" items={items}>
        <Combobox.Tags render={renderTags} />
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    expect(container.querySelector(".uiify-combobox-tags")).toBeNull();
    expect(renderTags).not.toHaveBeenCalled();
  });

  it("renders stable control and chip static markup", () => {
    function renderMarkup() {
      return renderToStaticMarkup(
        <Combobox.Root multiple defaultValue={["apple"]} items={items}>
          <Combobox.Control data-testid="control">
            <Combobox.Tags />
            <Combobox.Input aria-label="Fruit" />
          </Combobox.Control>
          <Combobox.Content>{() => null}</Combobox.Content>
        </Combobox.Root>,
      );
    }

    const firstMarkup = renderMarkup();
    expect(firstMarkup).toBe(renderMarkup());
    expect(firstMarkup).toContain('class="uiify-combobox-control"');
    expect(firstMarkup).toContain("uiify-combobox-tags");
    expect(firstMarkup).toContain('aria-label="Remove Apple"');
    expect(firstMarkup).toContain("aria-controls=");
    expect(firstMarkup).toContain('aria-expanded="false"');
  });

  it("filters items while typing", () => {
    render(
      <Combobox.Root defaultOpen inputValue="" items={items} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content data-testid="fruit-listbox" title="Filtered fruit">
          {(filteredItems) =>
            filteredItems.map((item) => (
              <Combobox.Item
                className="fruit-option"
                data-testid={`option-${item.value}`}
                item={item}
                key={item.value}
              />
            ))
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByTestId("fruit-listbox").getAttribute("title")).toBe("Filtered fruit");
    expect(screen.getByTestId("option-apple").classList.contains("fruit-option")).toBe(true);
  });

  it("renders rich content while filtering and committing the canonical label and value", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        defaultOpen
        items={[{ label: "Ada Lovelace", value: "ada" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Person" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => (
              <Combobox.Item item={item} key={item.value} aria-describedby="ada-description">
                <span aria-hidden="true">AL</span>
                <span>
                  <span data-part="item-primary">Ada Lovelace</span>
                  <span data-part="item-secondary" id="ada-description">
                    Engineering
                  </span>
                </span>
              </Combobox.Item>
            ))
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const option = screen.getByRole("option", { name: "Ada Lovelace" });
    expect(option.getAttribute("aria-label")).toBe("Ada Lovelace");
    expect(
      document.getElementById(option.getAttribute("aria-describedby") ?? "")?.textContent,
    ).toBe("Engineering");
    expect(screen.getByText("Engineering")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Engineering" } });
    expect(screen.queryByRole("option")).toBeNull();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Ada" } });
    fireEvent.click(screen.getByRole("option", { name: "Ada Lovelace" }));
    expect(onValueChange).toHaveBeenCalledWith("ada");
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Ada Lovelace");
  });

  it("selects clicked values in uncontrolled single mode", () => {
    render(
      <Combobox.Root defaultOpen defaultValue="apple" items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Trigger>Toggle options</Combobox.Trigger>
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Banana");

    fireEvent.click(screen.getByRole("button", { name: "Toggle options" }));
    expect(screen.getByRole("option", { name: "Banana" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("uses the label when children are undefined and preserves explicitly empty children", () => {
    const cases = [undefined, null, false, ""] as const;
    for (const [index, children] of cases.entries()) {
      const { unmount } = render(
        <Combobox.Root defaultOpen items={[{ label: `Person ${index}`, value: `${index}` }]}>
          <Combobox.Input aria-label="Person" />
          <Combobox.Content>
            {(filteredItems) =>
              filteredItems.map((item) => (
                <Combobox.Item item={item} key={item.value}>
                  {children}
                </Combobox.Item>
              ))
            }
          </Combobox.Content>
        </Combobox.Root>,
      );

      const option = screen.getByRole("option", { name: `Person ${index}` });
      expect(option.textContent).toBe(children === undefined ? `Person ${index}` : "");
      unmount();
    }
  });

  it("exposes named groups without registering their labels as options", () => {
    render(
      <Combobox.Root defaultOpen items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) => (
            <>
              <Combobox.Group aria-labelledby="fruit-group-label" data-testid="fruit-group">
                <Combobox.GroupLabel id="fruit-group-label">Fresh fruit</Combobox.GroupLabel>
                {filteredItems.slice(0, 1).map((item) => (
                  <Combobox.Item item={item} key={item.value} />
                ))}
              </Combobox.Group>
              <Combobox.Group aria-labelledby="other-group-label">
                <Combobox.GroupLabel id="other-group-label">Other fruit</Combobox.GroupLabel>
                {filteredItems.slice(1, 2).map((item) => (
                  <Combobox.Item item={item} key={item.value} />
                ))}
              </Combobox.Group>
            </>
          )}
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(
      screen.getByRole("group", { name: "Fresh fruit" }).classList.contains("uiify-combobox-group"),
    ).toBe(true);
    expect(screen.getByRole("group", { name: "Other fruit" })).toBeTruthy();
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByTestId("fruit-group").querySelector(".uiify-combobox-group-label")?.id).toBe(
      "fruit-group-label",
    );

    const input = screen.getByRole("combobox");
    input.focus();
    const options = screen.getAllByRole("option");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(options[1]?.id);
  });

  it("forwards native props to the empty state and generated listbox", () => {
    render(
      <Combobox.Root defaultInputValue="not found" defaultOpen items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content data-testid="fruit-listbox">
          {(filteredItems) =>
            filteredItems.length === 0 ? (
              <Combobox.Empty className="no-results" data-testid="empty" title="No match">
                No results
              </Combobox.Empty>
            ) : (
              filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
            )
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByTestId("fruit-listbox").getAttribute("role")).toBe("listbox");
    expect(screen.getByTestId("empty").classList.contains("no-results")).toBe(true);
    expect(screen.getByTestId("empty").getAttribute("title")).toBe("No match");
  });

  it("derives filtered items from inputValue", () => {
    render(
      <Combobox.Root defaultOpen inputValue="e" items={items} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("option", { name: "Apple" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Cherry" })).toBeTruthy();
  });

  it("moves the active option with arrow keys via aria-activedescendant", () => {
    render(
      <Combobox.Root defaultOpen inputValue="" items={items} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const firstOption = screen.getByRole("option", { name: "Apple" });
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
    expect(firstOption.getAttribute("aria-selected")).toBe("false");
    expect(firstOption.getAttribute("data-highlighted")).toBe("");
    expect(document.activeElement).toBe(input);
  });

  it("clears an active descendant when its item is removed", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Combobox.Root defaultOpen items={items} onValueChange={onValueChange}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const removedId = input.getAttribute("aria-activedescendant");
    expect(removedId).not.toBeNull();

    rerender(
      <Combobox.Root
        defaultOpen
        items={[{ label: "Banana", value: "banana" }]}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(document.getElementById(removedId!)).toBeNull();
    expect(input.getAttribute("aria-activedescendant")).toBeNull();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("skips disabled items when navigating and refuses to select them on click", () => {
    const onValueChange = vi.fn();
    const withDisabled: ComboboxItemData[] = [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana", disabled: true },
      { label: "Cherry", value: "cherry" },
    ];
    render(
      <Combobox.Root
        defaultOpen
        inputValue=""
        items={withDisabled}
        onInputValueChange={() => {}}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const apple = screen.getByRole("option", { name: "Apple" });
    expect(input.getAttribute("aria-activedescendant")).toBe(apple.id);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    const cherry = screen.getByRole("option", { name: "Cherry" });
    expect(input.getAttribute("aria-activedescendant")).toBe(cherry.id);

    const banana = screen.getByRole("option", { name: "Banana" });
    fireEvent.click(banana);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reports the selected label to a parent that controls both value and input text", () => {
    function Controlled() {
      const [inputValue, setInputValue] = useState("");
      const [value, setValue] = useState<string | null>(null);
      return (
        <Combobox.Root
          inputValue={inputValue}
          items={items}
          onInputValueChange={setInputValue}
          onValueChange={setValue}
          value={value}
        >
          <Combobox.Input aria-label="Fruit" />
          <Combobox.Content>
            {(filteredItems) =>
              filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
            }
          </Combobox.Content>
        </Combobox.Root>
      );
    }
    Controlled.displayName = "Controlled";
    render(<Controlled />);

    const input = screen.getByRole("combobox") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "ban" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.value).toBe("Banana");
  });

  it("selects the active option on Enter", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        defaultOpen
        inputValue=""
        items={items}
        onInputValueChange={() => {}}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("closes on Escape without committing selection", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        defaultOpen
        inputValue=""
        items={items}
        onInputValueChange={() => {}}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("false");
  });

  it("preserves native text-editing Home and End keys", () => {
    render(
      <Combobox.Root defaultOpen inputValue="" items={items} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox");
    const homeEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Home",
    });
    const endEvent = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "End" });

    input.dispatchEvent(homeEvent);
    input.dispatchEvent(endEvent);

    expect(homeEvent.defaultPrevented).toBe(false);
    expect(endEvent.defaultPrevented).toBe(false);
  });

  it("links the trigger to the listbox and returns focus to the input", () => {
    render(
      <Combobox.Root items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Trigger>Toggle fruit list</Combobox.Trigger>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox");
    const trigger = screen.getByRole("button", { name: "Toggle fruit list" });
    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-controls")).toBe(input.getAttribute("aria-controls"));
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(document.activeElement).toBe(input);
  });

  it("shows Empty when there are no matches", () => {
    render(
      <Combobox.Root defaultOpen inputValue="zzz" items={items} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.length === 0 ? (
              <Combobox.Empty>No results</Combobox.Empty>
            ) : (
              filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
            )
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByText("No results")).toBeTruthy();
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("rerenders only the previous and next option subtrees", () => {
    const largeItems = Array.from({ length: 100 }, (_, index) => ({
      label: `Item ${index}`,
      value: String(index),
    }));
    const renders = Array.from({ length: 100 }, () => 0);

    function Item({ item }: { readonly item: ComboboxItemData }) {
      const index = Number(item.value);
      return (
        <Profiler
          id={item.value}
          onRender={() => {
            renders[index] = (renders[index] ?? 0) + 1;
          }}
        >
          <Combobox.Item item={item} />
        </Profiler>
      );
    }
    Item.displayName = "Item";

    render(
      <Combobox.Root defaultOpen inputValue="" items={largeItems} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Items" />
        <Combobox.Content>
          {(filteredItems) => filteredItems.map((item) => <Item item={item} key={item.value} />)}
        </Combobox.Content>
      </Combobox.Root>,
    );

    renders.fill(0);
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    renders.fill(0);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const active = screen.getByRole("option", { name: "Item 1" });
    expect(input.getAttribute("aria-activedescendant")).toBe(active.id);
    expect(renders.slice(2).every((count) => count === 0)).toBe(true);
    expect(renders.reduce((total, count) => total + count, 0)).toBeLessThanOrEqual(2);
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Combobox.Root inputValue="" items={items} onInputValueChange={() => {}}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('aria-autocomplete="list"');
  });

  it("accepts input native overrides while retaining keyboard behavior", () => {
    render(
      <Combobox.Root defaultOpen inputValue="" items={items} onInputValueChange={() => {}}>
        <Combobox.Input
          aria-label="Fruit"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The combobox input owns its role.
          role="textbox"
          aria-autocomplete="both"
          aria-controls="bogus"
          // oxlint-disable-next-line jsx-a11y/role-supports-aria-props -- The combobox input owns its expanded state.
          aria-expanded="false"
          value="bogus"
        />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.getAttribute("aria-autocomplete")).toBe("both");
    expect(input.getAttribute("aria-controls")).toBe("bogus");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.value).toBe("bogus");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    const firstOption = screen.getByRole("option", { name: "Apple" });
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
  });

  it("accepts input anchor overrides", () => {
    render(
      <Combobox.Root items={items}>
        <Combobox.Input aria-label="Fruit" data-anchor="bogus" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByRole("combobox").getAttribute("data-anchor")).toBe("bogus");
  });

  it("lets a consumer onChange veto input sync, leaving the committed value unchanged (policy #1: form-control change veto)", () => {
    const onInputValueChange = vi.fn();
    render(
      <Combobox.Root inputValue="" items={items} onInputValueChange={onInputValueChange}>
        <Combobox.Input aria-label="Fruit" onChange={(event) => event.preventDefault()} />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "app" } });
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it("lets a consumer onKeyDown veto arrow navigation without suppressing text entry (policy #1-like veto isolation)", () => {
    const onInputValueChange = vi.fn();
    render(
      <Combobox.Root
        defaultOpen
        inputValue=""
        items={items}
        onInputValueChange={onInputValueChange}
      >
        <Combobox.Input
          aria-label="Fruit"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") event.preventDefault();
          }}
        />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBeNull();

    fireEvent.change(input, { target: { value: "app" } });
    expect(onInputValueChange).toHaveBeenCalledWith("app");
  });

  it("accepts trigger native overrides", () => {
    render(
      <Combobox.Root items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Trigger
          aria-expanded="true"
          aria-controls="bogus"
          aria-haspopup="dialog"
          type="submit"
        >
          Toggle fruit list
        </Combobox.Trigger>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle fruit list" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe("bogus");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("type")).toBe("submit");
  });

  it("lets a consumer onClick veto the trigger's open/close toggle", () => {
    render(
      <Combobox.Root items={items}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Trigger onClick={(event) => event.preventDefault()}>
          Toggle fruit list
        </Combobox.Trigger>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle fruit list" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles multiple items without closing the listbox", () => {
    const onValueChange = vi.fn();
    render(<MultiCombobox onValueChange={onValueChange} />);

    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "app" } });
    const apple = screen.getByRole("option", { name: "Apple" });
    fireEvent.click(apple);
    const addedValues = onValueChange.mock.calls[0]?.[0] as string[];
    expect(addedValues).toEqual(["apple"]);
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    expect(input.value).toBe("");
    expect(apple.getAttribute("aria-selected")).toBe("true");
    expect(apple.getAttribute("data-selected")).toBe("");

    fireEvent.click(apple);
    const removedValues = onValueChange.mock.calls[1]?.[0] as string[];
    expect(removedValues).toEqual([]);
    expect(removedValues).not.toBe(addedValues);
    expect(apple.getAttribute("aria-selected")).toBe("false");
  });

  it("derives multiple item membership from controlled values", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<MultiCombobox value={["banana"]} onValueChange={onValueChange} />);

    const apple = screen.getByRole("option", { name: "Apple" });
    const banana = screen.getByRole("option", { name: "Banana" });
    expect(apple.getAttribute("aria-selected")).toBe("false");
    expect(banana.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(apple);
    expect(onValueChange).toHaveBeenLastCalledWith(["banana", "apple"]);
    expect(apple.getAttribute("aria-selected")).toBe("false");

    rerender(<MultiCombobox value={["banana", "apple"]} onValueChange={onValueChange} />);
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("commits custom values and removes the last value with empty-input Backspace", () => {
    const onValueChange = vi.fn();
    render(
      <MultiCombobox allowCustomValue defaultValue={["React"]} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: " UI " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith(["React", "UI"]);
    expect(input.value).toBe("");

    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onValueChange).toHaveBeenLastCalledWith(["React"]);
  });

  it("commits configured delimiters and split paste values", () => {
    const onValueChange = vi.fn();
    render(
      <MultiCombobox
        addOnPaste
        allowCustomValue
        delimiters={[",", ";"]}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: ";" });
    expect(onValueChange).toHaveBeenLastCalledWith(["React"]);

    fireEvent.paste(input, {
      clipboardData: { getData: () => "UI, CSS\nDOM" },
    });
    expect(onValueChange).toHaveBeenLastCalledWith(["React", "UI", "CSS", "DOM"]);
  });

  it("does not treat non-printable Home and End keys as multiple-value delimiters", () => {
    render(<MultiCombobox allowCustomValue delimiters={["Home", "End"]} />);
    const input = screen.getByRole("combobox");
    const homeEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Home",
    });
    const endEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "End",
    });

    input.dispatchEvent(homeEvent);
    input.dispatchEvent(endEvent);

    expect(homeEvent.defaultPrevented).toBe(false);
    expect(endEvent.defaultPrevented).toBe(false);
  });

  it("does not commit custom input when allowCustomValue is false", () => {
    const onValueChange = vi.fn();
    render(<MultiCombobox delimiters={[","]} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Dragonfruit" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "," });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input.value).toBe("Dragonfruit");
  });

  it("rejects duplicate, maxed, and invalid custom values", () => {
    const onValueChange = vi.fn();
    render(
      <MultiCombobox
        allowCustomValue
        defaultValue={["React"]}
        maxValues={2}
        validateValue={(value) => /^[A-Z]/.test(value)}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "ui" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "Vue" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith(["React", "Vue"]);

    fireEvent.change(input, { target: { value: "Svelte" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("skips disabled items for multiple navigation and selection", () => {
    const onValueChange = vi.fn();
    const withDisabled: ComboboxItemData[] = [
      { label: "Apple", value: "apple", disabled: true },
      { label: "Banana", value: "banana" },
    ];
    render(
      <Combobox.Root multiple defaultOpen items={withDisabled} onValueChange={onValueChange}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filteredItems) =>
            filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
          }
        </Combobox.Content>
      </Combobox.Root>,
    );

    const input = screen.getByRole("combobox");
    const apple = screen.getByRole("option", { name: "Apple" });
    fireEvent.click(apple);
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Banana" }).id,
    );
  });

  it("continues active multiple-item navigation after toggling with Enter", () => {
    const onValueChange = vi.fn();
    render(<MultiCombobox onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("aria-selected")).toBe(
      "true",
    );

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Banana" }).id,
    );
  });

  it("lets a consumer onChange veto multiple query sync without blocking later key handling", () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        multiple
        allowCustomValue
        defaultOpen
        items={items}
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" onChange={(event) => event.preventDefault()} />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onInputValueChange).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("lets a consumer onKeyDown veto multiple commits without blocking query changes", () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        multiple
        allowCustomValue
        defaultOpen
        items={items}
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" onKeyDown={(event) => event.preventDefault()} />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onInputValueChange).toHaveBeenCalledWith("React");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("lets a consumer onPaste veto split commits without blocking keyboard commits", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox.Root
        multiple
        addOnPaste
        allowCustomValue
        defaultOpen
        items={items}
        onValueChange={onValueChange}
      >
        <Combobox.Input aria-label="Fruit" onPaste={(event) => event.preventDefault()} />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;

    fireEvent.paste(input, { clipboardData: { getData: () => "React,UI" } });
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith(["React"]);
  });

  describe("IME composition", () => {
    function setup() {
      const onValueChange = vi.fn();
      render(
        <Combobox.Root
          defaultOpen
          inputValue=""
          items={items}
          onInputValueChange={() => {}}
          onValueChange={onValueChange}
        >
          <Combobox.Input aria-label="Fruit" />
          <Combobox.Content>
            {(filteredItems) =>
              filteredItems.map((item) => <Combobox.Item item={item} key={item.value} />)
            }
          </Combobox.Content>
        </Combobox.Root>,
      );
      return { input: screen.getByRole("combobox"), onValueChange };
    }

    it("does not move the active option on ArrowDown while composing", () => {
      const { input } = setup();
      fireEvent.keyDown(input, { key: "ArrowDown", isComposing: true });
      expect(input.getAttribute("aria-activedescendant")).toBeNull();
    });

    it("does not select on Enter with keyCode 229", () => {
      const { input, onValueChange } = setup();
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("stays open on Escape while composing", () => {
      const { input } = setup();
      fireEvent.keyDown(input, { key: "Escape", isComposing: true });
      expect(input.getAttribute("aria-expanded")).toBe("true");
    });
  });
});

it("navigates keyed options in their reordered DOM sequence while skipping headings and disabled items", () => {
  const apple = items[0]!;
  const banana = items[1]!;
  const cherry = items[2]!;
  const disabled = { label: "Disabled fruit", value: "disabled", disabled: true };
  function renderOrder(ordered: readonly ComboboxItemData[]) {
    return (
      <Combobox.Root defaultOpen items={ordered}>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          {(filtered) => (
            <Combobox.Group aria-labelledby="reorder-heading">
              <Combobox.GroupLabel id="reorder-heading">Fruit group</Combobox.GroupLabel>
              {filtered.map((item) => (
                <Combobox.Item item={item} key={item.value} id={`reorder-${item.value}`} />
              ))}
            </Combobox.Group>
          )}
        </Combobox.Content>
      </Combobox.Root>
    );
  }
  const { rerender } = render(renderOrder([apple, cherry, disabled, banana]));
  const input = screen.getByRole("combobox");
  const cherryNode = screen.getByRole("option", { name: "Cherry" });
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(input.getAttribute("aria-activedescendant")).toBe("reorder-cherry");

  rerender(renderOrder([cherry, disabled, apple, banana]));
  expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
    "Cherry",
    "Disabled fruit",
    "Apple",
    "Banana",
  ]);
  expect(screen.getByRole("option", { name: "Cherry" })).toBe(cherryNode);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(input.getAttribute("aria-activedescendant")).toBe("reorder-apple");
});

it("keeps the input controlled when a mounted Root switches from multiple to single", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const items = [{ label: "Apple", value: "apple" }];
  const view = (multiple: boolean) => (
    <Combobox.Root {...(multiple ? { multiple: true, defaultValue: ["apple"] } : {})} items={items}>
      <Combobox.Input aria-label="Fruit" />
    </Combobox.Root>
  );
  view.displayName = "ControlledModeView";
  const { rerender } = render(view(true));
  rerender(view(false));
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
  expect(error).not.toHaveBeenCalled();
  error.mockRestore();
});
