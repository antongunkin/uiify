import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Avatar } from "./Avatar.js";
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
it("preserves default avatar DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <>
          <Avatar name="Ada" fallback="A" />
          <Avatar name="Ada" fallback="A" src="/ada.png" size="lg" />
        </>,
      ),
    ),
  ).toMatchSnapshot();
});
it("lets native props override avatar root, image and fallback defaults", () => {
  const { rerender } = render(
    <Avatar
      name="Ada"
      fallback="A"
      src="/ada.png"
      role={undefined}
      aria-label={undefined}
      data-uiify-avatar="custom"
      data-testid="root"
      slotProps={{ image: { src: "/consumer.png", alt: "Portrait", "data-part": undefined } }}
    />,
  );
  expect(screen.getByTestId("root").hasAttribute("role")).toBe(false);
  expect(screen.getByTestId("root").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByRole("img", { name: "Portrait" }).getAttribute("src")).toBe("/consumer.png");
  expect(screen.getByRole("img", { name: "Portrait" }).hasAttribute("data-part")).toBe(false);
  rerender(
    <Avatar
      name="Ada"
      fallback="A"
      slotProps={{ fallback: { "aria-hidden": false, "data-part": "initials" } }}
    />,
  );
  expect(screen.getByText("A").getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByText("A").getAttribute("data-part")).toBe("initials");
});
