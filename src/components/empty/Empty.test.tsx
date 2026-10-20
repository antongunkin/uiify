import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "./Empty.js";

describe("Empty", () => {
  it("renders its semantic composition with immutable anatomy markers", () => {
    render(
      <Empty data-testid="empty" data-uiify-empty="consumer">
        <EmptyTitle data-testid="title" data-part="consumer">
          No projects
        </EmptyTitle>
        <EmptyDescription data-testid="description">Create one to begin.</EmptyDescription>
        <EmptyContent data-testid="content">
          <a href="#create">Create a project</a>
        </EmptyContent>
      </Empty>,
    );

    const empty = screen.getByTestId("empty");
    const title = screen.getByTestId("title");
    const description = screen.getByTestId("description");
    const content = screen.getByTestId("content");
    expect(empty.tagName).toBe("SECTION");
    expect(empty.getAttribute("data-uiify-empty")).toBe("");
    expect(title.tagName).toBe("H2");
    expect(title.getAttribute("data-uiify-empty-title")).toBe("");
    expect(title.getAttribute("data-part")).toBe("title");
    expect(description.tagName).toBe("P");
    expect(description.getAttribute("data-uiify-empty-description")).toBe("");
    expect(description.getAttribute("data-part")).toBe("description");
    expect(content.tagName).toBe("DIV");
    expect(content.getAttribute("data-uiify-empty-content")).toBe("");
    expect(content.getAttribute("data-part")).toBe("content");
    expect(screen.getByRole("link", { name: "Create a project" }).getAttribute("href")).toBe(
      "#create",
    );
  });

  it("forwards consumer props and refs through the render element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Empty
        as="article"
        className="empty-state"
        data-testid="custom-empty"
        data-uiify-empty="changed"
        ref={ref}
        style={{ maxWidth: "32rem" }}
      >
        Nothing here
      </Empty>,
    );

    const empty = screen.getByTestId("custom-empty");
    expect(empty.tagName).toBe("ARTICLE");
    expect(empty.className).toBe("empty-state");
    expect(empty.getAttribute("data-uiify-empty")).toBe("");
    expect((empty as HTMLElement).style.maxWidth).toBe("32rem");
    expect(ref.current).toBe(empty);
  });
});
