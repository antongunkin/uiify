import { describe, expect, it } from "vitest";
import {
  colorToHex,
  createColor,
  formatColor,
  hsbToRgb,
  hslToRgb,
  parseColor,
  parseHex,
  rgbToHsb,
  rgbToHsl,
  roundTripRgbHsb,
  roundTripRgbHsl,
} from "./color.js";

describe("color math", () => {
  it("converts RGB to hex and back", () => {
    const color = createColor({ r: 255, g: 128, b: 0, a: 1 });
    expect(colorToHex(color)).toBe("#ff8000");
    expect(parseHex("#ff8000")?.rgb).toEqual(color.rgb);
  });

  it("round-trips RGB through HSL", () => {
    const color = createColor({ r: 64, g: 128, b: 200, a: 1 });
    const roundTripped = roundTripRgbHsl(color);
    expect(roundTripped.rgb.r).toBe(color.rgb.r);
    expect(roundTripped.rgb.g).toBe(color.rgb.g);
    expect(roundTripped.rgb.b).toBe(color.rgb.b);
  });

  it("round-trips RGB through HSB", () => {
    const color = createColor({ r: 64, g: 128, b: 200, a: 1 });
    const roundTripped = roundTripRgbHsb(color);
    expect(roundTripped.rgb.r).toBe(color.rgb.r);
    expect(roundTripped.rgb.g).toBe(color.rgb.g);
    expect(roundTripped.rgb.b).toBe(color.rgb.b);
  });

  it("clamps channel values", () => {
    const color = createColor({ r: 300, g: -10, b: 50, a: 2 });
    expect(color.rgb).toEqual({ r: 255, g: 0, b: 50, a: 1 });
  });

  it("formats colors in each format", () => {
    const color = createColor({ r: 255, g: 0, b: 0, a: 1 });
    expect(formatColor(color, "hex")).toBe("#ff0000");
    expect(formatColor(color, "rgb")).toBe("rgb(255, 0, 0)");
    expect(formatColor(color, "hsl")).toMatch(/^hsl\(/);
    expect(formatColor(color, "hsb")).toMatch(/^hsb\(/);
  });

  it("parses rgba strings", () => {
    const parsed = parseColor("rgba(10, 20, 30, 0.5)");
    expect(parsed?.rgb).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it("converts hsl to rgb directly", () => {
    const rgb = hslToRgb({ h: 120, s: 100, l: 50, a: 1 });
    expect(rgb.g).toBeGreaterThan(rgb.r);
    expect(rgb.g).toBeGreaterThan(rgb.b);
  });

  it("converts hsb to rgb directly", () => {
    const rgb = hsbToRgb({ h: 240, s: 100, b: 100, a: 1 });
    expect(rgb.b).toBeGreaterThan(rgb.r);
  });

  it("converts rgb to hsl and hsb", () => {
    const rgb = { r: 0, g: 255, b: 0, a: 1 };
    expect(rgbToHsl(rgb).h).toBeCloseTo(120, 0);
    expect(rgbToHsb(rgb).h).toBeCloseTo(120, 0);
  });
});
