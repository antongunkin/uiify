"use client";

import type { ReactElement } from "react";
import { NativeCheckControlClient } from "../../internal/native-check-control/NativeCheckControlClient.js";
import type { CheckboxClientProps } from "../types.js";

export function CheckboxClient(props: CheckboxClientProps): ReactElement {
  return <NativeCheckControlClient {...props} />;
}

CheckboxClient.displayName = "CheckboxClient";
