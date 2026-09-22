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
    itemPart = "item",
    labelPart = false,
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
              "data-part": "control",
              ...(kind === "single" ? { "data-uiify-radio": "" } : {}),
            }}
            key={item.value}
            kind={kind}
            label={renderLabel ? renderLabel(item) : item.label}
            labelPart={false}
            labelProps={{ "data-part": labelPart ? "trigger" : "label" }}
            name={groupName}
            {...(onItemChange ? { onChange: () => onItemChange(item) } : {})}
            panelProps={{ "data-part": "panel" }}
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
