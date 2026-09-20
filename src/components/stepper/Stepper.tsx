import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import type { StepperItem, StepperProps } from "./types.js";

export function Stepper({
  id,
  items,
  defaultValue,
  orientation = "horizontal",
  className,
}: StepperProps): ReactElement {
  return (
    <ChoiceGroup<StepperItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={items}
      isChecked={(item) => item.value === defaultValue}
      itemPart="step"
      itemWrapperAttributes={(item) => ({ "data-complete": item.complete ? "" : undefined })}
      kind="single"
      namespace="stepper"
      orientation={orientation}
      renderLabel={(item) => (
        <>
          <span>{item.label}</span>
          {item.description ? <small>{item.description}</small> : null}
        </>
      )}
      renderPanel={(item) => item.panel}
      withInputAttribute
    />
  );
}
Stepper.displayName = "Stepper";
