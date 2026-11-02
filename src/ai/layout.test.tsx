import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Grid, layoutComponents, Section, Stack } from "./layout.js";

describe("layout nodes", () => {
  it("renders Stack with its direction and gap", () => {
    expect(
      renderToStaticMarkup(
        <Stack direction="inline" gap="md">
          x
        </Stack>,
      ),
    ).toBe('<div data-ui-layout="stack" data-direction="inline" data-gap="md">x</div>');
  });

  it("renders every Stack prop as a data attribute", () => {
    const html = renderToStaticMarkup(<Stack direction="block" gap="xl" align="stretch" wrap />);
    expect(html).toContain('data-direction="block"');
    expect(html).toContain('data-gap="xl"');
    expect(html).toContain('data-align="stretch"');
    expect(html).toContain('data-wrap="true"');
  });

  it("renders Grid with its columns", () => {
    expect(
      renderToStaticMarkup(
        <Grid columns={3} gap="sm">
          x
        </Grid>,
      ),
    ).toBe('<div data-ui-layout="grid" data-columns="3" data-gap="sm">x</div>');
  });

  it("renders Section with the requested element and padding", () => {
    expect(
      renderToStaticMarkup(
        <Section as="nav" padding="lg">
          x
        </Section>,
      ),
    ).toBe('<nav data-ui-layout="section" data-padding="lg">x</nav>');
  });

  it("renders Section with a width cap", () => {
    expect(
      renderToStaticMarkup(
        <Section as="main" width="sm" padding="xl">
          x
        </Section>,
      ),
    ).toBe('<main data-ui-layout="section" data-padding="xl" data-width="sm">x</main>');
  });

  it("renders Section as a section by default", () => {
    expect(renderToStaticMarkup(<Section />)).toBe('<section data-ui-layout="section"></section>');
  });

  it("emits no attribute for omitted props", () => {
    expect(renderToStaticMarkup(<Stack />)).toBe('<div data-ui-layout="stack"></div>');
    expect(renderToStaticMarkup(<Grid />)).toBe('<div data-ui-layout="grid"></div>');
  });

  it("emits no wrap attribute when wrap is false", () => {
    expect(renderToStaticMarkup(<Stack wrap={false} />)).toBe('<div data-ui-layout="stack"></div>');
  });

  it("registers the three layout components", () => {
    expect(layoutComponents).toEqual({ Stack, Grid, Section });
  });
});
