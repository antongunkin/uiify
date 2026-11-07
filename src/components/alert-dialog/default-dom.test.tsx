import { expect, it } from "vitest";
import { AlertDialog } from "./AlertDialog.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default AlertDialog DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <AlertDialog id="delete" trigger="Delete" title="Delete item" description="Cannot undo">
      Body
    </AlertDialog>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
