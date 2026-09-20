"use client";

import type { ReactElement } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { ChoiceGroup } from "../../internal/choice-family/ChoiceGroup.js";
import type { ChoiceItem } from "../../internal/choice-family/types.js";
import { buildRatingItems } from "../rating-items.js";
import type { RatingClientProps } from "../types.js";

/**
 * Controlled entry point. The default `Rating` (server, Tier 0) covers the
 * common uncontrolled case with zero client JS — hover preview and
 * persisted selection are pure CSS (`:checked`/`:hover` sibling rules). This entry only exists
 * for `value`/`onValueChange`:
 * remounting on every value change (via `key`) keeps the underlying radios
 * genuinely uncontrolled DOM nodes rather than teaching ChoiceGroup a
 * React-controlled `checked` mode.
 */
export function RatingClient({
  id,
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: RatingClientProps): ReactElement {
  const [value, setValue] = useControllableState({
    defaultValue,
    onChange: onValueChange,
    value: controlledValue,
  });

  return (
    <ChoiceGroup<ChoiceItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={buildRatingItems(max, disabled || readOnly)}
      isChecked={(item) => Number(item.value) === value}
      key={value}
      kind="single"
      namespace="rating"
      onItemChange={(item) => setValue(Number(item.value))}
      orientation="horizontal"
      rootAttributes={{
        "aria-label": ariaLabel,
        "data-disabled": disabled ? "" : undefined,
        "data-readonly": readOnly ? "" : undefined,
      }}
    />
  );
}
RatingClient.displayName = "RatingClient";
