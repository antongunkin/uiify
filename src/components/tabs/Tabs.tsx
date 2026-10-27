import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import { omitProps, resolveRepeatedSlotProps } from "../../core/slot-props.js";
import type { TabsItem, TabsProps } from "./types.js";

export function Tabs({
  id,
  items,
  defaultValue,
  orientation = "horizontal",
  className,
  append,
  slotProps,
  ...rootProps
}: TabsProps): ReactElement {
  return (
    <ChoiceGroup<TabsItem>
      {...(className !== undefined ? { className } : {})}
      rootProps={omitProps(rootProps, ["children", "dangerouslySetInnerHTML"])}
      {...(append !== undefined ? { append } : {})}
      {...(slotProps?.append !== undefined
        ? {
            appendProps: omitProps(slotProps.append, [
              "children",
              "dangerouslySetInnerHTML",
              "data-part",
              "data-uiify-tabs",
            ]),
          }
        : {})}
      id={id}
      items={items}
      isChecked={(item) => item.value === defaultValue}
      itemProps={(item) =>
        resolveRepeatedSlotProps(slotProps?.item, item.value, [
          "data-part",
          "data-uiify-choice",
          "data-uiify-tabs",
        ])
      }
      itemSlotProps={(item) => ({
        input: resolveRepeatedSlotProps(slotProps?.input, item.value, [
          "aria-labelledby",
          "checked",
          "defaultChecked",
          "disabled",
          "id",
          "name",
          "type",
          "value",
          "data-part",
          "data-uiify-choice",
          "data-uiify-radio",
          "data-uiify-tabs",
        ]),
        label: resolveRepeatedSlotProps(slotProps?.trigger, item.value, [
          "htmlFor",
          "id",
          "data-part",
          "data-uiify-tabs",
        ]),
        panel: resolveRepeatedSlotProps(slotProps?.panel, item.value, [
          "id",
          "data-part",
          "data-uiify-tabs",
        ]),
      })}
      kind="single"
      labelPart
      namespace="tabs"
      orientation={orientation}
      renderPanel={(item) => item.panel}
    />
  );
}
Tabs.displayName = "Tabs";
