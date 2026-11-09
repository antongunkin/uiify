// Hero: one labelled section with an h1, supporting text, actions and optional media, in reading order.
import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { Button } from "../../components/button/index.js";
import { renderToStaticMarkup } from "../../components/test-utils/ssr.js";
import { Hero } from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "hero.html");
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

function Landing() {
  return (
    <Hero
      id="hero"
      eyebrow="New"
      title="Plan releases your whole team can follow"
      description="Orbit turns scattered tasks into one shared release timeline."
      actions={
        <>
          <Button href="/signup">Start a free trial</Button>
          <Button href="/tour" variant="link">
            Take the tour
          </Button>
        </>
      }
      media={
        <img
          src="/timeline.png"
          alt="Release timeline with three milestones"
          width={640}
          height={400}
        />
      }
    />
  );
}
Landing.displayName = "Landing";

it("labels the section by its h1 and keeps text, actions, media in source order", () => {
  const { container } = render(<Landing />);
  const section = screen.getByRole("region", { name: "Plan releases your whole team can follow" });
  expect(section.id).toBe("hero");
  expect(section.className).toContain("uiify-hero");
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.id).toBe("hero-title");
  const order = [
    screen.getByText("New"),
    heading,
    screen.getByText(/scattered tasks/),
    screen.getByRole("link", { name: "Start a free trial" }),
    screen.getByRole("link", { name: "Take the tour" }),
    screen.getByRole("img"),
  ];
  for (let index = 1; index < order.length; index += 1) {
    const before = order[index - 1]!;
    const after = order[index]!;
    expect(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
  expect(container.querySelectorAll("h1")).toHaveLength(1);
});

it("renders only the title without the optional parts and no labelling without an id", () => {
  const { container } = render(<Hero title="Pricing that grows with you" />);
  const section = container.querySelector("section")!;
  expect(section.hasAttribute("aria-labelledby")).toBe(false);
  expect(section.querySelector("h1")?.hasAttribute("id")).toBe(false);
  expect(section.querySelectorAll("p")).toHaveLength(0);
  expect(section.querySelector("img")).toBeNull();
  expect(section.querySelectorAll("a")).toHaveLength(0);
});

it("changes the heading level and centers the text", () => {
  render(
    <Hero title="Welcome back" level={2} align="center" description="Pick up where you left." />,
  );
  const heading = screen.getByRole("heading", { level: 2, name: "Welcome back" });
  expect(heading.getAttribute("data-align")).toBe("center");
  expect(screen.getByText("Pick up where you left.").getAttribute("data-align")).toBe("center");
});

it("lets consumer root and slot props win and composes className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(
    <Hero
      ref={ref}
      id="top"
      title="Ship faster"
      className="custom"
      aria-label="Introduction"
      slotProps={{ title: { id: "own-title", className: "own" }, media: { id: "hero-media" } }}
      media={<img src="/a.png" alt="App" />}
    />,
  );
  const section = ref.current!;
  expect(section.className).toContain("uiify-hero");
  expect(section.className).toContain("custom");
  expect(section.getAttribute("aria-label")).toBe("Introduction");
  expect(section.getAttribute("aria-labelledby")).toBe("own-title");
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.id).toBe("own-title");
  expect(heading.className).toContain("own");
  expect(document.getElementById("hero-media")?.querySelector("img")).not.toBeNull();
});

it("passes html-validate as server HTML", async () => {
  const markup = renderToStaticMarkup(<Landing />);
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  const messages = report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
  expect(messages).toEqual([]);
});
