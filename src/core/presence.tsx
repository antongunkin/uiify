"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement, RefCallback } from "react";

export type PresenceState = "open" | "closing" | "closed";

export interface PresenceRenderState {
  readonly presence: PresenceState;
  readonly ref: RefCallback<Element>;
}

export interface PresenceProps {
  readonly children: (state: PresenceRenderState) => ReactElement | null;
  readonly forceMount?: boolean;
  readonly present: boolean;
}

export function Presence({ children, forceMount = false, present }: PresenceProps) {
  const elementRef = useRef<Element | null>(null);
  const cycleRef = useRef(0);
  const wasPresentRef = useRef(present);
  const [state, setState] = useState<PresenceState>(present ? "open" : "closed");

  useEffect(() => {
    const cycle = ++cycleRef.current;
    if (present) {
      wasPresentRef.current = true;
      setState("open");
      return;
    }
    if (!wasPresentRef.current) return;
    wasPresentRef.current = false;

    setState("closing");
    const frame = requestAnimationFrame(() => {
      const element = elementRef.current;
      const animations =
        element && typeof element.getAnimations === "function"
          ? element.getAnimations({ subtree: true })
          : [];
      if (animations.length === 0) {
        if (cycleRef.current === cycle) setState("closed");
        return;
      }

      void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (cycleRef.current === cycle) setState("closed");
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [present]);

  if (state === "closed" && !forceMount) return null;

  return children({
    presence: state,
    ref(element) {
      elementRef.current = element;
    },
  });
}
