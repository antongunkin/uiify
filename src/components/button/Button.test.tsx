import type { ComponentPropsWithoutRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Button } from "./Button.js";

describe("Button", () => {
  it("renders a native button with type button by default", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
  });

  it("blocks interaction when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders an anchor without button-only attributes", () => {
    render(
      <Button as="a" href="/docs">
        Docs
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.getAttribute("type")).toBeNull();
  });

  it("maps disabled anchors to aria-disabled and blocks activation", () => {
    const onClick = vi.fn();
    render(
      <Button as="a" href="/docs" disabled onClick={onClick}>
        Docs
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.getAttribute("tabindex")).toBe("-1");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("runs consumer onClick before internal handlers and respects preventDefault", () => {
    const order: string[] = [];
    render(
      <Button
        onClick={(event) => {
          order.push("consumer");
          event.preventDefault();
        }}
      >
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(order).toEqual(["consumer"]);
  });

  it("supports a render callback", () => {
    render(
      <Button
        render={(buttonProps) => (
          <button {...(buttonProps as ComponentPropsWithoutRef<"button">)} data-custom="">
            Custom
          </button>
        )}
      />,
    );
    expect(screen.getByRole("button", { name: "Custom" }).getAttribute("data-custom")).toBe("");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Button>Save</Button>);
    expect(markup).toContain('type="button"');
    expect(markup).toContain("Save");
  });

  it("owns aria-disabled and tabIndex on a disabled non-native button; consumer cannot override them", () => {
    render(
      <Button as="a" href="/docs" disabled aria-disabled={false} tabIndex={3}>
        Docs
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.getAttribute("tabindex")).toBe("-1");
  });

  it("owns data-disabled when disabled; consumer cannot override it", () => {
    render(
      <Button disabled data-disabled="not-disabled">
        Save
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" }).getAttribute("data-disabled")).toBe("");
  });
});
