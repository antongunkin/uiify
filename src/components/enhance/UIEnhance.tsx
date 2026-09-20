"use client";

import { useEffect } from "react";
import { attachEnhancers } from "./listeners.js";

/**
 * Mount once per document, in the root layout.
 *
 * Every `uiify` component whose accessible state the browser does not maintain
 * itself is served by these delegated listeners, so no component needs a client
 * island of its own. One listener pair covers the whole page, including nodes
 * rendered after mount.
 *
 * Ownership contract: this may only own attributes whose React-rendered value
 * is a *constant*. React diffs DOM props against the previous render's virtual
 * props, not against the live DOM, so a constant prop is written once at
 * hydration and never rewritten — the enhancer's writes survive re-renders.
 * Attributes React re-renders with a changing value (controlled mode) must stay
 * with a real island. See docs/guides/client-enhancement.md.
 */
export function UIEnhance(): null {
  useEffect(() => attachEnhancers(), []);
  return null;
}
