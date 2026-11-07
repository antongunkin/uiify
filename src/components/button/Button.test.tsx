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

  it("maps variant to data-variant and omits it by default", () => {
    render(
      <>
        <Button variant="outline">Outlined</Button>
        <Button>Plain</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Outlined" }).getAttribute("data-variant")).toBe(
      "outline",
    );
    expect(screen.getByRole("button", { name: "Plain" }).hasAttribute("data-variant")).toBe(false);
  });

  it("keeps a consumer-supplied data-variant when no variant prop is passed", () => {
    render(<Button data-variant="ghost">Manual</Button>);
    expect(screen.getByRole("button", { name: "Manual" }).getAttribute("data-variant")).toBe(
      "ghost",
    );
  });

  it("maps size to data-size and omits it by default", () => {
    render(
      <>
        <Button size="sm">Small</Button>
        <Button>Plain</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Small" }).getAttribute("data-size")).toBe("sm");
    expect(screen.getByRole("button", { name: "Plain" }).hasAttribute("data-size")).toBe(false);
  });

  it("variant default renders like no variant", () => {
    expect(renderToStaticMarkup(<Button variant="default">Save</Button>)).toBe(
      renderToStaticMarkup(<Button>Save</Button>),
    );
  });

  it("size default renders like no size", () => {
    expect(renderToStaticMarkup(<Button size="default">Save</Button>)).toBe(
      renderToStaticMarkup(<Button>Save</Button>),
    );
  });

  it("size xs sets data-size=xs", () => {
    expect(renderToStaticMarkup(<Button size="xs">Save</Button>)).toContain('data-size="xs"');
  });

  it("size icon-xs sets data-size=icon-xs", () => {
    const markup = renderToStaticMarkup(
      <Button size="icon-xs" aria-label="Close">
        <svg aria-hidden="true" />
      </Button>,
    );
    expect(markup).toContain('data-size="icon-xs"');
  });

  it("serializes icon sizes independently of variant", () => {
    const markup = renderToStaticMarkup(
      <Button size="icon-sm" variant="ghost" aria-label="Settings">
        <svg aria-hidden="true" />
      </Button>,
    );
    expect(markup).toContain('data-size="icon-sm"');
    expect(markup).toContain('data-variant="ghost"');
  });

  it("marks a selected button and reports a native one as pressed", () => {
    const on = renderToStaticMarkup(<Button selected>Bold</Button>);
    expect(on).toContain('data-selected=""');
    expect(on).toContain('aria-pressed="true"');
    const off = renderToStaticMarkup(<Button selected={false}>Bold</Button>);
    expect(off).not.toContain("data-selected");
    expect(off).toContain('aria-pressed="false"');
    expect(renderToStaticMarkup(<Button>Save</Button>)).not.toContain("aria-pressed");
  });

  it("leaves the relation to the consumer on a link or an explicit aria attribute", () => {
    const link = renderToStaticMarkup(
      <Button as="a" href="/2" selected aria-current="page">
        2
      </Button>,
    );
    expect(link).toContain('data-selected=""');
    expect(link).not.toContain("aria-pressed");
    expect(renderToStaticMarkup(<Button as="a" href="/2" selected />)).not.toContain(
      "aria-pressed",
    );
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

  it("href renders an anchor equal to as=a", () => {
    const viaHref = renderToStaticMarkup(
      <Button href="/auth/google" variant="outline">
        Continue
      </Button>,
    );
    const viaAs = renderToStaticMarkup(
      <Button as="a" href="/auth/google" variant="outline">
        Continue
      </Button>,
    );
    expect(viaHref).toBe(viaAs);
    expect(viaHref.startsWith("<a ")).toBe(true);
    expect(viaHref).toContain('href="/auth/google"');
    expect(viaHref).not.toContain("type=");
  });

  it("href + disabled renders aria-disabled and tabIndex -1 and blocks navigation", () => {
    const onClick = vi.fn();
    render(
      <Button href="/docs" disabled onClick={onClick}>
        Docs
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.getAttribute("tabindex")).toBe("-1");
    expect(link.hasAttribute("disabled")).toBe(false);
    expect(fireEvent.click(link)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not offer button-only props on the link branch", () => {
    // @ts-expect-error `type` is a button attribute, not offered with `href`
    const markup = renderToStaticMarkup(<Button href="/x" type="submit" />);
    expect(markup.startsWith("<a ")).toBe(true);
  });

  it("without href markup is unchanged", () => {
    expect(renderToStaticMarkup(<Button variant="outline">Save</Button>)).toBe(
      '<button class="uiify-button" data-variant="outline" type="button">Save</button>',
    );
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
      <Button
        as="a"
        href="/docs"
        disabled
        aria-disabled={false}
        // oxlint-disable-next-line jsx-a11y/tabindex-no-positive -- The disabled button must reject this consumer tab stop.
        tabIndex={3}
      >
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

  it("forwards consumer styling props", () => {
    render(
      <Button className="consumer-button" data-layout="compact" style={{ marginBlock: "1rem" }}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.getAttribute("data-layout")).toBe("compact");
    expect(button.style.marginBlock).toBe("1rem");
  });

  it("renders uiify-button class joined with consumer className", () => {
    const markup = renderToStaticMarkup(<Button className="custom">Save</Button>);
    expect(markup).toContain('class="uiify-button custom"');
  });

  it("does not render data-uiify-button", () => {
    const markup = renderToStaticMarkup(<Button>Save</Button>);
    expect(markup).toContain('class="uiify-button"');
    expect(markup).not.toContain("data-uiify-button");
  });
});
