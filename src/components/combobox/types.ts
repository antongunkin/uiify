import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type {
  AnchorAlign,
  AnchorSide,
  UseAnchorPositionReturn,
} from "@gunkin/uiify/core/anchor-position";
import type { PopoverChangeHandler, UsePopoverReturn } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export interface ComboboxItemData {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: string;
}

export interface ComboboxActiveStore {
  readonly getActiveId: () => string | null;
  readonly isActive: (id: string) => boolean;
  readonly setActiveId: (next: string | null) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly subscribeItem: (id: string, listener: () => void) => () => void;
}

export type ActiveMoveDirection = "first" | "last" | "next" | "prev";

export type ComboboxFilterFn = (
  items: readonly ComboboxItemData[],
  inputValue: string,
) => ComboboxItemData[];

export interface ComboboxMultiValueOptions {
  readonly addOnPaste?: boolean;
  readonly allowCustomValue?: boolean;
  readonly delimiters?: readonly string[];
  readonly maxValues?: number;
  readonly validateValue?: (value: string) => boolean;
}

export interface ComboboxContextValue {
  readonly activeStore: ComboboxActiveStore;
  readonly addOnPaste: boolean;
  readonly anchorProps: UseAnchorPositionReturn["anchorProps"];
  readonly anchorRef: UseAnchorPositionReturn["anchorRef"];
  readonly close: () => void;
  readonly filterFn: ComboboxFilterFn;
  readonly inputNode: HTMLElement | null;
  readonly inputValue: string;
  readonly items: readonly ComboboxItemData[];
  readonly listboxId: string;
  readonly delimiters: readonly string[];
  readonly multiple: boolean;
  readonly selectedValues: readonly string[];
  readonly getValueLabel: (value: string) => string;
  readonly isValueSelected: (value: string) => boolean;
  readonly toggleValue: (item: ComboboxItemData) => void;
  readonly removeValue: (value: string) => void;
  readonly commitValue: (value: string) => boolean;
  readonly open: () => void;
  readonly openState: boolean;
  readonly popupProps: UsePopoverReturn["popupProps"];
  readonly popupRef: UsePopoverReturn["popupRef"];
  readonly positionerProps: UseAnchorPositionReturn["positionerProps"];
  readonly positionerRef: UseAnchorPositionReturn["positionerRef"];
  readonly selectItem: (item: ComboboxItemData) => void;
  readonly setInputElement: (element: HTMLElement | null) => void;
  readonly setInputValue: (value: string) => void;
  readonly value?: string | readonly string[] | undefined;
}

export interface ComboboxRootShellOwnProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
  readonly className?: string;
  readonly defaultInputValue?: string;
  readonly defaultOpen?: boolean;
  readonly defaultValue?: string;
  readonly filterFn?: ComboboxFilterFn;
  readonly items: readonly ComboboxItemData[];
}

export interface ComboboxRootControlledOwnProps {
  readonly inputValue?: string;
  readonly onInputValueChange?: (value: string) => void;
  readonly onOpenChange?: PopoverChangeHandler;
  readonly onValueChange?: (value: string) => void;
  readonly open?: boolean;
  readonly value?: string | readonly string[];
}

export interface ComboboxRootShellProps extends ComboboxRootShellOwnProps {
  readonly children?: ReactNode;
}

export interface ComboboxRootSingleProps
  extends
    ComboboxRootShellOwnProps,
    Omit<ComboboxRootControlledOwnProps, "onValueChange" | "value"> {
  readonly multiple?: false;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly value?: string;
  readonly children?: ReactNode;
}

export interface ComboboxRootMultiProps
  extends
    Omit<ComboboxRootShellOwnProps, "defaultValue">,
    Omit<ComboboxRootControlledOwnProps, "onValueChange" | "value">,
    ComboboxMultiValueOptions {
  readonly multiple: true;
  readonly defaultValue?: readonly string[];
  readonly onValueChange?: (value: string[]) => void;
  readonly value?: readonly string[];
  readonly children?: ReactNode;
}

export type ComboboxRootProps = ComboboxRootSingleProps | ComboboxRootMultiProps;

export interface ComboboxControlOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type ComboboxControlProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ComboboxControlOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface ComboboxTagsOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly slotProps?: ComboboxTagsSlotProps;
}

type ComboboxRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = RepeatedSlotProps<
  Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML">,
  TOwned & { readonly "data-part"?: never }
>;

export interface ComboboxTagsSlotProps {
  readonly tag?: ComboboxRepeatedSlotProps<"span">;
  readonly remove?: ComboboxRepeatedSlotProps<
    "button",
    { readonly "aria-label"?: never; readonly type?: never }
  >;
}

export type ComboboxTagsProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ComboboxTagsOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface ComboboxInputOwnProps {
  readonly className?: string;
}

export type ComboboxInputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  ComboboxInputOwnProps,
  { open: boolean },
  HTMLInputElement
>;

export interface ComboboxTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type ComboboxTriggerProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  ComboboxTriggerOwnProps,
  { open: boolean },
  HTMLElement
>;

export type ComboboxContentOwnProps = Omit<
  ComponentPropsWithRef<"div">,
  | "aria-multiselectable"
  | "children"
  | "className"
  | "data-align"
  | "data-part"
  | "data-side"
  | "data-state"
  | "dangerouslySetInnerHTML"
  | "id"
  | "role"
> &
  ConsumerDataAttributes & {
    readonly "aria-multiselectable"?: never;
    readonly "data-align"?: never;
    readonly "data-part"?: never;
    readonly "data-side"?: never;
    readonly "data-state"?: never;
    readonly align?: AnchorAlign;
    readonly children: (filteredItems: ComboboxItemData[]) => ReactNode;
    readonly className?: string;
    readonly side?: AnchorSide;
  };

export interface ComboboxItemOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      | "aria-disabled"
      | "aria-selected"
      | "children"
      | "data-disabled"
      | "data-highlighted"
      | "data-part"
      | "data-selected"
      | "dangerouslySetInnerHTML"
      | "id"
      | "role"
    >,
    ConsumerDataAttributes {
  readonly "aria-disabled"?: never;
  readonly "aria-selected"?: never;
  readonly className?: string;
  readonly "data-disabled"?: never;
  readonly "data-highlighted"?: never;
  readonly "data-part"?: never;
  readonly "data-selected"?: never;
  readonly item: ComboboxItemData;
}

export interface ComboboxEmptyOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      "children" | "data-part" | "dangerouslySetInnerHTML" | "role"
    >,
    ConsumerDataAttributes {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly "data-part"?: never;
}
