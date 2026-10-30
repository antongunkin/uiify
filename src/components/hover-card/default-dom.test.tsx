import { expect, it } from "vitest";
import { HoverCard } from "./HoverCard.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";

it("preserves default HoverCard DOM", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <HoverCard.Root id="profile">
      <HoverCard.Trigger>Profile</HoverCard.Trigger>
      <HoverCard.Content side="top">Details</HoverCard.Content>
    </HoverCard.Root>,
  );
  expect(
    [...host.querySelectorAll("*")].map((element) => [
      element.localName,
      [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`).sort(),
      element.childElementCount === 0 ? element.textContent : null,
    ]),
  ).toMatchSnapshot();
});
