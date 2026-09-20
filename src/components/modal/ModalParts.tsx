import type { ElementType, ReactElement } from "react";
import {
  DialogClose as ElementDialogClose,
  DialogTrigger as ElementDialogTrigger,
} from "../../elements/dialog/index.js";
import type { DialogCloseProps, DialogTriggerProps } from "../../elements/dialog/index.js";
import type { ModalCloseProps, ModalContentProps, ModalTriggerProps } from "./types.js";

/**
 * Opens `target` modally through the browser: no React handler, works before hydration.
 *
 * Built on `@gunkin/uiify/elements/dialog`'s `Dialog.Trigger` (aliased — the element and this
 * component share a name), which already
 * emits `data-uiify-dialog-trigger`; this part adds its own `data-uiify-modal-trigger`.
 *
 * Calls the element directly as a function rather than rendering `<ElementDialogTrigger>`:
 * `Dialog.Trigger` has no hooks and no state (Tier 0, enforced by
 * elements/architecture.test.ts), so it is safe to invoke like any other pure function, and
 * doing so skips a `jsx()` call — measurable at this component's byte budget (`.size-limit.json`).
 */
export function ModalTrigger<TAs extends ElementType = "button">(
  props: ModalTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as ModalTriggerProps<"button">;
  return ElementDialogTrigger({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-modal-trigger": "",
    target,
  } as unknown as DialogTriggerProps<TAs>);
}
ModalTrigger.displayName = "ModalTrigger";

/**
 * A plain, initially closed `<dialog>`; the accessible name is the consumer's responsibility.
 *
 * Mirrors `@gunkin/uiify/elements/dialog`'s `Dialog.Content` markup and marker
 * (`data-uiify-dialog-content`) exactly, plus this component's own
 * `data-uiify-modal-content`. Written inline rather than rendered through the element:
 * `Dialog.Content`'s type requires an accessible name (aria-labelledby xor aria-label), and
 * `ModalContentProps` deliberately does not
 * tighten to match, since this part is a public, generic native part in its own right, not
 * only an implementation detail of the `Modal` convenience shell (which always supplies one).
 */
export function ModalContent(props: ModalContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog {...dialogProps} data-uiify-dialog-content="" data-uiify-modal-content="">
      {children}
    </dialog>
  );
}
ModalContent.displayName = "ModalContent";

/**
 * Requests closing `target` (fires the cancelable `cancel` event first).
 *
 * Built on `@gunkin/uiify/elements/dialog`'s `Dialog.Close`, which already emits
 * `data-uiify-dialog-close`; this part adds its own `data-uiify-modal-close`. See
 * `ModalTrigger` for why this calls the element as a function instead of rendering it.
 */
export function ModalClose<TAs extends ElementType = "button">(
  props: ModalCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as ModalCloseProps<"button">;
  return ElementDialogClose({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-modal-close": "",
    target,
  } as unknown as DialogCloseProps<TAs>);
}
ModalClose.displayName = "ModalClose";
