"use client";

import { useId as useReactId } from "react";
import { sanitizeReactId } from "./utils/sanitize-react-id.js";

/**
 * SSR-safe id. Returns `providedId` if given, otherwise a stable, prefixed,
 * colon-free id derived from React's `useId`.
 */
export function useId(providedId?: string, prefix = "uiify"): string {
  const reactId = useReactId();
  return providedId ?? `${prefix}-${sanitizeReactId(reactId)}`;
}
