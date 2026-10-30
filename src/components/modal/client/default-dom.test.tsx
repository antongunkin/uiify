import { expect, it } from "vitest";
import { ModalClientContent } from "./ModalClientContent.js";
import { renderToStaticMarkup } from "../../test-utils/ssr.js";

it("preserves default ModalClientContent DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <ModalClientContent id="settings" aria-label="Settings" size="lg">
      Body
    </ModalClientContent>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
