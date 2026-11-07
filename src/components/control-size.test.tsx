import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Combobox } from "./combobox/Combobox.js";
import { DatePicker } from "./date-picker/DatePicker.js";
import { Input } from "./input/Input.js";
import { InputGroup } from "./input-group/InputGroup.js";
import { InputOTP } from "./input-otp/InputOtp.js";
import { SegmentedControl } from "./segmented-control/SegmentedControl.js";
import { NativeSelect, NativeSelectContent } from "./native-select/NativeSelect.js";

type SizeProps = { size?: "sm" | "lg" };

const controls = [
  ["input", (props: SizeProps) => <Input {...props} aria-label="x" />],
  [
    "native-select",
    (props: SizeProps) => (
      <NativeSelect {...props} aria-label="x">
        <NativeSelectContent />
      </NativeSelect>
    ),
  ],
  ["date-picker", (props: SizeProps) => <DatePicker {...props} aria-label="x" />],
  ["input-group", (props: SizeProps) => <InputGroup {...props} />],
  ["combobox", (props: SizeProps) => <Combobox.Root {...props} items={[]} />],
  ["input-otp", (props: SizeProps) => <InputOTP {...props} />],
  ["segmented-control", (props: SizeProps) => <SegmentedControl id="r" {...props} items={[]} />],
] as const;

describe("form control size", () => {
  it.each(controls)("%s marks its root with data-size and omits it by default", (name, ui) => {
    const marker = `.uiify-${name}`;
    const root = (props: SizeProps) => {
      const { container, unmount } = render(ui(props));
      const element = container.querySelector(marker);
      const value = element?.getAttribute("data-size") ?? null;
      unmount();
      return value;
    };

    expect(root({ size: "sm" })).toBe("sm");
    expect(root({ size: "lg" })).toBe("lg");
    expect(root({})).toBeNull();
  });

  it("maps sm and lg to the Button heights and text sizes for every control", () => {
    const css = readFileSync(
      resolve(import.meta.dirname, "../styles/components/control-size.css"),
      "utf8",
    );
    for (const name of controls.map(([control]) => control)) {
      if (name !== "input" && name !== "native-select" && name !== "segmented-control")
        expect(css).toContain(`.uiify-${name}`);
    }
    expect(css).toMatch(
      /"sm"\] \{\s*--uiify-control-size: var\(--control-sm\);\s*--uiify-control-font: 0\.875rem;/,
    );
    expect(css).toMatch(
      /"lg"\] \{\s*--uiify-control-size: var\(--control-lg\);\s*--uiify-control-font: 1\.125rem;/,
    );
  });
});
