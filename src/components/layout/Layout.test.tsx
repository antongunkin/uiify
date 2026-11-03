import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Box, Grid, GridItem, Section, Stack } from "./Layout.js";

describe("public layout parts", () => {
  it("retains exact omitted and scalar legacy SSR", () => {
    expect(renderToStaticMarkup(<Stack />)).toBe('<div data-ui-layout="stack"></div>');
    expect(renderToStaticMarkup(<Grid columns={3} gap="sm" />)).toBe(
      '<div data-ui-layout="grid" data-columns="3" data-gap="sm"></div>',
    );
    expect(renderToStaticMarkup(<Section padding="md" width="lg" />)).toBe(
      '<section data-ui-layout="section" data-padding="md" data-width="lg"></section>',
    );
  });
  it("forwards native props, events, refs and consumer marker overrides", () => {
    const ref = { current: null as HTMLElement | null };
    const click = vi.fn();
    render(
      <Box
        as="main"
        ref={ref}
        id="main"
        aria-label="Content"
        className="custom"
        style={{ color: "red" }}
        onClick={click}
        data-ui-layout="custom"
        padding="md"
        data-padding={undefined}
        data-testid="box"
      >
        Content
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(ref.current).toBe(box);
    expect(box.tagName).toBe("MAIN");
    expect(box.getAttribute("data-ui-layout")).toBe("custom");
    expect(box.hasAttribute("data-padding")).toBe(false);
    expect(box.className).toBe("custom");
    expect(box.style.color).toBe("red");
    fireEvent.click(box);
    expect(click).toHaveBeenCalledOnce();
  });
  it("renders no wrappers, responsive geometry and custom rendering", () => {
    render(
      <Grid columns={{ base: 1, md: "sidebar" }} container>
        <GridItem columnSpan={{ base: "full", md: 1 }} columnStart={{ lg: 2 }}>
          Child
        </GridItem>
      </Grid>,
    );
    const item = screen.getByText("Child");
    expect(item.getAttribute("data-column-span")).toBe("full");
    expect(item.getAttribute("data-md-column-span")).toBe("1");
    expect(item.parentElement?.getAttribute("data-md-columns")).toBe("sidebar");
    expect(item.parentElement?.children.length).toBe(1);
    expect(
      renderToStaticMarkup(<Box padding="sm" render={(props) => <article {...props} />} />),
    ).toBe('<article data-ui-layout="box" data-padding="sm"></article>');
  });
});
