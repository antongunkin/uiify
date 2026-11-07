import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card.js";

describe("Card", () => {
  it("renders uiify-card on a plain content grouping", () => {
    render(<Card data-testid="card">Project details</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card.classList.contains("uiify-card")).toBe(true);
    expect(card.getAttribute("role")).toBeNull();
    expect(card.textContent).toBe("Project details");
  });

  it("does not render data-uiify-card", () => {
    render(<Card data-testid="card" />);
    expect(screen.getByTestId("card").hasAttribute("data-uiify-card")).toBe(false);
  });

  it("keeps native semantics selected by the consumer", () => {
    render(
      <Card as="article" aria-label="Project" className="project-card" data-record="kept">
        Build
      </Card>,
    );
    const card = screen.getByRole("article", { name: "Project" });
    expect(card.className).toBe("uiify-card project-card");
    expect(card.getAttribute("data-record")).toBe("kept");
    expect(card.textContent).toBe("Build");
  });

  it("writes data-size for sm only; default and unset render none", () => {
    render(
      <>
        <Card data-testid="sm" size="sm" />
        <Card data-testid="default" size="default" />
        <Card data-testid="unset" />
      </>,
    );
    expect(screen.getByTestId("sm").getAttribute("data-size")).toBe("sm");
    expect(screen.getByTestId("default").hasAttribute("data-size")).toBe(false);
    expect(screen.getByTestId("unset").hasAttribute("data-size")).toBe(false);
  });

  it("lets a consumer data-size replace the library value", () => {
    render(<Card data-testid="card" size="sm" data-size="custom" />);
    expect(screen.getByTestId("card").getAttribute("data-size")).toBe("custom");
  });
});

const parts = [
  ["CardHeader", CardHeader, "uiify-card-header"],
  ["CardTitle", CardTitle, "uiify-card-title"],
  ["CardDescription", CardDescription, "uiify-card-description"],
  ["CardAction", CardAction, "uiify-card-action"],
  ["CardContent", CardContent, "uiify-card-content"],
  ["CardFooter", CardFooter, "uiify-card-footer"],
] as const;

describe.each(parts)("%s", (_name, Part, identity) => {
  it("renders its class on a div by default", () => {
    render(<Part data-testid="part">Text</Part>);
    const part = screen.getByTestId("part");
    expect(part.tagName).toBe("DIV");
    expect(part.className).toBe(identity);
    expect(part.textContent).toBe("Text");
  });

  it("changes the element with as", () => {
    render(<Part as="section" data-testid="part" />);
    expect(screen.getByTestId("part").tagName).toBe("SECTION");
  });

  it("composes the consumer className and lets consumer props win", () => {
    render(<Part data-testid="part" className="extra" id="own" aria-hidden="true" />);
    const part = screen.getByTestId("part");
    expect(part.className).toBe(`${identity} extra`);
    expect(part.id).toBe("own");
    expect(part.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Card parts", () => {
  it("compose into a headed card", () => {
    render(
      <Card as="section" aria-labelledby="plan-title">
        <CardHeader>
          <CardTitle as="h2" id="plan-title">
            Team plan
          </CardTitle>
          <CardDescription as="p">Billed yearly.</CardDescription>
          <CardAction>Popular</CardAction>
        </CardHeader>
        <CardContent>$12 per seat a month.</CardContent>
        <CardFooter>Choose plan</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Team plan" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Team plan" })).toBeTruthy();
    expect(screen.getByText("Billed yearly.").tagName).toBe("P");
  });
});
