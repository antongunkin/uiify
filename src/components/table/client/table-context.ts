"use client";

import { createPartContext } from "@gunkin/uiify/core";
import type { TableContextValue } from "../types.js";

export const [TableProvider, useTableContext] = createPartContext<TableContextValue>("Table");
