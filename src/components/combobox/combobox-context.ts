"use client";

import { createPartContext } from "@gunkin/uiify/core";
import type { ComboboxContextValue } from "./types.js";

export const [ComboboxProvider, useComboboxContext] =
  createPartContext<ComboboxContextValue>("Combobox");
