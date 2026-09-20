import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { MenuGroup, MenuLabel, MenuSeparator } from "./menu-parts.js";

it("renders semantic menu group and label parts", () => {
  expect(renderToStaticMarkup(<MenuGroup>Items</MenuGroup>)).toContain(
    'role="group" data-part="group"',
  );
  expect(renderToStaticMarkup(<MenuLabel>Label</MenuLabel>)).toContain('data-part="label"');
});

it("renders a separator with its owned semantics", () => {
  expect(renderToStaticMarkup(<MenuSeparator />)).toContain(
    'role="separator" data-part="separator"',
  );
});

it("keeps polymorphic and render props available", () => {
  expect(
    renderToStaticMarkup(
      <MenuGroup as="section" className="items">
        Items
      </MenuGroup>,
    ),
  ).toContain('<section class="items" role="group" data-part="group">Items</section>');
  expect(
    renderToStaticMarkup(
      <MenuLabel render={(props) => <strong {...props}>Label</strong>}>Label</MenuLabel>,
    ),
  ).toContain('<strong role="presentation" data-part="label">Label</strong>');
});
