// Review Focus 4: the choice-card pattern is valid HTML as it leaves the server (no div or p
// inside label), checked by html-validate with the package's .htmlvalidate.json.
import { FileSystemConfigLoader, HtmlValidate, type ConfigData } from "html-validate";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../field/index.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { RadioGroup, RadioGroupItem } from "./index.js";

const htmlValidate = new HtmlValidate(new FileSystemConfigLoader());
// The file loader finds .htmlvalidate.json by walking up from this path.
const configFilename = resolve(dirname(fileURLToPath(import.meta.url)), "choice-card.html");
// React writes boolean attributes as `checked=""`, the "empty" style.
const reactBooleans: ConfigData = {
  rules: { "attribute-boolean-style": ["error", { style: "empty" }] },
};
const page = (body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Fixture</title></head><body><main>${body}</main></body></html>`;

function ChoiceCards() {
  return (
    <RadioGroup aria-label="Plan">
      <Field orientation="horizontal" variant="card">
        <RadioGroupItem name="plan" value="free" id="plan-free" aria-describedby="plan-free-hint" />
        <FieldContent>
          <FieldLabel htmlFor="plan-free">Free</FieldLabel>
          <FieldDescription id="plan-free-hint">One project.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" variant="card">
        <RadioGroupItem
          name="plan"
          value="pro"
          id="plan-pro"
          aria-describedby="plan-pro-hint"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel htmlFor="plan-pro">Pro</FieldLabel>
          <FieldDescription id="plan-pro-hint">$12 a month, billed yearly.</FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  );
}
ChoiceCards.displayName = "ChoiceCards";

it("choice card pattern passes html-validate", async () => {
  const markup = renderToStaticMarkup(<ChoiceCards />);
  const host = document.createElement("div");
  host.innerHTML = markup;
  for (const label of host.querySelectorAll("label")) {
    expect(label.querySelector("div, p")).toBeNull();
  }
  expect(host.querySelectorAll('[data-variant="card"]')).toHaveLength(2);

  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  const messages = report.results.flatMap((result) =>
    result.messages.map((message) => `${message.ruleId}: ${message.message}`),
  );
  expect(messages).toEqual([]);
});

it("html-validate rejects the label-wraps-Field shape", async () => {
  const markup = renderToStaticMarkup(
    <FieldLabel htmlFor="plan-pro">
      <Field orientation="horizontal">
        <RadioGroupItem name="plan" value="pro" id="plan-pro" />
        <FieldContent>Pro</FieldContent>
      </Field>
    </FieldLabel>,
  );
  const report = await htmlValidate.validateString(page(markup), configFilename, reactBooleans);
  expect(report.valid).toBe(false);
});
