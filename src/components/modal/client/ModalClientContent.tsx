"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { modalAppearanceAttributes } from "../attributes.js";
import type { ModalClientContentProps } from "../types.js";

function increment(count: number): number {
  return count + 1;
}

/** A dialog nested in this one would stay open (and invisible) after its parent closes. */
function closeNestedDialogs(dialog: HTMLDialogElement): void {
  for (const nested of dialog.querySelectorAll<HTMLDialogElement>("dialog[open]")) {
    nested.close();
  }
}

/**
 * Runs `done` once the dialog's own transitions have finished; at once when there are none.
 * An `infinite` animation inside (a Spinner or Skeleton) never finishes, so it is not waited on.
 */
function afterMotion(dialog: HTMLDialogElement, done: () => void): void {
  requestAnimationFrame(() => {
    const running = dialog.getAnimations?.({ subtree: true }) ?? [];
    void Promise.allSettled(
      running.map((animation) =>
        animation.effect?.getComputedTiming().endTime === Infinity ? 0 : animation.finished,
      ),
    ).then(done);
  });
}

/**
 * Controlled/initially-open adapter over a native modal `<dialog>`.
 *
 * The browser stays the owner of modality: opening is `showModal()`, closing is
 * `close()`, and every change — invoker command, Escape, `requestClose()`,
 * `form method="dialog"`, programmatic — is observed through the single native
 * `toggle` event (Chrome 132, Firefox 133, Safari 26). SSR never emits `open`;
 * `defaultOpen` and controlled `open` are applied after mount.
 */
export function ModalClientContent(props: ModalClientContentProps): ReactElement {
  const {
    align,
    backdrop,
    children,
    defaultOpen = false,
    dismiss,
    onOpenChange,
    onOpenChangeComplete,
    open,
    ref,
    size,
    ...dialogProps
  } = props;

  const elementRef = useRef<HTMLDialogElement | null>(null);
  const mergedRef = useMergedRefs<HTMLDialogElement>(elementRef, ref);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  // Bumped on every native toggle so the sync effect re-runs after the parent
  // has had its render: a controlling parent that rejected the change is then
  // reconciled by reverting the element.
  const [nativeVersion, recordNativeToggle] = useReducer(increment, 0);
  const controlled = open !== undefined;
  const wantOpen = controlled ? open : uncontrolledOpen;

  const wantOpenRef = useRef(wantOpen);
  wantOpenRef.current = wantOpen;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const onOpenChangeCompleteRef = useRef(onOpenChangeComplete);
  onOpenChangeCompleteRef.current = onOpenChangeComplete;
  // One-shot: has the first-mount reconciliation below already run?
  const reconciledRef = useRef(false);

  useEffect(() => {
    const dialog = elementRef.current;
    if (!dialog) return;
    if (!reconciledRef.current) {
      reconciledRef.current = true;
      // SSR markup is always closed. If the dialog is already open at mount,
      // that can only mean a native invoker command opened it in the window
      // between initial paint and this effect running — the `toggle` event
      // fired with no listener attached yet, and that notification is
      // otherwise lost forever. Recover it exactly like a native toggle.
      //
      // The reverse (closed at mount) is never reconciled: it's indistinguishable
      // from "nothing happened" versus a pre-hydration open+close cycle that
      // netted back to closed, and it's also the normal starting shape for
      // defaultOpen (open before hydration) is reconciled when the DOM catches up.
      if (dialog.open && !wantOpenRef.current) {
        if (!controlled) setUncontrolledOpen(true);
        onOpenChangeRef.current?.(true);
        // Defer enacting show/close to the next pass, once the controlling
        // parent (if any) has had a chance to react to the report above —
        // the DOM already matches what was just reported, so there is
        // nothing to enact this pass regardless.
        recordNativeToggle();
        return;
      }
    }
    if (wantOpen && !dialog.open) dialog.showModal();
    else if (!wantOpen && dialog.open) {
      closeNestedDialogs(dialog);
      dialog.close();
    }
    // `controlled` is read above (line 66) and must be a dependency; the sibling
    // `toggle`-listener effect below lists it for the same reason.
  }, [nativeVersion, wantOpen, controlled]);

  useEffect(() => {
    const dialog = elementRef.current;
    if (!dialog) return;
    let disposed = false;
    const onToggle = (event: Event): void => {
      const next = (event as ToggleEvent).newState === "open";
      afterMotion(dialog, () => {
        if (!disposed) onOpenChangeCompleteRef.current?.(next);
      });
      // Programmatic changes already match the desired state; only report
      // changes the browser initiated.
      if (next === wantOpenRef.current) return;
      if (!controlled) setUncontrolledOpen(next);
      onOpenChangeRef.current?.(next);
      recordNativeToggle();
    };
    dialog.addEventListener("toggle", onToggle);
    return () => {
      disposed = true;
      dialog.removeEventListener("toggle", onToggle);
    };
  }, [controlled]);

  return (
    <dialog
      {...dialogProps}
      {...modalAppearanceAttributes({ align, backdrop, dismiss, size })}
      data-part="content"
      data-uiify-modal=""
      ref={mergedRef}
      // SSR markup is always closed, but the browser may have already opened this
      // dialog via a native invoker command before hydration (see the effect above,
      // which reconciles exactly that). React's hydration diff otherwise flags the
      // resulting `open` mismatch as an error; it is the documented recovery path.
      suppressHydrationWarning
    >
      {children}
    </dialog>
  );
}
ModalClientContent.displayName = "ModalClientContent";
