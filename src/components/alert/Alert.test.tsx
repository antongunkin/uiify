import { createElement, createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./Alert.js";

describe("Alert", () => {
  it("renders persistent content without an implicit live role", () => {
    render(<Alert variant="warning">One check remains.</Alert>);
    const alert = screen.getByText("One check remains.");
    expect(alert.tagName).toBe("DIV");
    expect(alert.getAttribute("role")).toBeNull();
    expect(alert.getAttribute("data-variant")).toBe("warning");
    expect(alert.classList.contains("uiify-alert")).toBe(true);
    expect(alert.hasAttribute("data-uiify-alert")).toBe(false);
  });

  it("composes consumer classes and preserves the selected role", () => {
    render(
      <Alert
        role="alert"
        symbol={false}
        className="callout"
        style={{ color: "red" }}
        data-record="kept"
      >
        Saved
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(alert.className).toBe("uiify-alert callout");
    expect(alert.querySelector(".uiify-alert-symbol")).toBeNull();
    expect(alert.style.color).toBe("red");
    expect(alert.getAttribute("data-record")).toBe("kept");
    expect(alert.textContent).toBe("Saved");
  });

  it("forwards slot props to the generated decorative symbol", () => {
    render(
      <Alert slotProps={{ symbol: { className: "alert-symbol", "data-testid": "alert-symbol" } }}>
        Saved
      </Alert>,
    );
    const symbol = screen.getByTestId("alert-symbol");
    expect(symbol.className).toBe("uiify-alert-symbol alert-symbol");
    expect(symbol.hasAttribute("data-part")).toBe(false);
    expect(symbol.getAttribute("aria-hidden")).toBe("true");
  });

  it("lets a consumer data attribute override the default variant", () => {
    render(<Alert data-variant="destructive">Saved</Alert>);
    expect(screen.getByText("Saved").getAttribute("data-variant")).toBe("destructive");
  });

  it.each([
    ["secondary", "ⓘ"],
    ["success", "✓"],
    ["warning", "⚠︎"],
    ["destructive", "×"],
  ] as const)("server-renders a decorative symbol for %s", (variant, symbol) => {
    const html = renderToStaticMarkup(<Alert variant={variant}>Message</Alert>);
    const document = new DOMParser().parseFromString(html, "text/html");
    const root = document.querySelector(".uiify-alert")!;
    const glyph = root.querySelector(".uiify-alert-symbol")!;
    expect(glyph.textContent).toBe(symbol);
    expect(glyph.getAttribute("aria-hidden")).toBe("true");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.querySelector("svg")).toBeNull();
  });

  it("allows a custom symbol without replacing content or adding a wrapper", () => {
    render(
      <Alert symbol="!">
        Read <a href="#details">the details</a>.
      </Alert>,
    );
    const link = screen.getByRole("link", { name: "the details" });
    const root = link.parentElement!;
    expect(root.classList.contains("uiify-alert")).toBe(true);
    expect(root.querySelector(".uiify-alert-symbol")?.textContent).toBe("!");
    expect(root.textContent).toBe("!Read the details.");
  });

  it("forwards native props, refs, events and styling through as and render", () => {
    const rootRef = createRef<HTMLElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const onClick = vi.fn();
    render(
      <Alert
        as="section"
        ref={rootRef}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This tests the consumer role on a polymorphic section.
        role="status"
        title="Native tooltip"
        onClick={onClick}
      >
        <AlertTitle
          as="h3"
          ref={titleRef}
          className="heading"
          style={{ color: "red" }}
          data-record="kept"
        >
          Settings updated
        </AlertTitle>
        <AlertDescription render={(props) => createElement("p", props)}>
          Your preferences are saved.
        </AlertDescription>
      </Alert>,
    );
    const root = screen.getByRole("status");
    const title = screen.getByRole("heading", { name: "Settings updated", level: 3 });
    const description = screen.getByText("Your preferences are saved.");
    expect(root.tagName).toBe("SECTION");
    expect(root.title).toBe("Native tooltip");
    expect(rootRef.current).toBe(root);
    expect(titleRef.current).toBe(title);
    expect(title.className).toBe("uiify-alert-title heading");
    expect(title.style.color).toBe("red");
    expect(title.hasAttribute("data-uiify-alert-title")).toBe(false);
    expect(title.hasAttribute("data-part")).toBe(false);
    expect(title.getAttribute("data-record")).toBe("kept");
    expect(description.tagName).toBe("P");
    expect(description.className).toBe("uiify-alert-description");
    expect(description.hasAttribute("data-uiify-alert-description")).toBe(false);
    expect(description.hasAttribute("data-part")).toBe(false);
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
