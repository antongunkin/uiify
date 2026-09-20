import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Skeleton } from "./Skeleton.js";

describe("Skeleton", () => {
  it("renders placeholder with aria-hidden when loading", () => {
    const { container } = render(<Skeleton loading data-testid="skel" />);
    const el = container.querySelector("[data-testid='skel']");
    expect(el?.getAttribute("aria-hidden")).toBe("true");
    expect(el?.getAttribute("data-state")).toBe("loading");
  });

  it("renders children when loading is false", () => {
    render(
      <Skeleton loading={false}>
        <span>Loaded content</span>
      </Skeleton>,
    );
    expect(screen.getByText("Loaded content")).toBeTruthy();
  });

  it("applies width and height as CSS custom properties", () => {
    const { container } = render(<Skeleton width={200} height="1rem" data-testid="skel" />);
    const el = container.querySelector("[data-testid='skel']") as HTMLElement;
    expect(el.style.getPropertyValue("--skeleton-w")).toBe("200px");
    expect(el.style.getPropertyValue("--skeleton-h")).toBe("1rem");
  });

  it("sets circle shape data attribute", () => {
    const { container } = render(<Skeleton circle data-testid="skel" />);
    expect(container.querySelector("[data-testid='skel']")?.getAttribute("data-shape")).toBe(
      "circle",
    );
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(<Skeleton width={100} height={20} />);
    expect(html).toContain('data-state="loading"');
  });

  it("owns aria-hidden, data-shape and data-state; consumer cannot override them", () => {
    const { container } = render(
      <Skeleton
        circle
        aria-hidden={false}
        data-shape="rect"
        data-state="idle"
        data-testid="skel"
      />,
    );
    const el = container.querySelector("[data-testid='skel']");
    expect(el?.getAttribute("aria-hidden")).toBe("true");
    expect(el?.getAttribute("data-shape")).toBe("circle");
    expect(el?.getAttribute("data-state")).toBe("loading");
  });

  it("joins consumer style with the owned CSS custom properties", () => {
    const { container } = render(
      <Skeleton width={200} height="1rem" style={{ color: "red" }} data-testid="skel" />,
    );
    const el = container.querySelector("[data-testid='skel']") as HTMLElement;
    expect(el.style.color).toBe("red");
    expect(el.style.getPropertyValue("--skeleton-w")).toBe("200px");
    expect(el.style.getPropertyValue("--skeleton-h")).toBe("1rem");
  });
});
