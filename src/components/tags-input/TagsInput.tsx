"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ElementType, KeyboardEvent, ReactElement, SyntheticEvent } from "react";
import { useControllableState, useId, useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { RovingFocusItem, RovingFocusRoot } from "@gunkin/uiify/core/roving-focus";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { createTagsInputStore, splitTags } from "./tags-input-store.js";
import type {
  TagsInputStore,
  TagsInputContextValue,
  TagsInputRootProps,
  TagsInputInputProps,
  TagsInputListOwnProps,
  TagsInputTagProps,
  TagsInputTagRemoveOwnProps,
} from "./types.js";

const [TagsInputProvider, useTagsInputContext] =
  createPartContext<TagsInputContextValue>("TagsInput");

export function TagsInputRoot(props: TagsInputRootProps): ReactElement | null {
  const {
    addOnPaste = true,
    allowDuplicates = false,
    children,
    defaultValue = [],
    delimiters = [","],
    disabled = false,
    maxTags,
    onChange,
    validate,
    value: controlledValue,
  } = props;

  const listId = useId();
  const inputId = useId();
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useControllableState<string[]>({
    defaultValue: [...defaultValue],
    ...(controlledValue !== undefined ? { value: [...controlledValue] } : {}),
    ...(onChange ? { onChange } : {}),
  });

  const storeRef = useRef<TagsInputStore | null>(null);
  storeRef.current ??= createTagsInputStore(tags, {
    allowDuplicates,
    ...(maxTags !== undefined ? { maxTags } : {}),
    ...(validate ? { validate } : {}),
  });
  const store = storeRef.current;

  useIsomorphicLayoutEffect(() => {
    store.setTags(tags);
    store.updateOptions({
      allowDuplicates,
      ...(maxTags !== undefined ? { maxTags } : {}),
      ...(validate ? { validate } : {}),
    });
  }, [allowDuplicates, maxTags, store, tags, validate]);

  const addTag = useCallback(
    (tag: string) => {
      if (disabled) return;
      if (store.addTag(tag)) {
        setTags(store.getTags());
        setInputValue("");
      }
    },
    [disabled, setTags, store],
  );

  const removeAt = useCallback(
    (index: number) => {
      if (disabled) return;
      store.removeAt(index);
      setTags(store.getTags());
    },
    [disabled, setTags, store],
  );

  const contextValue = useMemo(
    () => ({
      addOnPaste,
      addTag,
      delimiters,
      disabled,
      inputId,
      inputValue,
      listId,
      removeAt,
      setInputValue,
      store,
    }),
    [
      addOnPaste,
      addTag,
      delimiters,
      disabled,
      inputId,
      inputValue,
      listId,
      removeAt,
      setInputValue,
      store,
    ],
  );

  return (
    <TagsInputProvider value={contextValue}>
      <div data-disabled={disabled ? "" : undefined}>{children}</div>
    </TagsInputProvider>
  );
}
TagsInputRoot.displayName = "TagsInputRoot";

export function TagsInputInput<TAs extends ElementType = "input">(
  props: TagsInputInputProps<TAs>,
): ReactElement | null {
  const { as, render, className, placeholder, ...consumerProps } =
    props as TagsInputInputProps<"input">;
  const {
    addOnPaste,
    addTag,
    delimiters,
    disabled,
    inputId,
    inputValue,
    listId,
    removeAt,
    setInputValue,
    store,
  } = useTagsInputContext("Input");
  const tags = useSyncExternalStore(store.subscribe, store.getTags, store.getTags);
  const {
    onChange: consumerOnChange,
    onKeyDown: consumerOnKeyDown,
    onPaste: consumerOnPaste,
  } = consumerProps as {
    onChange?: (event: SyntheticEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  };

  const commitInput = () => {
    if (inputValue.trim()) addTag(inputValue);
  };

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || delimiters.includes(event.key)) {
      event.preventDefault();
      commitInput();
    } else if (event.key === "Backspace" && !inputValue && tags.length > 0) {
      event.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!addOnPaste) return;
    const text = event.clipboardData.getData("text");
    const splitChars = [...delimiters, "\n", "\t"];
    if (!splitChars.some((delimiter) => text.includes(delimiter))) return;
    event.preventDefault();
    const parts = splitTags(text, splitChars);
    for (const part of parts) addTag(part);
  };

  return useRenderElement({
    as,
    defaultTag: "input",
    props: {
      ...consumerProps,
      id: inputId,
      type: "text",
      role: "combobox",
      "aria-controls": listId,
      "aria-expanded": false,
      disabled: disabled || undefined,
      value: inputValue,
      placeholder,
      ...(className ? { className } : {}),
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      onPaste: composeEventHandlers(consumerOnPaste, handlePaste),
    },
    render,
    state: { disabled },
  });
}

export function TagsInputList(props: TagsInputListOwnProps): ReactElement | null {
  const { children, className } = props;
  const { listId, store } = useTagsInputContext("List");
  const tags = useSyncExternalStore(store.subscribe, store.getTags, store.getTags);

  return (
    <RovingFocusRoot
      as="ul"
      id={listId}
      orientation="horizontal"
      {...(className ? { className } : {})}
    >
      {tags.map((tag, index) => (
        <li data-index={index} data-value={tag} key={`${tag}-${index}`}>
          {tag}
        </li>
      ))}
      {/* A <ul> may only contain <li>, so a non-<li> child (typically TagsInput.Input)
          needs one too — leaving it bare made the list malformed, a serious axe
          violation. TagsInputTag already renders its own <li>; wrapping it again
          would nest <li> inside <li>, an invalid, hydration-breaking tree. */}
      {Children.map(children, (child) =>
        isValidElement(child) && child.type === TagsInputTag ? (
          child
        ) : (
          <li data-part="input-slot">{child}</li>
        ),
      )}
    </RovingFocusRoot>
  );
}
TagsInputList.displayName = "TagsInputList";

export function TagsInputTag<TAs extends ElementType = "li">(
  props: TagsInputTagProps<TAs>,
): ReactElement | null {
  const { as, render, children, className, index, value, ...consumerProps } =
    props as TagsInputTagProps<"li">;
  const { disabled, removeAt } = useTagsInputContext("Tag");
  const { onKeyDown: consumerOnKeyDown } = consumerProps as {
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      removeAt(index);
    }
  };

  const tagProps = {
    ...consumerProps,
    role: "listitem",
    "data-value": value,
    ...(className ? { className } : {}),
    onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
    children,
  };

  if (render) {
    return (
      <RovingFocusItem
        disabled={disabled}
        render={(renderProps, state) => render(renderProps, { current: state.current })}
        textValue={value}
        {...(tagProps as object)}
      />
    );
  }

  return (
    <RovingFocusItem
      as={as ?? "li"}
      disabled={disabled}
      textValue={value}
      {...(tagProps as object)}
    />
  );
}
TagsInputTag.displayName = "TagsInputTag";

export function TagsInputTagRemove(props: TagsInputTagRemoveOwnProps): ReactElement | null {
  const { className, index } = props;
  const { disabled, removeAt } = useTagsInputContext("TagRemove");

  return useRenderElement({
    defaultTag: "button",
    props: {
      type: "button",
      "aria-label": "Remove tag",
      disabled: disabled || undefined,
      ...(className ? { className } : {}),
      onClick: () => removeAt(index),
    },
    state: { disabled },
  });
}

export const TagsInput = {
  Input: TagsInputInput,
  List: TagsInputList,
  Root: TagsInputRoot,
  Tag: TagsInputTag,
  TagRemove: TagsInputTagRemove,
};
