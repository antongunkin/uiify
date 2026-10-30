import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, type CSSProperties } from "react";
import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Slider } from "./Slider.js";
import { SliderClient } from "./client/SliderClient.js";

function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}

it("preserves default slider DOM", () => {
  expect({
    native: outline(renderToStaticMarkup(<Slider defaultValue={20} aria-label="Volume" />)),
    single: outline(
      renderToStaticMarkup(
        <SliderClient
          defaultValue={20}
          aria-label="Volume"
          marks={[{ value: 50, label: "Half" }]}
        />,
      ),
    ),
    range: outline(renderToStaticMarkup(<SliderClient defaultValue={[20, 80]} />)),
  }).toMatchSnapshot();
});

it("lets native and slotted props replace slider defaults and geometry", () => {
  const nativeStyle = { "--uiify-slider-progress": "7%" } as CSSProperties;
  const { container } = render(
    <>
      <Slider
        defaultValue={20}
        type="text"
        data-uiify-slider={undefined}
        data-state="custom"
        style={nativeStyle}
        data-testid="native"
      />
      <SliderClient
        defaultValue={[20, 80]}
        role="note"
        data-state="custom"
        data-testid="client"
        style={{ "--uiify-slider-start": "7%" } as CSSProperties}
        marks={[{ value: 50 }, { value: 50 }]}
        slotProps={{
          track: { "aria-hidden": undefined, "data-part": "custom-track", "data-testid": "track" },
          range: { "data-part": "custom-range", "data-testid": "range" },
          input: {
            "aria-label": undefined,
            byItemValue: {
              minimum: {
                type: "number",
                min: 5,
                max: 90,
                step: 5,
                value: 30,
                disabled: true,
                "data-state": "custom",
                "data-part": "custom-input",
                "data-testid": "lower",
              },
            },
          },
          mark: {
            "data-part": "common-mark",
            byItemValue: { "50": { "data-part": "value-mark" } },
            byItemIndex: {
              1: {
                "data-part": "indexed-mark",
                "data-testid": "mark",
                style: { "--uiify-slider-position": "7%" } as CSSProperties,
              },
            },
          },
          visualThumb: {
            byItemValue: {
              minimum: {
                "data-part": "custom-thumb",
                "data-testid": "thumb",
                style: { "--uiify-slider-position": "7%" } as CSSProperties,
              },
            },
          },
        }}
      />
    </>,
  );
  const native = screen.getByTestId("native");
  expect(native.getAttribute("type")).toBe("text");
  expect(native.hasAttribute("data-uiify-slider")).toBe(false);
  expect(native.getAttribute("data-state")).toBe("custom");
  expect(native.style.getPropertyValue("--uiify-slider-progress")).toBe("7%");
  expect(screen.getByTestId("client").getAttribute("role")).toBe("note");
  expect(screen.getByTestId("client").getAttribute("data-state")).toBe("custom");
  expect(screen.getByTestId("client").style.getPropertyValue("--uiify-slider-start")).toBe("7%");
  expect(screen.getByTestId("track").hasAttribute("aria-hidden")).toBe(false);
  expect(screen.getByTestId("track").getAttribute("data-part")).toBe("custom-track");
  expect(screen.getByTestId("range").getAttribute("data-part")).toBe("custom-range");
  const lower = screen.getByTestId<HTMLInputElement>("lower");
  expect([lower.type, lower.min, lower.max, lower.step, lower.value, lower.disabled]).toEqual([
    "number",
    "5",
    "90",
    "5",
    "30",
    true,
  ]);
  expect(lower.hasAttribute("aria-label")).toBe(false);
  expect(lower.getAttribute("data-part")).toBe("custom-input");
  expect(screen.getByTestId("mark").getAttribute("data-part")).toBe("indexed-mark");
  expect(container.querySelector('[data-part="value-mark"]')).toBeTruthy();
  expect(screen.getByTestId("mark").style.getPropertyValue("--uiify-slider-position")).toBe("7%");
  expect(screen.getByTestId("thumb").style.getPropertyValue("--uiify-slider-position")).toBe("7%");
});

it("composes common and item handlers, honors keyboard veto and cleans up both refs", () => {
  const order: string[] = [];
  const firstCleanup = vi.fn();
  const secondCleanup = vi.fn();
  const firstRef = vi.fn(() => firstCleanup);
  const secondRef = vi.fn(() => secondCleanup);
  const rootRef = createRef<HTMLDivElement>();
  const onValueChange = vi.fn();
  const { unmount } = render(
    <SliderClient
      ref={rootRef}
      defaultValue={50}
      step={null}
      marks={[{ value: 0 }, { value: 50 }, { value: 100 }]}
      onValueChange={onValueChange}
      slotProps={{
        input: {
          ref: firstRef,
          onKeyDown: (event) => {
            order.push("common");
            event.preventDefault();
          },
          byItemValue: {
            value: {
              ref: secondRef,
              onKeyDown: () => {
                order.push("item");
              },
            },
          },
        },
      }}
    />,
  );
  const input = screen.getByRole<HTMLInputElement>("slider");
  expect(firstRef).toHaveBeenCalledWith(input);
  expect(secondRef).toHaveBeenCalledWith(input);
  expect(rootRef.current).toBeTruthy();
  fireEvent.keyDown(input, { key: "ArrowRight" });
  expect(order).toEqual(["common", "item"]);
  expect(input.value).toBe("50");
  expect(onValueChange).not.toHaveBeenCalled();
  unmount();
  expect(firstCleanup).toHaveBeenCalled();
  expect(secondCleanup).toHaveBeenCalled();
  expect(rootRef.current).toBeNull();
});

it("keeps consumer native progress styles after change, including undefined removal", () => {
  const { rerender } = render(
    <Slider
      defaultValue={20}
      style={{ "--uiify-slider-progress": "7%" } as CSSProperties}
      aria-label="Volume"
    />,
  );
  const slider = screen.getByRole("slider");
  fireEvent.change(slider, { target: { value: "42" } });
  expect(slider.style.getPropertyValue("--uiify-slider-progress")).toBe("7%");
  rerender(
    <Slider
      defaultValue={20}
      style={{ "--uiify-slider-progress": undefined } as CSSProperties}
      aria-label="Volume"
    />,
  );
  fireEvent.change(slider, { target: { value: "43" } });
  expect(slider.style.getPropertyValue("--uiify-slider-progress")).toBe("");
});
