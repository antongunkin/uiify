"use client";

import { useEffect, useState } from "react";
import type {
  HeaderBehavior,
  UseHeaderScrollStateOptions,
  UseHeaderScrollStateReturn,
} from "./types.js";

export type {
  HeaderBehavior,
  UseHeaderScrollStateOptions,
  UseHeaderScrollStateReturn,
} from "./types.js";

function isScrollBehavior(behavior: HeaderBehavior): boolean {
  return (
    behavior === "elevate-on-scroll" ||
    behavior === "solid-on-scroll" ||
    behavior === "hide-on-scroll-down"
  );
}

function usesIntersectionObserver(behavior: HeaderBehavior): boolean {
  return behavior === "elevate-on-scroll" || behavior === "solid-on-scroll";
}

export function useHeaderScrollState(
  options: UseHeaderScrollStateOptions = {},
): UseHeaderScrollStateReturn {
  const {
    behavior = "none",
    disabled = false,
    scrollRoot: scrollRootProp,
    scrollRootRef,
    threshold = 0,
  } = options;
  const scrollRoot = scrollRootProp ?? scrollRootRef?.current ?? null;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!isScrollBehavior(behavior)) {
      return;
    }

    if (scrollRootRef && !scrollRoot) {
      return;
    }

    if (usesIntersectionObserver(behavior)) {
      const sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.setAttribute("data-header-scroll-sentinel", "");
      sentinel.style.cssText =
        "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden";

      if (scrollRoot) {
        scrollRoot.insertBefore(sentinel, scrollRoot.firstChild);
      } else {
        document.body.prepend(sentinel);
      }

      const rootMargin = threshold > 0 ? `-${threshold}px 0px 0px 0px` : "0px";
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          setScrolled(!entry.isIntersecting);
        },
        { root: scrollRoot, rootMargin, threshold: 0 },
      );
      observer.observe(sentinel);

      return () => {
        observer.disconnect();
        sentinel.remove();
      };
    }

    if (behavior === "hide-on-scroll-down") {
      let lastScrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY; // banned-read-ok: scroll handler, batched in rAF
      let ticking = false;

      const readScrollTop = (): number => (scrollRoot ? scrollRoot.scrollTop : window.scrollY); // banned-read-ok: scroll handler, batched in rAF

      const update = () => {
        const currentScrollTop = readScrollTop();
        const pastThreshold = currentScrollTop > threshold;
        setScrolled(pastThreshold);
        setHidden(pastThreshold && currentScrollTop > lastScrollTop);
        lastScrollTop = currentScrollTop;
        ticking = false;
      };

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };

      const target: HTMLElement | Window = scrollRoot ?? window;
      target.addEventListener("scroll", onScroll, { passive: true });
      return () => target.removeEventListener("scroll", onScroll);
    }

    return undefined;
  }, [behavior, disabled, scrollRoot, scrollRootRef, threshold]);

  return { hidden, scrolled };
}
