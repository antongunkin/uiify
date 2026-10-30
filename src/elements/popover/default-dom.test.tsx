import { expect, it } from "vitest";
import { Popover } from "./Popover.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default Popover DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <>
      <Popover.Trigger target="help">Help</Popover.Trigger>
      <Popover.Surface id="help">
        Body<Popover.Close target="help">Close</Popover.Close>
      </Popover.Surface>
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
