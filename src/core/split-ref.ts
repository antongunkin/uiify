import type { Ref } from "react";

/**
 * Take `ref` out of a consumer props object without mutating it.
 *
 * Replaces the `{ ...props }` + `delete` dance repeated across the client
 * compounds, which had to cast twice and left a mutated copy behind.
 */
export function splitRef<TElement, TProps extends object>(
  props: TProps,
): readonly [Ref<TElement> | undefined, Omit<TProps, "ref">] {
  const { ref, ...rest } = props as TProps & { ref?: Ref<TElement> };
  return [ref, rest as Omit<TProps, "ref">] as const;
}
