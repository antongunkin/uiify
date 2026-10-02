"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useMergedRefs } from "../../../hooks/use-merged-refs.js";
import { HeaderRoot } from "../Header.js";
import type { HeaderClientProps, HeaderClientState } from "../types.js";

export function HeaderClient({
  hideOnScroll = true,
  scrollTarget,
  placement = "sticky",
  ref,
  ...props
}: HeaderClientProps): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const [state, setState] = useState<HeaderClientState>("top");

  useEffect(() => {
    const root = rootRef.current;
    const view = root?.ownerDocument.defaultView;
    if (!root || !view) return;
    const element =
      scrollTarget === undefined ? null : root.ownerDocument.getElementById(scrollTarget);
    const target = scrollTarget === undefined ? view : element;
    const readPosition = () => {
      // banned-read-ok: Scroll offset is the required direction input; it does not measure layout.
      return Math.max(0, element ? element.scrollTop : view.scrollY);
    };
    let previous = target ? readPosition() : 0;
    let current: HeaderClientState = previous === 0 ? "top" : "visible";
    setState(current);
    if (!target) return;

    let height = Infinity;
    let movement = 0;
    let frame = 0;
    const update = (next: HeaderClientState) => {
      if (current === next) return;
      current = next;
      setState(next);
    };
    const protectedState = () =>
      root.contains(root.ownerDocument.activeElement) ||
      root.querySelector("dialog[open], details[open], :popover-open") !== null;
    const reveal = () => {
      if (protectedState()) {
        movement = 0;
        update(readPosition() === 0 ? "top" : "visible");
      }
    };
    const resize = new view.ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) height = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height;
    });
    resize.observe(root, { box: "border-box" });
    const mutation = new view.MutationObserver(reveal);
    mutation.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    root.addEventListener("focusin", reveal);
    root.addEventListener("toggle", reveal, true);
    const scroll = () => {
      if (frame) return;
      frame = view.requestAnimationFrame(() => {
        frame = 0;
        const position = readPosition();
        const delta = position - previous;
        previous = position;
        if (position === 0 || !hideOnScroll || placement === "static" || protectedState()) {
          movement = 0;
          update(position === 0 ? "top" : "visible");
          return;
        }
        if (delta !== 0)
          movement = Math.sign(delta) === Math.sign(movement) ? movement + delta : delta;
        if (current === "top") update("visible");
        if (movement <= -8) update("visible");
        if (position > height && movement >= 8) update("hidden");
      });
    };
    target.addEventListener("scroll", scroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", scroll);
      root.removeEventListener("focusin", reveal);
      root.removeEventListener("toggle", reveal, true);
      resize.disconnect();
      mutation.disconnect();
      if (frame) view.cancelAnimationFrame(frame);
    };
  }, [hideOnScroll, scrollTarget, placement]);

  return <HeaderRoot {...props} placement={placement} ref={mergedRef} data-state={state} />;
}
HeaderClient.displayName = "HeaderClient";
