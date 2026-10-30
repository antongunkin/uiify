import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import type {
  ConsumerDataAttributes,
  RepeatedSlotProps,
  SlotProps,
} from "../../core/slot-props.js";

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

export type ToastItemSlotProps = RepeatedSlotProps<SlotProps<"div">>;
export type ToastTitleSlotProps = RepeatedSlotProps<SlotProps<"div">>;
export type ToastDescriptionSlotProps = ToastTitleSlotProps;
export type ToastActionSlotProps = RepeatedSlotProps<SlotProps<"button">>;
export type ToastCloseSlotProps = RepeatedSlotProps<SlotProps<"button">>;

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
  readonly politeLiveRegion?: SlotProps<"span">;
  readonly assertiveLiveRegion?: SlotProps<"span">;
}

export interface ToastProviderOwnProps {
  readonly children?: ReactNode;
  readonly labels?: Partial<ToastLabels>;
  readonly limit?: number;
  readonly slotProps?: ToastProviderSlotProps;
}

export interface ToastViewportOwnProps
  extends
    Omit<ComponentPropsWithRef<"section">, "dangerouslySetInnerHTML">,
    ConsumerDataAttributes {
  readonly labels?: Partial<ToastLabels>;
  readonly slotProps?: ToastViewportSlotProps;
}

export interface ToastRootOwnProps
  extends
    Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML">,
    ConsumerDataAttributes {
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
