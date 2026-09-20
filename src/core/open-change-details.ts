export type OpenChangeReason =
  | "trigger-press"
  | "escape-key"
  | "outside-press"
  | "focus-outside"
  | "native-toggle"
  | "programmatic";

export interface OpenChangeDetails {
  readonly event: Event | null;
  readonly isCanceled: boolean;
  readonly reason: OpenChangeReason;
  cancel(): void;
}

export function createOpenChangeDetails(
  reason: OpenChangeReason,
  event: Event | null = null,
): OpenChangeDetails {
  let canceled = false;
  return {
    event,
    get isCanceled() {
      return canceled;
    },
    reason,
    cancel() {
      canceled = true;
    },
  };
}

/**
 * Fire a consumer `onOpenChange` for a change the library made itself: no DOM
 * event, nothing to cancel. Lifted verbatim from the byte-identical copies in
 * Tooltip and HoverCard.
 */
export function emitProgrammaticOpenChange(
  onOpenChange: ((next: boolean, details: OpenChangeDetails) => void) | undefined,
  next: boolean,
): void {
  onOpenChange?.(next, createOpenChangeDetails("programmatic"));
}
