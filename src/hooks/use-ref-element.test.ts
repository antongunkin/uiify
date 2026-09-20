import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useRefElement } from "./use-ref-element.js";

describe("useRefElement", () => {
  it("tracks ref.current when it attaches after the first render", () => {
    const element = document.createElement("div");
    const { result, rerender } = renderHook(
      ({ show }: { show: boolean }) => {
        const ref = useRef<HTMLDivElement | null>(null);
        ref.current = show ? element : null;
        return useRefElement(ref);
      },
      { initialProps: { show: false } },
    );

    expect(result.current).toBeNull();
    rerender({ show: true });
    expect(result.current).toBeInstanceOf(HTMLDivElement);
  });
});
