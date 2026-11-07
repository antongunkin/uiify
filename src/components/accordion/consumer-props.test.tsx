import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./index.js";

it("composes Accordion className, style and ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<Accordion ref={ref} className="custom" style={{ gap: 4 }} title="FAQ" />);
  expect(ref.current?.className).toBe("uiify-accordion custom");
  expect(ref.current?.style.gap).toBe("4px");
  expect(ref.current?.getAttribute("title")).toBe("FAQ");
});

it("lets AccordionItem native props replace open and data-value and composes the rest", () => {
  const ref = createRef<HTMLDetailsElement>();
  const onToggle = vi.fn();
  render(
    <AccordionItem
      ref={ref}
      value="shipping"
      data-value="custom"
      defaultOpen
      open={false}
      className="custom"
      data-testid="item"
      onToggle={onToggle}
    />,
  );
  const item = screen.getByTestId("item");
  expect(ref.current).toBe(item);
  expect(item.hasAttribute("open")).toBe(false);
  expect(item.getAttribute("data-value")).toBe("custom");
  expect(item.className).toBe("uiify-native-details uiify-accordion-item custom");
  fireEvent(item, new Event("toggle"));
  expect(onToggle).toHaveBeenCalledOnce();
});

it("lets AccordionTrigger consumer ARIA and tabIndex replace the disabled defaults", () => {
  const ref = createRef<HTMLElement>();
  render(
    <AccordionTrigger
      ref={ref}
      disabled
      aria-disabled={false}
      tabIndex={0}
      className="custom"
      data-testid="trigger"
    >
      Shipping
    </AccordionTrigger>,
  );
  const trigger = screen.getByTestId("trigger");
  expect(ref.current).toBe(trigger);
  expect(trigger.getAttribute("aria-disabled")).toBe("false");
  expect(trigger.tabIndex).toBe(0);
  expect(trigger.className).toBe("uiify-accordion-trigger custom");
});

it("composes AccordionContent className and forwards native props", () => {
  render(
    <AccordionContent className="custom" aria-label="Answer" data-testid="content">
      Body
    </AccordionContent>,
  );
  const content = screen.getByTestId("content");
  expect(content.className).toBe("uiify-accordion-content custom");
  expect(content.getAttribute("aria-label")).toBe("Answer");
});
