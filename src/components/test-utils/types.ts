import type { ReactElement, ReactNode } from "react";

export interface RenderCounter {
  readonly getCommitCount: () => number;
  readonly reset: () => void;
  readonly Wrapper: (props: { children: ReactNode }) => ReactElement;
}
