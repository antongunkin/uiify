import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Rating } from "./Rating.js";

describe("Rating", () => {
  it("renders one native radio per star, no button/role=radio shell", () => {
    render(<Rating defaultValue={3} id="movie" />);

    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(5);
    expect(document.querySelectorAll('[role="radiogroup"]')).toHaveLength(0);
  });

  it("respects a custom max", () => {
    render(<Rating id="movie" max={10} />);
    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(10);
  });

  it("checks only the single radio matching defaultValue — the fill-through is CSS, not multiple checked inputs", () => {
    render(<Rating defaultValue={3} id="movie" />);
    const radios = screen.getAllByRole("radio", { hidden: true }) as HTMLInputElement[];
    expect(radios.map((radio) => radio.checked)).toEqual([false, false, true, false, false]);
  });

  it("disables every star when disabled", () => {
    render(<Rating disabled id="movie" />);
    const radios = screen.getAllByRole("radio", { hidden: true }) as HTMLInputElement[];
    expect(radios.every((radio) => radio.disabled)).toBe(true);
  });

  it("disables every star when readOnly, marking data-readonly not data-disabled", () => {
    render(<Rating id="movie" readOnly />);
    const radios = screen.getAllByRole("radio", { hidden: true }) as HTMLInputElement[];
    expect(radios.every((radio) => radio.disabled)).toBe(true);
    const root = document.querySelector("[data-uiify-rating]");
    expect(root?.hasAttribute("data-readonly")).toBe(true);
    expect(root?.hasAttribute("data-disabled")).toBe(false);
  });

  it("gives every star a visually-hidden accessible name and hides the glyph", () => {
    render(<Rating id="movie" />);
    expect(screen.getByRole("radio", { name: "3 stars", hidden: true })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "1 star", hidden: true })).toBeTruthy();
  });

  it("renders checked state in SSR markup, no input beyond the radios", () => {
    const html = assertSSRRenderable(<Rating defaultValue={2} id="movie" />);
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="movie"');
    expect((html.match(/checked=""/g) ?? []).length).toBe(1);
  });
});
