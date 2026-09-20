import { createRef } from "react";
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
          <Combobox.Tags />
          <Combobox.Input aria-label="Fruit" />
        </Combobox.Control>
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    const control = screen.getByTestId("control");
    const input = screen.getByRole("combobox");
    expect(control.tagName).toBe("SECTION");
    expect(control.className).toBe("fruit-control");
    expect(control.getAttribute("data-part")).toBe("control");
    expect(controlRef.current).toBe(control);
    expect(control.querySelector('[data-part="tags"]')).not.toBeNull();
    expect(screen.getByText("Apple").getAttribute("data-part")).toBe("tag");
    expect(screen.getByRole("button", { name: "Remove Apple" }).getAttribute("data-part")).toBe(
      "tag-remove",
    );
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

    expect(container.querySelector('[data-part="tags"]')).toBeNull();
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
    expect(firstMarkup).toContain('data-part="control"');
    expect(firstMarkup).toContain('data-part="tags"');
    expect(firstMarkup).toContain('aria-label="Remove Apple"');
    expect(firstMarkup).toContain("aria-controls=");
    expect(firstMarkup).toContain('aria-expanded="false"');
  });

  it("filters items while typing", () => {
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

    expect(screen.getAllByRole("option")).toHaveLength(3);
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
    expect(firstOption.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(input);
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

  it("rerenders at most two options when moving across a large list", () => {
    const largeItems = Array.from({ length: 1000 }, (_, index) => ({
      label: `Item ${index}`,
      value: String(index),
    }));
    const renders = Array.from({ length: 1000 }, () => 0);

    function Item({ item }: { readonly item: ComboboxItemData }) {
      const index = Number(item.value);
      renders[index] = (renders[index] ?? 0) + 1;
      return <Combobox.Item item={item} />;
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
    fireEvent.keyDown(input, { key: "ArrowDown" });
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

  it("owns Input's role, aria-autocomplete, aria-controls, aria-expanded, aria-activedescendant, and value regardless of consumer override", () => {
    render(
      <Combobox.Root defaultOpen inputValue="" items={items} onInputValueChange={() => {}}>
        <Combobox.Input
          aria-label="Fruit"
          role="textbox"
          aria-autocomplete="both"
          aria-controls="bogus"
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

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-controls")).not.toBe("bogus");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.value).toBe("");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    const firstOption = screen.getByRole("option", { name: "Apple" });
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
  });

  it("owns Input's data-anchor regardless of consumer override", () => {
    render(
      <Combobox.Root items={items}>
        <Combobox.Input aria-label="Fruit" data-anchor="bogus" />
        <Combobox.Content>{() => null}</Combobox.Content>
      </Combobox.Root>,
    );

    expect(screen.getByRole("combobox").getAttribute("data-anchor")).not.toBe("bogus");
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

  it("owns Trigger's aria-expanded, aria-controls, aria-haspopup, and type regardless of consumer override", () => {
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
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).not.toBe("bogus");
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.getAttribute("type")).toBe("button");
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
});
