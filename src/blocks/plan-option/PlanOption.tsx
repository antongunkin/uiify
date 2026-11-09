import type { ReactElement } from "react";
import { Badge } from "../../components/badge/index.js";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../../components/field/index.js";
import { RadioGroupItem } from "../../components/radio-group/index.js";
import type { PlanOptionProps } from "./types.js";

/** A plan as a radio choice card. Tier 0: the browser owns selection, keyboard and submission. */
export function PlanOption(props: PlanOptionProps): ReactElement {
  const {
    name,
    value,
    title,
    price,
    description,
    badge,
    defaultChecked,
    disabled,
    required,
    slotProps = {},
    ...rootProps
  } = props;
  const id = slotProps.input?.id ?? `${name}-${value}`;
  const priceId = slotProps.price?.id ?? `${id}-price`;
  const descriptionId = slotProps.description?.id ?? `${id}-description`;
  const describedBy =
    [price ? priceId : undefined, description ? descriptionId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <Field orientation="horizontal" variant="card" {...rootProps}>
      <RadioGroupItem
        id={id}
        aria-describedby={describedBy}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        {...slotProps.input}
        name={name}
        value={value}
      />
      <FieldContent {...slotProps.content}>
        <FieldLabel htmlFor={id} disabled={disabled} {...slotProps.label}>
          {title}
          {badge ? (
            <>
              {" "}
              <Badge {...slotProps.badge}>{badge}</Badge>
            </>
          ) : null}
        </FieldLabel>
        {price ? (
          <FieldDescription disabled={disabled} {...slotProps.price} id={priceId}>
            {price}
          </FieldDescription>
        ) : null}
        {description ? (
          <FieldDescription disabled={disabled} {...slotProps.description} id={descriptionId}>
            {description}
          </FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  );
}
PlanOption.displayName = "PlanOption";
