import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Item, ItemActions, ItemContent, ItemMedia, ItemMetadata } from "./Item.js";

describe("Item", () => {
  it("renders a list item and keeps each content part separate", () => {
    render(
      <ul>
        <Item data-testid="item" data-uiify-item="consumer">
          <ItemMedia data-testid="media" data-part="consumer">
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
    expect(item.getAttribute("data-uiify-item")).toBe("");
    expect(within(item).getByRole("link", { name: "Mina Chen" }).getAttribute("href")).toBe(
      "#mina",
    );
    expect(screen.getByTestId("media").getAttribute("data-uiify-item-media")).toBe("");
    expect(screen.getByTestId("media").getAttribute("data-part")).toBe("media");
    expect(screen.getByTestId("content").getAttribute("data-uiify-item-content")).toBe("");
    expect(screen.getByTestId("content").getAttribute("data-part")).toBe("content");
    expect(screen.getByTestId("metadata").getAttribute("data-uiify-item-metadata")).toBe("");
    expect(screen.getByTestId("metadata").getAttribute("data-part")).toBe("metadata");
    expect(screen.getByTestId("actions").getAttribute("data-uiify-item-actions")).toBe("");
    expect(screen.getByTestId("actions").getAttribute("data-part")).toBe("actions");
    expect(within(item).getByRole("button", { name: "More actions" })).toBeTruthy();
  });
});
