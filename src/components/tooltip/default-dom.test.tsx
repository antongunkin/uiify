import { expect, it } from "vitest";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default Tooltip DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <TooltipProvider>
      <Tooltip id="hint">
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent side="top">Hint</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
