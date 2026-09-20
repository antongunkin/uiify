import { Profiler } from "react";
import type { ProfilerOnRenderCallback } from "react";
import type { RenderCounter } from "./types.js";

export function createRenderCounter(): RenderCounter {
  let count = 0;

  const onRender: ProfilerOnRenderCallback = () => {
    count++;
  };

  function Wrapper({ children }: { children: React.ReactNode }): React.ReactElement {
    return (
      <Profiler id="render-counter" onRender={onRender}>
        {children}
      </Profiler>
    );
  }
  Wrapper.displayName = "Wrapper";

  return {
    getCommitCount: () => count,
    reset: () => {
      count = 0;
    },
    Wrapper,
  };
}
