import { expect, it } from "vitest";
import { DialogClientContent } from "./DialogClientContent.js";
import { renderToStaticMarkup } from "../../test-utils/ssr.js";

it("preserves default DialogClientContent DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <DialogClientContent id="settings" aria-label="Settings" size="lg">
      Body
    </DialogClientContent>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
