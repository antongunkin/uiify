import type { CSSProperties } from "react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { AspectRatio } from "./AspectRatio.js";
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}
it("preserves default aspect-ratio DOM", () => {
  expect(
    outline(renderToStaticMarkup(<AspectRatio ratio={1.5}>Media</AspectRatio>)),
  ).toMatchSnapshot();
});
it("lets native props and consumer styles override aspect ratio defaults", () => {
  render(
    <AspectRatio
      ratio={2}
      data-uiify-aspect-ratio={undefined}
      data-testid="root"
      style={{ "--uiify-aspect-ratio": 3 } as CSSProperties}
      slotProps={{ content: { "data-part": "media", "data-testid": "content" } }}
    >
      Media
    </AspectRatio>,
  );
  expect(screen.getByTestId("root").hasAttribute("data-uiify-aspect-ratio")).toBe(false);
  expect(screen.getByTestId("root").style.getPropertyValue("--uiify-aspect-ratio")).toBe("3");
  expect(screen.getByTestId("content").getAttribute("data-part")).toBe("media");
});
