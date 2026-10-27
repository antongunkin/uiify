import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RatingClient } from "./RatingClient.js";

describe("RatingClient", () => {
  it("selects a star uncontrolled and calls onValueChange", () => {
    const onValueChange = vi.fn();
    render(<RatingClient id="movie" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "4 stars", hidden: true }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(4);
    expect(
      (screen.getByRole("radio", { name: "4 stars", hidden: true }) as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("stays in sync with an externally-controlled value", () => {
    const { rerender } = render(<RatingClient id="movie" value={2} />);
    expect(
      (screen.getByRole("radio", { name: "2 stars", hidden: true }) as HTMLInputElement).checked,
    ).toBe(true);

    rerender(<RatingClient id="movie" value={5} />);
    expect(
      (screen.getByRole("radio", { name: "5 stars", hidden: true }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (screen.getByRole("radio", { name: "2 stars", hidden: true }) as HTMLInputElement).checked,
    ).toBe(false);
  });

  it("forwards native root props and repeated slot props", () => {
    render(
      <RatingClient
        data-testid="rating-client-root"
        id="movie"
        slotProps={{ input: { byItemValue: { "4": { "data-testid": "rating-client-input" } } } }}
      />,
    );

    expect(screen.getByTestId("rating-client-root").hasAttribute("data-uiify-rating")).toBe(true);
    expect(screen.getByTestId("rating-client-input").getAttribute("type")).toBe("radio");
  });
});
