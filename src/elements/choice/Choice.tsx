import type { ReactElement } from "react";
import { choiceGroupName, choiceIds } from "./ids.js";
import type { ChoiceGroupProps, ChoiceItemProps } from "./types.js";

function omitOwnedProps<TProps extends object>(
  props: TProps | undefined,
  keys: readonly string[],
): TProps {
  const result = { ...props } as Record<string, unknown>;
  for (const key of keys) delete result[key];
  return result as TProps;
}

/**
 * A group of `Choice.Item`s. Purely a marked, oriented `<div>` — the actual `<input>`s are
 * siblings-by-id, not parent/child data flow (no `useContext`, no `cloneElement`: Tier 0 bans
 * both). Emits `data-orientation` and `data-uiify-choice`.
 */
export function ChoiceGroup(props: ChoiceGroupProps): ReactElement {
  const {
    children,
    kind: _kind,
    name: _name,
    orientation = "horizontal",
    ...consumerProps
  } = props;
  const nativeProps = omitOwnedProps(consumerProps, ["children", "dangerouslySetInnerHTML"]);
  return (
    <div {...nativeProps} data-orientation={orientation} data-uiify-choice="">
      {children}
    </div>
  );
}
ChoiceGroup.displayName = "ChoiceGroup";

/**
 * One radio/checkbox choice: an `<input>`, its `<label>`, and an optional panel. `groupId` and
 * `kind` are explicit (see `ChoiceGroupOwnProps.id`) — this part does not read them from its
 * `Choice.Group` ancestor. Emits `data-uiify-choice` and `data-part` (default `"item"`) on the
 * wrapper.
 */
export function ChoiceItem(props: ChoiceItemProps): ReactElement {
  const {
    defaultChecked = false,
    checked,
    disabled = false,
    groupId,
    kind,
    label,
    labelPart = false,
    name,
    onValueChange,
    panel,
    slotProps,
    part = "item",
    value,
    ...consumerProps
  } = props;

  const isControlled = checked !== undefined;
  const wrapperProps = omitOwnedProps(consumerProps, [
    "children",
    "dangerouslySetInnerHTML",
    "data-part",
    "data-uiify-choice",
  ]);
  const inputProps = omitOwnedProps(slotProps?.input, [
    "children",
    "dangerouslySetInnerHTML",
    "aria-labelledby",
    "checked",
    "defaultChecked",
    "disabled",
    "id",
    "name",
    "type",
    "value",
  ]);
  const labelProps = omitOwnedProps(slotProps?.label, [
    "children",
    "dangerouslySetInnerHTML",
    "htmlFor",
    "id",
    "data-part",
  ]);
  const panelProps = omitOwnedProps(slotProps?.panel, [
    "children",
    "dangerouslySetInnerHTML",
    "id",
    "data-part",
  ]);

  const { controlId, labelId, panelId } = choiceIds(groupId, value);
  const groupName = name ?? choiceGroupName(groupId, kind);
  const inputType = kind === "single" ? "radio" : "checkbox";

  return (
    <div {...wrapperProps} data-part={part} data-uiify-choice="">
      <input
        {...inputProps}
        aria-labelledby={labelId}
        {...(isControlled ? { checked } : { defaultChecked })}
        disabled={disabled}
        id={controlId}
        name={groupName}
        type={inputType}
        value={value}
        {...(onValueChange
          ? {
              onChange: (event) => {
                slotProps?.input?.onChange?.(event);
                if (!event.defaultPrevented) onValueChange(event.currentTarget.value);
              },
            }
          : {})}
      />
      <label
        {...labelProps}
        htmlFor={controlId}
        id={labelId}
        {...(labelPart ? { "data-part": labelPart === true ? "label" : labelPart } : {})}
      >
        {label}
      </label>
      {panel === undefined ? null : (
        <div {...panelProps} data-part="panel" id={panelId}>
          {panel}
        </div>
      )}
    </div>
  );
}
ChoiceItem.displayName = "ChoiceItem";

export const Choice = {
  Group: ChoiceGroup,
  Item: ChoiceItem,
};
