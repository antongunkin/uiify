"use client";
import { NativeCheckControl } from "../internal/native-check-control/NativeCheckControl.js";
import type { ReactElement } from "react";
import type { CheckboxProps } from "./types.js";

export function Checkbox(props: CheckboxProps): ReactElement {
  return <NativeCheckControl {...props} />;
}

Checkbox.displayName = "Checkbox";
