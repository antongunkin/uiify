import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Breadcrumb } from "./Breadcrumb.js";
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

it("preserves default breadcrumb DOM", () => {
  expect(
    outline(
      renderToStaticMarkup(
        <Breadcrumb.Root>
          <Breadcrumb.List
            items={[
              { key: "a", label: "A", href: "/a" },
              { key: "b", label: "B", href: "/b" },
              { key: "c", label: "C", current: true },
            ]}
            maxItems={2}
            separator={<Breadcrumb.Separator />}
          />
        </Breadcrumb.Root>,
      ),
    ),
  ).toMatchSnapshot();
});

it("lets native breadcrumb props replace defaults on direct and generated parts", () => {
  render(
    <Breadcrumb.Root aria-label={undefined} data-uiify-breadcrumb="custom">
      <Breadcrumb.List
        items={[
          { key: "a", label: "A", href: "/a" },
          { key: "b", label: "B", current: true },
        ]}
        data-part="trail"
        slotProps={{
          item: { "data-part": "entry" },
          link: {
            href: "/elsewhere",
            "aria-current": "step",
            "data-current": "custom",
            "data-part": undefined,
          },
        }}
      />
    </Breadcrumb.Root>,
  );
  expect(screen.getByRole("navigation").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByRole("list").getAttribute("data-part")).toBe("trail");
  expect(screen.getAllByRole("listitem")[0]?.getAttribute("data-part")).toBe("entry");
  expect(screen.getByText("B").getAttribute("href")).toBe("/elsewhere");
  expect(screen.getByText("B").getAttribute("aria-current")).toBe("step");
  expect(screen.getByText("B").hasAttribute("data-part")).toBe(false);
});
