"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";

export type PortalContainer = Element | DocumentFragment;

export interface PortalProps {
  readonly children?: ReactNode;
  readonly container?: PortalContainer | (() => PortalContainer | null) | null;
}

export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const resolved = typeof container === "function" ? container() : container;
  const target = resolved ?? (typeof document === "undefined" ? null : document.body);
  return target ? createPortal(children, target) : null;
}
