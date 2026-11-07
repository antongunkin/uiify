import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { CheckboxGroup } from "./CheckboxGroup.js";

const items = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
] as const;

describe("CheckboxGroup", () => {
  it("renders a native fieldset named by its legend", () => {
    render(
      <CheckboxGroup
        defaultValue={["email"]}
        id="contact"
        items={items}
        label="Contact preferences"
      />,
    );

    const group = screen.getByRole("group", { name: "Contact preferences" });
    expect(group.localName).toBe("fieldset");
    expect(group.className).toContain("uiify-checkbox-group");
    expect(group.getAttribute("data-orientation")).toBe("vertical");
    expect(screen.getByText("Contact preferences").localName).toBe("legend");
  });

  it("maps defaultValue to defaultChecked and forwards name and value", () => {
    render(<CheckboxGroup defaultValue={["email"]} id="contact" items={items} name="contact" />);

    const email = screen.getByRole("checkbox", { name: "Email" }) as HTMLInputElement;
    const sms = screen.getByRole("checkbox", { name: "Text message" }) as HTMLInputElement;
    expect(email.checked).toBe(true);
    expect(email.name).toBe("contact");
    expect(email.value).toBe("email");
    expect(sms.checked).toBe(false);
    expect(email.id).toBe("contact-email");
    expect(sms.id).toBe("contact-sms");
  });

  it("submits every checked item under the shared name", () => {
    const { container } = render(
      <form>
        <CheckboxGroup defaultValue={["email", "sms"]} id="contact" items={items} name="contact" />
      </form>,
    );

    const form = container.querySelector("form")!;
    expect([...new FormData(form).getAll("contact")]).toEqual(["email", "sms"]);
  });

  it("names a legend-less group with aria-label", () => {
    render(<CheckboxGroup aria-label="Channels" id="channels" items={items} />);

    const group = screen.getByRole("group", { name: "Channels" });
    expect(group.hasAttribute("data-required")).toBe(false);
    expect(group.hasAttribute("data-invalid")).toBe(false);
  });

  it("propagates disabled items and the group state", () => {
    render(
      <CheckboxGroup
        disabled
        id="contact"
        invalid
        items={[
          { value: "email", label: "Email" },
          { value: "sms", label: "Text message", disabled: true },
        ]}
        required
      />,
    );

    const group = screen.getByRole("group");
    expect(group.getAttribute("data-disabled")).toBe("");
    expect(group.getAttribute("data-required")).toBe("");
    expect(group.getAttribute("data-invalid")).toBe("");
    expect(group.getAttribute("aria-invalid")).toBe("true");
    for (const checkbox of screen.getAllByRole("checkbox"))
      expect((checkbox as HTMLInputElement).disabled).toBe(true);
  });

  it("renders horizontal orientation for the group contract", () => {
    const markup = renderToStaticMarkup(
      <CheckboxGroup id="contact" items={items} orientation="horizontal" />,
    );
    expect(markup).toContain('data-orientation="horizontal"');
    expect(markup).toContain("<fieldset");
  });

  it("forwards repeated input and label slots plus the legend slot", () => {
    render(
      <CheckboxGroup
        id="contact"
        items={items}
        label="Contact preferences"
        slotProps={{
          legend: { "data-testid": "group-legend", className: "legend-class" },
          input: {
            className: "input-class",
            byItemValue: { email: { "data-testid": "email-input" } },
          },
          label: { byItemValue: { sms: { "data-testid": "sms-label" } } },
        }}
      />,
    );

    expect(screen.getByTestId("group-legend").className).toContain("legend-class");
    expect(screen.getByTestId("email-input").className).toContain("input-class");
    expect(screen.getByTestId("sms-label").textContent).toContain("Text message");
  });

  it("renders the server-readable legend, name and initial checked state", () => {
    const markup = renderToStaticMarkup(
      <CheckboxGroup
        defaultValue={["sms"]}
        id="contact"
        items={items}
        label="Contact preferences"
        name="contact"
      />,
    );
    expect(markup).toContain("<legend");
    expect(markup).toContain('id="contact-sms"');
    expect(markup).toMatch(/id="contact-sms"[^>]*checked/);
    expect(markup).not.toMatch(/id="contact-email"[^>]*checked/);
  });
});
