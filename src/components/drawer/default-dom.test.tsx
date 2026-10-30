import { expect, it } from "vitest";
import { DrawerPanel } from "./DrawerNative.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default DrawerPanel DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <DrawerPanel
      id="settings"
      trigger="Open"
      title="Settings"
      description="Preferences"
      size="lg"
      footer="Actions"
    >
      Body
    </DrawerPanel>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
