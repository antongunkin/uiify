import type { ReactElement } from "react";
import { cn } from "../../../core/class-names.js";
import { resolveRepeatedSlotProps } from "../../../core/slot-props.js";
import {
  ChoiceGroup as ElementChoiceGroup,
  ChoiceItem as ElementChoiceItem,
} from "../../../elements/choice/index.js";
import { getChoiceGroupName } from "./ids.js";
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
      {...{ [`data-uiify-${namespace}`]: "" }}
      {...rootAttributes}
      {...rootProps}
      className={className}
      id={id}
      kind={kind}
      orientation={orientation}
    >
      {items.map((item) => {
        const inputSlotProps = resolveRepeatedSlotProps(slotProps?.input, item.value);
        return (
          <ElementChoiceItem
            {...resolveRepeatedSlotProps(slotProps?.item, item.value)}
            {...(renderPanel ? { panel: renderPanel(item) } : {})}
            {...(isControlled ? { checked: isChecked(item) } : { defaultChecked: isChecked(item) })}
            disabled={item.disabled ?? false}
            groupId={id}
            key={item.value}
            kind={kind}
            label={renderLabel ? renderLabel(item) : item.label}
            labelPart={labelPart ? "trigger" : "label"}
            slotProps={{
              input: {
                "data-part": "control",
                ...(kind === "single" ? { "data-uiify-radio": "" } : {}),
                ...inputSlotProps,
                className: cn(inputSlotProps.className, itemInputClassName?.(item)),
              },
              label: {
                ...labelAttributes,
                ...resolveRepeatedSlotProps(slotProps?.label, item.value),
              },
              panel: resolveRepeatedSlotProps(slotProps?.panel, item.value),
            }}
            name={groupName}
            {...(onItemChange ? { onValueChange: () => onItemChange(item) } : {})}
            part={itemPart}
            value={item.value}
          />
        );
      })}
      {append ? (
        <div data-part="append" {...appendProps}>
          {append}
        </div>
      ) : null}
    </ElementChoiceGroup>
  );
}
ChoiceGroup.displayName = "ChoiceGroup";
