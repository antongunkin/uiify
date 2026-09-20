import type { ComponentPropsWithRef, ElementType, JSX, ReactElement, Ref } from "react";

export type ElementFor<TAs extends ElementType> = ComponentPropsWithRef<TAs>["ref"] extends
  | Ref<infer TElement>
  | undefined
  ? TElement
  : HTMLElement;

export type PolymorphicProps<TAs extends ElementType, OwnProps extends object> = OwnProps &
  Omit<ComponentPropsWithRef<TAs>, keyof OwnProps | "as" | "render"> & {
    as?: TAs;
    render?: never;
  };

export interface RenderCallbackProps<TState, TElement extends Element> {
  render: (
    props: Record<string, unknown> & { ref?: Ref<TElement> },
    state: TState,
  ) => ReactElement | null;
  as?: never;
}

export type RenderableProps<
  TAs extends ElementType,
  OwnProps extends object,
  TState,
  TElement extends Element,
> = PolymorphicProps<TAs, OwnProps> | (OwnProps & RenderCallbackProps<TState, TElement>);

/**
 * Invoker commands (`command`/`commandfor`, `popovertarget`) only fire from a
 * real <button>. Intrinsic tags other than "button" collapse to `never`; custom
 * components pass through and are trusted — by documented contract, verified in
 * fixture tests — to forward their props and ref to a native <button>.
 */
export type NativeButtonAs<TAs extends ElementType> = TAs extends keyof JSX.IntrinsicElements
  ? Extract<TAs, "button">
  : TAs;

/**
 * Props of a part that renders a native invoker button. The library owns `type`
 * and the invoker attributes; consumers keep className, style, ref and onClick.
 */
export type NativeButtonProps<TAs extends ElementType, OwnProps extends object> = OwnProps &
  Omit<
    ComponentPropsWithRef<TAs>,
    | keyof OwnProps
    | "as"
    | "render"
    | "type"
    | "command"
    | "commandfor"
    | "popoverTarget"
    | "popoverTargetAction"
  > & {
    /** `"button"` (default) or a component that forwards props and ref to a native <button>. */
    readonly as?: TAs & NativeButtonAs<TAs>;
    readonly render?: never;
  };
