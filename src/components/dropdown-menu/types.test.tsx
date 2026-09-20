import { expect, it } from "vitest";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuSubContentProps,
} from "./types.js";

it("accepts the major DropdownMenu type contract", () => {
  const root = {
    defaultOpen: true,
    dir: "rtl",
    disabled: false,
    loop: false,
  } satisfies DropdownMenuRootProps;
  const checkbox = {
    defaultChecked: "indeterminate",
    closeOnSelect: false,
  } satisfies DropdownMenuCheckboxItemProps;
  const radio = {
    value: "compact",
    closeOnSelect: false,
  } satisfies DropdownMenuRadioItemProps;
  const submenu = {
    side: "right",
    align: "start",
  } satisfies DropdownMenuSubContentProps;

  expect({ root, checkbox, radio, submenu }).toBeTruthy();
});
