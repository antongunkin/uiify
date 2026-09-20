import type { ReactElement } from "react";
import {
  ChoiceGroup as ElementChoiceGroup,
  ChoiceItem as ElementChoiceItem,
} from "../../../elements/choice/index.js";
import { getChoiceGroupName } from "./ids.js";
import type { ChoiceGroupProps, ChoiceItem } from "./types.js";

/**
 * Built on `@gunkin/uiify/elements/choice`: this component
 * stays the ergonomic, items-array API six components share, now implemented as a thin map
 * from `items` onto `Choice.Item` — this file's `namespace`/`with*Attribute` flags translate
 * into the element's explicit `inputProps`/`labelProps`/`panelProps` escape hatches.
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
    itemPart = "item",
    labelPart = false,
    withInputAttribute = false,
    withTriggerAttribute = false,
    rootAttributes,
    itemWrapperAttributes,
    itemInputClassName,
    onItemChange,
    renderPanel,
    renderLabel,
    append,
  } = props;
  const groupName = name ?? getChoiceGroupName(id, kind);

  return (
    <ElementChoiceGroup
      {...{ [`data-uiify-${namespace}`]: "" }}
      {...rootAttributes}
      className={className}
      id={id}
      kind={kind}
      orientation={orientation}
    >
      {items.map((item) => {
        const panel = renderPanel ? renderPanel(item) : undefined;
        return (
          <ElementChoiceItem
            {...itemWrapperAttributes?.(item)}
            {...(panel === undefined ? {} : { panel })}
            {...(isControlled ? { checked: isChecked(item) } : { defaultChecked: isChecked(item) })}
            disabled={item.disabled ?? false}
            groupId={id}
            inputProps={{
              className: itemInputClassName?.(item),
              ...(withInputAttribute ? { [`data-uiify-${namespace}-input`]: "" } : {}),
            }}
            key={item.value}
            kind={kind}
            label={renderLabel ? renderLabel(item) : item.label}
            labelPart={labelPart}
            labelProps={withTriggerAttribute ? { [`data-uiify-${namespace}-trigger`]: "" } : {}}
            name={groupName}
            {...(onItemChange ? { onChange: () => onItemChange(item) } : {})}
            panelProps={{ [`data-uiify-${namespace}-panel`]: item.value }}
            part={itemPart}
            value={item.value}
          />
        );
      })}
      {append ? <div data-part="append">{append}</div> : null}
    </ElementChoiceGroup>
  );
}
ChoiceGroup.displayName = "ChoiceGroup";
