import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar.js";

describe("Avatar", () => {
  it("renders the named fallback when no source is supplied", () => {
    render(<Avatar name="Ada Lovelace" fallback="AL" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar.tagName).toBe("SPAN");
    expect(avatar.querySelector("img")).toBeNull();
    expect(avatar.querySelector('[data-part="fallback"]')?.textContent).toBe("AL");
    expect(avatar.querySelector('[data-part="fallback"]')?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("renders an empty-alt image when a source is supplied", () => {
    render(<Avatar name="Ada Lovelace" fallback="AL" src="/ada.png" size="lg" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    const image = avatar.querySelector("img");
    expect(image?.getAttribute("src")).toBe("/ada.png");
    expect(image?.getAttribute("alt")).toBe("");
    expect(avatar.querySelector('[data-part="fallback"]')).toBeNull();
    expect(avatar.getAttribute("data-size")).toBe("lg");
  });

  it("allows adjacent text to make the avatar decorative", () => {
    render(
      <>
        <Avatar aria-hidden="true" name="Ada Lovelace" fallback="AL" />
        <span>Ada Lovelace</span>
      </>,
    );
    expect(screen.getByText("AL").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });
});
