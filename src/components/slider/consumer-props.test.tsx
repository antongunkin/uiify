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

it("styles the Slider root with className and style, and the input through slotProps.input", () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <Slider
      aria-label="Volume"
      className="w-64"
      style={{ inlineSize: "10rem" }}
      ref={ref}
      slotProps={{
        input: { className: "accent", style: { cursor: "grab" }, "data-testid": "input" },
      }}
    />,
  );
  const input = screen.getByRole("slider", { name: "Volume" });
  expect(ref.current).toBe(input);
  expect(input).toBe(screen.getByTestId("input"));
  expect(input.className).toBe("uiify-slider-input accent");
  expect(input.style.cursor).toBe("grab");
  expect(input.parentElement?.className).toBe("uiify-slider w-64");
  expect(input.parentElement?.style.inlineSize).toBe("10rem");
});

it("renders SliderClient root and generated-part identities without legacy markers", () => {
  const { container } = render(
    <SliderClient
      defaultValue={[20, 80]}
      marks={[{ value: 50, label: "Half" }]}
      aria-label="Volume"
    />,
  );
  expect(container.querySelector(".uiify-slider-client")).toBeTruthy();
  expect(container.querySelector(".uiify-slider-track")).toBeTruthy();
  expect(container.querySelector(".uiify-slider-range")).toBeTruthy();
  expect(container.querySelector(".uiify-slider-mark")).toBeTruthy();
  expect(container.querySelector(".uiify-slider-thumb")).toBeTruthy();
  expect(container.querySelector(".uiify-slider-visual-thumb")).toBeTruthy();
  expect(container.querySelector("[data-uiify-slider-client]")).toBeNull();
  expect(container.querySelector('[data-part="track"]')).toBeNull();
});

it("lets native and slotted props replace slider defaults and geometry", () => {
  const nativeStyle = { "--consumer-value": "7%" } as CSSProperties;
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
  // The root draws the track, so `style` (and `className`) style it; the input keeps the rest.
  expect(native.parentElement?.style.getPropertyValue("--consumer-value")).toBe("7%");
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
