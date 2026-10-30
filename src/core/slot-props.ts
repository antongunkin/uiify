import type { ComponentPropsWithRef, ElementType, Ref } from "react";
import { cn } from "./class-names.js";

/** Native custom data attributes are accepted by slot objects as well as JSX. */
export interface ConsumerDataAttributes {
  readonly [attribute: `data-${string}`]: string | number | boolean | undefined;
}

/**
 * Native props for an element whose content the component renders. Consumer values replace the
 * component's defaults, ids, ARIA and markers included; only the content itself is not a slot prop.
 */
export type SlotProps<T extends ElementType> = Omit<
  ComponentPropsWithRef<T>,
  "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes;

type NativeSlotObject = Record<string, unknown> & {
  readonly className?: string;
  readonly style?: object;
};

/**
 * Props for a repeated internal part. Common props apply to each instance;
 * `byItemValue` adds props to the item with the matching stable `value`.
 */
export type RepeatedSlotProps<TProps extends object> = TProps & {
  readonly byItemValue?: Readonly<Record<string, TProps>>;
} & ConsumerDataAttributes;

/** Merge consumer props without losing common/item classes, styles, or event handlers. */
export function mergeRepeatedSlotProps<TProps extends object>(
  common: TProps | undefined,
  byItemValue: TProps | undefined,
): TProps {
  const commonRecord = common as NativeSlotObject | undefined;
  const itemRecord = byItemValue as NativeSlotObject | undefined;
  const merged: Record<string, unknown> = { ...commonRecord, ...itemRecord };

  if (commonRecord?.className !== undefined || itemRecord?.className !== undefined) {
    merged.className = cn(commonRecord?.className, itemRecord?.className);
  }
  if (commonRecord?.style !== undefined || itemRecord?.style !== undefined) {
    merged.style = { ...commonRecord?.style, ...itemRecord?.style };
  }

  for (const [key, first] of Object.entries(commonRecord ?? {})) {
    const second = itemRecord?.[key];
    if (key.startsWith("on") && typeof first === "function" && typeof second === "function") {
      merged[key] = (...args: unknown[]) => {
        (first as (...values: unknown[]) => unknown)(...args);
        (second as (...values: unknown[]) => unknown)(...args);
      };
    }
  }

  if (commonRecord?.ref !== undefined && itemRecord?.ref !== undefined) {
    const refs = [commonRecord.ref, itemRecord.ref] as Array<Ref<unknown>>;
    merged.ref = (node: unknown) => {
      const cleanups = refs.map((ref) => {
        if (typeof ref === "function") {
          const cleanup = ref(node);
          return typeof cleanup === "function" ? cleanup : () => ref(null);
        }
        if (ref !== null) ref.current = node;
        return () => {
          if (ref !== null) ref.current = null;
        };
      });
      return () => {
        for (const cleanup of cleanups.reverse()) cleanup();
      };
    };
  }

  return merged as TProps;
}

export function resolveRepeatedSlotProps<TProps extends object>(
  props: RepeatedSlotProps<TProps> | undefined,
  itemValue: string,
): TProps {
  const { byItemValue, ...common } = props ?? {};
  return mergeRepeatedSlotProps(common as TProps, byItemValue?.[itemValue]);
}
