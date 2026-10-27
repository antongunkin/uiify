import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Accordion } from "./Accordion.js";
import type { AccordionProps } from "./types.js";

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

  it("forwards root props and per-slot props to their corresponding nodes", () => {
    const markup = renderToStaticMarkup(
      <Accordion
        data-testid="faq-root"
        id="faq"
        items={items}
        slotProps={{
          item: {
            className: "item-base",
            style: { color: "red" },
            byItemValue: {
              shipping: {
                className: "shipping-item",
                style: { backgroundColor: "blue" },
                "data-testid": "shipping",
              },
            },
          },
          trigger: { className: "trigger", "data-testid": "faq-trigger" },
          panel: { className: "panel", "aria-label": "answer" },
        }}
        style={{ color: "red" }}
        title="Frequently asked questions"
      />,
    );

    expect(markup).toContain('id="faq"');
    expect(markup).toContain('data-testid="faq-root"');
    expect(markup).toContain('style="color:red"');
    expect(markup).toContain('title="Frequently asked questions"');
    expect(markup).toContain('class="item-base shipping-item"');
    expect(markup).toContain('style="color:red;background-color:blue"');
    expect(markup).toContain('data-testid="shipping"');
    expect(markup).toContain('class="trigger"');
    expect(markup).toContain('data-testid="faq-trigger"');
    expect(markup).toContain('class="panel"');
    expect(markup).toContain('aria-label="answer"');
  });

  it("keeps per-item slot classes, refs, and events attached by value after reordering", () => {
    const shippingRef = createRef<HTMLDetailsElement>();
    const returnsRef = createRef<HTMLDetailsElement>();
    const onShippingToggle = vi.fn();
    const onReturnsToggle = vi.fn();
    const slotProps = {
      item: {
        byItemValue: {
          shipping: {
            className: "shipping-item",
            ref: shippingRef,
            onToggle: onShippingToggle,
            "data-testid": "shipping-item",
          },
          returns: {
            className: "returns-item",
            ref: returnsRef,
            onToggle: onReturnsToggle,
            "data-testid": "returns-item",
          },
        },
      },
    };
    const view = render(<Accordion id="faq" items={items} slotProps={slotProps} />);

    expect(screen.getByTestId("shipping-item").className).toContain("shipping-item");
    expect(screen.getByTestId("returns-item").className).toContain("returns-item");
    expect(shippingRef.current).toBe(screen.getByTestId("shipping-item"));
    expect(returnsRef.current).toBe(screen.getByTestId("returns-item"));
    fireEvent(screen.getByTestId("shipping-item"), new Event("toggle"));
    expect(onShippingToggle).toHaveBeenCalledOnce();
    expect(onReturnsToggle).not.toHaveBeenCalled();

    view.rerender(<Accordion id="faq" items={[...items].reverse()} slotProps={slotProps} />);

    expect(screen.getByTestId("shipping-item").className).toContain("shipping-item");
    expect(screen.getByTestId("returns-item").className).toContain("returns-item");
    expect(shippingRef.current).toBe(screen.getByTestId("shipping-item"));
    expect(returnsRef.current).toBe(screen.getByTestId("returns-item"));
  });

  it("filters state and group props from untyped slot values", () => {
    const unsafeProps = {
      id: "faq",
      items,
      children: "untrusted child",
      dangerouslySetInnerHTML: { __html: "untrusted html" },
      type: "multiple",
      slotProps: {
        item: {
          open: true,
          name: "wrong-common",
          byItemValue: { shipping: { open: true, name: "wrong-item" } },
        },
      },
    } as unknown as AccordionProps;
    const markup = renderToStaticMarkup(<Accordion {...unsafeProps} />);

    expect(markup).not.toContain(" name=");
    expect(markup).not.toContain(" open=");
    expect(markup).not.toContain("untrusted");
  });
});
