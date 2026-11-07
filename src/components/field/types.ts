// Field, FieldContent, FieldTitle, FieldGroup, FieldSeparator, FieldSet and FieldLegend API
// informed by shadcn/ui public documentation (names and props only).
import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { SlotProps } from "../../core/slot-props.js";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type FieldOrientation = "vertical" | "horizontal" | "responsive";

/** `card`: a bordered selectable container for a radio or checkbox with its FieldContent. */
export type FieldVariant = "card";

export interface FieldOwnProps {
  /**
   * Layout of the label, control and content. `responsive` is vertical until the nearest size
   * container (FieldGroup) is at least 28rem wide, then horizontal. Written as data-orientation.
   * @default "vertical"
   */
  readonly orientation?: FieldOrientation;
  /**
   * Marks the group with data-invalid. It does not reach the control: set `invalid` on the
   * control and render FieldError with an id listed in its aria-describedby.
   */
  readonly invalid?: boolean | undefined;
  /**
   * `card` draws the field as a bordered choice card and stretches its FieldLabel over the
   * card, so a click anywhere selects the control. Written as data-variant; omitted when unset.
   */
  readonly variant?: FieldVariant | undefined;
}

/** One label, control, description and error. Renders role="group". */
export type FieldProps = FieldOwnProps & Omit<ComponentPropsWithRef<"div">, keyof FieldOwnProps>;

export interface FieldLabelOwnProps {
  readonly disabled?: boolean | undefined;
  readonly required?: boolean | undefined;
}

/** A native label; its `htmlFor` names the control's `id`. */
export type FieldLabelProps = FieldLabelOwnProps &
  Omit<ComponentPropsWithRef<"label">, keyof FieldLabelOwnProps>;

export interface FieldDescriptionOwnProps {
  readonly disabled?: boolean | undefined;
}

/** Give it an `id` and list that id in the control's aria-describedby. */
export type FieldDescriptionProps = FieldDescriptionOwnProps &
  Omit<ComponentPropsWithRef<"p">, keyof FieldDescriptionOwnProps>;

export interface FieldErrorOwnProps {
  /** The message. Without content (`""` and `[]` count as none) FieldError renders nothing. */
  readonly children?: ReactNode;
}

/** Give it an `id` and list that id in the control's aria-describedby. */
export type FieldErrorProps = FieldErrorOwnProps &
  Omit<ComponentPropsWithRef<"p">, keyof FieldErrorOwnProps>;

export interface FieldContentOwnProps {
  /** Label and description beside a control. */
  readonly children?: ReactNode;
}

export type FieldContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FieldContentOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface FieldTitleOwnProps {
  /** Title text; use `as="span"` inside FieldLabel. */
  readonly children?: ReactNode;
}

export type FieldTitleProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FieldTitleOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface FieldGroupOwnProps {
  /** Fields stacked with form spacing; also the size container for `responsive` fields. */
  readonly children?: ReactNode;
}

export type FieldGroupProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FieldGroupOwnProps,
  Record<string, never>,
  HTMLElement
>;

/** Props for the generated nodes of FieldSeparator. */
export interface FieldSeparatorSlotProps {
  /**
   * Native props for each generated hr. They apply to both lines, so a `ref` here attaches to
   * both and ends on the last one; use a callback ref to track each line.
   */
  readonly line?: SlotProps<"hr">;
  /** Native props for the text span. */
  readonly content?: SlotProps<"span">;
}

export interface FieldSeparatorOwnProps {
  /** Optional inline label such as "or". Shown between the lines and read by assistive tech. */
  readonly children?: ReactNode;
  /** Props for the generated lines and text. */
  readonly slotProps?: FieldSeparatorSlotProps;
}

/** A line with an optional inline label. Without children it is one semantic hr. */
export type FieldSeparatorProps = FieldSeparatorOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof FieldSeparatorOwnProps>;

export interface FieldSetOwnProps {
  readonly children?: ReactNode;
}

/** A native fieldset that groups related fields under one legend. */
export type FieldSetProps<TAs extends ElementType = "fieldset"> = RenderableProps<
  TAs,
  FieldSetOwnProps,
  Record<string, never>,
  HTMLFieldSetElement
>;

export type FieldLegendVariant = "legend" | "label";

export interface FieldLegendOwnProps {
  readonly children?: ReactNode;
  /**
   * `legend` sizes it as a section heading; `label` matches FieldLabel. Written as data-variant;
   * omitted when unset, which renders as `legend`.
   */
  readonly variant?: FieldLegendVariant;
}

/** The native legend that names a FieldSet. Put it first. */
export type FieldLegendProps<TAs extends ElementType = "legend"> = RenderableProps<
  TAs,
  FieldLegendOwnProps,
  Record<string, never>,
  HTMLLegendElement
>;
