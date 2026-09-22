import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Accordion } from "./Accordion.js";

const items = [
  { value: "shipping", label: "Shipping", panel: <>Ships in 2-3 days.</> },
  { value: "returns", label: "Returns", panel: <>30-day window.</> },
];

describe("Accordion", () => {
  it("renders a details/summary pair per item, no input", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue="shipping" id="faq" items={items} type="single" />,
    );
    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).not.toContain("<input");
  });

  it("keeps the component identity on the root, not on each item", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue="shipping" id="faq" items={items} type="single" />,
    );
    expect(markup.match(/data-uiify-accordion=""/g)).toHaveLength(1);
    expect(markup).not.toContain('data-part="item" data-uiify-accordion=""');
  });

  it("sets a shared name on every item for type=single, enabling exclusivity", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue="shipping" id="faq" items={items} type="single" />,
    );
    const nameCount = markup.match(/name="faq"/g)?.length ?? 0;
    expect(nameCount).toBe(2);
  });

  it("omits the name attribute entirely for type=multiple", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue={["shipping"]} id="faq" items={items} type="multiple" />,
    );
    expect(markup).not.toContain("name=");
  });

  it("marks the matching item open for type=single", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue="shipping" id="faq" items={items} type="single" />,
    );
    const openCount = markup.match(/open=""/g)?.length ?? 0;
    expect(openCount).toBe(1);
  });

  it("marks every listed item open for type=multiple", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue={["shipping", "returns"]} id="faq" items={items} type="multiple" />,
    );
    const openCount = markup.match(/open=""/g)?.length ?? 0;
    expect(openCount).toBe(2);
  });

  it("marks a disabled item's summary aria-disabled and unfocusable, not the input", () => {
    const markup = renderToStaticMarkup(
      <Accordion
        id="faq"
        items={[{ value: "shipping", label: "Shipping", disabled: true, panel: <>Panel</> }]}
        type="single"
      />,
    );
    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('tabindex="-1"');
  });

  it("does not disable a non-disabled item's summary", () => {
    const markup = renderToStaticMarkup(
      <Accordion defaultValue="shipping" id="faq" items={items} type="single" />,
    );
    expect(markup).not.toContain("aria-disabled");
    expect(markup).not.toContain("tabindex");
  });
});
