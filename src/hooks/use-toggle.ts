"use client";

import { useCallback, useState } from "react";

/** Boolean state. Call the setter with no arg to flip, or a boolean to set. */
export function useToggle(initialValue = false): [boolean, (next?: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback((next?: boolean) => {
    setValue((prev) => (typeof next === "boolean" ? next : !prev));
  }, []);
  return [value, toggle];
}
