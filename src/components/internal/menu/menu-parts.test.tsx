import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { MenuGroup, MenuLabel, MenuSeparator } from "./menu-parts.js";

it("renders semantic menu group and label parts", () => {
  expect(renderToStaticMarkup(<MenuGroup>Items</MenuGroup>)).toContain(
    'role="group" class="uiify-menu-group"',
  );
  expect(renderToStaticMarkup(<MenuLabel>Label</MenuLabel>)).toContain('class="uiify-menu-label"');
});

it("renders a separator with its owned semantics", () => {
  expect(renderToStaticMarkup(<MenuSeparator />)).toContain(
    'role="separator" class="uiify-menu-separator"',
  );
});

it("keeps polymorphic and render props available", () => {
  expect(
    renderToStaticMarkup(
      <MenuGroup as="section" className="items">
        Items
      </MenuGroup>,
    ),
  ).toContain('<section role="group" class="uiify-menu-group items">Items</section>');
  expect(
    renderToStaticMarkup(
      <MenuLabel render={(props) => <strong {...props}>Label</strong>}>Label</MenuLabel>,
    ),
  ).toContain('<strong role="presentation" class="uiify-menu-label">Label</strong>');
});
