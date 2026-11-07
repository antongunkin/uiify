import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./index.js";

/** Elements and attributes in document order; attributes sorted so source order cannot matter. */
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) => {
    const attributes = [...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort();
    return `${element.localName} ${attributes.join(" ")}`.trim();
  });
}

describe("Accordion", () => {
  it("renders a plain div root with the identity class", () => {
    render(<Accordion data-testid="faq" />);
    const root = screen.getByTestId("faq");
    expect(root.localName).toBe("div");
    expect(root.className).toBe("uiify-accordion");
    expect([...root.attributes].map(({ name }) => name).sort()).toEqual(["class", "data-testid"]);
  });
});

describe("AccordionItem", () => {
  it("renders a closed native details with data-value and no name by default", () => {
    expect(outline(renderToStaticMarkup(<AccordionItem value="shipping" />))).toEqual([
      'details class="uiify-native-details uiify-accordion-item" data-value="shipping"',
    ]);
  });

  it("writes name for single-open groups and open for defaultOpen", () => {
    expect(
      outline(renderToStaticMarkup(<AccordionItem value="shipping" name="faq" defaultOpen />)),
    ).toEqual([
      'details class="uiify-native-details uiify-accordion-item" data-value="shipping" name="faq" open=""',
    ]);
  });
});

describe("AccordionTrigger", () => {
  it("renders a summary with the trigger class", () => {
    expect(outline(renderToStaticMarkup(<AccordionTrigger>Shipping</AccordionTrigger>))).toEqual([
      'summary class="uiify-accordion-trigger"',
    ]);
  });

  it("marks a disabled summary aria-disabled and unfocusable", () => {
    expect(
      outline(renderToStaticMarkup(<AccordionTrigger disabled>Shipping</AccordionTrigger>)),
    ).toEqual(['summary aria-disabled="true" class="uiify-accordion-trigger" tabindex="-1"']);
  });
});

describe("AccordionContent", () => {
  it("renders a div with the content class", () => {
    expect(outline(renderToStaticMarkup(<AccordionContent>Body</AccordionContent>))).toEqual([
      'div class="uiify-accordion-content"',
    ]);
  });
});

describe("Accordion composition", () => {
  it("renders summary then content inside each details", () => {
    const markup = renderToStaticMarkup(
      <Accordion>
        <AccordionItem value="shipping" name="faq" defaultOpen>
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionContent>Ships in 2-3 days.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns" name="faq">
          <AccordionTrigger>Returns</AccordionTrigger>
          <AccordionContent>30-day window.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const host = document.createElement("div");
    host.innerHTML = markup;
    const items = host.querySelectorAll(".uiify-accordion > details");
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect([...item.children].map((child) => child.localName)).toEqual(["summary", "div"]);
      expect(item.getAttribute("name")).toBe("faq");
    }
    expect(markup).not.toContain("<input");
  });
});
