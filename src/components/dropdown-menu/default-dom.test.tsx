import { expect, it } from "vitest";
import { DropdownMenu } from "./DropdownMenu.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default DropdownMenu DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <DropdownMenu.Bar>
      <DropdownMenu.Root id="actions">
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Tools</DropdownMenu.Label>
          <DropdownMenu.Group>
            <DropdownMenu.Item>Cut</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Copy</DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem defaultChecked>
            <DropdownMenu.ItemIndicator />
            Checked
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.RadioGroup defaultValue="a">
            <DropdownMenu.RadioItem value="a">A</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Child</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </DropdownMenu.Bar>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
