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

// M3 P6 (brief docs/superpowers/plans/2026-11-07-shadcn-names-remaining.md): no namespace objects.
const FLAT_ROOTS = ["Header", "Toast", "Tooltip", "Table", "Breadcrumb", "Drawer"];
const FLAT_NEW = [
  ...FLAT_ROOTS,
  "TableHead",
  "BreadcrumbPage",
  "DrawerTrigger",
  "DrawerClose",
  "DrawerContent",
  "DrawerHeader",
  "DrawerTitle",
  "DrawerDescription",
  "DrawerBody",
  "DrawerFooter",
  "DrawerGrabber",
];
const FLAT_OLD = [
  "HeaderRoot",
  "ToastRoot",
  "TooltipRoot",
  "TableRoot",
  "TableColumnHeader",
  "BreadcrumbRoot",
  "DrawerPanel",
  "DrawerNativeTrigger",
  "DrawerNativeClose",
  "DrawerNativeContent",
  "DrawerRoot",
  "DrawerHandle",
];

test("Header, Toast, Tooltip, Table, Breadcrumb and Drawer use flat shadcn names", () => {
  const exported = root as Record<string, unknown>;
  expect(FLAT_NEW.filter((name) => !(name in exported))).toEqual([]);
  expect(FLAT_OLD.filter((name) => name in exported)).toEqual([]);
  expect(FLAT_ROOTS.filter((name) => typeof exported[name] !== "function")).toEqual([]);
  const catalog = readFileSync(resolve(import.meta.dirname, "../../agents/catalog.md"), "utf8");
  expect(catalog.match(new RegExp(`\\b(?:${FLAT_OLD.join("|")})\\b`, "g")) ?? []).toEqual([]);
});
