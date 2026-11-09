import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Keyboard focus must stay visible: a solid outline in `--ring`, at least 3:1 against the surfaces
 * (WCAG 1.4.11). A translucent `box-shadow` halo measured 1.34:1 and disappears in forced colors.
 */
const read = (path: string) => readFileSync(resolve(import.meta.dirname, path), "utf8");
const compiled = read("generated/uiify.css");
const authored = `${read("base.css")}\n${read("uiify/effects.css")}`;
const theme = read("themes/basic.css");

/** Rules whose selector targets keyboard focus. */
function focusRules(css: string): { selector: string; body: string }[] {
  const rules: { selector: string; body: string }[] = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1]!.trim();
    if (/:focus-visible|:focus-within/.test(selector)) rules.push({ selector, body: match[2]! });
  }
  return rules;
}

describe("focus indicator", () => {
  it("is never a translucent ring or box-shadow", () => {
    const halos = [...focusRules(compiled), ...focusRules(authored)].filter(({ body }) =>
      /--tw-ring-color|box-shadow:[^;]*var\(--(ring|destructive)\)/.test(body),
    );
    expect(halos.map(({ selector }) => selector)).toEqual([]);
  });

  it.each([
    ".uiify-button:focus-visible",
    ".uiify-input:focus-visible",
    ".uiify-textarea:focus-visible",
    ".uiify-native-select:focus-visible",
    ".uiify-accordion-trigger:focus-visible",
    ".uiify-collapsible-trigger:focus-visible",
  ])("%s draws a 2px outline in the ring colour", (selector) => {
    const body = focusRules(compiled)
      .filter((rule) => rule.selector === selector)
      .map((rule) => rule.body)
      .join(";");
    expect(body).toContain("outline-width:2px");
    expect(body).toContain("outline-color:var(--color-ring)");
  });
});

/** OKLCH → sRGB channels (0–1), clamped. */
function oklchToSrgb(l: number, c: number, hue: number): number[] {
  const h = (hue * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const lms = [
    (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ] as const;
  const linear = [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ];
  return linear.map((x) => Math.min(1, Math.max(0, x)));
}

const luminance = ([r, g, b]: number[]) => 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
const contrast = (x: number[], y: number[]) => {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi! + 0.05) / (lo! + 0.05);
};

/** Resolves `--name` in basic.css to light and dark OKLCH colours. */
function token(name: string): [number[], number[]] {
  const value = theme.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`--${name} not found`);
  const parts = value.startsWith("light-dark(") ? splitLightDark(value) : [value, value];
  return parts.map(colour) as [number[], number[]];
}

function splitLightDark(value: string): [string, string] {
  const inner = value.slice("light-dark(".length, -1);
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === "(") depth++;
    else if (inner[i] === ")") depth--;
    else if (inner[i] === "," && depth === 0)
      return [inner.slice(0, i).trim(), inner.slice(i + 1).trim()];
  }
  throw new Error(`cannot split ${value}`);
}

function colour(value: string): number[] {
  const reference = value.match(/^var\(--([\w-]+)\)$/);
  if (reference) return token(reference[1]!)[0];
  const match = value.match(/^oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)deg\)$/);
  if (!match) throw new Error(`unsupported colour ${value}`);
  return oklchToSrgb(Number(match[1]) / 100, Number(match[2]), Number(match[3]));
}

describe("ring token", () => {
  it.each(["background", "card"])("meets 3:1 against --%s in light and dark", (surface) => {
    const [ringLight, ringDark] = token("ring");
    const [light, dark] = token(surface);
    expect(contrast(ringLight, light)).toBeGreaterThanOrEqual(3);
    expect(contrast(ringDark, dark)).toBeGreaterThanOrEqual(3);
  });
});
