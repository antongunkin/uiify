import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Item, ItemActions, ItemContent, ItemMedia, ItemMetadata } from "./Item.js";

describe("Item", () => {
  it("renders a list item and keeps each content part separate", () => {
    render(
      <ul>
        <Item data-testid="item" className="consumer">
          <ItemMedia data-testid="media">
            <img src="/avatar.png" alt="" />
          </ItemMedia>
          <ItemContent data-testid="content">
            <a href="#mina">Mina Chen</a>
          </ItemContent>
          <ItemMetadata data-testid="metadata">Design, updated today</ItemMetadata>
          <ItemActions data-testid="actions">
            <button type="button">More actions</button>
          </ItemActions>
        </Item>
      </ul>,
    );

    const item = screen.getByTestId("item");
    expect(item.tagName).toBe("LI");
    expect(item.classList.contains("uiify-item")).toBe(true);
    expect(item.classList.contains("consumer")).toBe(true);
    expect(item.hasAttribute("data-uiify-item")).toBe(false);
    expect(within(item).getByRole("link", { name: "Mina Chen" }).getAttribute("href")).toBe(
      "#mina",
    );
    expect(screen.getByTestId("media").classList.contains("uiify-item-media")).toBe(true);
    expect(screen.getByTestId("media").hasAttribute("data-uiify-item-media")).toBe(false);
    expect(screen.getByTestId("media").hasAttribute("data-part")).toBe(false);
    expect(screen.getByTestId("content").classList.contains("uiify-item-content")).toBe(true);
    expect(screen.getByTestId("content").hasAttribute("data-uiify-item-content")).toBe(false);
    expect(screen.getByTestId("content").hasAttribute("data-part")).toBe(false);
    expect(screen.getByTestId("metadata").classList.contains("uiify-item-metadata")).toBe(true);
    expect(screen.getByTestId("metadata").hasAttribute("data-uiify-item-metadata")).toBe(false);
    expect(screen.getByTestId("metadata").hasAttribute("data-part")).toBe(false);
    expect(screen.getByTestId("actions").classList.contains("uiify-item-actions")).toBe(true);
    expect(screen.getByTestId("actions").hasAttribute("data-uiify-item-actions")).toBe(false);
    expect(screen.getByTestId("actions").hasAttribute("data-part")).toBe(false);
    expect(within(item).getByRole("button", { name: "More actions" })).toBeTruthy();
  });
});
