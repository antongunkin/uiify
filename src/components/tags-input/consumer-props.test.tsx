import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { TagsInput } from "./TagsInput.js";
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

it("preserves default tags input DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <TagsInput.Root defaultValue={["React"]}>
          <TagsInput.List>
            <TagsInput.Input aria-label="Tags" />
            <TagsInput.Tag index={0} value="React">
              React
              <TagsInput.TagRemove index={0} />
            </TagsInput.Tag>
          </TagsInput.List>
        </TagsInput.Root>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets tags input native props override generated defaults", () => {
  render(
    <TagsInput.Root defaultValue={["React"]} data-uiify-tags-input="custom">
      <TagsInput.List
        id="custom-list"
        data-part="custom-list"
        slotProps={{
          tag: { "data-index": "custom", "data-value": "custom", "data-testid": "tag" },
          input: { "data-part": "entry", "data-testid": "wrapper" },
        }}
      >
        <TagsInput.Input
          id={undefined}
          data-testid="control"
          value="custom"
          data-part="custom-input"
          aria-label="Tags"
        />
      </TagsInput.List>
      <TagsInput.TagRemove index={0} type="submit" disabled data-part="custom-remove" />
    </TagsInput.Root>,
  );
  expect(screen.getByTestId("control").getAttribute("value")).toBe("custom");
  expect(screen.getByTestId("control").hasAttribute("id")).toBe(false);
  expect(screen.getByRole("list").id).toBe("custom-list");
  expect(screen.getByTestId("tag").getAttribute("data-index")).toBe("custom");
  expect(screen.getByTestId("wrapper").getAttribute("data-part")).toBe("entry");
  expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
});
