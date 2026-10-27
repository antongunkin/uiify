import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export interface SliderMark {
  readonly value: number;
  readonly label?: ReactNode;
}

export interface SliderOwnProps {
  readonly value?: number;
  readonly defaultValue?: number;
  readonly onValueChange?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
}

export type SliderClientValue = number | readonly [number, number];

export interface SliderClientOwnProps {
  readonly value?: SliderClientValue;
  readonly defaultValue?: SliderClientValue;
  readonly onValueChange?: (value: SliderClientValue) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number | null;
  readonly disabled?: boolean;
  readonly orientation?: "horizontal" | "vertical";
  readonly marks?: readonly SliderMark[];
  readonly labels?: Partial<SliderLabels>;
  readonly thumbLabels?: readonly [string, string];
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
  readonly slotProps?: SliderClientSlotProps;
}

type SliderRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = RepeatedSlotProps<
  Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML">,
  TOwned
>;

type SliderMarkNativeProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes & { readonly "data-part"?: never };

type SliderMarkSlotProps = Omit<
  SliderRepeatedSlotProps<"span", { readonly "data-part"?: never }>,
  "byItemValue"
> & {
  readonly byItemValue?: Readonly<Record<string, SliderMarkNativeProps>>;
  /** Use the rendered mark index to customize records that share one numeric value. */
  readonly byItemIndex?: Readonly<Record<number, SliderMarkNativeProps>>;
};

export interface SliderClientSlotProps {
  readonly track?: Omit<
    ComponentPropsWithRef<"div">,
    "aria-hidden" | "children" | "dangerouslySetInnerHTML" | "data-part"
  > &
    ConsumerDataAttributes & {
      readonly "aria-hidden"?: never;
      readonly "data-part"?: never;
    };
  readonly range?: SliderClientPartSlotProps<"span">;
  readonly mark?: SliderMarkSlotProps;
  readonly visualThumb?: SliderRepeatedSlotProps<"span", { readonly "data-part"?: never }>;
  readonly input?: SliderRepeatedSlotProps<
    "input",
    {
      readonly "aria-label"?: never;
      readonly "aria-labelledby"?: never;
      readonly "aria-orientation"?: never;
      readonly "data-disabled"?: never;
      readonly "data-orientation"?: never;
      readonly "data-part"?: never;
      readonly "data-state"?: never;
      readonly defaultChecked?: never;
      readonly defaultValue?: never;
      readonly disabled?: never;
      readonly max?: never;
      readonly min?: never;
      readonly step?: never;
      readonly type?: never;
      readonly value?: never;
    }
  >;
}

export type SliderClientPartSlotProps<TTag extends ElementType> = Omit<
  ComponentPropsWithRef<TTag>,
  "children" | "dangerouslySetInnerHTML" | "data-part"
> &
  ConsumerDataAttributes & { readonly "data-part"?: never };

export interface SliderLabels {
  readonly minimum: string;
  readonly maximum: string;
}

export interface SliderClientRenderState {
  readonly disabled: boolean;
  readonly orientation: "horizontal" | "vertical";
  readonly value: SliderClientValue;
}

export type SliderClientProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SliderClientOwnProps,
  SliderClientRenderState,
  HTMLDivElement
>;

export type SliderProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  SliderOwnProps,
  SliderOwnProps,
  HTMLInputElement
>;
