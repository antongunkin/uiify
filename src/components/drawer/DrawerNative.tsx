import type { ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type { DrawerProps } from "./types.js";

/**
 * Monolithic native shell: a `command="show-modal"` trigger opens a plain,
 * initially closed `<dialog>`; a `command="request-close"` invoker closes it.
 * Works before hydration, matching Modal and AlertModal's native shell — all
 * three are built on `@gunkin/uiify/elements/dialog`. Always a true modal — controlled
 * or initially open state needs a client adapter, which this Tier 0 shell does
 * not have.
 *
 * `title` is required, so `aria-labelledby={titleId}` always satisfies
 * `Dialog.Content`'s accessible-name requirement here — unlike `ModalContent`/
 * `AlertModalContent`, which are exported as generic parts in their own right
 * and so keep a looser prop type (see ModalParts.tsx), this shell has no
 * public "DrawerContent" part to keep loose.
 */
export function DrawerPanel({
  id,
  trigger,
  title,
  description,
  children,
  closeLabel = "Close",
  side = "bottom",
  className,
}: DrawerProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <div data-part="root" data-side={side} data-uiify-drawer="">
      {renderNativeInvoker(
        "button",
        "data-uiify-drawer",
        "trigger",
        "show-modal",
        id,
        {
          children: trigger,
        },
        { button: true },
      )}
      <dialog
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        className={className}
        data-part="content"
        data-side={side}
        data-uiify-drawer=""
        id={id}
      >
        <h2 id={titleId}>{title}</h2>
        {description === undefined ? null : <p id={descriptionId}>{description}</p>}
        {children}
        {renderNativeInvoker(
          "button",
          "data-uiify-drawer",
          "close",
          "request-close",
          id,
          {
            children: closeLabel,
          },
          { button: true, variant: "ghost" },
        )}
      </dialog>
    </div>
  );
}
DrawerPanel.displayName = "DrawerPanel";
