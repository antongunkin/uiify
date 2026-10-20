import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress.js";

describe("Progress", () => {
  it("keeps the native determinate progress element and accessible name", () => {
    render(<Progress aria-label="Migration progress" value={3} max={5} />);
    const progress = screen.getByRole("progressbar", { name: "Migration progress" });
    expect(progress.tagName).toBe("PROGRESS");
    expect(progress.getAttribute("value")).toBe("3");
    expect(progress.getAttribute("max")).toBe("5");
    expect(progress.getAttribute("data-uiify-progress")).toBe("");
  });

  it("preserves native indeterminate semantics when value is omitted", () => {
    render(<Progress aria-label="Loading project" data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress.hasAttribute("value")).toBe(false);
    expect(progress.getAttribute("aria-label")).toBe("Loading project");
  });

  it("keeps the identity marker immutable", () => {
    render(<Progress data-uiify-progress="changed" data-testid="progress" />);
    expect(screen.getByTestId("progress").getAttribute("data-uiify-progress")).toBe("");
  });

  it("forwards the native progress ref", () => {
    const ref = { current: null as HTMLProgressElement | null };
    render(<Progress ref={ref} aria-label="Build progress" />);
    expect(ref.current?.tagName).toBe("PROGRESS");
    expect(ref.current?.getAttribute("aria-label")).toBe("Build progress");
  });
});
