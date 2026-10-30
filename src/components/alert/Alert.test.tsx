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
    expect(alert.getAttribute("data-uiify-alert")).toBe("");
  });

  it("preserves consumer-selected role and marker", () => {
    render(
      <Alert
        role="alert"
        symbol={false}
        className="callout"
        style={{ color: "red" }}
        data-uiify-alert="changed"
        data-record="kept"
        data-testid="alert"
      >
        Saved
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("data-uiify-alert")).toBe("changed");
    expect(alert.className).toBe("callout");
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
    expect(symbol.className).toBe("alert-symbol");
    expect(symbol.getAttribute("data-part")).toBe("symbol");
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
    const root = document.querySelector("[data-uiify-alert]")!;
    const glyph = root.querySelector('[data-part="symbol"]')!;
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
    expect(root.hasAttribute("data-uiify-alert")).toBe(true);
    expect(root.querySelector('[data-part="symbol"]')?.textContent).toBe("!");
    expect(root.textContent).toBe("!Read the details.");
  });

  it("forwards native props, refs, events and styling and consumer part markers", () => {
    const rootRef = createRef<HTMLElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const onClick = vi.fn();
    render(
      <Alert as="section" ref={rootRef} role="status" title="Native tooltip" onClick={onClick}>
        <AlertTitle
          as="h3"
          ref={titleRef}
          className="heading"
          style={{ color: "red" }}
          data-uiify-alert-title="changed"
          data-part="changed"
          data-record="kept"
        >
          Settings updated
        </AlertTitle>
        <AlertDescription render={(props) => createElement("p", props)} data-part="changed">
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
    expect(title.className).toBe("heading");
    expect(title.style.color).toBe("red");
    expect(title.getAttribute("data-uiify-alert-title")).toBe("changed");
    expect(title.getAttribute("data-part")).toBe("changed");
    expect(title.getAttribute("data-record")).toBe("kept");
    expect(description.tagName).toBe("P");
    expect(description.getAttribute("data-part")).toBe("changed");
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
