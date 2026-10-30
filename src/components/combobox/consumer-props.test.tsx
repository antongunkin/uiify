import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
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
