import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";
import * as root from "../index.js";

const NEW_NAMES = [
  "Dialog",
  "DialogTrigger",
  "DialogContent",
  "DialogHeader",
  "DialogTitle",
  "DialogDescription",
  "DialogBody",
  "DialogFooter",
  "DialogClose",
  "DialogGrabber",
  "AlertDialog",
  "AlertDialogTrigger",
  "AlertDialogContent",
  "AlertDialogAction",
  "AlertDialogCancel",
  "PopoverTrigger",
  "PopoverContent",
  "PopoverClose",
  "InputOTP",
  "InputOTPSlot",
  "InputOTPHiddenInput",
  "NativeSelect",
  "NativeSelectOption",
  "NativeSelectOptGroup",
  "NativeSelectContent",
  "NativeSelectSeparator",
];

const OLD_NAMES = [
  "Modal",
  "ModalTrigger",
  "ModalContent",
  "ModalHeader",
  "ModalTitle",
  "ModalDescription",
  "ModalBody",
  "ModalFooter",
  "ModalClose",
  "ModalGrabber",
  "AlertModal",
  "AlertModalTrigger",
  "AlertModalContent",
  "AlertModalAction",
  "AlertModalCancel",
  "Popup",
  "PopupRoot",
  "PopupTrigger",
  "PopupContent",
  "PopupClose",
  "OtpInput",
  "OtpInputRoot",
  "OtpInputSlot",
  "OtpInputHiddenInput",
  "Select",
  "SelectRoot",
  "SelectItem",
  "SelectGroup",
  "SelectContent",
  "SelectSeparator",
];

test("the root export uses the shadcn component names", () => {
  const exported = Object.keys(root);
  expect(NEW_NAMES.filter((name) => !exported.includes(name))).toEqual([]);
  expect(OLD_NAMES.filter((name) => exported.includes(name))).toEqual([]);
});

test("the agent catalog names no removed component", () => {
  const catalog = readFileSync(resolve(import.meta.dirname, "../../agents/catalog.md"), "utf8");
  const old = new RegExp(`\\b(?:${OLD_NAMES.join("|")})\\b`, "g");
  expect(catalog.match(old) ?? []).toEqual([]);
});
