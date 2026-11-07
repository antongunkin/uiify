import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Combobox } from "./Combobox.js";
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}

const items = [{ label: "Apple", value: "apple" }];

it("uses the consumer option ID for keyboard active-descendant linkage", () => {
  const onValueChange = vi.fn();
  render(
    <Combobox.Root defaultOpen items={items} onValueChange={onValueChange}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filtered) =>
          filtered.map((item) => <Combobox.Item key={item.value} item={item} id="consumer-apple" />)
        }
      </Combobox.Content>
    </Combobox.Root>,
  );
  const input = screen.getByRole("combobox");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(input.getAttribute("aria-activedescendant")).toBe("consumer-apple");
  expect(document.getElementById(input.getAttribute("aria-activedescendant")!)).toBe(
    screen.getByRole("option", { name: "Apple" }),
  );
  fireEvent.keyDown(input, { key: "Enter" });
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith("apple");
});

it("does not publish an active descendant when the consumer removes the option ID", () => {
  render(
    <Combobox.Root defaultOpen items={items}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filtered) =>
          filtered.map((item) => <Combobox.Item key={item.value} item={item} id={undefined} />)
        }
      </Combobox.Content>
    </Combobox.Root>,
  );
  const input = screen.getByRole("combobox");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(screen.getByRole("option").hasAttribute("id")).toBe(false);
  expect(input.hasAttribute("aria-activedescendant")).toBe(false);
});

it("keeps keyboard ID linkage within the input's shadow root", () => {
  const host = document.createElement("div");
  document.body.append(host);
  const shadow = host.attachShadow({ mode: "open" });
  const container = document.createElement("div");
  shadow.append(container);
  const view = render(
    <Combobox.Root defaultOpen items={items}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filtered) =>
          filtered.map((item) => <Combobox.Item key={item.value} item={item} id="shadow-apple" />)
        }
      </Combobox.Content>
    </Combobox.Root>,
    { container },
  );
  const input = view.getByRole("combobox");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(input.getAttribute("aria-activedescendant")).toBe("shadow-apple");
  view.unmount();
  host.remove();
});
it("merges library styling classes with consumer parts, render callbacks and generated slots", () => {
  const { container } = render(
    <Combobox.Root multiple defaultOpen items={items} defaultValue={["apple"]} className="consumer">
      <Combobox.Control className="consumer">
        <Combobox.Tags
          className="consumer"
          slotProps={{
            tag: { className: "consumer" },
            remove: { className: "consumer" },
          }}
        />
        <Combobox.Input
          className="consumer"
          aria-label="Fruit"
          render={(props) => <input {...props} />}
        />
        <Combobox.Trigger className="consumer">Open</Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Content className="consumer">
        {(filtered) => (
          <Combobox.Group className="consumer">
            <Combobox.GroupLabel className="consumer">Fruit</Combobox.GroupLabel>
            {filtered.map((item) => (
              <Combobox.Item item={item} key={item.value} className="consumer" />
            ))}
          </Combobox.Group>
        )}
      </Combobox.Content>
      <Combobox.Empty className="consumer">Empty</Combobox.Empty>
    </Combobox.Root>,
  );
  expect(container.firstElementChild?.classList.contains("uiify-combobox")).toBe(true);
  expect(container.firstElementChild?.classList.contains("consumer")).toBe(true);
  for (const part of [
    "control",
    "tags",
    "tag",
    "tag-remove",
    "input",
    "trigger",
    "content",
    "item",
    "group",
    "group-label",
    "empty",
  ]) {
    expect(container.querySelector(`.uiify-combobox-${part}.consumer`), part).not.toBeNull();
  }
});

it("preserves default combobox DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <Combobox.Root multiple defaultValue={["apple"]} items={items}>
          <Combobox.Control>
            <Combobox.Tags />
            <Combobox.Input aria-label="Fruit" />
            <Combobox.Trigger>Open</Combobox.Trigger>
          </Combobox.Control>
          <Combobox.Content>
            {(filtered) => filtered.map((item) => <Combobox.Item key={item.value} item={item} />)}
          </Combobox.Content>
          <Combobox.Empty>Empty</Combobox.Empty>
        </Combobox.Root>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets combobox consumers override input, popup, item and generated tag defaults", () => {
  render(
    <Combobox.Root multiple defaultValue={["apple"]} items={items} data-uiify-combobox="custom">
      <Combobox.Tags
        slotProps={{
          tag: { "data-part": "pill" },
          remove: { "aria-label": "Remove fruit", type: "reset" },
        }}
      />
      <Combobox.Input
        aria-label="Fruit"
        aria-expanded={undefined}
        value="custom"
        data-part="editor"
      />
      <Combobox.Trigger type="submit" aria-controls={undefined}>
        Open
      </Combobox.Trigger>
      <Combobox.Content
        id="results"
        data-state="custom"
        aria-multiselectable={false}
        data-testid="results"
      >
        {(filtered) =>
          filtered.map((item) => (
            <Combobox.Item
              key={item.value}
              item={item}
              id="option"
              aria-selected={true}
              data-part="choice"
            />
          ))
        }
      </Combobox.Content>
    </Combobox.Root>,
  );
  expect(screen.getByRole("combobox").hasAttribute("aria-expanded")).toBe(false);
  expect(screen.getByRole("combobox").getAttribute("value")).toBe("custom");
  expect(screen.getByRole("button", { name: "Remove fruit" }).getAttribute("type")).toBe("reset");
  expect(screen.getByRole("button", { name: "Open" }).hasAttribute("aria-controls")).toBe(false);
  expect(screen.getByTestId("results").id).toBe("results");
  expect(screen.getByTestId("results").getAttribute("aria-multiselectable")).toBe("false");
  expect(screen.getByTestId("results").querySelector("#option")?.getAttribute("data-part")).toBe(
    "choice",
  );
});

it("lets consumers override rich option labels and group semantics", () => {
  const ref = { current: null as HTMLDivElement | null };
  const onValueChange = vi.fn();
  render(
    <Combobox.Root defaultOpen items={items} onValueChange={onValueChange}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filtered) => (
          <Combobox.Group
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This tests the consumer group role override.
            role="region"
            data-part="custom-group"
            data-testid="group"
          >
            <Combobox.GroupLabel id="custom-label">Category</Combobox.GroupLabel>
            {filtered.map((item) => (
              <Combobox.Item
                key={item.value}
                item={item}
                aria-label="Favorite fruit"
                aria-labelledby="custom-option-label"
                aria-describedby="custom-description"
                data-testid="option"
                className="custom-option"
                style={{ color: "red" }}
                ref={ref}
                onClick={(event) => event.preventDefault()}
              >
                <span id="custom-option-label">Consumer name</span>
                <span id="custom-description">Consumer description</span>
              </Combobox.Item>
            ))}
          </Combobox.Group>
        )}
      </Combobox.Content>
    </Combobox.Root>,
  );

  const option = screen.getByRole("option", { name: "Consumer name" });
  expect(document.getElementById(option.getAttribute("aria-describedby") ?? "")?.textContent).toBe(
    "Consumer description",
  );
  expect(option.getAttribute("aria-label")).toBe("Favorite fruit");
  expect(option.classList.contains("custom-option")).toBe(true);
  expect((option as HTMLDivElement).style.color).toBe("red");
  expect(ref.current).toBe(option);
  option.click();
  expect(onValueChange).not.toHaveBeenCalled();
  expect(screen.getByTestId("group").getAttribute("role")).toBe("region");
  expect(screen.getByTestId("group").getAttribute("data-part")).toBe("custom-group");
});

it("allows removing the default option accessible name", () => {
  render(
    <Combobox.Root defaultOpen items={items}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filtered) =>
          filtered.map((item) => (
            <Combobox.Item key={item.value} item={item} aria-label={undefined} />
          ))
        }
      </Combobox.Content>
    </Combobox.Root>,
  );

  const option = screen.getByRole("option", { name: "Apple" });
  expect(option.hasAttribute("aria-label")).toBe(false);
});
