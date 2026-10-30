import { expect, it } from "vitest";
import { AlertModal } from "./AlertModal.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default AlertModal DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <AlertModal id="delete" trigger="Delete" title="Delete item" description="Cannot undo">
      Body
    </AlertModal>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
