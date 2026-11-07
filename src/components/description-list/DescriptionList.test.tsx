import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "./DescriptionList.js";

describe("DescriptionList", () => {
  it("renders UIify identity classes without default identity markers", () => {
    render(
      <DescriptionList className="consumer-list" data-testid="list">
        <DescriptionTerm className="consumer-term" data-testid="term">
          Status
        </DescriptionTerm>
        <DescriptionDetails className="consumer-details" data-testid="details">
          Active
        </DescriptionDetails>
      </DescriptionList>,
    );

    expect(screen.getByTestId("list").classList.contains("uiify-description-list")).toBe(true);
    expect(screen.getByTestId("list").classList.contains("consumer-list")).toBe(true);
    expect(screen.getByTestId("term").classList.contains("uiify-description-list-term")).toBe(true);
    expect(screen.getByTestId("term").classList.contains("consumer-term")).toBe(true);
    expect(screen.getByTestId("details").classList.contains("uiify-description-list-details")).toBe(
      true,
    );
    expect(screen.getByTestId("details").classList.contains("consumer-details")).toBe(true);
    for (const element of [
      screen.getByTestId("list"),
      screen.getByTestId("term"),
      screen.getByTestId("details"),
    ]) {
      expect(element.hasAttribute("data-uiify-description-list")).toBe(false);
      expect(element.hasAttribute("data-uiify-description-term")).toBe(false);
      expect(element.hasAttribute("data-uiify-description-details")).toBe(false);
      expect(element.hasAttribute("data-part")).toBe(false);
    }
  });

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
    expect(list.getAttribute("data-uiify-description-list")).toBe("consumer");
    expect(screen.getByTestId("term").tagName).toBe("DT");
    expect(screen.getByTestId("term").hasAttribute("data-uiify-description-term")).toBe(false);
    expect(screen.getByTestId("term").getAttribute("data-part")).toBe("consumer");
    expect(screen.getByTestId("details").tagName).toBe("DD");
    expect(screen.getByTestId("details").hasAttribute("data-uiify-description-details")).toBe(
      false,
    );
    expect(screen.getByTestId("details").hasAttribute("data-part")).toBe(false);
    expect(list.textContent).toBe("StatusActiveOwnerMina Chen");
  });
});
