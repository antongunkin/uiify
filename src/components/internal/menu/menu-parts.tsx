import type { ElementType, ReactElement, ReactNode } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { MenuGroupProps, MenuLabelProps, MenuSeparatorProps } from "./types.js";

interface MenuPartOptions {
  readonly defaultTag: ElementType;
  readonly part: string;
  readonly role: string;
}

interface MenuPartValues {
  readonly as?: ElementType | undefined;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly render?:
    | ((props: Record<string, unknown>, state: Record<string, never>) => ReactElement | null)
    | undefined;
  readonly [key: string]: unknown;
}

function useMenuPart<TAs extends ElementType>(
  props: MenuGroupProps<TAs> | MenuLabelProps<TAs> | MenuSeparatorProps<TAs>,
  options: MenuPartOptions,
): ReactElement | null {
  const { as, render, children, className, ...consumerProps } = props as MenuPartValues;
  return useRenderElement({
    as,
    defaultTag: options.defaultTag,
    render,
    props: {
      ...consumerProps,
      ...(className ? { className } : {}),
      children,
      role: options.role,
      "data-part": options.part,
    },
    state: {},
  });
}

export function MenuGroup<TAs extends ElementType = "div">(
  props: MenuGroupProps<TAs>,
): ReactElement | null {
  return useMenuPart(props, { defaultTag: "div", part: "group", role: "group" });
}

export function MenuLabel<TAs extends ElementType = "div">(
  props: MenuLabelProps<TAs>,
): ReactElement | null {
  return useMenuPart(props, { defaultTag: "div", part: "label", role: "presentation" });
}

export function MenuSeparator<TAs extends ElementType = "div">(
  props: MenuSeparatorProps<TAs>,
): ReactElement | null {
  return useMenuPart(props, { defaultTag: "div", part: "separator", role: "separator" });
}
