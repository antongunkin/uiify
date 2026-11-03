import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Heading, Text } from "./Typography.js";

describe("public typography parts", () => {
  it("keeps appearance independent from native heading semantics", () => {
    render(
      <>
        <Heading level={1} size="sm">
          Title
        </Heading>
        <Text as="span" size="2xl">
          Detail
        </Text>
      </>,
    );
    expect(screen.getByRole("heading", { level: 1 }).getAttribute("data-size")).toBe("sm");
    expect(screen.getByText("Detail").tagName).toBe("SPAN");
    expect(screen.getByText("Detail").hasAttribute("role")).toBe(false);
  });
  it("defaults to p/h2 and leaves appearance defaults in CSS", () => {
    expect(renderToStaticMarkup(<Text>Text</Text>)).toBe('<p data-ui-text="text">Text</p>');
    expect(renderToStaticMarkup(<Heading>Title</Heading>)).toBe(
      '<h2 data-ui-text="heading">Title</h2>',
    );
  });
  it("lets native as/render and consumer attributes override defaults", () => {
    const ref = { current: null as HTMLHeadingElement | null };
    render(
      <Heading
        as="h4"
        level={1}
        ref={ref}
        data-ui-text={undefined}
        size={{ md: "xl" }}
        data-md-size="2xl"
      >
        Title
      </Heading>,
    );
    expect(ref.current?.tagName).toBe("H4");
    expect(ref.current?.hasAttribute("data-ui-text")).toBe(false);
    expect(ref.current?.getAttribute("data-md-size")).toBe("2xl");
    expect(
      renderToStaticMarkup(
        <Heading level={1} render={(props) => createElement("h3", props, "Title")} />,
      ),
    ).toBe('<h3 data-ui-text="heading">Title</h3>');
  });
});
