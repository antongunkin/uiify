import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Toolbar, Toolbar as ClientToolbar } from "./Toolbar.js";

describe("Toolbar", () => {
  it("keeps a single tab stop on the toolbar", () => {
    render(
      <ClientToolbar.Root aria-label="Formatting">
        <ClientToolbar.Button>One</ClientToolbar.Button>
        <ClientToolbar.Button>Two</ClientToolbar.Button>
        <ClientToolbar.Button>Three</ClientToolbar.Button>
      </ClientToolbar.Root>,
    );
    const toolbar = screen.getByRole("toolbar");
    const buttons = screen.getAllByRole("button");
    expect(toolbar).toBeTruthy();
    expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1);
  });

  it("moves focus with arrow keys and loops horizontally", () => {
    render(
      <ClientToolbar.Root aria-label="Formatting" orientation="horizontal" loop>
        <ClientToolbar.Button>One</ClientToolbar.Button>
        <ClientToolbar.Button>Two</ClientToolbar.Button>
        <ClientToolbar.Button>Three</ClientToolbar.Button>
      </ClientToolbar.Root>,
    );
    const one = screen.getByRole("button", { name: "One" });
    const three = screen.getByRole("button", { name: "Three" });
    fireEvent.keyDown(one, { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Two" }));
    fireEvent.keyDown(three, { key: "ArrowRight" });
    expect(document.activeElement).toBe(one);
  });

  it("supports Home and End", () => {
    render(
      <ClientToolbar.Root aria-label="Formatting" orientation="vertical">
        <ClientToolbar.Button>Alpha</ClientToolbar.Button>
        <ClientToolbar.Button>Beta</ClientToolbar.Button>
        <ClientToolbar.Button>Gamma</ClientToolbar.Button>
      </ClientToolbar.Root>,
    );
    const alpha = screen.getByRole("button", { name: "Alpha" });
    const gamma = screen.getByRole("button", { name: "Gamma" });
    fireEvent.keyDown(alpha, { key: "End" });
    expect(document.activeElement).toBe(gamma);
    fireEvent.keyDown(gamma, { key: "Home" });
    expect(document.activeElement).toBe(alpha);
  });

  it("honors RTL horizontal movement", () => {
    render(
      <ClientToolbar.Root aria-label="Formatting" dir="rtl" orientation="horizontal">
        <ClientToolbar.Button>First</ClientToolbar.Button>
        <ClientToolbar.Button>Last</ClientToolbar.Button>
      </ClientToolbar.Root>,
    );
    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });
    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(last);
  });

  it("embeds toggle groups and links", () => {
    render(
      <ClientToolbar.Root aria-label="Editor">
        <ClientToolbar.Link href="/docs">Docs</ClientToolbar.Link>
        <ClientToolbar.Separator />
        <ClientToolbar.ToggleGroup
          id="toolbar-toggle-group"
          type="single"
          defaultValue="bold"
          items={[
            { value: "bold", label: "Bold" },
            { value: "italic", label: "Italic" },
          ]}
        />
      </ClientToolbar.Root>,
    );
    expect(screen.getByRole("link", { name: "Docs" }).getAttribute("href")).toBe("/docs");
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(screen.getByLabelText("Bold")).toBeTruthy();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Button>Save</Toolbar.Button>
        <Toolbar.Link href="/docs">Docs</Toolbar.Link>
      </Toolbar.Root>,
    );
    expect(markup).toContain('role="toolbar"');
    expect(markup).toContain("Save");
    expect(markup).toContain('href="/docs"');
    expect(markup).not.toContain('tabindex="-1"');
  });
});
