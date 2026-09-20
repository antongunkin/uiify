import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

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

export interface TagsInputRootShellOwnProps {
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
  readonly onChange?: (tags: string[]) => void;
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

export interface TagsInputListOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
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

export interface TagsInputTagRemoveOwnProps {
  readonly className?: string;
  readonly index: number;
}
