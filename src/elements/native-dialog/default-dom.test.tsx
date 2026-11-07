import { expect, it } from "vitest";
import { NativeDialog } from "./NativeDialog.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default NativeDialog DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <>
      <NativeDialog.Trigger target="dialog">Open</NativeDialog.Trigger>
      <NativeDialog.Content id="dialog" aria-label="Settings">
        Body<NativeDialog.Close target="dialog">Close</NativeDialog.Close>
      </NativeDialog.Content>
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
