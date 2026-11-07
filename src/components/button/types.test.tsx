import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Button } from "./Button.js";

// Type-level checks, compiled by `tsc -p packages/uiify`.
describe("Button types", () => {
  it("types handlers on every branch", () => {
    const markup = renderToStaticMarkup(
      <>
        <Button onClick={(e) => e.currentTarget.blur()}>a</Button>
        <Button href="/x" onClick={(e) => e.currentTarget.href}>
          b
        </Button>
        <Button href="/x" onClick={(e) => e.preventDefault()}>
          c
        </Button>
        <Button as="a" href="/x">
          d
        </Button>
        <Button href="/x" variant="outline" disabled>
          e
        </Button>
        {/* @ts-expect-error `type` is a button attribute, not offered with `href` */}
        <Button href="/x" type="submit">
          f
        </Button>
      </>,
    );
    expect(markup.match(/<a /g)).toHaveLength(5);
  });

  it("rejects the removed md size", () => {
    // @ts-expect-error `md` is not a Button size; the unset look is `default`
    const p: ComponentProps<typeof Button> = { size: "md" };
    const q: ComponentProps<typeof Button> = { size: "default", variant: "default" };
    expect([p.size, q.size]).toEqual(["md", "default"]);
  });

  it("keeps ComponentProps usable", () => {
    const p: ComponentProps<typeof Button> = { variant: "outline", type: "submit" };
    expect(p.variant).toBe("outline");
  });
});
