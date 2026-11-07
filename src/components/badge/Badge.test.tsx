import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Badge } from "./Badge.js";

describe("Badge", () => {
  it("renders a textual span without implicit semantics", () => {
    render(<Badge>Ready</Badge>);
    const badge = screen.getByText("Ready");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.classList.contains("uiify-badge")).toBe(true);
    expect(badge.hasAttribute("data-uiify-badge")).toBe(false);
    expect(badge.hasAttribute("role")).toBe(false);
  });

  it("writes supplied variant and size and forwards consumer data", () => {
    render(
      <Badge variant="success" size="sm" data-uiify-badge="changed" data-testid="badge">
        Ready
      </Badge>,
    );
    const badge = screen.getByTestId("badge");
    expect(badge.getAttribute("data-variant")).toBe("success");
    expect(badge.getAttribute("data-size")).toBe("sm");
    expect(badge.getAttribute("data-uiify-badge")).toBe("changed");
  });

  it("variant default renders like no variant", () => {
    expect(renderToStaticMarkup(<Badge variant="default">Ready</Badge>)).toBe(
      renderToStaticMarkup(<Badge>Ready</Badge>),
    );
  });

  it("Badge outline sets data-variant=outline", () => {
    expect(renderToStaticMarkup(<Badge variant="outline">Ready</Badge>)).toContain(
      'data-variant="outline"',
    );
  });

  it("keeps native props and supports a polymorphic root", () => {
    render(
      <Badge as="a" href="/ready" data-record="kept">
        Ready
      </Badge>,
    );
    const badge = screen.getByRole("link", { name: "Ready" });
    expect(badge.getAttribute("href")).toBe("/ready");
    expect(badge.getAttribute("data-record")).toBe("kept");
  });

  it("forwards the root class, style and ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Badge ref={ref} className="status-label" style={{ color: "red" }} data-testid="badge">
        Ready
      </Badge>,
    );
    const badge = screen.getByTestId("badge");
    expect(ref.current).toBe(badge);
    expect(badge.className).toBe("uiify-badge status-label");
    expect(badge.style.color).toBe("red");
  });
});
