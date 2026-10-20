import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Fieldset, FieldsetLegend } from "./Fieldset.js";

describe("Fieldset", () => {
  it("renders a native fieldset with a first-child legend and labeled controls", () => {
    render(
      <Fieldset aria-label="Contact preferences">
        <FieldsetLegend>Contact preferences</FieldsetLegend>
        <label>
          <input type="checkbox" name="email" /> Email
        </label>
        <label>
          <input type="checkbox" name="sms" /> Text message
        </label>
      </Fieldset>,
    );

    const group = screen.getByRole("group", { name: "Contact preferences" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group.firstElementChild?.tagName).toBe("LEGEND");
    expect(group.getAttribute("data-uiify-fieldset")).toBe("");
    expect(group.getAttribute("data-part")).toBe("root");
    expect(group.querySelector('[data-part="legend"]')?.textContent).toBe("Contact preferences");
    expect(screen.getByLabelText("Email").getAttribute("name")).toBe("email");
    expect(screen.getByLabelText("Text message").getAttribute("name")).toBe("sms");
  });

  it("forwards native props, styling, data, and refs while keeping markers immutable", () => {
    const fieldsetRef = vi.fn();
    const legendRef = vi.fn();
    render(
      <Fieldset
        ref={fieldsetRef}
        className="consumer-fieldset"
        style={{ marginBlock: "1rem" }}
        data-layout="compact"
        data-uiify-fieldset="consumer"
        data-part="consumer"
      >
        <FieldsetLegend ref={legendRef} data-part="consumer-legend">
          Options
        </FieldsetLegend>
      </Fieldset>,
    );

    const fieldset = screen.getByRole("group", { name: "Options" });
    const legend = screen.getByText("Options");
    expect(fieldset.className).toBe("consumer-fieldset");
    expect(fieldset.style.marginBlock).toBe("1rem");
    expect(fieldset.getAttribute("data-layout")).toBe("compact");
    expect(fieldset.getAttribute("data-uiify-fieldset")).toBe("");
    expect(fieldset.getAttribute("data-part")).toBe("root");
    expect(legend.getAttribute("data-part")).toBe("legend");
    expect(legend.getAttribute("data-uiify-fieldset-legend")).toBe("");
    expect(fieldsetRef).toHaveBeenCalledWith(fieldset);
    expect(legendRef).toHaveBeenCalledWith(legend);
  });
});
