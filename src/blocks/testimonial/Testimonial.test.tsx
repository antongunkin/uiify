// Testimonial: figure > blockquote + figcaption keeps a quote with its speaker, valid as server HTML.
import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { Avatar } from "../../components/avatar/index.js";
import { renderToStaticMarkup } from "../../components/test-utils/ssr.js";
import { Testimonial } from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "testimonial.html");
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

function Quote() {
  return (
    <Testimonial
      quote="Inkwell is where every idea I have ends up."
      name="Maya Chen"
      byline="Designer at Northwind"
      cite="https://example.com/review"
      avatar={<Avatar aria-hidden="true" fallback="MC" name="Maya Chen" size="sm" />}
    />
  );
}
Quote.displayName = "Quote";

it("puts the quote in a blockquote and the speaker in the figcaption of one figure", () => {
  const { container } = render(<Quote />);
  const figure = container.querySelector("figure")!;
  expect(figure.className).toContain("uiify-testimonial");
  expect(figure.classList.contains("uiify-card")).toBe(false);
  const quote = figure.querySelector("blockquote")!;
  expect(quote.textContent).toBe("Inkwell is where every idea I have ends up.");
  expect(quote.getAttribute("cite")).toBe("https://example.com/review");
  const caption = figure.querySelector("figcaption")!;
  expect(caption.textContent).toContain("Maya Chen");
  expect(caption.textContent).toContain("Designer at Northwind");
  expect(screen.getByRole("figure").contains(caption)).toBe(true);
});

it("draws a card with variant card and leaves out the byline, avatar and cite when not given", () => {
  const { container } = render(<Testimonial variant="card" quote="Fast setup." name="Tom" />);
  const figure = container.querySelector("figure")!;
  expect(figure.classList.contains("uiify-card")).toBe(true);
  expect(figure.querySelector("blockquote")?.hasAttribute("cite")).toBe(false);
  expect(figure.querySelector("figcaption")?.textContent).toBe("Tom");
  expect(figure.querySelector(".uiify-avatar")).toBeNull();
});

it("lets consumer root and slot props win and composes className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(
    <Testimonial
      ref={ref}
      quote="Great."
      name="Ana"
      byline="CTO"
      className="custom"
      aria-label="Customer quote"
      slotProps={{ quote: { className: "q", lang: "en" }, byline: { id: "byline" } }}
    />,
  );
  const figure = ref.current!;
  expect(figure.className).toContain("uiify-testimonial");
  expect(figure.className).toContain("custom");
  expect(screen.getByRole("figure", { name: "Customer quote" })).toBe(figure);
  const quote = figure.querySelector("blockquote")!;
  expect(quote.className).toContain("uiify-testimonial-body");
  expect(quote.className).toContain("q");
  expect(quote.getAttribute("lang")).toBe("en");
  expect(document.getElementById("byline")?.textContent).toBe("CTO");
});

it("passes html-validate as server HTML in both variants", async () => {
  const markup =
    renderToStaticMarkup(<Quote />) +
    renderToStaticMarkup(
      <Testimonial variant="card" quote="Fast setup." name="Tom" byline="Founder" />,
    );
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  const messages = report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
  expect(messages).toEqual([]);
});
