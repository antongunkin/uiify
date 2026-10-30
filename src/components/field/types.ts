import type { ComponentPropsWithRef, ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface FieldRootOwnProps {
  /** Stable id for deterministic label/control/error wiring. Required. */
  readonly id: string;
  readonly invalid?: boolean | undefined;
  readonly required?: boolean | undefined;
  readonly disabled?: boolean | undefined;
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
  readonly disabled?: boolean | undefined;
  readonly required?: boolean | undefined;
}

export type FieldLabelProps = FieldLabelOwnProps &
  Omit<ComponentPropsWithRef<"label">, keyof FieldLabelOwnProps>;

export interface FieldControlOwnProps extends FieldPartOwnProps {
  readonly disabled?: boolean | undefined;
  readonly invalid?: boolean | undefined;
  readonly required?: boolean | undefined;
}

export type FieldControlProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FieldControlOwnProps,
  { disabled: boolean; invalid: boolean; required: boolean },
  HTMLElement
>;

export interface FieldDescriptionOwnProps extends FieldPartOwnProps {
  readonly disabled?: boolean | undefined;
}

export type FieldDescriptionProps = FieldDescriptionOwnProps &
  Omit<ComponentPropsWithRef<"p">, keyof FieldDescriptionOwnProps>;

export interface FieldErrorOwnProps extends FieldPartOwnProps {
  readonly invalid?: boolean | undefined;
}

export type FieldErrorProps = FieldErrorOwnProps &
  Omit<ComponentPropsWithRef<"p">, keyof FieldErrorOwnProps>;
