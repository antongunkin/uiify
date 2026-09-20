import { createElement } from "react";
import type { ElementType, ReactElement } from "react";

interface UseRenderElementOptions<TState> {
  readonly as?: ElementType | undefined;
  readonly defaultTag: ElementType;
  readonly props: Record<string, unknown>;
  readonly render?:
    | ((props: Record<string, unknown>, state: TState) => ReactElement | null)
    | undefined;
  readonly state: TState;
}

export function useRenderElement<TState>({
  as,
  defaultTag,
  props,
  render,
  state,
}: UseRenderElementOptions<TState>): ReactElement | null {
  if (render) return render(props, state);
  return createElement(as ?? defaultTag, props);
}
