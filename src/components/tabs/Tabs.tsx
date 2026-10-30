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
  slotProps,
  ...rootProps
}: TabsProps): ReactElement {
  return (
    <ChoiceGroup<TabsItem>
      {...(className !== undefined ? { className } : {})}
      rootProps={rootProps}
      {...(append !== undefined ? { append } : {})}
      {...(slotProps?.append !== undefined ? { appendProps: slotProps.append } : {})}
      id={id}
      items={items}
      isChecked={(item) => item.value === defaultValue}
      kind="single"
      labelPart
      namespace="tabs"
      orientation={orientation}
      renderPanel={(item) => item.panel}
      slotProps={{
        item: slotProps?.item,
        input: slotProps?.input,
        label: slotProps?.trigger,
        panel: slotProps?.panel,
      }}
    />
  );
}
Tabs.displayName = "Tabs";
