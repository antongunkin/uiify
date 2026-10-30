import { expect, it } from "vitest";
import { Dialog } from "./Dialog.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default Dialog DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <>
      <Dialog.Trigger target="dialog">Open</Dialog.Trigger>
      <Dialog.Content id="dialog" aria-label="Settings">
        Body<Dialog.Close target="dialog">Close</Dialog.Close>
      </Dialog.Content>
    </>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
