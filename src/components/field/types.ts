import type { ElementType, HTMLAttributes } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface FieldRootOwnProps {
  /** Stable id for deterministic label/control/error wiring. Required. */
  readonly id: string;
  readonly invalid?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
}

export type FieldRootProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FieldRootOwnProps,
  FieldRootOwnProps,
  HTMLElement
>;

/** Every part connects to Field.Root by this one explicit prop — the same
 * `id` passed to Root — instead of props injected via child traversal. */
export interface FieldPartOwnProps {
  readonly fieldId: string;
}

export interface FieldLabelOwnProps extends FieldPartOwnProps {
  readonly disabled?: boolean;
  readonly required?: boolean;
}

export type FieldLabelProps = FieldLabelOwnProps &
  Omit<HTMLAttributes<HTMLLabelElement>, "htmlFor" | keyof FieldLabelOwnProps>;

export interface FieldControlOwnProps extends FieldPartOwnProps {
  readonly disabled?: boolean;
  readonly invalid?: boolean;
  readonly required?: boolean;
}

export type FieldControlProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FieldControlOwnProps,
  { disabled: boolean; invalid: boolean; required: boolean },
  HTMLElement
>;

export interface FieldDescriptionOwnProps extends FieldPartOwnProps {
  readonly disabled?: boolean;
}

export type FieldDescriptionProps = FieldDescriptionOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof FieldDescriptionOwnProps>;

export interface FieldErrorOwnProps extends FieldPartOwnProps {
  readonly invalid?: boolean;
}

export type FieldErrorProps = FieldErrorOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof FieldErrorOwnProps>;
