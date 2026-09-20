import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stepper } from "./Stepper.js";

describe("Stepper", () => {
  it("renders one native control and panel per step", () => {
    render(
      <Stepper
        defaultValue="shipping"
        id="checkout"
        items={[
          { value: "shipping", label: "Shipping", panel: <>Shipping panel</>, complete: true },
          { value: "payment", label: "Payment", panel: <>Payment panel</> },
        ]}
      />,
    );
    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(2);
    expect(screen.getByLabelText("Shipping")).toBeTruthy();
    expect(document.getElementById("checkout-panel-shipping")).toBeTruthy();
  });
});
