import type { ReactElement } from "react";
import { mergeRepeatedSlotProps, resolveRepeatedSlotProps } from "../../../core/slot-props.js";
import {
  ChoiceGroup as ElementChoiceGroup,
  ChoiceItem as ElementChoiceItem,
} from "../../../elements/choice/index.js";
import { getChoiceGroupName } from "./ids.js";
import type { ChoiceItemSlotProps } from "../../../elements/choice/types.js";
import type { ChoiceGroupProps, ChoiceItem } from "./types.js";

/**
 * Built on `@gunkin/uiify/elements/choice`: this component
 * stays the ergonomic, items-array API six components share, now implemented as a thin map
 * from `items` onto `Choice.Item` with canonical `data-part` anatomy.
 */
export function ChoiceGroup<TItem extends ChoiceItem>(
  props: ChoiceGroupProps<TItem>,
): ReactElement {
  const {
    id,
    items,
    namespace,
    kind,
    isChecked,
    isControlled = false,
    name,
    orientation,
    className,
    rootProps,
    itemPart = "item",
    labelPart = false,
    rootAttributes,
    labelAttributes,
    itemInputClassName,
    itemProps,
    itemSlotProps,
    slotProps,
    onItemChange,
    renderPanel,
    renderLabel,
    append,
    appendProps,
  } = props;
  const groupName = name ?? getChoiceGroupName(id, kind);

  return (
    <ElementChoiceGroup
      {...rootProps}
      {...rootAttributes}
      className={className}
      id={id}
      kind={kind}
      orientation={orientation}
      {...{ [`data-uiify-${namespace}`]: "" }}
    >
      {items.map((item) => {
        const panel = renderPanel ? renderPanel(item) : undefined;
        const itemSlots = itemSlotProps?.(item);
        const inputSlotProps = mergeRepeatedSlotProps(
          resolveRepeatedSlotProps(slotProps?.input, item.value, ["data-part", "data-uiify-radio"]),
          itemSlots?.input,
        );
        const controlClassName = [inputSlotProps.className, itemInputClassName?.(item)]
          .filter(Boolean)
          .join(" ");
        const itemPropsForValue = mergeRepeatedSlotProps(
          resolveRepeatedSlotProps(slotProps?.item, item.value, [
            "checked",
            "defaultChecked",
            "disabled",
            "groupId",
            "kind",
            "label",
            "labelPart",
            "name",
            "onValueChange",
            "panel",
            "part",
            "slotProps",
            "value",
          ]),
          itemProps?.(item),
        );
        const labelPropsForValue = mergeRepeatedSlotProps(
          resolveRepeatedSlotProps(slotProps?.label, item.value),
          itemSlots?.label,
        );
        const panelPropsForValue = mergeRepeatedSlotProps(
          resolveRepeatedSlotProps(slotProps?.panel, item.value),
          itemSlots?.panel,
        );
        return (
          <ElementChoiceItem
            {...itemPropsForValue}
            {...(panel === undefined ? {} : { panel })}
            {...(isControlled ? { checked: isChecked(item) } : { defaultChecked: isChecked(item) })}
            disabled={item.disabled ?? false}
            groupId={id}
            key={item.value}
            kind={kind}
            label={renderLabel ? renderLabel(item) : item.label}
            labelPart={labelPart ? "trigger" : "label"}
            slotProps={{
              ...itemSlots,
              input: {
                ...inputSlotProps,
                ...(controlClassName ? { className: controlClassName } : {}),
                "data-part": "control",
                ...(kind === "single" ? { "data-uiify-radio": "" } : {}),
              } as unknown as NonNullable<ChoiceItemSlotProps["input"]>,
              label: {
                ...labelPropsForValue,
                ...labelAttributes,
              } as NonNullable<ChoiceItemSlotProps["label"]>,
              panel: {
                ...panelPropsForValue,
                "data-part": "panel",
              } as NonNullable<ChoiceItemSlotProps["panel"]>,
            }}
            name={groupName}
            {...(onItemChange ? { onValueChange: () => onItemChange(item) } : {})}
            part={itemPart}
            value={item.value}
          />
        );
      })}
      {append ? (
        <div {...appendProps} data-part="append">
          {append}
        </div>
      ) : null}
    </ElementChoiceGroup>
  );
}
ChoiceGroup.displayName = "ChoiceGroup";
