import type { RgbColor, HslColor, HsbColor, ColorFormat, Color } from "./types.js";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createColor(rgb: RgbColor): Color {
  return {
    rgb: {
      r: clamp(Math.round(rgb.r), 0, 255),
      g: clamp(Math.round(rgb.g), 0, 255),
      b: clamp(Math.round(rgb.b), 0, 255),
      a: clamp(rgb.a, 0, 1),
    },
  };
}

export function rgbToHsl({ r, g, b, a }: RgbColor): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100, a };
}

export function hslToRgb({ h, s, l, a }: HslColor): RgbColor {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (h < 60) [rn, gn, bn] = [c, x, 0];
  else if (h < 120) [rn, gn, bn] = [x, c, 0];
  else if (h < 180) [rn, gn, bn] = [0, c, x];
  else if (h < 240) [rn, gn, bn] = [0, x, c];
  else if (h < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
    a,
  };
}

export function rgbToHsb({ r, g, b, a }: RgbColor): HsbColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const brightness = max * 100;
  return { h, s, b: brightness, a };
}

export function hsbToRgb({ h, s, b, a }: HsbColor): RgbColor {
  const sn = clamp(s, 0, 100) / 100;
  const bn = clamp(b, 0, 100) / 100;
  const c = bn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bn - c;
  let rn = 0;
  let gn = 0;
  let bl = 0;

  if (h < 60) [rn, gn, bl] = [c, x, 0];
  else if (h < 120) [rn, gn, bl] = [x, c, 0];
  else if (h < 180) [rn, gn, bl] = [0, c, x];
  else if (h < 240) [rn, gn, bl] = [0, x, c];
  else if (h < 300) [rn, gn, bl] = [x, 0, c];
  else [rn, gn, bl] = [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bl + m) * 255),
    a,
  };
}

function componentToHex(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

export function colorToHex(color: Color, includeAlpha = true): string {
  const { r, g, b, a } = color.rgb;
  const base = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  if (!includeAlpha || a >= 1) return base;
  return `${base}${componentToHex(a * 255)}`;
}

export function parseHex(input: string): Color | null {
  const value = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3,8}$/.test(value)) return null;
  const expanded =
    value.length === 3 || value.length === 4
      ? [...value].map((char) => char + char).join("")
      : value;
  if (expanded.length !== 6 && expanded.length !== 8) return null;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  const a = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;
  return createColor({ r, g, b, a });
}

export function formatColor(color: Color, format: ColorFormat): string {
  const { r, g, b, a } = color.rgb;
  switch (format) {
    case "hex":
      return colorToHex(color);
    case "rgb":
      return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    case "hsl": {
      const hsl = rgbToHsl(color.rgb);
      return a < 1
        ? `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${a})`
        : `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }
    case "hsb": {
      const hsb = rgbToHsb(color.rgb);
      return `hsb(${Math.round(hsb.h)}, ${Math.round(hsb.s)}%, ${Math.round(hsb.b)}%)`;
    }
  }
}

export function parseColor(input: string): Color | null {
  const hex = parseHex(input);
  if (hex) return hex;
  const rgbMatch = input.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch?.[1]) {
    const parts = rgbMatch[1].split(",").map((part) => part.trim());
    if (parts.length >= 3) {
      const [r, g, b, alpha = "1"] = parts;
      return createColor({
        r: Number(r),
        g: Number(g),
        b: Number(b),
        a: Number(alpha),
      });
    }
  }
  return null;
}

export function colorsEqual(a: Color, b: Color): boolean {
  return a.rgb.r === b.rgb.r && a.rgb.g === b.rgb.g && a.rgb.b === b.rgb.b && a.rgb.a === b.rgb.a;
}

export function roundTripRgbHsl(color: Color): Color {
  return createColor(hslToRgb(rgbToHsl(color.rgb)));
}

export function roundTripRgbHsb(color: Color): Color {
  return createColor(hsbToRgb(rgbToHsb(color.rgb)));
}
