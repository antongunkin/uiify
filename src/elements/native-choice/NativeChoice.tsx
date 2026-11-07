import type { ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { choiceGroupName, choiceIds } from "./ids.js";
import type { NativeChoiceGroupProps, NativeChoiceItemProps } from "./types.js";

/**
 * A group of `NativeChoice.Item`s. Purely a marked, oriented `<div>` — the actual `<input>`s are
 * siblings-by-id, not parent/child data flow (no `useContext`, no `cloneElement`: Tier 0 bans
 * both). Emits `data-orientation` and the `uiify-native-choice` class.
 */
export function NativeChoiceGroup(props: NativeChoiceGroupProps): ReactElement {
  const {
    children,
    className,
    kind: _kind,
    name: _name,
    orientation = "horizontal",
    ...consumerProps
  } = props;
  return (
    <div
      data-orientation={orientation}
      {...consumerProps}
      className={cn("uiify-native-choice", className)}
    >
      {children}
    </div>
  );
}
NativeChoiceGroup.displayName = "NativeChoiceGroup";

/**
 * One radio/checkbox choice: an `<input>`, its `<label>`, and an optional panel. `groupId` and
 * `kind` are explicit (see `NativeChoiceGroupOwnProps.id`) — this part does not read them from its
 * `NativeChoice.Group` ancestor. Renders the `uiify-native-choice-item` class on the wrapper and
 * `uiify-native-choice-panel` on the panel; a component built on it adds its own part classes.
 */
export function NativeChoiceItem(props: NativeChoiceItemProps): ReactElement {
  const {
    defaultChecked = false,
    checked,
    className,
    disabled = false,
    groupId,
    kind,
    label,
    name,
    onValueChange,
    panel,
    slotProps,
    value,
    ...consumerProps
  } = props;

  const isControlled = checked !== undefined;
  const { controlId, labelId, panelId } = choiceIds(groupId, value);
  const groupName = name ?? choiceGroupName(groupId, kind);
  const inputType = kind === "single" ? "radio" : "checkbox";

  return (
    <div {...consumerProps} className={cn("uiify-native-choice-item", className)}>
      <input
        aria-labelledby={labelId}
        {...(isControlled ? { checked } : { defaultChecked })}
        disabled={disabled}
        id={controlId}
        name={groupName}
        type={inputType}
        value={value}
        {...slotProps?.input}
        {...(onValueChange
          ? {
              onChange: (event) => {
                slotProps?.input?.onChange?.(event);
                if (!event.defaultPrevented) onValueChange(event.currentTarget.value);
              },
            }
          : {})}
      />
      <label htmlFor={controlId} id={labelId} {...slotProps?.label}>
        {label}
      </label>
      {panel === undefined ? null : (
        <div
          id={panelId}
          {...slotProps?.panel}
          className={cn("uiify-native-choice-panel", slotProps?.panel?.className)}
        >
          {panel}
        </div>
      )}
    </div>
  );
}
NativeChoiceItem.displayName = "NativeChoiceItem";

export const NativeChoice = {
  Group: NativeChoiceGroup,
  Item: NativeChoiceItem,
};
