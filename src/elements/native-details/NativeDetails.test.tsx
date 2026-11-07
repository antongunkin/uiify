import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  NativeDetails,
  NativeDetailsContent,
  NativeDetailsRoot,
  NativeDetailsSummary,
} from "./NativeDetails.js";

describe("NativeDetails", () => {
  it("renders a details/summary/content tree with no input", () => {
    const markup = renderToStaticMarkup(
      <NativeDetailsRoot>
        <NativeDetailsSummary>Shipping</NativeDetailsSummary>
        <NativeDetailsContent>Ships in 2-3 days.</NativeDetailsContent>
      </NativeDetailsRoot>,
    );
    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).toContain('<details class="uiify-native-details">');
    expect(markup).not.toContain("<input");
  });

  it("renders no data-part markers", () => {
    const markup = renderToStaticMarkup(
      <NativeDetailsRoot>
        <NativeDetailsSummary>…</NativeDetailsSummary>
        <NativeDetailsContent as="ol" />
      </NativeDetailsRoot>,
    );
    expect(markup).not.toContain("data-part");
    expect(markup).toContain("<ol");
  });

  it("sets name for exclusive grouping and open for defaultOpen", () => {
    const markup = renderToStaticMarkup(
      <NativeDetailsRoot defaultOpen name="faq">
        <NativeDetailsSummary>Shipping</NativeDetailsSummary>
        <NativeDetailsContent>Panel</NativeDetailsContent>
      </NativeDetailsRoot>,
    );
    expect(markup).toContain('name="faq"');
    expect(markup).toContain('open=""');
  });

  it("omits name when not given", () => {
    const markup = renderToStaticMarkup(
      <NativeDetailsRoot>
        <NativeDetailsSummary>Shipping</NativeDetailsSummary>
        <NativeDetailsContent>Panel</NativeDetailsContent>
      </NativeDetailsRoot>,
    );
    expect(markup).not.toContain("name=");
  });

  it("marks a disabled root data-disabled and its summary aria-disabled/unfocusable", () => {
    render(
      <NativeDetailsRoot disabled>
        <NativeDetailsSummary disabled>Shipping</NativeDetailsSummary>
        <NativeDetailsContent>Panel</NativeDetailsContent>
      </NativeDetailsRoot>,
    );
    const summary = screen.getByText("Shipping");
    expect(summary.getAttribute("aria-disabled")).toBe("true");
    expect(summary.getAttribute("tabindex")).toBe("-1");
    expect(summary.closest("details")?.hasAttribute("data-disabled")).toBe(true);
  });

  it("does not disable a non-disabled summary", () => {
    render(
      <NativeDetailsRoot>
        <NativeDetailsSummary>Shipping</NativeDetailsSummary>
        <NativeDetailsContent>Panel</NativeDetailsContent>
      </NativeDetailsRoot>,
    );
    const summary = screen.getByText("Shipping");
    expect(summary.hasAttribute("aria-disabled")).toBe(false);
    expect(summary.hasAttribute("tabindex")).toBe(false);
    expect(summary.closest("details")?.hasAttribute("data-disabled")).toBe(false);
  });

  it("renders content as a custom element via `as`", () => {
    render(
      <NativeDetailsRoot>
        <NativeDetailsSummary>…</NativeDetailsSummary>
        <NativeDetailsContent as="ol">
          <li>One</li>
        </NativeDetailsContent>
      </NativeDetailsRoot>,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("exposes the same parts through the NativeDetails compound object", () => {
    expect(NativeDetails.Root).toBe(NativeDetailsRoot);
    expect(NativeDetails.Summary).toBe(NativeDetailsSummary);
    expect(NativeDetails.Content).toBe(NativeDetailsContent);
  });
});
