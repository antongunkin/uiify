import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TableOfContents } from "./index.js";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "setup", label: "Setup" },
  { id: "config", label: "Configuration" },
];

function Navigation() {
  return (
    <TableOfContents.Root aria-label="On this page">
      <TableOfContents.Trigger target="toc-panel" aria-label="Open contents">
        <TableOfContents.Rail>
          {sections.map(({ id }) => (
            <TableOfContents.Indicator key={id} value={id} selected={id === "setup"} />
          ))}
        </TableOfContents.Rail>
      </TableOfContents.Trigger>
      <TableOfContents.Content id="toc-panel">
        <TableOfContents.List>
          {sections.map(({ id, label }) => (
            <TableOfContents.Link key={id} href={`#${id}`} selected={id === "setup"}>
              {label}
            </TableOfContents.Link>
          ))}
        </TableOfContents.List>
      </TableOfContents.Content>
    </TableOfContents.Root>
  );
}

describe("native TableOfContents", () => {
  it("wires an accessible native popover to real fragment links", () => {
    const { container } = render(<Navigation />);
    const root = screen.getByRole("navigation", { name: "On this page" });
    expect(root?.getAttribute("data-uiify-table-of-contents")).toBe("");
    expect(
      screen.getByRole("button", { name: "Open contents" })?.getAttribute("popovertarget"),
    ).toBe("toc-panel");
    const panel = container.querySelector("#toc-panel");
    expect(panel?.getAttribute("popover")).toBe("auto");
    expect(panel?.getAttribute("data-side")).toBe("left");
    expect(panel?.getAttribute("data-align")).toBe("start");
    expect(container.querySelectorAll('[data-part="indicator"]')).toHaveLength(3);
    expect([...container.querySelectorAll("a")].map((link) => link.getAttribute("href"))).toEqual([
      "#intro",
      "#setup",
      "#config",
    ]);
    expect(container.querySelector('[data-part="rail"]')?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector('[data-part="rail"]')?.tagName).toBe("SPAN");
  });
  it("forwards native classes, data props, and refs through every public part", () => {
    const refs = {
      root: createRef<HTMLElement>(),
      trigger: createRef<HTMLButtonElement>(),
      rail: createRef<HTMLSpanElement>(),
      indicator: createRef<HTMLSpanElement>(),
      content: createRef<HTMLDivElement>(),
      list: createRef<HTMLDivElement>(),
      link: createRef<HTMLAnchorElement>(),
    };
    render(
      <TableOfContents.Root
        aria-label="On this page"
        className="toc-root"
        data-testid="toc-root"
        ref={refs.root}
      >
        <TableOfContents.Trigger
          className="toc-trigger"
          data-testid="toc-trigger"
          ref={refs.trigger}
          target="toc-panel"
        >
          Contents
          <TableOfContents.Rail className="toc-rail" data-testid="toc-rail" ref={refs.rail}>
            <TableOfContents.Indicator
              className="toc-indicator"
              data-testid="toc-indicator"
              ref={refs.indicator}
              value="intro"
            />
          </TableOfContents.Rail>
        </TableOfContents.Trigger>
        <TableOfContents.Content
          className="toc-content"
          data-testid="toc-content"
          id="toc-panel"
          ref={refs.content}
        >
          <TableOfContents.List className="toc-list" data-testid="toc-list" ref={refs.list}>
            <TableOfContents.Link
              className="toc-link"
              data-testid="toc-link"
              href="#intro"
              ref={refs.link}
            >
              Introduction
            </TableOfContents.Link>
          </TableOfContents.List>
        </TableOfContents.Content>
      </TableOfContents.Root>,
    );

    for (const [part, ref] of Object.entries(refs)) {
      const element = screen.getByTestId(`toc-${part}`);
      expect(element.className).toBe(`toc-${part}`);
      expect(ref.current).toBe(element);
    }
  });
  it("owns selection attributes while preserving native styling, refs and events", () => {
    const ref = createRef<HTMLAnchorElement>();
    const click = vi.fn();
    render(
      <TableOfContents.Link
        ref={ref}
        href="#setup"
        selected
        className="custom"
        style={{ color: "red" }}
        data-consumer="kept"
        data-part="wrong"
        data-selected={undefined}
        aria-current="page"
        onClick={click}
      >
        Setup
      </TableOfContents.Link>,
    );
    const link = screen.getByRole("link", { name: "Setup" });
    expect(link?.getAttribute("aria-current")).toBe("location");
    expect(link?.getAttribute("data-selected")).toBe("");
    expect(link?.getAttribute("data-part")).toBe("link");
    expect(link?.getAttribute("data-consumer")).toBe("kept");
    expect(link.classList.contains("custom")).toBe(true);
    expect(link.style.color).toBe("red");
    expect(ref.current).toBe(link);
    fireEvent.click(link);
    expect(click).toHaveBeenCalledOnce();
  });
  it("removes false consumer selection and writes heading level as a CSS value", () => {
    const { container } = render(
      <>
        <TableOfContents.Indicator value="setup" level={3} selected={false} data-selected="wrong" />
        <TableOfContents.Link href="#setup" selected={false} aria-current="location">
          Setup
        </TableOfContents.Link>
      </>,
    );
    const indicator = container.querySelector('[data-part="indicator"]') as HTMLElement;
    expect(indicator.hasAttribute("data-selected")).toBe(false);
    expect(indicator.style.getPropertyValue("--uiify-toc-level")).toBe("3");
    expect(screen.getByRole("link").hasAttribute("aria-current")).toBe(false);
  });
  it("preserves a consumer-provided current state when selected is omitted", () => {
    render(
      <TableOfContents.Link href="#intro" aria-current="location">
        Introduction
      </TableOfContents.Link>,
    );
    expect(screen.getByRole("link")?.getAttribute("aria-current")).toBe("location");
  });
  it("supports a custom anchor renderer with immutable returned props", () => {
    render(
      <TableOfContents.Link href="#intro" selected render={(props) => <a {...props}>Custom</a>} />,
    );
    const link = screen.getByRole("link", { name: "Custom" });
    expect(link?.getAttribute("href")).toBe("#intro");
    expect(link?.getAttribute("aria-current")).toBe("location");
    expect(link?.getAttribute("data-part")).toBe("link");
  });
});

Navigation.displayName = "Navigation";
