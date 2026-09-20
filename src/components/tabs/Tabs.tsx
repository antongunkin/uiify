import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import type { TabsItem, TabsProps } from "./types.js";

export function Tabs({
  id,
  items,
  defaultValue,
  orientation = "horizontal",
  className,
  append,
}: TabsProps): ReactElement {
  return (
    <ChoiceGroup<TabsItem>
      {...(className !== undefined ? { className } : {})}
      {...(append !== undefined ? { append } : {})}
      id={id}
      items={items}
      isChecked={(item) => item.value === defaultValue}
      kind="single"
      labelPart
      namespace="tabs"
      orientation={orientation}
      renderPanel={(item) => item.panel}
      withInputAttribute
      withTriggerAttribute
    />
  );
}
Tabs.displayName = "Tabs";
