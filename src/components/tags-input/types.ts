import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

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
    Omit<
      ComponentPropsWithRef<"div">,
      | "children"
      | "className"
      | "data-disabled"
      | "data-uiify-tags-input"
      | "dangerouslySetInnerHTML"
    >,
    ConsumerDataAttributes {
  readonly "data-disabled"?: never;
  readonly "data-uiify-tags-input"?: never;
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

type TagsInputPartSlotProps<TTag extends ElementType> = Omit<
  ComponentPropsWithRef<TTag>,
  "children" | "dangerouslySetInnerHTML" | "data-part"
> &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
  };

type TagsInputIndexedSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = TagsInputPartSlotProps<TTag> &
  TOwned & {
    readonly byItemIndex?: Readonly<Record<number, TagsInputPartSlotProps<TTag> & TOwned>>;
  };

export interface TagsInputListSlotProps {
  readonly input?: TagsInputPartSlotProps<"li">;
  readonly tag?: TagsInputIndexedSlotProps<
    "li",
    { readonly "data-index"?: never; readonly "data-value"?: never }
  >;
}

export interface TagsInputListOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"ul">,
      "children" | "className" | "data-orientation" | "data-part" | "dangerouslySetInnerHTML" | "id"
    >,
    ConsumerDataAttributes {
  readonly "data-orientation"?: never;
  readonly "data-part"?: never;
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
  extends
    Omit<ComponentPropsWithRef<"button">, "children" | "data-part" | "disabled" | "type">,
    ConsumerDataAttributes {
  readonly className?: string;
  readonly "data-part"?: never;
  readonly disabled?: never;
  readonly index: number;
  readonly type?: never;
}
