import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type {
  AnchorAlign,
  AnchorSide,
  UseAnchorPositionReturn,
} from "@gunkin/uiify/core/anchor-position";
import type { PopoverChangeHandler, UsePopoverReturn } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ControlSize } from "../internal/control-size/types.js";
import type {
  ConsumerDataAttributes,
  RepeatedSlotProps,
  SlotProps,
} from "../../core/slot-props.js";

export interface ComboboxItemData {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: string;
}

export interface ComboboxItemAdapterOptions<T> {
  readonly getValue: (record: T) => string;
  readonly getLabel: (record: T) => string;
  readonly isDisabled?: (record: T) => boolean;
}

export interface ComboboxItemCollection<T> {
  readonly items: readonly ComboboxItemData[];
  readonly getItem: (value: string) => T | undefined;
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

export interface ComboboxSingleValueOptions {
  /** Allows a nonempty unmatched value to commit on Enter. */
  readonly allowCustomValue?: boolean;
  /** Rejects a custom value when it returns false. */
  readonly validateValue?: (value: string) => boolean;
}

export interface ComboboxFormState {
  readonly required: boolean;
  readonly invalid: boolean;
}

/** Native submission bridge; selection and option content are owned by Root. */
export interface ComboboxFormControlProps
  extends
    Omit<
      ComponentPropsWithRef<"select">,
      "children" | "multiple" | "value" | "defaultValue" | "onChange"
    >,
    ConsumerDataAttributes {}

export interface ComboboxContextValue {
  readonly reset: () => void;
  readonly formState: ComboboxFormState;
  readonly hasControl: boolean;
  readonly setHasControl: (value: boolean) => void;
  readonly registerFormControl: (node: HTMLSelectElement) => () => void;
  readonly setFormState: (state: ComboboxFormState) => void;
  readonly activeStore: ComboboxActiveStore;
  readonly addOnPaste: boolean;
  readonly allowCustomValue: boolean;
  readonly anchorProps: UseAnchorPositionReturn["anchorProps"];
  readonly anchorRef: UseAnchorPositionReturn["anchorRef"];
  readonly close: () => void;
  readonly filterFn: ComboboxFilterFn;
  readonly filterQuery: string;
  readonly inputNode: HTMLElement | null;
  readonly inputValue: string;
  readonly loading: boolean;
  readonly items: readonly ComboboxItemData[];
  readonly listboxId: string;
  readonly delimiters: readonly string[];
  readonly disabled: boolean;
  readonly isDisabled: () => boolean;
  readonly multiple: boolean;
  readonly selectedValues: readonly string[];
  readonly getValueLabel: (value: string) => string;
  readonly isValueSelected: (value: string) => boolean;
  readonly toggleValue: (item: ComboboxItemData) => void;
  readonly removeValue: (value: string) => void;
  readonly commitValue: (value: string) => boolean;
  readonly commitSingleValue: (value: string) => boolean;
  readonly open: () => void;
  readonly openState: boolean;
  readonly popupProps: UsePopoverReturn["popupProps"];
  readonly popupRef: UsePopoverReturn["popupRef"];
  readonly positionerProps: UseAnchorPositionReturn["positionerProps"];
  readonly positionerRef: UseAnchorPositionReturn["positionerRef"];
  readonly selectItem: (item: ComboboxItemData) => void;
  readonly setInputElement: (element: HTMLElement | null) => void;
  readonly setInputValue: (value: string) => void;
  readonly value?: string | null | readonly string[] | undefined;
}

export interface ComboboxRootShellOwnProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue"
> {
  readonly className?: string;
  readonly defaultInputValue?: string;
  readonly defaultOpen?: boolean;
  /** In single mode, `null` means no selection; an empty string is a valid item ID. */
  readonly defaultValue?: string | null;
  /** Blocks model mutations and supplies the default disabled state to native controls. */
  readonly disabled?: boolean;
  readonly filterFn?: ComboboxFilterFn;
  readonly items: readonly ComboboxItemData[];
  /** Marks consumer-managed results as loading while keeping existing options available. */
  readonly loading?: boolean;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
}

export interface ComboboxRootControlledOwnProps {
  readonly inputValue?: string;
  readonly onInputValueChange?: (value: string) => void;
  readonly onOpenChange?: PopoverChangeHandler;
  readonly onValueChange?: (value: string | null) => void;
  readonly open?: boolean;
  readonly value?: string | null | readonly string[];
}

export interface ComboboxRootShellProps extends ComboboxRootShellOwnProps {
  readonly children?: ReactNode;
}

export interface ComboboxRootSingleProps
  extends
    ComboboxRootShellOwnProps,
    ComboboxSingleValueOptions,
    Omit<ComboboxRootControlledOwnProps, "onValueChange" | "value"> {
  readonly multiple?: false;
  readonly defaultValue?: string | null;
  readonly onValueChange?: (value: string | null) => void;
  readonly value?: string | null;
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

export interface ComboboxTagsSlotProps {
  readonly tag?: RepeatedSlotProps<SlotProps<"span">>;
  readonly remove?: RepeatedSlotProps<SlotProps<"button">>;
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

export type ComboboxContentOwnProps = SlotProps<"div"> & {
  readonly align?: AnchorAlign;
  readonly children: (filteredItems: ComboboxItemData[]) => ReactNode;
  readonly side?: AnchorSide;
};

export interface ComboboxItemOwnProps extends SlotProps<"div"> {
  /** Option content; when omitted, the item's string label is rendered. */
  readonly children?: ReactNode;
  readonly item: ComboboxItemData;
}

export interface ComboboxGroupOwnProps extends SlotProps<"div"> {
  /** Options in this named group. Link it to `GroupLabel` with `aria-labelledby`. */
  readonly children?: ReactNode;
}

export interface ComboboxGroupLabelOwnProps extends SlotProps<"div"> {
  /** Visible heading referenced by the group's `aria-labelledby`. */
  readonly children?: ReactNode;
}

export interface ComboboxEmptyOwnProps
  extends Omit<ComponentPropsWithRef<"div">, "dangerouslySetInnerHTML">, ConsumerDataAttributes {}

export interface ComboboxStatusProps extends SlotProps<"div"> {
  readonly children?: ReactNode;
}
