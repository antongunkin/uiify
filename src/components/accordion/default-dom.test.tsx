import { expect, it } from "vitest";
import { Accordion } from "./Accordion.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default Accordion DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <Accordion
      id="faq"
      defaultValue="a"
      items={[
        { value: "a", label: "A", panel: "Panel A" },
        { value: "b", label: "B", panel: "Panel B", disabled: true },
      ]}
    />,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
