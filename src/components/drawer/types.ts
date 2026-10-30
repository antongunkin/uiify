import type {
  ComponentPropsWithRef,
  CSSProperties,
  MouseEvent,
  PointerEvent,
  ReactNode,
  Ref,
  RefObject,
} from "react";

import type { DialogChangeHandler, UseDialogReturn } from "@gunkin/uiify/core/dialog";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, SlotProps } from "../../core/slot-props.js";

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerAppearanceProps {
  readonly size?: "sm" | "md" | "lg" | "full";
  readonly dismiss?: "any" | "closerequest" | "none";
  readonly backdrop?: "opaque" | "transparent";
}
export interface DrawerOwnProps extends DrawerAppearanceProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  readonly closeLabel?: string;
  readonly labels?: Partial<DrawerLabels>;
  readonly footer?: ReactNode;
  readonly side?: DrawerSide;
  /** Native props for generated inner nodes; DrawerPanel's root takes props directly. */
  readonly slotProps?: DrawerSlotProps;
}

type DrawerInvokerSlotProps = Omit<SlotProps<"button">, "popoverTarget" | "popoverTargetAction"> & {
  readonly command?: string | undefined;
  readonly commandfor?: string | undefined;
};

export interface DrawerSlotProps {
  readonly trigger?: DrawerInvokerSlotProps;
  readonly content?: Omit<SlotProps<"dialog">, "id" | "open" | "popover">;
  readonly grabber?: SlotProps<"div">;
  readonly header?: SlotProps<"div">;
  readonly title?: SlotProps<"h2">;
  readonly description?: SlotProps<"p">;
  readonly close?: DrawerInvokerSlotProps;
  readonly body?: SlotProps<"div">;
  readonly footer?: SlotProps<"div">;
}

export type DrawerProps = DrawerOwnProps & Omit<SlotProps<"div">, keyof DrawerOwnProps>;

export interface DrawerLabels {
  readonly close: string;
}

export interface DrawerNativeContentProps
  extends
    Omit<ComponentPropsWithRef<"dialog">, "open" | "popover" | "dangerouslySetInnerHTML">,
    DrawerAppearanceProps,
    ConsumerDataAttributes {
  readonly id: string;
  readonly side?: DrawerSide;
}

export type DrawerNativeInvokerProps = NativeButtonProps<"button", { readonly target: string }> &
  ConsumerDataAttributes;

export interface DrawerStoreOptions {
  readonly activeSnapPoint?: number;
  readonly defaultActiveSnapPoint?: number;
  readonly dismissible?: boolean;
  readonly onDismiss?: () => void;
  readonly onSnapChange?: (snap: number) => void;
  readonly side: DrawerSide;
  readonly snapPoints?: readonly number[];
}

export interface DrawerStore {
  readonly endDrag: () => void;
  readonly getActiveSnapPoint: () => number;
  readonly getDragOffset: () => number;
  readonly getTransform: () => string;
  readonly isDragging: () => boolean;
  readonly moveDrag: (clientCoord: number) => void;
  readonly setSide: (side: DrawerSide) => void;
  readonly setContainerSize: (size: number) => void;
  readonly startDrag: (clientCoord: number) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly syncActiveSnapPoint: (snap: number) => void;
}

export interface DrawerContextValue {
  readonly close: (returnValue?: string) => void;
  readonly contentId: string;
  readonly descriptionId: string | undefined;
  readonly dialogProps: UseDialogReturn["dialogProps"];
  readonly dialogRef: UseDialogReturn["dialogRef"];
  readonly dismissible: boolean;
  readonly closeOnOverlayClick: boolean;
  readonly labelId: string | undefined;
  readonly modal: boolean;
  readonly open: boolean;
  readonly openDialog: () => void;
  readonly setDescriptionId: (id: string | undefined) => void;
  readonly setLabelId: (id: string | undefined) => void;
  readonly side: DrawerSide;
  readonly snapEnabled: boolean;
  readonly store: DrawerStore;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

export interface DrawerRootOwnProps {
  readonly activeSnapPoint?: number;
  readonly closeOnOverlayClick?: boolean;
  readonly defaultActiveSnapPoint?: number;
  readonly defaultOpen?: boolean;
  readonly dismissible?: boolean;
  readonly modal?: boolean;
  readonly onOpenChange?: DialogChangeHandler;
  readonly onSnapChange?: (snap: number) => void;
  readonly open?: boolean;
  readonly side?: DrawerSide;
  readonly snapPoints?: readonly number[];
}

export interface DrawerRootProps extends DrawerRootOwnProps {
  readonly children?: ReactNode;
}

export interface DrawerTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface DrawerTriggerProps
  extends
    DrawerTriggerOwnProps,
    Omit<ComponentPropsWithRef<"button">, keyof DrawerTriggerOwnProps> {
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  readonly ref?: Ref<HTMLButtonElement>;
}

export interface DrawerContentOwnProps extends DrawerAppearanceProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export interface DrawerContentProps
  extends
    DrawerContentOwnProps,
    Omit<ComponentPropsWithRef<"dialog">, "open" | keyof DrawerContentOwnProps> {
  readonly onCancel?: DrawerContextValue["dialogProps"]["onCancel"];
  readonly onClose?: DrawerContextValue["dialogProps"]["onClose"];
  readonly ref?: Ref<HTMLDialogElement>;
}

export interface DrawerTitleOwnProps extends ComponentPropsWithRef<"h2"> {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface DrawerDescriptionOwnProps extends ComponentPropsWithRef<"p"> {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface DrawerCloseOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface DrawerCloseProps
  extends DrawerCloseOwnProps, Omit<ComponentPropsWithRef<"button">, keyof DrawerCloseOwnProps> {
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DrawerHandleOwnProps extends ComponentPropsWithRef<"div"> {
  readonly className?: string;
  readonly onPointerCancel?: (event: PointerEvent<HTMLDivElement>) => void;
  readonly onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  readonly onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
  readonly onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
}
