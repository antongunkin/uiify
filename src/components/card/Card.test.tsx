import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card.js";

describe("Card", () => {
  it("renders a plain content grouping with its owned marker", () => {
    render(<Card data-testid="card">Project details</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card.getAttribute("data-uiify-card")).toBe("");
    expect(card.getAttribute("role")).toBeNull();
    expect(card.textContent).toBe("Project details");
  });

  it("keeps native semantics selected by the consumer", () => {
    render(
      <Card
        as="article"
        aria-label="Project"
        className="project-card"
        data-uiify-card="changed"
        data-record="kept"
      >
        Build
      </Card>,
    );
    const card = screen.getByRole("article", { name: "Project" });
    expect(card.getAttribute("data-uiify-card")).toBe("");
    expect(card.className).toBe("project-card");
    expect(card.getAttribute("data-record")).toBe("kept");
    expect(card.textContent).toBe("Build");
  });
});
