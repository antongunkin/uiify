import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { RadioGroup } from "./RadioGroup.js";

describe("RadioGroup", () => {
  it("renders one native radio per data item", () => {
    render(
      <RadioGroup
        id="plan"
        defaultValue="a"
        items={[
          { value: "a", label: "Plan A" },
          { value: "b", label: "Plan B" },
        ]}
      />,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect((screen.getByRole("radio", { name: "Plan A" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "Plan B" }) as HTMLInputElement).checked).toBe(false);
  });

  it("applies each item styling hook to its native radio", () => {
    render(
      <RadioGroup id="plan" items={[{ value: "a", label: "Plan A", className: "custom-radio" }]} />,
    );

    expect(screen.getByRole("radio", { name: "Plan A" }).className).toBe("custom-radio");
  });

  it("forwards slot props to the matching item parts and root", () => {
    const rootRef = createRef<HTMLDivElement>();
    render(
      <RadioGroup
        id="plan"
        title="Plans"
        data-testid="plans"
        ref={rootRef}
        items={[
          { value: "a", label: "Plan A" },
          { value: "b", label: "Plan B" },
        ]}
        slotProps={
          {
            item: {
              className: "item-base",
              byItemValue: { b: { "data-testid": "item-b", "data-part": "bad" } },
            },
            input: {
              className: "input-base",
              byItemValue: {
                b: { className: "input-specific", "data-testid": "input-b", "data-part": "bad" },
              },
            },
            label: { byItemValue: { b: { title: "Plan B label" } } },
          } as never
        }
      />,
    );

    expect(screen.getByTestId("plans").getAttribute("title")).toBe("Plans");
    expect(rootRef.current).toBe(screen.getByTestId("plans"));
    expect(screen.getByTestId("item-b").className).toContain("item-base");
    expect(screen.getByTestId("item-b").getAttribute("data-part")).toBe("item");
    expect(screen.getByTestId("input-b").getAttribute("data-part")).toBe("control");
    expect(screen.getByTestId("input-b").className).toBe("input-base input-specific");
    expect(screen.getByRole("radio", { name: "Plan B" }).getAttribute("data-part")).toBe("control");
    expect(screen.getByText("Plan B").closest("label")?.getAttribute("title")).toBe("Plan B label");
  });

  it("lets the browser own selection without React state", () => {
    render(
      <RadioGroup
        id="plan"
        items={[
          { value: "a", label: "Plan A" },
          { value: "b", label: "Plan B" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Plan B" }));

    expect((screen.getByRole("radio", { name: "Plan B" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "Plan A" }) as HTMLInputElement).checked).toBe(false);
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <RadioGroup id="plan" defaultValue="a" items={[{ value: "a", label: "Plan A" }]} />,
    );
    expect(markup).toContain('name="plan"');
  });
});
