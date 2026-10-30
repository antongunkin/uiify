import { expect, it } from "vitest";
import { Tooltip } from "./Tooltip.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default Tooltip DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <Tooltip.Provider>
      <Tooltip.Root id="hint">
        <Tooltip.Trigger>Help</Tooltip.Trigger>
        <Tooltip.Content side="top">Hint</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
