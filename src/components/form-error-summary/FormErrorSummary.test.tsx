import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormErrorSummary } from "./FormErrorSummary.js";

describe("FormErrorSummary", () => {
  it("renders static links to the caller's fields without a live alert role", () => {
    render(
      <FormErrorSummary
        title="There is a problem"
        errors={[
          { href: "#email", message: "Enter a valid email address" },
          { href: "#password", message: "Choose a longer password" },
        ]}
      />,
    );

    const summary = screen.getByText("There is a problem").parentElement;
    expect(summary?.tagName).toBe("SECTION");
    expect(summary?.getAttribute("data-uiify-form-error-summary")).toBe("");
    expect(summary?.getAttribute("role")).toBeNull();
    expect(
      screen.getByRole("link", { name: "Enter a valid email address" }).getAttribute("href"),
    ).toBe("#email");
    expect(
      screen.getByRole("link", { name: "Choose a longer password" }).getAttribute("href"),
    ).toBe("#password");
  });

  it("renders nothing when there are no errors", () => {
    const { container } = render(<FormErrorSummary title="There is a problem" errors={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("forwards native props to generated parts and targets repeated errors by href", () => {
    render(
      <FormErrorSummary
        title="There is a problem"
        errors={[
          { href: "#email", message: "Enter a valid email address" },
          { href: "#password", message: "Choose a longer password" },
        ]}
        slotProps={{
          title: { className: "summary-title", "data-testid": "summary-title" },
          list: { "data-testid": "error-list" },
          item: { byItemValue: { "#email": { "data-testid": "email-item" } } },
          link: {
            byItemValue: {
              "#email": {
                className: "email-link",
                title: "Fix email",
                "data-testid": "email-link",
              },
            },
          },
        }}
      />,
    );

    expect(screen.getByTestId("summary-title").classList.contains("summary-title")).toBe(true);
    expect(screen.getByTestId("error-list").tagName).toBe("UL");
    expect(screen.getByTestId("email-item").tagName).toBe("LI");
    expect(screen.getByTestId("email-link").getAttribute("href")).toBe("#email");
    expect(screen.getByTestId("email-link").getAttribute("title")).toBe("Fix email");
    expect(
      screen.getByRole("link", { name: "Choose a longer password" }).getAttribute("href"),
    ).toBe("#password");
  });

  it("preserves consumer attributes and makes the identity marker immutable", () => {
    render(
      <FormErrorSummary
        title="There is a problem"
        errors={[{ href: "#email", message: "Enter a valid email address" }]}
        className="consumer-summary"
        data-uiify-form-error-summary="changed"
        data-context="signup"
        style={{ marginBlock: "1rem" }}
      />,
    );
    const summary = screen.getByText("There is a problem").parentElement;
    expect(summary?.className).toBe("consumer-summary");
    expect(summary?.getAttribute("data-context")).toBe("signup");
    expect(summary?.getAttribute("data-uiify-form-error-summary")).toBe("");
    expect(summary?.style.marginBlock).toBe("1rem");
  });
});
