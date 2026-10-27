import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export type ToastPriority = "polite" | "assertive";

export interface ToastLabels {
  readonly region: string;
  readonly notification: string;
  readonly close: string;
}

export interface ToastAction {
  readonly label: ReactNode;
  readonly onClick: () => void;
}

export interface ToastInput {
  readonly action?: ToastAction;
  readonly description?: ReactNode;
  readonly duration?: number;
  readonly id?: string;
  readonly priority?: ToastPriority;
  readonly title?: ReactNode;
}

export interface ToastRecord {
  readonly action?: ToastAction;
  readonly description?: ReactNode;
  readonly duration: number;
  readonly id: string;
  readonly priority: ToastPriority;
  readonly title?: ReactNode;
}

export interface TimerState {
  readonly remaining: number;
  readonly startedAt: number;
  readonly timerId: ReturnType<typeof setTimeout> | null;
}

export interface ToastStoreOptions {
  readonly limit?: number;
}

export interface ToastStore {
  readonly dismiss: (id: string) => void;
  readonly enqueue: (input: ToastInput) => string;
  readonly getAnnouncement: () => string;
  readonly getAssertiveAnnouncement: () => string;
  readonly getSnapshot: () => readonly ToastRecord[];
  readonly getServerSnapshot: () => readonly ToastRecord[];
  readonly pause: (id: string) => void;
  readonly resume: (id: string) => void;
  readonly subscribe: (listener: () => void) => () => void;
}

export interface ToastContextValue {
  readonly dismiss: (id: string) => void;
  readonly pause: (id: string) => void;
  readonly resume: (id: string) => void;
  readonly store: ToastStore;
  readonly labels: ToastLabels;
}

type ToastPartOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-toast"?: never;
};

type ToastItemOwnedAttributes = ToastPartOwnedAttributes & {
  readonly "data-state"?: never;
  readonly "aria-label"?: never;
  readonly role?: never;
  readonly tabIndex?: never;
};

export type ToastItemSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"div">,
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-part"
    | "data-state"
    | "data-uiify-toast"
    | "aria-label"
    | "role"
    | "tabIndex"
  >,
  ToastItemOwnedAttributes
>;

export type ToastTitleSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"div">,
    "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-toast"
  >,
  ToastPartOwnedAttributes
>;

export type ToastDescriptionSlotProps = ToastTitleSlotProps;

export type ToastActionSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"button">,
    "children" | "dangerouslySetInnerHTML" | "type" | "data-part" | "data-uiify-toast"
  >,
  ToastPartOwnedAttributes
>;

export type ToastCloseSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"button">,
    | "children"
    | "dangerouslySetInnerHTML"
    | "type"
    | "aria-label"
    | "data-part"
    | "data-uiify-toast"
  >,
  ToastPartOwnedAttributes & { readonly "aria-label"?: never }
>;

export interface ToastRootSlotProps {
  readonly title?: ToastTitleSlotProps;
  readonly description?: ToastDescriptionSlotProps;
  readonly action?: ToastActionSlotProps;
  readonly close?: ToastCloseSlotProps;
}

export interface ToastViewportSlotProps extends ToastRootSlotProps {
  readonly item?: ToastItemSlotProps;
}

export interface ToastProviderSlotProps {
  readonly politeLiveRegion?: Omit<
    ComponentPropsWithRef<"span">,
    "children" | "dangerouslySetInnerHTML" | "aria-atomic" | "aria-live"
  > &
    ConsumerDataAttributes;
  readonly assertiveLiveRegion?: Omit<
    ComponentPropsWithRef<"span">,
    "children" | "dangerouslySetInnerHTML" | "aria-atomic" | "aria-live"
  > &
    ConsumerDataAttributes;
}

export interface ToastProviderOwnProps {
  readonly children?: ReactNode;
  readonly labels?: Partial<ToastLabels>;
  readonly limit?: number;
  readonly slotProps?: ToastProviderSlotProps;
}

export interface ToastViewportOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"section">,
      "children" | "dangerouslySetInnerHTML" | "popover" | "data-part" | "data-uiify-toast"
    >,
    ConsumerDataAttributes {
  readonly "data-part"?: never;
  readonly "data-uiify-toast"?: never;
  readonly children?: ReactNode;
  readonly labels?: Partial<ToastLabels>;
  /**
   * Set by the live client viewport (@gunkin/uiify/components/toast/Toast.js) to
   * `"manual"` so the queue's rendered surface sits in the top layer. The
   * structural shell (this file's own re-exported ToastViewport, used
   * directly by "Toast server shell" tests and any no-JS render) leaves it
   * unset, since there is no queue-driven show/hide to wire up there.
   */
  readonly popover?: "manual";
  readonly slotProps?: ToastViewportSlotProps;
}

export interface ToastRootOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      | "children"
      | "dangerouslySetInnerHTML"
      | "aria-label"
      | "data-part"
      | "data-state"
      | "data-uiify-toast"
      | "role"
      | "tabIndex"
    >,
    ConsumerDataAttributes {
  readonly "data-part"?: never;
  readonly "data-state"?: never;
  readonly "data-uiify-toast"?: never;
  readonly labels?: Partial<ToastLabels>;
  readonly slotProps?: ToastRootSlotProps;
  readonly toast: ToastRecord;
}

export interface ToastTitleOwnProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> {
  readonly children?: ReactNode;
}

export interface ToastDescriptionOwnProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> {
  readonly children?: ReactNode;
}

export interface ToastActionOwnProps extends Omit<
  ComponentPropsWithRef<"button">,
  "children" | "dangerouslySetInnerHTML"
> {
  readonly children?: ReactNode;
}

export interface ToastActionProps extends ToastActionOwnProps {
  readonly onClick?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
}

export interface ToastCloseOwnProps extends Omit<
  ComponentPropsWithRef<"button">,
  "children" | "dangerouslySetInnerHTML"
> {
  readonly children?: ReactNode;
  readonly labels?: Partial<ToastLabels>;
}

export interface ToastCloseProps extends ToastCloseOwnProps {
  readonly onClick?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
}
