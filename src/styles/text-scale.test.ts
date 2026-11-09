import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";
import { textSizeValues } from "../core/layout/values.js";

/**
 * M13 D3: Text and Heading sizes are Tailwind's scale read from `--text-*`. Under the adapter the
 * host's Tailwind must emit every step the layout CSS reads, so a project theme moves them.
 */
describe("text scale under the Tailwind adapter", () => {
  it("emits every --text-* step the layout CSS reads", async () => {
    const compiler = await compile(`@import "tailwindcss";\n@import "./tailwind.css";`, {
      base: import.meta.dirname,
      onDependency() {},
    });
    const css = compiler.build([]);
    for (const size of textSizeValues) {
      expect(css, size).toMatch(new RegExp(`var\\(--text-${size},`));
      expect(css, size).toMatch(new RegExp(`--text-${size}:`));
    }
  });
});
