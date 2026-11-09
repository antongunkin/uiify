// PlanOption renders the catalog's "Choice cards" pattern with derived ids, as valid server HTML.
import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { RadioGroup } from "../../components/radio-group/index.js";
import { renderToStaticMarkup } from "../../components/test-utils/ssr.js";
import { PlanOption } from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
// The file loader finds .htmlvalidate.json by walking up from this path.
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "plan-option.html");
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

function Plans() {
  return (
    <RadioGroup aria-label="Plan">
      <PlanOption name="plan" value="monthly" title="Monthly" price="$4.99 / month" />
      <PlanOption
        name="plan"
        value="annual"
        title="Annual"
        price="$39.99 / year"
        description="Billed once a year."
        badge="Save 33%"
        defaultChecked
      />
    </RadioGroup>
  );
}
Plans.displayName = "Plans";

it("labels the radio by title and badge and describes it by price and description", () => {
  render(<Plans />);
  const annual = screen.getByRole("radio", { name: "Annual Save 33%" });
  expect(annual.id).toBe("plan-annual");
  expect(annual.getAttribute("name")).toBe("plan");
  expect(annual.getAttribute("value")).toBe("annual");
  expect((annual as HTMLInputElement).checked).toBe(true);
  expect(annual.getAttribute("aria-describedby")).toBe("plan-annual-price plan-annual-description");
  expect(document.getElementById("plan-annual-price")?.textContent).toBe("$39.99 / year");

  const monthly = screen.getByRole("radio", { name: "Monthly" });
  expect(monthly.getAttribute("aria-describedby")).toBe("plan-monthly-price");
  expect((monthly as HTMLInputElement).checked).toBe(false);
});

it("omits aria-describedby, badge and descriptions that are not given", () => {
  const { container } = render(<PlanOption name="plan" value="free" title="Free" />);
  const radio = screen.getByRole("radio", { name: "Free" });
  expect(radio.hasAttribute("aria-describedby")).toBe(false);
  expect(container.querySelector("p")).toBeNull();
  expect(container.querySelector(".uiify-badge")).toBeNull();
});

it("renders a choice card around the radio and passes disabled and required to it", () => {
  const { container } = render(
    <PlanOption name="plan" value="team" title="Team" price="$12" disabled required />,
  );
  const card = container.firstElementChild as HTMLElement;
  expect(card.getAttribute("data-variant")).toBe("card");
  expect(card.getAttribute("data-orientation")).toBe("horizontal");
  const radio = screen.getByRole("radio", { name: "Team" }) as HTMLInputElement;
  expect(radio.disabled).toBe(true);
  expect(radio.required).toBe(true);
});

it("lets consumer root props, slot ids and ARIA win and composes className and ref", () => {
  const ref = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  render(
    <PlanOption
      ref={ref}
      name="plan"
      value="pro"
      title="Pro"
      price="$12"
      className="custom"
      data-testid="card"
      data-variant="flat"
      slotProps={{
        input: { id: "pro-radio", ref: inputRef, "aria-describedby": "own-hint" },
        price: { id: "pro-cost", className: "cost" },
        badge: { variant: "warning" },
      }}
      badge="Popular"
    />,
  );
  const card = screen.getByTestId("card");
  expect(ref.current).toBe(card);
  expect(card.className).toContain("custom");
  expect(card.getAttribute("data-variant")).toBe("flat");
  const radio = screen.getByRole("radio", { name: "Pro Popular" });
  expect(inputRef.current).toBe(radio);
  expect(radio.id).toBe("pro-radio");
  expect(radio.getAttribute("aria-describedby")).toBe("own-hint");
  expect(document.querySelector('label[for="pro-radio"]')).not.toBeNull();
  const cost = document.getElementById("pro-cost");
  expect(cost?.className).toContain("cost");
  expect(document.querySelector(".uiify-badge")?.getAttribute("data-variant")).toBe("warning");
});

it("passes html-validate as server HTML", async () => {
  const markup = renderToStaticMarkup(<Plans />);
  const host = document.createElement("div");
  host.innerHTML = markup;
  for (const label of host.querySelectorAll("label")) {
    expect(label.querySelector("div, p")).toBeNull();
  }
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  const messages = report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
  expect(messages).toEqual([]);
});
