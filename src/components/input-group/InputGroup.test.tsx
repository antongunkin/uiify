import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputGroup, InputGroupAddon } from "./InputGroup.js";

describe("InputGroup", () => {
  it("composes labeled native input and a separate native action", () => {
    render(
      <>
        <label id="website-label" htmlFor="website">
          Website
        </label>
        <InputGroup>
          <InputGroupAddon align="start">https://</InputGroupAddon>
          <input id="website" aria-labelledby="website-label" name="website" type="url" />
          <InputGroupAddon align="end">
            <button type="button">Verify</button>
          </InputGroupAddon>
        </InputGroup>
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Website" }).getAttribute("type")).toBe("url");
    expect(screen.getByRole("button", { name: "Verify" })).toBeTruthy();
  });

  it("emits recipe identity while forwarding consumer attributes and styling", () => {
    render(
      <InputGroup
        className="consumer-group"
        data-uiify-input-group="changed"
        data-density="compact"
        style={{ inlineSize: "20rem" }}
      >
        <InputGroupAddon align="end" data-uiify-input-group="changed">
          Action
        </InputGroupAddon>
      </InputGroup>,
    );

    const group = screen.getByText("Action").parentElement;
    expect(group?.className).toBe("uiify-input-group consumer-group");
    expect(group?.hasAttribute("data-part")).toBe(false);
    expect(group?.getAttribute("data-uiify-input-group")).toBe("changed");
    expect(group?.getAttribute("data-density")).toBe("compact");
    expect(group?.style.inlineSize).toBe("20rem");
    expect(screen.getByText("Action").getAttribute("data-align")).toBe("end");
    expect(screen.getByText("Action").className).toBe("uiify-input-group-addon");
    expect(screen.getByText("Action").hasAttribute("data-part")).toBe(false);
    expect(screen.getByText("Action").getAttribute("data-uiify-input-group")).toBe("changed");
  });
});
