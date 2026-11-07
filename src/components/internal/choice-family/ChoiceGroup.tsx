import type { ReactElement } from "react";
import { cn } from "../../../core/class-names.js";
import { resolveRepeatedSlotProps } from "../../../core/slot-props.js";
import { NativeChoiceGroup, NativeChoiceItem } from "../../../elements/native-choice/index.js";
import { getChoiceGroupName } from "./ids.js";
import type { ChoiceGroupProps, ChoiceItem } from "./types.js";

const choiceClasses: Readonly<
  Partial<
    Record<
      string,
      {
        root: string;
        item: string;
        control: string;
        label: string;
      }
    >
  >
> = {
  "toggle-group": {
    root: "uiify-toggle-group",
    item: "uiify-toggle-group-item",
    control: "uiify-toggle-group-control",
    label: "uiify-toggle-group-label",
  },
  "segmented-control": {
    root: "uiify-segmented-control",
    item: "uiify-segmented-control-item",
    control: "peer/segmented-control uiify-segmented-control-input",
    label: "uiify-segmented-control-label",
  },
  rating: {
    root: "uiify-rating",
    item: "uiify-rating-item",
    control: "uiify-rating-input",
    label: "uiify-rating-label",
  },
};

/** Renders the shared items-array API as native Choice elements. */
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
    rootAttributes,
    labelAttributes,
    slotProps,
    onItemChange,
    renderLabel,
  } = props;
  const groupName = name ?? getChoiceGroupName(id, kind);
  const classes = Object.hasOwn(choiceClasses, namespace) ? choiceClasses[namespace] : undefined;

  return (
    <NativeChoiceGroup
      {...rootAttributes}
      {...rootProps}
      className={cn(classes?.root, className)}
      id={id}
      kind={kind}
      orientation={orientation}
    >
      {items.map((item) => {
        const itemProps = resolveRepeatedSlotProps(slotProps?.item, item.value);
        const inputSlotProps = resolveRepeatedSlotProps(slotProps?.input, item.value);
        const labelSlotProps = resolveRepeatedSlotProps(slotProps?.label, item.value);
        return (
          <NativeChoiceItem
            {...itemProps}
            className={cn(classes?.item, itemProps.className)}
            {...(isControlled ? { checked: isChecked(item) } : { defaultChecked: isChecked(item) })}
            disabled={item.disabled ?? false}
            groupId={id}
            key={item.value}
            kind={kind}
            label={renderLabel ? renderLabel(item) : item.label}
            slotProps={{
              input: {
                ...inputSlotProps,
                className: cn(classes?.control, inputSlotProps.className),
              },
              label: {
                ...labelAttributes,
                ...labelSlotProps,
                className: cn(
                  labelAttributes?.["className"],
                  classes?.label,
                  labelSlotProps.className,
                ),
              },
            }}
            name={groupName}
            {...(onItemChange ? { onValueChange: () => onItemChange(item) } : {})}
            value={item.value}
          />
        );
      })}
    </NativeChoiceGroup>
  );
}
ChoiceGroup.displayName = "ChoiceGroup";
