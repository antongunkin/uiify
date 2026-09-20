import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion.js";

describe("Accordion (client)", () => {
  it("renders the prop-driven single accordion from the client entry", () => {
    render(
      <Accordion
        defaultValue="a"
        id="faq"
        items={[
          { value: "a", label: "A", panel: <>A content</> },
          { value: "b", label: "B", panel: <>B content</> },
        ]}
        type="single"
      />,
    );

    expect(document.querySelectorAll("details")).toHaveLength(2);
    const itemA = screen.getByText("A").closest("details");
    expect(itemA?.hasAttribute("open")).toBe(true);
    const itemB = screen.getByText("B").closest("details");
    expect(itemB?.hasAttribute("open")).toBe(false);
  });

  it("marks every listed item open for multiple mode from the client entry", () => {
    render(
      <Accordion
        defaultValue={["a", "b"]}
        id="faq"
        items={[
          { value: "a", label: "A", panel: <>A content</> },
          { value: "b", label: "B", panel: <>B content</> },
        ]}
        type="multiple"
      />,
    );

    expect(screen.getByText("A").closest("details")?.hasAttribute("open")).toBe(true);
    expect(screen.getByText("B").closest("details")?.hasAttribute("open")).toBe(true);
  });
});
