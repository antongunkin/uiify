import { expect, it } from "vitest";
import { NativePopover } from "./NativePopover.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default NativePopover DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <>
      <NativePopover.Trigger target="help">Help</NativePopover.Trigger>
      <NativePopover.Surface id="help">
        Body<NativePopover.Close target="help">Close</NativePopover.Close>
      </NativePopover.Surface>
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
