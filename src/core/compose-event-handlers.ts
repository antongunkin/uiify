/**
 * Compose a consumer handler with the component's own handler under uiify's
 * fixed ownership contract: the consumer runs first and may veto the internal
 * action with `preventDefault()`.
 *
 * This is deliberately not a props merger. It takes exactly two handlers for
 * one event, never inspects keys, and never merges objects.
 */
export function composeEventHandlers<TEvent extends { readonly defaultPrevented?: boolean }>(
  consumer: ((event: TEvent) => void) | undefined,
  internal: (event: TEvent) => void,
): (event: TEvent) => void {
  return (event) => {
    consumer?.(event);
    if (!event.defaultPrevented) internal(event);
  };
}
