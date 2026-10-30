import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, SlotProps } from "../../core/slot-props.js";

export interface TagsInputStoreOptions {
  readonly allowDuplicates?: boolean;
  readonly maxTags?: number;
  readonly validate?: (tag: string) => boolean;
}

export interface TagsInputStore {
  readonly addTag: (tag: string) => boolean;
  readonly addTags: (nextTags: readonly string[]) => void;
  readonly getTags: () => string[];
  readonly removeAt: (index: number) => void;
  readonly removeLast: () => void;
  readonly setTags: (next: readonly string[]) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly updateOptions: (next: TagsInputStoreOptions) => void;
}

export interface TagsInputContextValue {
  readonly addOnPaste: boolean;
  readonly addTag: (tag: string) => void;
  readonly delimiters: readonly string[];
  readonly disabled: boolean;
  readonly inputId: string;
  readonly inputValue: string;
  readonly listId: string;
  readonly removeAt: (index: number) => void;
  readonly setInputValue: (value: string) => void;
  readonly store: TagsInputStore;
}

export interface TagsInputRootShellOwnProps
  extends
    Omit<ComponentPropsWithRef<"div">, "children" | "className" | "dangerouslySetInnerHTML">,
    ConsumerDataAttributes {
  readonly className?: string;
  readonly addOnPaste?: boolean;
  readonly allowDuplicates?: boolean;
  readonly defaultValue?: readonly string[];
  readonly delimiters?: readonly string[];
  readonly disabled?: boolean;
  readonly id?: string;
  readonly items?: readonly string[];
  readonly maxTags?: number;
  readonly validate?: (tag: string) => boolean;
}

export interface TagsInputRootControlledOwnProps {
  readonly onValueChange?: (tags: string[]) => void;
  readonly value?: readonly string[];
}

export interface TagsInputRootShellProps extends TagsInputRootShellOwnProps {
  readonly children?: ReactNode;
}

export interface TagsInputRootProps
  extends TagsInputRootShellOwnProps, TagsInputRootControlledOwnProps {
  readonly children?: ReactNode;
}

export interface TagsInputInputOwnProps {
  readonly className?: string;
  readonly placeholder?: string;
}

export type TagsInputInputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  TagsInputInputOwnProps,
  { disabled: boolean },
  HTMLInputElement
>;

export interface TagsInputListSlotProps {
  readonly input?: SlotProps<"li">;
  readonly tag?: SlotProps<"li"> & {
    readonly byItemIndex?: Readonly<Record<number, SlotProps<"li">>>;
  };
}

export interface TagsInputListOwnProps
  extends
    Omit<ComponentPropsWithRef<"ul">, "children" | "className" | "dangerouslySetInnerHTML">,
    ConsumerDataAttributes {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly slotProps?: TagsInputListSlotProps;
}

export interface TagsInputTagOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly index: number;
  readonly value: string;
}

export type TagsInputTagProps<TAs extends ElementType = "li"> = RenderableProps<
  TAs,
  TagsInputTagOwnProps,
  { current: boolean },
  HTMLElement
>;

export interface TagsInputTagRemoveOwnProps
  extends ComponentPropsWithRef<"button">, ConsumerDataAttributes {
  readonly className?: string;
  readonly index: number;
}
