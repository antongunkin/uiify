import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar.js";

describe("Avatar", () => {
  it("renders the named fallback when no source is supplied", () => {
    render(<Avatar name="Ada Lovelace" fallback="AL" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar.tagName).toBe("SPAN");
    expect(avatar.classList.contains("uiify-avatar")).toBe(true);
    expect(avatar.hasAttribute("data-uiify-avatar")).toBe(false);
    expect(avatar.querySelector("img")).toBeNull();
    const fallback = avatar.querySelector(".uiify-avatar-fallback");
    expect(fallback?.textContent).toBe("AL");
    expect(fallback?.getAttribute("aria-hidden")).toBe("true");
    expect(fallback?.hasAttribute("data-part")).toBe(false);
  });

  it("renders an empty-alt image when a source is supplied", () => {
    render(<Avatar name="Ada Lovelace" fallback="AL" src="/ada.png" size="lg" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    const image = avatar.querySelector("img");
    expect(image?.classList.contains("uiify-avatar-image")).toBe(true);
    expect(image?.getAttribute("src")).toBe("/ada.png");
    expect(image?.getAttribute("alt")).toBe("");
    expect(image?.hasAttribute("data-part")).toBe(false);
    expect(avatar.querySelector(".uiify-avatar-fallback")).toBeNull();
    expect(avatar.getAttribute("data-size")).toBe("lg");
  });

  it("forwards slot props to the generated image and fallback", () => {
    const { rerender } = render(
      <Avatar
        fallback="AL"
        name="Ada Lovelace"
        slotProps={{ fallback: { className: "fallback", "data-testid": "avatar-fallback" } }}
      />,
    );
    expect(screen.getByTestId("avatar-fallback").className).toBe("uiify-avatar-fallback fallback");
    rerender(
      <Avatar
        fallback="AL"
        name="Ada Lovelace"
        slotProps={{ image: { className: "image", "data-testid": "avatar-image" } }}
        src="/ada.png"
      />,
    );
    expect(screen.getByTestId("avatar-image").className).toBe("uiify-avatar-image image");
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
