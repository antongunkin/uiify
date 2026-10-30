import { expect, it } from "vitest";
import { ContextMenu } from "./ContextMenu.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default ContextMenu DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <ContextMenu.Root id="context">
      <ContextMenu.Trigger>Area</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>Tools</ContextMenu.Label>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.CheckboxItem checked>Bold</ContextMenu.CheckboxItem>
        <ContextMenu.RadioItem value="a">A</ContextMenu.RadioItem>
        <ContextMenu.Sub>
          <ContextMenu.Sub.Trigger>More</ContextMenu.Sub.Trigger>
          <ContextMenu.Sub.Content>
            <ContextMenu.Item>Child</ContextMenu.Item>
          </ContextMenu.Sub.Content>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu.Root>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
