import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import type { ChoiceItem } from "../internal/choice-family/types.js";
import { buildRatingItems } from "./rating-items.js";
import type { RatingProps } from "./types.js";

export function Rating({
  id,
  defaultValue = 0,
  max = 5,
  readOnly = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: RatingProps): ReactElement {
  return (
    <ChoiceGroup<ChoiceItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={buildRatingItems(max, disabled || readOnly)}
      isChecked={(item) => Number(item.value) === defaultValue}
      kind="single"
      namespace="rating"
      orientation="horizontal"
      rootAttributes={{
        "aria-label": ariaLabel,
        "data-disabled": disabled ? "" : undefined,
        "data-readonly": readOnly ? "" : undefined,
      }}
    />
  );
}
Rating.displayName = "Rating";
