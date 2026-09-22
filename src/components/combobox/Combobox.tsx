"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type {
  ClipboardEvent,
  ElementType,
  KeyboardEvent,
  ReactElement,
  SyntheticEvent,
} from "react";
import {
  useControllableState,
  useId,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from "@gunkin/uiify/hooks";
import { createPartContext, splitRef } from "@gunkin/uiify/core";
import { useAnchorPosition } from "@gunkin/uiify/core/anchor-position";
import {
  CollectionProvider,
  useCollection,
  useCollectionItem,
} from "@gunkin/uiify/core/collection";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { DismissableLayer } from "@gunkin/uiify/core/dismissable-layer";
import { usePopover } from "@gunkin/uiify/core/popover";
import { useRenderElement } from "@gunkin/uiify/core/render";
import {
  createComboboxActiveStore,
  defaultComboboxFilter,
  moveActiveId,
} from "./combobox-store.js";
import {
  canAddComboboxValue,
  normalizeComboboxValue,
  splitComboboxValues,
} from "./combobox-values.js";
import type {
  ComboboxActiveStore,
  ComboboxControlProps,
  ComboboxItemData,
  ComboboxContextValue,
  ComboboxRootProps,
  ComboboxTagsProps,
  ComboboxInputProps,
  ComboboxTriggerProps,
  ComboboxContentOwnProps,
  ComboboxItemOwnProps,
  ComboboxEmptyOwnProps,
} from "./types.js";

export type { ComboboxItemData } from "./types.js";

const [ComboboxProvider, useComboboxContext] = createPartContext<ComboboxContextValue>("Combobox");
const DEFAULT_MULTI_DELIMITERS = [","] as const;
const EMPTY_DELIMITERS: readonly string[] = [];

function getEnabledIds(collection: ReturnType<typeof useCollection<ComboboxItemData>>): string[] {
  return collection.filter((entry) => !entry.data.disabled).map((entry) => entry.id);
}

export function ComboboxRoot(props: ComboboxRootProps): ReactElement | null {
  const multiple = props.multiple === true;
  let multiDefaultValue: readonly string[] = [];
  let multiValue: readonly string[] | undefined;
  let multiOnValueChange: ((value: string[]) => void) | undefined;
  let singleOnValueChange: ((value: string) => void) | undefined;
  let singleValue: string | undefined;

  if (props.multiple === true) {
    multiDefaultValue = props.defaultValue ?? [];
    multiValue = props.value;
    multiOnValueChange = props.onValueChange;
  } else {
    singleOnValueChange = props.onValueChange;
    singleValue = props.value ?? props.defaultValue;
  }

  const {
    className,
    children,
    defaultInputValue,
    defaultOpen,
    filterFn = defaultComboboxFilter,
    inputValue: controlledInputValue,
    items,
    onInputValueChange,
    onOpenChange,
    open: controlledOpen,
  } = props;
  const addOnPaste = multiple ? (props.addOnPaste ?? true) : false;
  const allowCustomValue = multiple ? (props.allowCustomValue ?? false) : false;
  const delimiters = multiple ? (props.delimiters ?? DEFAULT_MULTI_DELIMITERS) : EMPTY_DELIMITERS;
  const maxValues = multiple ? props.maxValues : undefined;
  const validateValue = multiple ? props.validateValue : undefined;

  const listboxId = useId();
  const activeStoreRef = useRef<ComboboxActiveStore | null>(null);
  activeStoreRef.current ??= createComboboxActiveStore();
  const activeStore = activeStoreRef.current;
  const inputRef = useRef<HTMLElement | null>(null);
  const [inputNode, setInputNode] = useState<HTMLElement | null>(null);
  const [internalInputValue, setInternalInputValue] = useState(defaultInputValue ?? "");
  const inputValue = controlledInputValue ?? internalInputValue;
  const [selectedValues, setSelectedValues] = useControllableState<readonly string[]>({
    defaultValue: [...multiDefaultValue],
    ...(multiValue !== undefined ? { value: multiValue } : {}),
    ...(multiOnValueChange
      ? { onChange: (next: readonly string[]) => multiOnValueChange([...next]) }
      : {}),
  });

  const popover = usePopover({
    mode: "auto",
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(controlledOpen !== undefined ? { open: controlledOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const anchor = useAnchorPosition();

  const setInputElement = useCallback((element: HTMLElement | null) => {
    inputRef.current = element;
    setInputNode(element);
  }, []);

  const setInputValue = useCallback(
    (next: string) => {
      if (controlledInputValue === undefined) setInternalInputValue(next);
      onInputValueChange?.(next);
    },
    [controlledInputValue, onInputValueChange],
  );

  const isValueSelected = useCallback(
    (value: string) => multiple && selectedValues.includes(value),
    [multiple, selectedValues],
  );

  const getValueLabel = useCallback(
    (value: string) => items.find((item) => item.value === value)?.label ?? value,
    [items],
  );

  const removeValue = useCallback(
    (value: string) => {
      if (!multiple) return;
      setSelectedValues((current) => {
        if (!current.includes(value)) return current;
        return current.filter((selectedValue) => selectedValue !== value);
      });
    },
    [multiple, setSelectedValues],
  );

  const addValue = useCallback(
    (value: string): boolean => {
      let added = false;
      setSelectedValues((current) => {
        if (
          !canAddComboboxValue(value, current, {
            ...(maxValues !== undefined ? { maxValues } : {}),
            ...(validateValue ? { validateValue } : {}),
          })
        )
          return current;
        added = true;
        return [...current, value];
      });
      if (added) {
        setInputValue("");
        activeStore.setActiveId(null);
      }
      return added;
    },
    [activeStore, maxValues, setInputValue, setSelectedValues, validateValue],
  );

  const toggleValue = useCallback(
    (item: ComboboxItemData) => {
      if (!multiple || item.disabled) return;
      let added = false;
      setSelectedValues((current) => {
        if (current.includes(item.value)) {
          return current.filter((value) => value !== item.value);
        }
        if (
          !canAddComboboxValue(item.value, current, {
            ...(maxValues !== undefined ? { maxValues } : {}),
            ...(validateValue ? { validateValue } : {}),
          })
        )
          return current;
        added = true;
        return [...current, item.value];
      });
      if (added) setInputValue("");
    },
    [maxValues, multiple, setInputValue, setSelectedValues, validateValue],
  );

  const commitValue = useCallback(
    (value: string): boolean => {
      if (!multiple) return false;
      const normalizedValue = normalizeComboboxValue(value);
      const item = items.find(
        (candidate) => candidate.value === normalizedValue || candidate.label === normalizedValue,
      );
      if (item?.disabled || (!item && !allowCustomValue)) return false;
      return addValue(item?.value ?? normalizedValue);
    },
    [addValue, allowCustomValue, items, multiple],
  );

  const selectItem = useCallback(
    (item: ComboboxItemData) => {
      if (multiple) {
        toggleValue(item);
        return;
      }
      singleOnValueChange?.(item.value);
      setInputValue(item.label);
      activeStore.setActiveId(null);
      popover.close();
    },
    [activeStore, multiple, popover, setInputValue, singleOnValueChange, toggleValue],
  );

  useIsomorphicLayoutEffect(() => {
    if (!popover.open) activeStore.setActiveId(null);
  }, [activeStore, popover.open]);

  const contextValue = useMemo<ComboboxContextValue>(
    () => ({
      activeStore,
      addOnPaste,
      anchorProps: anchor.anchorProps,
      anchorRef: anchor.anchorRef,
      close: popover.close,
      filterFn,
      inputNode,
      inputValue,
      items,
      listboxId,
      delimiters,
      multiple,
      selectedValues,
      getValueLabel,
      isValueSelected,
      toggleValue,
      removeValue,
      commitValue,
      open: popover.openPopover,
      openState: popover.open,
      popupProps: popover.popupProps,
      popupRef: popover.popupRef,
      positionerProps: anchor.positionerProps,
      positionerRef: anchor.positionerRef,
      selectItem,
      setInputElement,
      setInputValue,
      ...(multiple
        ? { value: selectedValues }
        : singleValue !== undefined
          ? { value: singleValue }
          : {}),
    }),
    [
      activeStore,
      addOnPaste,
      anchor.anchorProps,
      anchor.anchorRef,
      anchor.positionerProps,
      anchor.positionerRef,
      commitValue,
      delimiters,
      filterFn,
      getValueLabel,
      inputNode,
      inputValue,
      items,
      isValueSelected,
      listboxId,
      multiple,
      popover.close,
      popover.open,
      popover.openPopover,
      popover.popupProps,
      popover.popupRef,
      selectItem,
      selectedValues,
      setInputElement,
      setInputValue,
      removeValue,
      singleValue,
      toggleValue,
    ],
  );

  return (
    <div className={className} data-uiify-combobox="">
      <CollectionProvider>
        <ComboboxProvider value={contextValue}>{children}</ComboboxProvider>
      </CollectionProvider>
    </div>
  );
}
ComboboxRoot.displayName = "ComboboxRoot";

export function ComboboxControl<TAs extends ElementType = "div">(
  props: ComboboxControlProps<TAs>,
): ReactElement | null {
  const { as, render, children, className, ...consumerProps } =
    props as ComboboxControlProps<ElementType>;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-part": "control",
      ...(className ? { className } : {}),
      children,
    },
    render,
    state: {},
  });
}
ComboboxControl.displayName = "ComboboxControl";

function ComboboxTagsMultiple<TAs extends ElementType = "div">(
  props: ComboboxTagsProps<TAs>,
): ReactElement | null {
  const { as, render, children, className, ...consumerProps } =
    props as ComboboxTagsProps<ElementType>;
  const { getValueLabel, removeValue, selectedValues } = useComboboxContext("Tags");

  const tags = selectedValues.map((value) => {
    const label = getValueLabel(value);
    return (
      <span data-part="tag" key={value}>
        {label}
        <button
          aria-label={`Remove ${label}`}
          data-part="tag-remove"
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => removeValue(value)}
        >
          ×
        </button>
      </span>
    );
  });

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-part": "tags",
      ...(className ? { className } : {}),
      children: (
        <>
          {tags}
          {children}
        </>
      ),
    },
    render,
    state: {},
  });
}
ComboboxTagsMultiple.displayName = "ComboboxTagsMultiple";

export function ComboboxTags<TAs extends ElementType = "div">(
  props: ComboboxTagsProps<TAs>,
): ReactElement | null {
  const { multiple } = useComboboxContext("Tags");
  if (!multiple) return null;

  return <ComboboxTagsMultiple {...props} />;
}
ComboboxTags.displayName = "ComboboxTags";

export function ComboboxInput<TAs extends ElementType = "input">(
  props: ComboboxInputProps<TAs>,
): ReactElement | null {
  const { as, render, className, ...consumerProps } = props as ComboboxInputProps<"input">;
  const {
    activeStore,
    addOnPaste,
    anchorProps,
    anchorRef,
    close,
    inputValue,
    listboxId,
    commitValue,
    delimiters,
    multiple,
    open,
    openState,
    removeValue,
    selectedValues,
    selectItem,
    setInputElement,
    setInputValue,
  } = useComboboxContext("Input");
  const collection = useCollection<ComboboxItemData>();
  const activeId = useSyncExternalStore(activeStore.subscribe, activeStore.getActiveId, () => null);
  const [consumerRef, withoutRef] = splitRef<HTMLInputElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(anchorRef, setInputElement, consumerRef);
  const {
    onChange: consumerOnChange,
    onKeyDown: consumerOnKeyDown,
    onPaste: consumerOnPaste,
  } = withoutRef as {
    onChange?: (event: SyntheticEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  };

  const navigate = (direction: "first" | "last" | "next" | "prev") => {
    const nextId = moveActiveId(getEnabledIds(collection), activeId, direction);
    activeStore.setActiveId(nextId);
  };

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
    if (!openState) open();
    activeStore.setActiveId(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const isDelimiterKey = event.key.length === 1 && delimiters.includes(event.key);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!openState) open();
      navigate(activeId ? "next" : "first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!openState) open();
      navigate(activeId ? "prev" : "last");
    } else if (event.key === "Enter" && openState && activeId) {
      event.preventDefault();
      const match = collection.find((entry) => entry.id === activeId);
      if (match) selectItem(match.data);
    } else if (multiple && (event.key === "Enter" || isDelimiterKey)) {
      event.preventDefault();
      commitValue(inputValue);
    } else if (multiple && event.key === "Backspace" && !inputValue && selectedValues.length > 0) {
      event.preventDefault();
      const lastValue = selectedValues.at(-1);
      if (lastValue !== undefined) removeValue(lastValue);
    } else if (event.key === "Escape" && openState) {
      event.preventDefault();
      close();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (!multiple || !addOnPaste) return;
    const text = event.clipboardData.getData("text");
    const separators = [...delimiters, "\n", "\r", "\t"];
    if (!separators.some((delimiter) => delimiter.length > 0 && text.includes(delimiter))) return;
    event.preventDefault();
    for (const value of splitComboboxValues(text, delimiters)) commitValue(value);
  };

  return useRenderElement({
    as,
    defaultTag: "input",
    props: {
      ...withoutRef,
      ...anchorProps,
      ref: mergedRef,
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-controls": listboxId,
      "aria-expanded": openState,
      ...(activeId ? { "aria-activedescendant": activeId } : {}),
      "data-part": "input",
      ...(className ? { className } : {}),
      value: inputValue,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      onPaste: composeEventHandlers(consumerOnPaste, handlePaste),
    },
    render,
    state: { open: openState },
  });
}

export function ComboboxTrigger<TAs extends ElementType = "button">(
  props: ComboboxTriggerProps<TAs>,
): ReactElement | null {
  const { as, render, children, className, ...consumerProps } =
    props as ComboboxTriggerProps<"button">;
  const { close, inputNode, listboxId, open, openState } = useComboboxContext("Trigger");
  const nativeButton = !as || as === "button";
  const { onClick: consumerOnClick } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
  };

  const handleClick = () => {
    if (openState) close();
    else open();
    inputNode?.focus({ preventScroll: true });
  };

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      "aria-expanded": openState,
      "aria-controls": listboxId,
      "aria-haspopup": "listbox",
      ...(nativeButton ? { type: "button" } : {}),
      ...(className ? { className } : {}),
      "data-part": "trigger",
      children,
      onClick: composeEventHandlers(consumerOnClick, handleClick),
    },
    render,
    state: { open: openState },
  });
}

export function ComboboxContent(props: ComboboxContentOwnProps): ReactElement | null {
  const { align = "start", children, className, side = "bottom" } = props;
  const {
    close,
    filterFn,
    inputNode,
    inputValue,
    items,
    listboxId,
    multiple,
    openState,
    popupProps,
    popupRef,
    positionerProps,
    positionerRef,
  } = useComboboxContext("Content");

  const filteredItems = useMemo(() => filterFn(items, inputValue), [filterFn, inputValue, items]);

  const branches = useMemo(() => {
    const set = new Set<Element>();
    if (inputNode) set.add(inputNode);
    return set;
  }, [inputNode]);
  const mergedRef = useMergedRefs(popupRef, positionerRef);

  return (
    <DismissableLayer
      branches={branches}
      onDismiss={() => close()}
      {...popupProps}
      {...positionerProps}
      ref={mergedRef}
      id={listboxId}
      // Combobox pattern requires an ARIA listbox; native <select> cannot replace it.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- ARIA combobox popup
      role="listbox"
      aria-multiselectable={multiple ? true : undefined}
      data-align={align}
      data-part="content"
      data-side={side}
      data-state={openState ? "open" : "closed"}
      {...(className ? { className } : {})}
    >
      {children(filteredItems)}
    </DismissableLayer>
  );
}
ComboboxContent.displayName = "ComboboxContent";

export function ComboboxItem(props: ComboboxItemOwnProps): ReactElement | null {
  const { className, item } = props;
  const { activeStore, isValueSelected, multiple, selectItem } = useComboboxContext("Item");
  const id = useId();
  const ref = useCollectionItem({ data: item, id });
  const active = useSyncExternalStore(
    (onStoreChange) => activeStore.subscribeItem(id, onStoreChange),
    () => activeStore.isActive(id),
    () => false,
  );
  const selected = multiple ? isValueSelected(item.value) : active;

  return useRenderElement({
    defaultTag: "div",
    props: {
      ref,
      id,
      role: "option",
      "aria-disabled": item.disabled ? true : undefined,
      "aria-selected": selected,
      "data-disabled": item.disabled ? "" : undefined,
      "data-highlighted": active ? "" : undefined,
      "data-selected": multiple && selected ? "" : undefined,
      "data-part": "item",
      ...(className ? { className } : {}),
      children: item.label,
      onMouseDown(event: SyntheticEvent<HTMLElement>) {
        event.preventDefault();
      },
      onClick: () => {
        if (!item.disabled) selectItem(item);
      },
    },
    state: { active, disabled: Boolean(item.disabled), selected },
  });
}

export function ComboboxEmpty(props: ComboboxEmptyOwnProps): ReactElement | null {
  const { children, className } = props;
  return useRenderElement({
    defaultTag: "div",
    props: {
      role: "presentation",
      "data-part": "empty",
      ...(className ? { className } : {}),
      children,
    },
    state: {},
  });
}

export const Combobox = {
  Control: ComboboxControl,
  Content: ComboboxContent,
  Empty: ComboboxEmpty,
  Input: ComboboxInput,
  Item: ComboboxItem,
  Root: ComboboxRoot,
  Tags: ComboboxTags,
  Trigger: ComboboxTrigger,
};
