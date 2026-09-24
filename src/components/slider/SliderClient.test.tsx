import { act, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SliderClient } from "./client/SliderClient.js";

describe("SliderClient", () => {
  it("server-renders one native range input for a single value", () => {
    const html = renderToStaticMarkup(<SliderClient defaultValue={40} aria-label="Volume" />);
    expect(html).toContain('type="range"');
    expect(html).toContain('value="40"');
  });

  it("renders two named native inputs for an ordered range", () => {
    render(<SliderClient defaultValue={[20, 80]} thumbLabels={["Minimum", "Maximum"]} />);
    const lower = screen.getByRole("slider", { name: "Minimum" }) as HTMLInputElement;
    const upper = screen.getByRole("slider", { name: "Maximum" }) as HTMLInputElement;
    expect(lower.value).toBe("20");
    expect(upper.value).toBe("80");
    expect(lower.min).toBe("0");
    expect(lower.max).toBe("100");
    expect(upper.min).toBe("0");
    expect(upper.max).toBe("100");
  });

  it("gives range thumbs a usable name when labels are omitted", () => {
    render(<SliderClient defaultValue={[20, 80]} />);
    expect(screen.getByRole("slider", { name: "Minimum value" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Maximum value" })).toBeTruthy();
  });

  it("snaps a marked value and reports the ordered tuple", () => {
    const onValueChange = vi.fn();
    render(
      <SliderClient
        defaultValue={[0, 100]}
        marks={[{ value: 0 }, { value: 30 }, { value: 70 }, { value: 100 }]}
        step={null}
        thumbLabels={["Minimum", "Maximum"]}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(screen.getByRole("slider", { name: "Minimum" }), {
      target: { value: "42" },
    });
    expect(onValueChange).toHaveBeenLastCalledWith([30, 100]);
  });

  it("moves marks-only values to the adjacent stop with arrow keys", () => {
    render(
      <SliderClient
        defaultValue={30}
        marks={[{ value: 0 }, { value: 30 }, { value: 70 }, { value: 100 }]}
        step={null}
        aria-label="Temperature"
      />,
    );
    const input = screen.getByRole("slider", { name: "Temperature" });

    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect((input as HTMLInputElement).value).toBe("70");
    fireEvent.keyDown(input, { key: "ArrowLeft" });
    expect((input as HTMLInputElement).value).toBe("30");
  });

  it("uses up and down arrows for vertical marked values", () => {
    render(
      <SliderClient
        defaultValue={20}
        marks={[{ value: 0 }, { value: 20 }, { value: 40 }]}
        step={null}
        orientation="vertical"
        aria-label="Temperature"
      />,
    );
    const input = screen.getByRole("slider", { name: "Temperature" });

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect((input as HTMLInputElement).value).toBe("40");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect((input as HTMLInputElement).value).toBe("20");
  });

  it("normalizes an off-mark initial value to the nearest mark", () => {
    const html = renderToStaticMarkup(
      <SliderClient
        defaultValue={42}
        marks={[{ value: 0 }, { value: 30 }, { value: 70 }, { value: 100 }]}
        step={null}
        aria-label="Temperature"
      />,
    );
    expect(html).toContain('value="30"');
  });

  it("clamps a thumb at the other thumb instead of allowing it to cross", () => {
    const onValueChange = vi.fn();
    render(
      <SliderClient
        value={[30, 70]}
        marks={[{ value: 0 }, { value: 30 }, { value: 70 }, { value: 100 }]}
        step={null}
        thumbLabels={["Minimum", "Maximum"]}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(screen.getByRole("slider", { name: "Minimum" }), {
      target: { value: "90" },
    });
    expect(onValueChange).toHaveBeenLastCalledWith([70, 70]);
  });

  it("does not report changes from a disabled slider", () => {
    const onValueChange = vi.fn();
    render(
      <SliderClient defaultValue={40} disabled aria-label="Volume" onValueChange={onValueChange} />,
    );
    fireEvent.change(screen.getByRole("slider", { name: "Volume" }), {
      target: { value: "60" },
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("hydrates the initial value without a mismatch", async () => {
    const tree = <SliderClient defaultValue={35} aria-label="Volume" />;
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree);

    await act(async () => {
      hydrateRoot(container, tree);
    });

    expect((container.querySelector('input[type="range"]') as HTMLInputElement).value).toBe("35");
  });

  it("hydrates the controlled value and reports subsequent changes", async () => {
    const onValueChange = vi.fn();
    const tree = <SliderClient value={35} onValueChange={onValueChange} aria-label="Volume" />;
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree);

    await act(async () => {
      hydrateRoot(container, tree);
    });
    const input = container.querySelector('input[type="range"]');
    expect((input as HTMLInputElement).value).toBe("35");

    await act(async () => {
      fireEvent.change(input as HTMLInputElement, { target: { value: "50" } });
    });
    expect(onValueChange).toHaveBeenLastCalledWith(50);
  });
});
