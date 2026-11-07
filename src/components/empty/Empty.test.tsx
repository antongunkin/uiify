import { createRef } from "react";
import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "./Empty.js";

describe("Empty", () => {
  it("renders its semantic composition with uiify classes", () => {
    render(
      <Empty data-testid="empty">
        <EmptyTitle data-testid="title">No projects</EmptyTitle>
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
    expect(empty.classList.contains("uiify-empty")).toBe(true);
    expect(empty.hasAttribute("data-uiify-empty")).toBe(false);
    expect(title.tagName).toBe("H2");
    expect(title.classList.contains("uiify-empty-title")).toBe(true);
    expect(title.hasAttribute("data-uiify-empty-title")).toBe(false);
    expect(title.hasAttribute("data-part")).toBe(false);
    expect(description.tagName).toBe("P");
    expect(description.classList.contains("uiify-empty-description")).toBe(true);
    expect(description.hasAttribute("data-uiify-empty-description")).toBe(false);
    expect(description.hasAttribute("data-part")).toBe(false);
    expect(content.tagName).toBe("DIV");
    expect(content.classList.contains("uiify-empty-content")).toBe(true);
    expect(content.hasAttribute("data-uiify-empty-content")).toBe(false);
    expect(content.hasAttribute("data-part")).toBe(false);
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
    expect(empty.className).toBe("uiify-empty empty-state");
    expect(empty.getAttribute("data-uiify-empty")).toBe("changed");
    expect((empty as HTMLElement).style.maxWidth).toBe("32rem");
    expect(ref.current).toBe(empty);
  });

  it("passes the part class to a custom renderer", () => {
    render(
      <EmptyTitle render={(props) => <h3 {...(props as ComponentProps<"h3">)}>No projects</h3>} />,
    );

    const title = screen.getByRole("heading", { level: 3, name: "No projects" });
    expect(title.classList.contains("uiify-empty-title")).toBe(true);
  });
});
