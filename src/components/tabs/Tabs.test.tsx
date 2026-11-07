import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index.js";

/** Elements and attributes in document order; attributes sorted so source order cannot matter. */
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) => {
    const attributes = [...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort();
    return `${element.localName} ${attributes.join(" ")}`.trim();
  });
}

describe("Tabs", () => {
  it("renders a div root with the identity class and horizontal orientation", () => {
    render(<Tabs data-testid="tabs" />);
    const root = screen.getByTestId("tabs");
    expect(root.localName).toBe("div");
    expect(root.className).toBe("uiify-tabs");
    expect(root.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("writes orientation as data-orientation", () => {
    render(<Tabs orientation="vertical" data-testid="tabs" />);
    expect(screen.getByTestId("tabs").getAttribute("data-orientation")).toBe("vertical");
  });
});

describe("TabsList", () => {
  it("renders a plain div with the list class and no ARIA role", () => {
    render(<TabsList data-testid="list" />);
    const list = screen.getByTestId("list");
    expect(list.localName).toBe("div");
    expect(list.className).toBe("uiify-tabs-list");
    expect(list.hasAttribute("role")).toBe(false);
  });
});

describe("TabsTrigger", () => {
  it("renders a contents span holding a visually hidden radio immediately followed by its label", () => {
    expect(
      outline(
        renderToStaticMarkup(
          <TabsTrigger name="account" value="profile" defaultChecked>
            Profile
          </TabsTrigger>,
        ),
      ),
    ).toEqual([
      'span class="uiify-tabs-item"',
      'input checked="" class="peer/tabs uiify-tabs-control" id="account-profile" name="account" type="radio" value="profile"',
      'label class="uiify-tabs-trigger" for="account-profile"',
    ]);
  });

  it("names the radio by its label and honours an explicit id", () => {
    render(
      <TabsTrigger name="account" value="security" id="custom">
        Security
      </TabsTrigger>,
    );
    const radio = screen.getByRole("radio", { name: "Security" });
    expect(radio.id).toBe("custom");
    expect(screen.getByText("Security").getAttribute("for")).toBe("custom");
  });

  it("disables the native radio and marks the label", () => {
    const markup = renderToStaticMarkup(
      <TabsTrigger name="account" value="billing" disabled>
        Billing
      </TabsTrigger>,
    );
    expect(outline(markup)).toEqual([
      'span class="uiify-tabs-item"',
      'input class="peer/tabs uiify-tabs-control" disabled="" id="account-billing" name="account" type="radio" value="billing"',
      'label class="uiify-tabs-trigger" data-disabled="" for="account-billing"',
    ]);
  });
});

describe("TabsContent", () => {
  it("renders a div with the content class and data-value", () => {
    expect(
      outline(renderToStaticMarkup(<TabsContent value="profile">Profile</TabsContent>)),
    ).toEqual(['div class="uiify-tabs-content" data-value="profile"']);
  });
});

describe("Tabs composition", () => {
  it("keeps triggers inside the list and contents as direct children of the root, in order", () => {
    const markup = renderToStaticMarkup(
      <Tabs>
        <TabsList>
          <TabsTrigger name="t" value="a" defaultChecked>
            A
          </TabsTrigger>
          <TabsTrigger name="t" value="b">
            B
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>,
    );
    const host = document.createElement("div");
    host.innerHTML = markup;
    const root = host.querySelector(".uiify-tabs")!;
    expect(root.querySelectorAll(":scope > .uiify-tabs-list > .uiify-tabs-item")).toHaveLength(2);
    expect(
      [...root.querySelectorAll(":scope > .uiify-tabs-content")].map((node) =>
        node.getAttribute("data-value"),
      ),
    ).toEqual(["a", "b"]);
    expect(markup).not.toMatch(/role=|aria-selected|data-part/);
  });
});
