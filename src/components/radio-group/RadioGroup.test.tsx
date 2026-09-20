import { fireEvent, render, screen } from "@testing-library/react";
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
      <RadioGroup id="plan" items={[{ value: "a", label: "Plan A", className: "uiify-radio" }]} />,
    );

    expect(screen.getByRole("radio", { name: "Plan A" }).className).toBe("uiify-radio");
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
