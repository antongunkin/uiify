"use client";

import { useMemo } from "react";
import type { ReactElement, SyntheticEvent } from "react";
import { useControllableState, useId } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { Popup } from "../popup/index.js";
import { Slider } from "../slider/Slider.js";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { colorToHex, createColor, formatColor, hsbToRgb, parseHex, rgbToHsb } from "./color.js";
import type {
  Color,
  ColorPickerContextValue,
  ColorPickerRootProps,
  ColorPickerTriggerOwnProps,
  ColorPickerContentOwnProps,
  ColorPickerAreaOwnProps,
  ColorPickerSliderOwnProps,
  ColorPickerSwatchOwnProps,
  ColorPickerSwatchGroupOwnProps,
  ColorPickerFieldOwnProps,
} from "./types.js";

export type { Color, ColorFormat } from "./types.js";

const [ColorPickerProvider, useColorPickerContext] =
  createPartContext<ColorPickerContextValue>("ColorPicker");

export function ColorPickerRoot(props: ColorPickerRootProps): ReactElement | null {
  const {
    alpha = true,
    children,
    defaultValue = createColor({ r: 255, g: 0, b: 0, a: 1 }),
    format = "hex",
    onChange,
    value: controlledValue,
  } = props;

  const [color, setColor] = useControllableState<Color>({
    defaultValue,
    ...(controlledValue !== undefined ? { value: controlledValue } : {}),
    ...(onChange ? { onChange } : {}),
  });
  const popoverId = useId(undefined, "uiify-color-picker");

  const contextValue = useMemo(
    () => ({ alpha, color, format, popoverId, setColor }),
    [alpha, color, format, popoverId, setColor],
  );

  return (
    <ColorPickerProvider value={contextValue}>
      <Popup.Root id={popoverId}>{children}</Popup.Root>
    </ColorPickerProvider>
  );
}
ColorPickerRoot.displayName = "ColorPickerRoot";

export function ColorPickerTrigger(props: ColorPickerTriggerOwnProps): ReactElement | null {
  const { children, className } = props;
  const { color, popoverId } = useColorPickerContext("Trigger");

  return (
    <Popup.Trigger __popupId={popoverId} {...(className ? { className } : {})}>
      {children ?? colorToHex(color)}
    </Popup.Trigger>
  );
}
ColorPickerTrigger.displayName = "ColorPickerTrigger";

export function ColorPickerContent(props: ColorPickerContentOwnProps): ReactElement | null {
  const { children, className } = props;
  const { popoverId } = useColorPickerContext("Content");
  return (
    <Popup.Content __popupId={popoverId} {...(className ? { className } : {})}>
      {children}
    </Popup.Content>
  );
}
ColorPickerContent.displayName = "ColorPickerContent";

export function ColorPickerArea(props: ColorPickerAreaOwnProps): ReactElement | null {
  const { className } = props;
  const { color, setColor } = useColorPickerContext("Area");
  const hsb = rgbToHsb(color.rgb);

  return (
    <div
      className={className}
      data-channel="area"
      style={{
        background: `hsl(${Math.round(hsb.h)}, 100%, 50%)`,
      }}
    >
      <Slider
        aria-label="Saturation"
        max={100}
        min={0}
        onValueChange={(value) => {
          setColor(createColor(hsbToRgb({ ...hsb, s: value })));
        }}
        step={1}
        value={hsb.s}
      />
      <Slider
        aria-label="Brightness"
        max={100}
        min={0}
        onValueChange={(value) => {
          setColor(createColor(hsbToRgb({ ...hsb, b: value })));
        }}
        step={1}
        value={hsb.b}
      />
    </div>
  );
}
ColorPickerArea.displayName = "ColorPickerArea";

export function ColorPickerSlider(props: ColorPickerSliderOwnProps): ReactElement | null {
  const { channel, className } = props;
  const { alpha, color, setColor } = useColorPickerContext("Slider");
  const hsb = rgbToHsb(color.rgb);

  if (channel === "alpha" && !alpha) return null;

  const value = channel === "hue" ? hsb.h : color.rgb.a * 100;
  const max = channel === "hue" ? 360 : 100;

  return (
    <Slider
      aria-label={channel}
      aria-valuetext={String(Math.round(value))}
      className={className}
      max={max}
      min={0}
      onValueChange={(next) => {
        if (channel === "hue") {
          setColor(createColor(hsbToRgb({ ...hsb, h: next })));
        } else {
          setColor(createColor({ ...color.rgb, a: next / 100 }));
        }
      }}
      step={1}
      value={value}
    />
  );
}
ColorPickerSlider.displayName = "ColorPickerSlider";

export function ColorPickerSwatch(props: ColorPickerSwatchOwnProps): ReactElement | null {
  const { className, value } = props;
  const { setColor } = useColorPickerContext("Swatch");
  const parsed = parseHex(value) ?? createColor({ r: 0, g: 0, b: 0, a: 1 });

  return useRenderElement({
    defaultTag: "button",
    props: {
      type: "button",
      "aria-label": value,
      "data-value": value,
      style: { backgroundColor: value },
      ...(className ? { className } : {}),
      onClick: () => setColor(parsed),
    },
    state: {},
  });
}

export function ColorPickerSwatchGroup(props: ColorPickerSwatchGroupOwnProps): ReactElement | null {
  const { children, className, swatches = [] } = props;

  return useRenderElement({
    defaultTag: "div",
    props: {
      role: "group",
      ...(className ? { className } : {}),
      children:
        children ?? swatches.map((swatch) => <ColorPickerSwatch key={swatch} value={swatch} />),
    },
    state: {},
  });
}

export function ColorPickerField(props: ColorPickerFieldOwnProps): ReactElement | null {
  const { className } = props;
  const { color, format, setColor } = useColorPickerContext("Field");

  return useRenderElement({
    defaultTag: "input",
    props: {
      type: "text",
      "aria-label": "Color value",
      value: formatColor(color, format),
      ...(className ? { className } : {}),
      onChange(event: SyntheticEvent<HTMLInputElement>) {
        const parsed = parseHex(event.currentTarget.value);
        if (parsed) setColor(parsed);
      },
    },
    state: {},
  });
}

export const ColorPicker = {
  Area: ColorPickerArea,
  Content: ColorPickerContent,
  Field: ColorPickerField,
  Root: ColorPickerRoot,
  Slider: ColorPickerSlider,
  Swatch: ColorPickerSwatch,
  SwatchGroup: ColorPickerSwatchGroup,
  Trigger: ColorPickerTrigger,
};
