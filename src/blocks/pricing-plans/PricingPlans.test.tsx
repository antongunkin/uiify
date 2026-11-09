// PricingPlans: a labelled section with a native period switch and plan cards, valid as server HTML.
import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { Button } from "../../components/button/index.js";
import { renderToStaticMarkup } from "../../components/test-utils/ssr.js";
import { PricingPlan, PricingPlans } from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "pricing-plans.html");
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

function Pricing() {
  return (
    <PricingPlans
      id="pricing"
      title="Pricing"
      description="Start free, upgrade when you grow."
      periods={{ month: "Monthly", year: "Yearly" }}
      defaultPeriod="year"
    >
      <PricingPlan
        name="Free"
        price="$0"
        description="For trying it out."
        features={["One project"]}
        action={<Button href="/signup">Choose Free</Button>}
      />
      <PricingPlan
        name="Pro"
        price={{ month: "$12", year: "$120" }}
        period={{ month: "per month", year: "per year" }}
        features={["Unlimited projects", "Priority support"]}
        action={{
          month: <Button href="/signup?plan=pro&period=month">Choose Pro</Button>,
          year: <Button href="/signup?plan=pro&period=year">Choose Pro yearly</Button>,
        }}
        recommended="Most popular"
      />
    </PricingPlans>
  );
}
Pricing.displayName = "Pricing";

it("labels the section by its heading and lists one card per plan", () => {
  render(<Pricing />);
  const section = screen.getByRole("region", { name: "Pricing" });
  expect(section.id).toBe("pricing");
  const list = section.querySelector(".uiify-pricing-plans-list")!;
  expect(list.tagName).toBe("UL");
  const plans = [...list.children] as HTMLElement[];
  expect(plans.every((plan) => plan.tagName === "LI")).toBe(true);
  expect(plans).toHaveLength(2);
  expect(within(plans[1]!).getByRole("heading", { level: 3, name: "Pro" })).toBeTruthy();
  // The list wraps each plan card in its own item.
  const cards = plans.map((plan) => plan.firstElementChild as HTMLElement);
  expect(cards.every((card) => card.classList.contains("uiify-card"))).toBe(true);
  expect(cards[1]!.hasAttribute("data-recommended")).toBe(true);
  expect(within(plans[1]!).getByText("Most popular")).toBeTruthy();
  expect(cards[0]!.hasAttribute("data-recommended")).toBe(false);
});

it("renders a native month/year switch with the default period checked", () => {
  render(<Pricing />);
  const group = screen.getByRole("radiogroup", { name: "Billing period" });
  const year = within(group).getByRole("radio", { name: "Yearly" }) as HTMLInputElement;
  const month = within(group).getByRole("radio", { name: "Monthly" }) as HTMLInputElement;
  expect(year.checked).toBe(true);
  expect(month.checked).toBe(false);
  expect(year.value).toBe("year");
  expect(year.name).toBe("pricing-period");
  expect(group.closest(".uiify-pricing-plans-control")).toBe(group);
});

it("renders both values of a per-period price, label and action, marked for the switch", () => {
  const { container } = render(<Pricing />);
  const marked = (period: string) =>
    [...container.querySelectorAll(`[data-period="${period}"]`)].map((node) => node.textContent);
  expect(marked("month")).toEqual(["$12", "per month", "Choose Pro"]);
  expect(marked("year")).toEqual(["$120", "per year", "Choose Pro yearly"]);
  // A single value is not marked: it shows for both periods.
  expect(screen.getByText("$0").closest("[data-period]")).toBeNull();
});

it("renders no switch, heading or labelling without periods and title", () => {
  render(
    <PricingPlans id="plans">
      <PricingPlan name="Team" price="$20" />
    </PricingPlans>,
  );
  expect(screen.queryByRole("radiogroup")).toBeNull();
  const section = document.getElementById("plans")!;
  expect(section.hasAttribute("aria-labelledby")).toBe(false);
  expect(section.querySelector("h2")).toBeNull();
  expect(section.querySelector(".uiify-pricing-plans-features")).toBeNull();
  expect(section.querySelector(".uiify-card-footer")).toBeNull();
});

it("translates the switch name through labels and sets the heading levels", () => {
  render(
    <PricingPlans
      id="p"
      title="Tarifs"
      level={3}
      periods={{ month: "Mois", year: "An" }}
      labels={{ period: "Période" }}
    >
      <PricingPlan name="Pro" price="$12" level={4} />
    </PricingPlans>,
  );
  expect(screen.getByRole("radiogroup", { name: "Période" })).toBeTruthy();
  expect(screen.getByRole("heading", { level: 3, name: "Tarifs" })).toBeTruthy();
  expect(screen.getByRole("heading", { level: 4, name: "Pro" })).toBeTruthy();
});

it("lets consumer root and slot props win and composes className and ref", () => {
  const sectionRef = createRef<HTMLElement>();
  const planRef = createRef<HTMLDivElement>();
  render(
    <PricingPlans
      ref={sectionRef}
      id="p"
      title="Pricing"
      aria-label="Plans"
      className="custom"
      slotProps={{
        title: { id: "own-title" },
        list: { className: "own-list", "aria-label": "Plan list" },
      }}
    >
      <PricingPlan
        ref={planRef}
        name="Pro"
        price="$12"
        recommended="Best"
        className="plan"
        data-recommended="custom"
        slotProps={{ badge: { variant: "outline" }, price: { className: "own-price" } }}
      />
    </PricingPlans>,
  );
  const section = sectionRef.current!;
  expect(section.className).toContain("uiify-pricing-plans");
  expect(section.className).toContain("custom");
  expect(section.getAttribute("aria-label")).toBe("Plans");
  expect(section.getAttribute("aria-labelledby")).toBe("own-title");
  expect(document.getElementById("own-title")?.textContent).toBe("Pricing");
  const list = screen.getByRole("list", { name: "Plan list" });
  expect(list.className).toContain("uiify-pricing-plans-list");
  expect(list.className).toContain("own-list");
  const plan = planRef.current!;
  expect(plan.tagName).toBe("DIV");
  expect(plan.parentElement?.tagName).toBe("LI");
  expect(plan.className).toContain("plan");
  expect(plan.getAttribute("data-recommended")).toBe("custom");
  expect(plan.querySelector(".uiify-badge")?.getAttribute("data-variant")).toBe("outline");
  expect(plan.querySelector(".uiify-pricing-plans-price")?.className).toContain("own-price");
});

it("fits the default columns to the number of plans, at most four", () => {
  const columnsOf = (count: number) => {
    const { container, unmount } = render(
      <PricingPlans id={`p${count}`}>
        {Array.from({ length: count }, (_, index) => (
          <PricingPlan key={index} name={`Plan ${index}`} price="$1" />
        ))}
      </PricingPlans>,
    );
    const list = container.querySelector("ul")!;
    const attributes = Object.fromEntries(
      [...list.attributes].filter((a) => a.name.startsWith("data-")).map((a) => [a.name, a.value]),
    );
    unmount();
    return JSON.stringify(attributes);
  };
  expect(columnsOf(3)).not.toBe(columnsOf(2));
  expect(columnsOf(6)).toBe(columnsOf(4));
});

it("keeps a plan valid outside PricingPlans: a card, not a list item", async () => {
  const markup = renderToStaticMarkup(
    <div>
      <PricingPlan name="Free" price="$0" />
      <PricingPlan name="Pro" price="$12" recommended="Most popular" />
    </div>,
  );
  expect(markup).not.toContain("<li");
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  expect(report.results.flatMap((result) => result.messages.map((m) => m.ruleId))).toEqual([]);
});

it("passes html-validate as server HTML", async () => {
  const markup = renderToStaticMarkup(<Pricing />);
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  const messages = report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
  expect(messages).toEqual([]);
});
