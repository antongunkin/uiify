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
import { splitRef } from "@gunkin/uiify/core";
import { useAnchorPosition } from "@gunkin/uiify/core/anchor-position";
import {
  CollectionProvider,
  useCollection,
  useCollectionItem,
} from "@gunkin/uiify/core/collection";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn } from "../../core/class-names.js";
import { sortByDocumentOrder } from "../../core/dom-order.js";
import { DismissableLayer } from "@gunkin/uiify/core/dismissable-layer";
import { isComposingKeyEvent } from "@gunkin/uiify/core/ime";
import { usePopover } from "@gunkin/uiify/core/popover";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
import {
  createComboboxActiveStore,
  defaultComboboxFilter,
  moveActiveId,
} from "./combobox-store.js";
import {
  canSelectComboboxValue,
  normalizeComboboxValue,
  splitComboboxValues,
} from "./combobox-values.js";
import { ComboboxProvider, useComboboxContext } from "./combobox-context.js";
import { ComboboxFormControl } from "./ComboboxFormControl.js";
import type {
  ComboboxFormState,
  ComboboxControlProps,
  ComboboxItemData,
  ComboboxContextValue,
  ComboboxRootProps,
  ComboboxMultiValueOptions,
  ComboboxTagsProps,
  ComboboxInputProps,
  ComboboxTriggerProps,
  ComboboxContentOwnProps,
  ComboboxItemOwnProps,
  ComboboxGroupOwnProps,
  ComboboxGroupLabelOwnProps,
  ComboboxEmptyOwnProps,
  ComboboxStatusProps,
} from "./types.js";

export { ComboboxFormControl } from "./ComboboxFormControl.js";
export type { ComboboxItemData } from "./types.js";

const DEFAULT_MULTI_DELIMITERS = [","] as const;
const EMPTY_DELIMITERS: readonly string[] = [];

function getEnabledIds(
  collection: ReturnType<typeof useCollection<ComboboxItemData>>,
  treeRoot: Document | ShadowRoot | undefined,
): string[] {
  const enabled = collection
    .filter((entry) => !entry.data.disabled)
    .map((entry) => ({
      id: entry.id,
      element: treeRoot?.getElementById?.(entry.id) ?? null,
    }));
  // Stable keyed nodes can move without changing their collection registration.
  return sortByDocumentOrder(enabled, (entry) => entry.element).map((entry) => entry.id);
}

export function ComboboxRoot(props: ComboboxRootProps): ReactElement | null {
  const rootProps = props as ComboboxRootProps & ComboboxMultiValueOptions;
  const {
    addOnPaste: configuredAddOnPaste,
    allowCustomValue: configuredAllowCustomValue,
    children,
    className,
    defaultInputValue,
    defaultOpen,
    defaultValue,
    delimiters: configuredDelimiters,
    disabled = false,
    filterFn = defaultComboboxFilter,
    id,
    inputValue: controlledInputValue,
    items,
    loading = false,
    maxValues: configuredMaxValues,
    multiple: multipleMode,
    onInputValueChange,
    onOpenChange,
    onValueChange,
    open: controlledOpen,
    size,
    validateValue: configuredValidateValue,
    value: controlledValue,
    ...consumerProps
  } = rootProps;
  const [formState, updateFormState] = useState<ComboboxFormState>({
    required: false,
    invalid: false,
  });
  const [hasControl, setHasControl] = useState(false);
  const formControlRef = useRef<HTMLSelectElement | null>(null);
  const setFormState = useCallback((next: ComboboxFormState) => {
    updateFormState((current) =>
      current.required === next.required && current.invalid === next.invalid ? current : next,
    );
  }, []);
  const registerFormControl = useCallback(
    (node: HTMLSelectElement) => {
      if (formControlRef.current && formControlRef.current !== node) {
        throw new Error("Combobox accepts only one FormControl per Root.");
      }
      formControlRef.current = node;
      return () => {
        if (formControlRef.current !== node) return;
        formControlRef.current = null;
        setFormState({ required: false, invalid: false });
      };
    },
    [setFormState],
  );
  const multiple = multipleMode === true;
  let multiDefaultValue: readonly string[] = [];
  let multiValue: readonly string[] | undefined;
  let multiOnValueChange: ((value: string[]) => void) | undefined;

  if (multipleMode === true) {
    multiDefaultValue = (defaultValue as readonly string[] | undefined) ?? [];
    multiValue = controlledValue as readonly string[] | undefined;
    multiOnValueChange = onValueChange as ((value: string[]) => void) | undefined;
  }

  const addOnPaste = multiple ? (configuredAddOnPaste ?? true) : false;
  const allowCustomValue = configuredAllowCustomValue ?? false;
  const delimiters = multiple
    ? (configuredDelimiters ?? DEFAULT_MULTI_DELIMITERS)
    : EMPTY_DELIMITERS;
  const maxValues = multiple ? configuredMaxValues : undefined;
  const validateValue = configuredValidateValue;

  const listboxId = useId();
  const [activeStore] = useState(createComboboxActiveStore);
  const inputRef = useRef<HTMLElement | null>(null);
  const isDisabled = useCallback(
    () => disabled || inputRef.current?.matches(":disabled") === true,
    [disabled],
  );
  const [inputNode, setInputNode] = useState<HTMLElement | null>(null);
  const [queryDirty, setQueryDirty] = useState(false);
  const [selectedValues, setSelectedValues] = useControllableState<readonly string[]>({
    defaultValue: [...multiDefaultValue],
    ...(multiValue !== undefined ? { value: multiValue } : {}),
    ...(multiOnValueChange
      ? { onChange: (next: readonly string[]) => multiOnValueChange([...next]) }
      : {}),
  });
  const [singleValue, setSingleValue] = useControllableState<string | null>({
    // Always seeded: a Root can switch from multiple to single after mount.
    defaultValue: typeof defaultValue === "string" ? defaultValue : null,
    ...(!multiple && controlledValue !== undefined
      ? { value: controlledValue as string | null }
      : {}),
    ...(!multiple && onValueChange
      ? { onChange: onValueChange as (value: string | null) => void }
      : {}),
  });
  const initialSingleLabel =
    multiple || singleValue === null
      ? ""
      : (items.find((item) => item.value === singleValue)?.label ?? singleValue);
  const [internalInputValue, setInternalInputValue] = useState(
    () => defaultInputValue ?? initialSingleLabel,
  );
  const [initialDefaults] = useState(() => ({
    values: [...multiDefaultValue],
    value: typeof defaultValue === "string" ? defaultValue : null,
    query:
      defaultInputValue ??
      (!multiple && typeof defaultValue === "string"
        ? (items.find((item) => item.value === defaultValue)?.label ?? defaultValue)
        : ""),
  }));
  const [resetRevision, setResetRevision] = useState(0);
  const previousResetRevisionRef = useRef(resetRevision);
  const inputValue = controlledInputValue ?? internalInputValue;
  const filterQuery =
    multiple || controlledInputValue !== undefined || defaultInputValue !== undefined || queryDirty
      ? inputValue
      : "";
  const previousSingleLabelRef = useRef(initialSingleLabel);
  const previousSingleValueRef = useRef(singleValue);
  const previousControlledValueRef = useRef(controlledValue);
  const didSyncInitialSingleQueryRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (!didSyncInitialSingleQueryRef.current) {
      didSyncInitialSingleQueryRef.current = true;
      previousSingleValueRef.current = singleValue;
      previousControlledValueRef.current = controlledValue;
      return;
    }

    const wasReset = previousResetRevisionRef.current !== resetRevision;
    previousResetRevisionRef.current = resetRevision;
    const selectedLabelChanged = previousSingleLabelRef.current !== initialSingleLabel;
    previousSingleLabelRef.current = initialSingleLabel;
    const controlledSelectionChanged =
      controlledValue !== undefined &&
      !Object.is(previousControlledValueRef.current, controlledValue);
    const singleSelectionChanged = !Object.is(previousSingleValueRef.current, singleValue);
    if (
      !wasReset &&
      !multiple &&
      controlledInputValue === undefined &&
      (controlledSelectionChanged ||
        singleSelectionChanged ||
        (selectedLabelChanged && !queryDirty))
    ) {
      const nextLabel =
        singleValue === null
          ? ""
          : (items.find((item) => item.value === singleValue)?.label ?? singleValue);
      setInternalInputValue(nextLabel);
      if (controlledSelectionChanged) setQueryDirty(false);
    }

    previousSingleValueRef.current = singleValue;
    previousControlledValueRef.current = controlledValue;
  }, [
    controlledInputValue,
    controlledValue,
    initialSingleLabel,
    items,
    multiple,
    queryDirty,
    resetRevision,
    singleValue,
  ]);

  const popover = usePopover({
    mode: "auto",
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(controlledOpen !== undefined ? { open: controlledOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const showPopover = popover.openPopover;
  const anchor = useAnchorPosition();

  const setInputElement = useCallback(
    (element: HTMLElement | null) => {
      inputRef.current = element;
      setInputNode(element);
    },
    [setInputNode],
  );

  const openPopover = useCallback(() => {
    if (!isDisabled()) showPopover();
  }, [isDisabled, showPopover]);

  const setInputValue = useCallback(
    (next: string) => {
      if (controlledInputValue === undefined) {
        setInternalInputValue(next);
        setQueryDirty(true);
      }
      onInputValueChange?.(next);
    },
    [controlledInputValue, onInputValueChange, setInternalInputValue, setQueryDirty],
  );

  const setCommittedInputValue = useCallback(
    (next: string) => {
      if (controlledInputValue === undefined) {
        setInternalInputValue(next);
        setQueryDirty(false);
      }
      onInputValueChange?.(next);
    },
    [controlledInputValue, onInputValueChange, setInternalInputValue, setQueryDirty],
  );

  const reset = useCallback(() => {
    if (multiple) {
      if (
        selectedValues.length !== initialDefaults.values.length ||
        selectedValues.some((value, index) => value !== initialDefaults.values[index])
      ) {
        setSelectedValues([...initialDefaults.values]);
      }
    } else if (singleValue !== initialDefaults.value) {
      setSingleValue(initialDefaults.value);
    }
    if (inputValue !== initialDefaults.query) setCommittedInputValue(initialDefaults.query);
    setQueryDirty(false);
    activeStore.setActiveId(null);
    if (popover.open) popover.close();
    setResetRevision((current) => current + 1);
  }, [
    activeStore,
    initialDefaults,
    inputValue,
    multiple,
    popover,
    selectedValues,
    setCommittedInputValue,
    setQueryDirty,
    setResetRevision,
    setSelectedValues,
    setSingleValue,
    singleValue,
  ]);

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
      if (!multiple || isDisabled()) return;
      setSelectedValues((current) => {
        if (!current.includes(value)) return current;
        return current.filter((selectedValue) => selectedValue !== value);
      });
    },
    [isDisabled, multiple, setSelectedValues],
  );

  const addValue = useCallback(
    (value: string): boolean => {
      let added = false;
      setSelectedValues((current) => {
        if (
          !canSelectComboboxValue(value, current, {
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
      if (!multiple || item.disabled || isDisabled()) return;
      let added = false;
      setSelectedValues((current) => {
        if (current.includes(item.value)) {
          return current.filter((value) => value !== item.value);
        }
        if (
          !canSelectComboboxValue(item.value, current, {
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
    [isDisabled, maxValues, multiple, setInputValue, setSelectedValues, validateValue],
  );

  const commitValue = useCallback(
    (value: string): boolean => {
      if (!multiple || isDisabled()) return false;
      const normalizedValue = normalizeComboboxValue(value);
      if (!normalizedValue) return false;
      const item = items.find(
        (candidate) => candidate.value === normalizedValue || candidate.label === normalizedValue,
      );
      if (item?.disabled || (!item && !allowCustomValue)) return false;
      return addValue(item?.value ?? normalizedValue);
    },
    [addValue, allowCustomValue, isDisabled, items, multiple],
  );

  const selectItem = useCallback(
    (item: ComboboxItemData) => {
      if (isDisabled()) return;
      if (multiple) {
        toggleValue(item);
        return;
      }
      setSingleValue(item.value);
      // A controlled value waits for the parent's new `value` (the layout effect copies its label);
      // a controlled input text has no such effect, so its owner receives the label now.
      if (
        controlledValue === undefined ||
        controlledInputValue !== undefined ||
        singleValue === item.value
      ) {
        setCommittedInputValue(item.label);
      }
      activeStore.setActiveId(null);
      popover.close();
    },
    [
      activeStore,
      controlledInputValue,
      controlledValue,
      isDisabled,
      multiple,
      popover,
      setCommittedInputValue,
      setSingleValue,
      singleValue,
      toggleValue,
    ],
  );

  const commitSingleValue = useCallback(
    (value: string): boolean => {
      if (multiple || isDisabled()) return false;
      const normalizedValue = normalizeComboboxValue(value);
      if (!normalizedValue) return false;
      const exactItem =
        items.find((item) => item.value === normalizedValue) ??
        items.find((item) => item.label === normalizedValue);
      if (exactItem) {
        if (exactItem.disabled) return false;
        selectItem(exactItem);
        return true;
      }
      if (!allowCustomValue || !(validateValue?.(normalizedValue) ?? true)) return false;

      setSingleValue(normalizedValue);
      if (
        controlledValue === undefined ||
        controlledInputValue !== undefined ||
        singleValue === normalizedValue
      ) {
        setCommittedInputValue(normalizedValue);
        activeStore.setActiveId(null);
        popover.close();
      }
      return true;
    },
    [
      activeStore,
      allowCustomValue,
      controlledInputValue,
      controlledValue,
      isDisabled,
      items,
      multiple,
      popover,
      selectItem,
      setCommittedInputValue,
      setSingleValue,
      singleValue,
      validateValue,
    ],
  );

  useIsomorphicLayoutEffect(() => {
    if (!popover.open) activeStore.setActiveId(null);
  }, [activeStore, popover.open]);

  const contextValue = useMemo<ComboboxContextValue>(
    () => ({
      reset,
      formState,
      hasControl,
      registerFormControl,
      setFormState,
      setHasControl,
      activeStore,
      addOnPaste,
      allowCustomValue,
      anchorProps: anchor.anchorProps,
      anchorRef: anchor.anchorRef,
      close: popover.close,
      filterFn,
      filterQuery,
      disabled,
      isDisabled,
      inputNode,
      inputValue,
      items,
      loading,
      listboxId,
      delimiters,
      multiple,
      selectedValues,
      getValueLabel,
      isValueSelected,
      toggleValue,
      removeValue,
      commitValue,
      commitSingleValue,
      open: openPopover,
      openState: popover.open,
      popupProps: popover.popupProps,
      popupRef: popover.popupRef,
      positionerProps: anchor.positionerProps,
      positionerRef: anchor.positionerRef,
      selectItem,
      setInputElement,
      setInputValue,
      value: multiple ? selectedValues : singleValue,
    }),
    [
      reset,
      formState,
      hasControl,
      registerFormControl,
      setFormState,
      activeStore,
      addOnPaste,
      allowCustomValue,
      anchor.anchorProps,
      anchor.anchorRef,
      anchor.positionerProps,
      anchor.positionerRef,
      commitValue,
      commitSingleValue,
      delimiters,
      filterFn,
      filterQuery,
      disabled,
      isDisabled,
      getValueLabel,
      inputNode,
      inputValue,
      items,
      loading,
      isValueSelected,
      listboxId,
      multiple,
      popover.close,
      popover.open,
      openPopover,
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
    <div
      {...(size !== undefined ? { "data-size": size } : {})}
      {...consumerProps}
      id={id}
      className={cn("uiify-combobox", className)}
    >
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
  const { anchorProps, setHasControl } = useComboboxContext("Control");
  // The surrounding control, not the inner input, is the popup's visual anchor.
  useIsomorphicLayoutEffect(() => {
    setHasControl(true);
    return () => setHasControl(false);
  }, [setHasControl]);

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...anchorProps,

      ...consumerProps,
      className: cn("uiify-combobox-control", className),
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
  const { as, render, children, className, slotProps, ...consumerProps } =
    props as ComboboxTagsProps<ElementType>;
  const { disabled, getValueLabel, removeValue, selectedValues } = useComboboxContext("Tags");

  const tags = selectedValues.map((value) => {
    const label = getValueLabel(value);
    const tagProps = resolveRepeatedSlotProps(slotProps?.tag, value);
    const removeProps = resolveRepeatedSlotProps(slotProps?.remove, value);
    return (
      <span {...tagProps} className={cn("uiify-combobox-tag", tagProps.className)} key={value}>
        {label}
        <button
          aria-label={`Remove ${label}`}
          disabled={disabled}
          type="button"
          {...removeProps}
          className={cn("uiify-combobox-tag-remove", removeProps.className)}
          onMouseDown={composeEventHandlers(removeProps.onMouseDown, (event) =>
            event.preventDefault(),
          )}
          onClick={composeEventHandlers(removeProps.onClick, () => removeValue(value))}
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
      className: cn("uiify-combobox-tags", className),
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
    allowCustomValue,
    anchorProps,
    anchorRef,
    close,
    commitSingleValue,
    formState,
    hasControl,
    inputNode,
    inputValue,
    items,
    listboxId,
    commitValue,
    delimiters,
    disabled,
    isDisabled,
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
  const treeRoot = inputNode?.getRootNode() as Document | ShadowRoot | undefined;
  const validActiveId =
    activeId &&
    collection.some((entry) => entry.id === activeId) &&
    treeRoot?.getElementById?.(activeId)
      ? activeId
      : null;
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
    const currentRoot = inputNode?.getRootNode() as Document | ShadowRoot | undefined;
    const nextId = moveActiveId(getEnabledIds(collection, currentRoot), validActiveId, direction);
    activeStore.setActiveId(nextId);
  };

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    if (isDisabled()) return;
    setInputValue(event.currentTarget.value);
    if (!openState) open();
    activeStore.setActiveId(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled() || isComposingKeyEvent(event)) return;
    const isDelimiterKey = event.key.length === 1 && delimiters.includes(event.key);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!openState) open();
      navigate(validActiveId ? "next" : "first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!openState) open();
      navigate(validActiveId ? "prev" : "last");
    } else if (event.key === "Enter" && openState && validActiveId) {
      event.preventDefault();
      const match = collection.find((entry) => entry.id === validActiveId);
      if (match) selectItem(match.data);
    } else if (
      !multiple &&
      event.key === "Enter" &&
      (allowCustomValue ||
        items.some(
          (item) =>
            item.value === normalizeComboboxValue(inputValue) ||
            item.label === normalizeComboboxValue(inputValue),
        ))
    ) {
      const committed = commitSingleValue(inputValue);
      if (committed || allowCustomValue) event.preventDefault();
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
    if (isDisabled() || !multiple || !addOnPaste) return;
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
      ...(hasControl ? {} : anchorProps),
      role: "combobox",
      "aria-required": formState.required || undefined,
      "aria-invalid": formState.invalid || undefined,
      "aria-autocomplete": "list",
      "aria-controls": listboxId,
      "aria-expanded": openState,
      ...(validActiveId ? { "aria-activedescendant": validActiveId } : {}),

      className: cn("uiify-combobox-input", className),
      disabled,
      value: inputValue,
      ...withoutRef,
      ref: mergedRef,
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
  const { close, disabled, inputNode, isDisabled, listboxId, open, openState } =
    useComboboxContext("Trigger");
  const nativeButton = !as || as === "button";
  const { onClick: consumerOnClick } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
  };

  const handleClick = () => {
    if (isDisabled()) return;
    if (openState) close();
    else open();
    inputNode?.focus({ preventScroll: true });
  };

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      "aria-expanded": openState,
      "aria-controls": listboxId,
      "aria-haspopup": "listbox",
      ...(nativeButton ? { disabled } : {}),
      ...(nativeButton ? { type: "button" } : {}),
      className: cn("uiify-combobox-trigger", className),

      ...consumerProps,
      children,
      onClick: composeEventHandlers(consumerOnClick, handleClick),
    },
    render,
    state: { open: openState },
  });
}

export function ComboboxContent(props: ComboboxContentOwnProps): ReactElement | null {
  const { align = "start", children, className, side = "bottom", ...consumerProps } = props;
  const {
    close,
    filterQuery,
    filterFn,
    inputNode,
    items,
    loading,
    listboxId,
    multiple,
    openState,
    popupProps,
    popupRef,
    positionerProps,
    positionerRef,
  } = useComboboxContext("Content");

  const filteredItems = useMemo(() => filterFn(items, filterQuery), [filterFn, filterQuery, items]);

  const branches = useMemo(() => {
    const set = new Set<Element>();
    if (inputNode) set.add(inputNode);
    return set;
  }, [inputNode]);
  const [consumerRef, domProps] = splitRef<HTMLDivElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(popupRef, positionerRef, consumerRef);

  return (
    <DismissableLayer
      branches={branches}
      onDismiss={() => close()}
      {...popupProps}
      {...positionerProps}
      id={listboxId}
      // Combobox pattern requires an ARIA listbox; native <select> cannot replace it.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- ARIA combobox popup
      role="listbox"
      aria-multiselectable={multiple ? true : undefined}
      aria-busy={loading ? true : undefined}
      data-align={align}
      data-side={side}
      data-state={openState ? "open" : "closed"}
      {...domProps}
      ref={mergedRef}
      className={cn("uiify-combobox-content", className)}
    >
      {children(filteredItems)}
    </DismissableLayer>
  );
}
ComboboxContent.displayName = "ComboboxContent";

export function ComboboxItem(props: ComboboxItemOwnProps): ReactElement | null {
  const {
    children,
    className,
    item,
    onClick: consumerOnClick,
    onMouseDown: consumerOnMouseDown,
    ref: consumerRef,
    ...consumerProps
  } = props;
  const { activeStore, isDisabled, isValueSelected, multiple, selectItem, value } =
    useComboboxContext("Item");
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const collectionRef = useCollectionItem({ data: item, id });
  const itemRef = useRef<HTMLElement | null>(null);
  const ref = useMergedRefs(collectionRef, consumerRef, itemRef);
  const active = useSyncExternalStore(
    (onStoreChange) => activeStore.subscribeItem(id, onStoreChange),
    () => activeStore.isActive(id),
    () => false,
  );
  useIsomorphicLayoutEffect(() => {
    if (!active) return undefined;
    let canceled = false;
    // Parent layout effects open the native popover after its children's effects run.
    queueMicrotask(() => {
      if (!canceled && activeStore.isActive(id)) {
        itemRef.current?.scrollIntoView?.({ block: "nearest" });
      }
    });
    return () => {
      canceled = true;
    };
  }, [active, activeStore, id]);
  const selected = multiple
    ? isValueSelected(item.value)
    : typeof value === "string" && value === item.value;

  return useRenderElement({
    defaultTag: "div",
    props: {
      id,
      role: "option",
      "aria-disabled": item.disabled ? true : undefined,
      "aria-label": children === undefined ? undefined : item.label,
      "aria-selected": selected,
      "data-disabled": item.disabled ? "" : undefined,
      "data-highlighted": active ? "" : undefined,
      "data-selected": selected ? "" : undefined,

      ...consumerProps,
      ref,
      className: cn("uiify-combobox-item", className),
      children: children === undefined ? item.label : children,
      onMouseDown: composeEventHandlers(consumerOnMouseDown, (event) => event.preventDefault()),
      onClick: composeEventHandlers(consumerOnClick, () => {
        if (!item.disabled && !isDisabled()) selectItem(item);
      }),
    },
    state: { active, disabled: Boolean(item.disabled), selected },
  });
}

export function ComboboxGroup(props: ComboboxGroupOwnProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This groups options inside an ARIA listbox.
    <div role="group" {...consumerProps} className={cn("uiify-combobox-group", className)}>
      {children}
    </div>
  );
}
ComboboxGroup.displayName = "ComboboxGroup";

export function ComboboxGroupLabel(props: ComboboxGroupLabelOwnProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  return (
    <div {...consumerProps} className={cn("uiify-combobox-group-label", className)}>
      {children}
    </div>
  );
}
ComboboxGroupLabel.displayName = "ComboboxGroupLabel";

export function ComboboxEmpty(props: ComboboxEmptyOwnProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  const { loading } = useComboboxContext("Empty");
  const element = useRenderElement({
    defaultTag: "div",
    props: {
      role: "presentation",

      ...consumerProps,
      className: cn("uiify-combobox-empty", className),
      children,
    },
    state: {},
  });
  return loading ? null : element;
}

export function ComboboxStatus(props: ComboboxStatusProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  return useRenderElement({
    defaultTag: "div",
    props: {
      role: "status",
      "aria-live": "polite",
      "aria-atomic": true,

      ...consumerProps,
      className: cn("uiify-combobox-status", className),
      children,
    },
    state: {},
  });
}
ComboboxStatus.displayName = "ComboboxStatus";

export const Combobox = {
  Control: ComboboxControl,
  Content: ComboboxContent,
  Empty: ComboboxEmpty,
  FormControl: ComboboxFormControl,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Input: ComboboxInput,
  Item: ComboboxItem,
  Root: ComboboxRoot,
  Status: ComboboxStatus,
  Tags: ComboboxTags,
  Trigger: ComboboxTrigger,
};
