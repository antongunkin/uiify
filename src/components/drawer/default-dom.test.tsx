import { expect, it } from "vitest";
import { Drawer } from "./DrawerNative.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default Drawer DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <Drawer
      id="settings"
      trigger="Open"
      title="Settings"
      description="Preferences"
      size="lg"
      footer="Actions"
    >
      Body
    </Drawer>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
