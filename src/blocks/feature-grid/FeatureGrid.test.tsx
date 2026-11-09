// FeatureGrid: a labelled section with a list of feature cards, valid as server HTML.
import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../../components/test-utils/ssr.js";
import { Feature, FeatureGrid } from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "feature-grid.html");
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

function Features() {
  return (
    <FeatureGrid
      id="features"
      title="Why teams switch"
      description="Three things you get on day one."
    >
      <Feature
        title="Works before hydration"
        description="Native elements respond at first paint."
      />
      <Feature
        title="One vocabulary"
        description="Screens use the same parts."
        media={<span aria-hidden="true">◆</span>}
      />
      <Feature title="Your design system" />
    </FeatureGrid>
  );
}
Features.displayName = "Features";

it("labels the section by its heading and lists one card per feature with a level-3 heading", () => {
  render(<Features />);
  const section = screen.getByRole("region", { name: "Why teams switch" });
  expect(section.className).toContain("uiify-feature-grid");
  const list = section.querySelector(".uiify-feature-grid-list")!;
  expect(list.tagName).toBe("UL");
  const items = [...list.children] as HTMLElement[];
  expect(items.map((item) => item.tagName)).toEqual(["LI", "LI", "LI"]);
  // The list wraps each feature card in its own item.
  expect(items.every((item) => item.classList.contains("uiify-feature-grid-item"))).toBe(true);
  expect(items.every((item) => item.firstElementChild?.classList.contains("uiify-card"))).toBe(
    true,
  );
  expect(
    within(items[0]!).getByRole("heading", { level: 3, name: "Works before hydration" }),
  ).toBeTruthy();
  expect(within(items[0]!).getByText("Native elements respond at first paint.").tagName).toBe("P");
  expect(items[2]!.querySelector("p")).toBeNull();
});

it("puts media before the heading", () => {
  render(<Features />);
  const heading = screen.getByRole("heading", { name: "One vocabulary" });
  const media = screen.getByText("◆");
  expect(media.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

it("has no heading or labelling without a title, and fits columns to the count, at most three", () => {
  const columnsOf = (count: number) => {
    const { container, unmount } = render(
      <FeatureGrid>
        {Array.from({ length: count }, (_, index) => (
          <Feature key={index} title={`Feature ${index}`} />
        ))}
      </FeatureGrid>,
    );
    const section = container.querySelector("section")!;
    expect(section.hasAttribute("aria-labelledby")).toBe(false);
    expect(section.querySelector("h2")).toBeNull();
    const value = container.querySelector("ul")!.getAttribute("data-md-columns");
    unmount();
    return value;
  };
  expect(columnsOf(2)).toBe("2");
  expect(columnsOf(3)).toBe("3");
  expect(columnsOf(5)).toBe("3");
});

it("lets consumer root and slot props win and composes className and ref", () => {
  const ref = createRef<HTMLElement>();
  const itemRef = createRef<HTMLDivElement>();
  render(
    <FeatureGrid
      ref={ref}
      id="f"
      title="Features"
      className="custom"
      level={3}
      columns={{ base: 1, lg: 4 }}
      slotProps={{ list: { "aria-label": "Feature list" }, title: { id: "own-title" } }}
    >
      <Feature
        ref={itemRef}
        title="Fast"
        level={4}
        className="item"
        slotProps={{ description: { id: "d" } }}
        description="Quick."
      />
    </FeatureGrid>,
  );
  const section = ref.current!;
  expect(section.className).toContain("custom");
  expect(section.getAttribute("aria-labelledby")).toBe("own-title");
  expect(screen.getByRole("heading", { level: 3, name: "Features" }).id).toBe("own-title");
  expect(screen.getByRole("heading", { level: 4, name: "Fast" })).toBeTruthy();
  const list = screen.getByRole("list", { name: "Feature list" });
  expect(list.getAttribute("data-lg-columns")).toBe("4");
  expect(itemRef.current?.className).toContain("item");
  expect(document.getElementById("d")?.textContent).toBe("Quick.");
});

it("keeps a feature valid outside FeatureGrid: a card, not a list item (live run M5 pilot)", async () => {
  const markup = renderToStaticMarkup(
    <div>
      <Feature title="Works offline" description="Write without a connection." />
      <Feature title="Sync everywhere" />
    </div>,
  );
  expect(markup).not.toContain("<li");
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  expect(report.results.flatMap((result) => result.messages.map((m) => m.ruleId))).toEqual([]);
});

it("passes html-validate as server HTML", async () => {
  const markup = renderToStaticMarkup(<Features />);
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  const messages = report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
  expect(messages).toEqual([]);
});
