import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Details, DetailsContent, DetailsRoot, DetailsSummary } from "./Details.js";

describe("Details", () => {
  it("renders a details/summary/content tree with no input", () => {
    const markup = renderToStaticMarkup(
      <DetailsRoot>
        <DetailsSummary part="trigger">Shipping</DetailsSummary>
        <DetailsContent part="panel">Ships in 2-3 days.</DetailsContent>
      </DetailsRoot>,
    );
    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).toContain('data-part="trigger"');
    expect(markup).toContain('data-part="panel"');
    expect(markup).toContain("data-uiify-details");
    expect(markup).not.toContain("<input");
  });

  it("omits data-part entirely when part is not given", () => {
    const markup = renderToStaticMarkup(
      <DetailsRoot>
        <DetailsSummary>…</DetailsSummary>
        <DetailsContent as="ol" />
      </DetailsRoot>,
    );
    expect(markup).not.toContain("data-part");
    expect(markup).toContain("<ol");
  });

  it("sets name for exclusive grouping and open for defaultOpen", () => {
    const markup = renderToStaticMarkup(
      <DetailsRoot defaultOpen name="faq">
        <DetailsSummary>Shipping</DetailsSummary>
        <DetailsContent>Panel</DetailsContent>
      </DetailsRoot>,
    );
    expect(markup).toContain('name="faq"');
    expect(markup).toContain('open=""');
  });

  it("omits name when not given", () => {
    const markup = renderToStaticMarkup(
      <DetailsRoot>
        <DetailsSummary>Shipping</DetailsSummary>
        <DetailsContent>Panel</DetailsContent>
      </DetailsRoot>,
    );
    expect(markup).not.toContain("name=");
  });

  it("marks a disabled root data-disabled and its summary aria-disabled/unfocusable", () => {
    render(
      <DetailsRoot disabled>
        <DetailsSummary disabled>Shipping</DetailsSummary>
        <DetailsContent>Panel</DetailsContent>
      </DetailsRoot>,
    );
    const summary = screen.getByText("Shipping");
    expect(summary.getAttribute("aria-disabled")).toBe("true");
    expect(summary.getAttribute("tabindex")).toBe("-1");
    expect(summary.closest("details")?.hasAttribute("data-disabled")).toBe(true);
  });

  it("does not disable a non-disabled summary", () => {
    render(
      <DetailsRoot>
        <DetailsSummary>Shipping</DetailsSummary>
        <DetailsContent>Panel</DetailsContent>
      </DetailsRoot>,
    );
    const summary = screen.getByText("Shipping");
    expect(summary.hasAttribute("aria-disabled")).toBe(false);
    expect(summary.hasAttribute("tabindex")).toBe(false);
    expect(summary.closest("details")?.hasAttribute("data-disabled")).toBe(false);
  });

  it("renders content as a custom element via `as`", () => {
    render(
      <DetailsRoot>
        <DetailsSummary>…</DetailsSummary>
        <DetailsContent as="ol">
          <li>One</li>
        </DetailsContent>
      </DetailsRoot>,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("exposes the same parts through the Details compound object", () => {
    expect(Details.Root).toBe(DetailsRoot);
    expect(Details.Summary).toBe(DetailsSummary);
    expect(Details.Content).toBe(DetailsContent);
  });
});
