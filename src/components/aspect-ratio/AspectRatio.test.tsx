import { createElement } from "react";
import type { CSSProperties } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { AspectRatio } from "./AspectRatio.js";

describe("AspectRatio", () => {
  it("renders exactly two wrappers around its children", () => {
    const { container } = render(
      <AspectRatio>
        <img alt="Mountain landscape" src="mountains.svg" />
      </AspectRatio>,
    );
    const root = container.firstElementChild;
    expect(root?.getAttribute("data-uiify-aspect-ratio")).toBe("");
    expect(root?.children).toHaveLength(1);
    const content = root?.firstElementChild;
    expect(content?.tagName).toBe("DIV");
    expect(content?.getAttribute("data-part")).toBe("content");
    expect(content?.children).toHaveLength(1);
    expect(content?.firstElementChild).toBe(screen.getByRole("img"));
  });

  it("leaves the default ratio to CSS", () => {
    render(<AspectRatio data-testid="frame" />);
    expect(screen.getByTestId("frame").style.getPropertyValue("--uiify-aspect-ratio")).toBe("");
    expect(screen.getByTestId("frame").hasAttribute("ratio")).toBe(false);
  });

  it("writes a supplied ratio without changing consumer styles", () => {
    render(
      <AspectRatio
        ratio={16 / 9}
        data-testid="frame"
        style={{ color: "red", "--consumer-value": "kept" } as CSSProperties}
      />,
    );
    const root = screen.getByTestId("frame");
    expect(root.style.getPropertyValue("--uiify-aspect-ratio")).toBe(String(16 / 9));
    expect(root.style.getPropertyValue("--consumer-value")).toBe("kept");
    expect(root.style.color).toBe("red");
    expect(root.hasAttribute("ratio")).toBe(false);
  });

  it("preserves a consumer CSS ratio when the prop is omitted", () => {
    render(
      <AspectRatio
        data-testid="frame"
        style={{ "--uiify-aspect-ratio": "4 / 5" } as CSSProperties}
      />,
    );
    expect(screen.getByTestId("frame").style.getPropertyValue("--uiify-aspect-ratio")).toBe(
      "4 / 5",
    );
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "falls back to square for invalid ratio %s",
    (ratio) => {
      render(<AspectRatio ratio={ratio} data-testid="frame" />);
      expect(screen.getByTestId("frame").style.getPropertyValue("--uiify-aspect-ratio")).toBe("1");
    },
  );

  it("lets consumer styles override the ratio custom property", () => {
    render(
      <AspectRatio
        ratio={4 / 5}
        data-testid="frame"
        style={{ "--uiify-aspect-ratio": 2 } as CSSProperties}
      />,
    );
    expect(screen.getByTestId("frame").style.getPropertyValue("--uiify-aspect-ratio")).toBe("2");
  });

  it("forwards native props, events, className and ref to the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    const onClick = vi.fn();
    render(
      <AspectRatio
        ref={ref}
        className="media-frame"
        id="mountain-frame"
        title="Mountain frame"
        data-consumer="retained"
        onClick={onClick}
      />,
    );
    const root = screen.getByTitle("Mountain frame");
    expect(ref.current).toBe(root);
    expect(root.className).toBe("media-frame");
    expect(root.id).toBe("mountain-frame");
    expect(root.getAttribute("data-consumer")).toBe("retained");
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards slot props to the generated content wrapper", () => {
    render(
      <AspectRatio
        slotProps={{ content: { className: "frame-content", "data-testid": "content" } }}
      >
        Photo
      </AspectRatio>,
    );
    expect(screen.getByTestId("content").className).toBe("frame-content");
    expect(screen.getByTestId("content").getAttribute("data-part")).toBe("content");
  });

  it("lets a consumer replace its identity marker", () => {
    render(<AspectRatio data-uiify-aspect-ratio="overridden" data-testid="frame" />);
    expect(screen.getByTestId("frame").getAttribute("data-uiify-aspect-ratio")).toBe("overridden");
  });

  it("supports a polymorphic root and its native attributes and ref", () => {
    const ref = { current: null as HTMLAnchorElement | null };
    render(
      <AspectRatio as="a" href="/mountains" ref={ref}>
        Mountains
      </AspectRatio>,
    );
    const root = screen.getByRole("link", { name: "Mountains" });
    expect(root.getAttribute("href")).toBe("/mountains");
    expect(ref.current).toBe(root);
    expect(root.firstElementChild?.getAttribute("data-part")).toBe("content");
  });

  it("passes its complete root props and content to a custom renderer", () => {
    render(
      <AspectRatio ratio={2} render={(props) => createElement("section", props)}>
        <span>Custom frame</span>
      </AspectRatio>,
    );
    const root = screen.getByText("Custom frame").parentElement?.parentElement;
    expect(root?.tagName).toBe("SECTION");
    expect(root?.getAttribute("data-uiify-aspect-ratio")).toBe("");
    expect(root?.style.getPropertyValue("--uiify-aspect-ratio")).toBe("2");
    expect(root?.firstElementChild?.getAttribute("data-part")).toBe("content");
  });

  it("renders on the server without client behavior", () => {
    const html = assertSSRRenderable(<AspectRatio ratio={1}>Square content</AspectRatio>);
    expect(html).toContain('data-uiify-aspect-ratio=""');
    expect(html).toContain('<div data-part="content">Square content</div>');
    expect(html).toContain("--uiify-aspect-ratio:1");
  });
});
