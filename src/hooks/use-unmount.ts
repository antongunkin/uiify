"use client";

import { useEffect, useRef } from "react";

/** Invokes `fn` once when the component unmounts. Always uses the latest `fn`. */
export function useUnmount(fn: () => void): void {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(
    () => () => {
      ref.current();
    },
    [],
  );
}
