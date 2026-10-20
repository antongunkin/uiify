import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "./DescriptionList.js";

describe("DescriptionList", () => {
  it("renders native description-list semantics in consumer source order", () => {
    render(
      <DescriptionList data-testid="list" data-uiify-description-list="consumer">
        <DescriptionTerm data-testid="term" data-part="consumer">
          Status
        </DescriptionTerm>
        <DescriptionDetails data-testid="details">Active</DescriptionDetails>
        <DescriptionTerm>Owner</DescriptionTerm>
        <DescriptionDetails>Mina Chen</DescriptionDetails>
      </DescriptionList>,
    );

    const list = screen.getByTestId("list");
    expect(list.tagName).toBe("DL");
    expect(list.getAttribute("data-uiify-description-list")).toBe("");
    expect(screen.getByTestId("term").tagName).toBe("DT");
    expect(screen.getByTestId("term").getAttribute("data-uiify-description-term")).toBe("");
    expect(screen.getByTestId("term").getAttribute("data-part")).toBe("term");
    expect(screen.getByTestId("details").tagName).toBe("DD");
    expect(screen.getByTestId("details").getAttribute("data-uiify-description-details")).toBe("");
    expect(screen.getByTestId("details").getAttribute("data-part")).toBe("details");
    expect(list.textContent).toBe("StatusActiveOwnerMina Chen");
  });
});
