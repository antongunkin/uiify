import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
  Ref,
} from "react";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export type CarouselAxis = "inline" | "block";
export type CarouselReason =
  | "previous"
  | "next"
  | "dot"
  | "command"
  | "scroll"
  | "drag"
  | "autoplay"
  | "controlled"
  | "items";

export interface CarouselItem {
  readonly id: string;
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export interface CarouselLabels {
  readonly previous: string;
  readonly next: string;
  readonly goToSlide: string;
  readonly navigation: string;
  readonly start: string;
  readonly stop: string;
  readonly slide: string;
}

/**
 * Visible content for the client entries' buttons. Empty by default: `labels` already
 * supplies each button's accessible name, so a consumer supplies whatever it wants to
 * see — an icon, a glyph, a word — without the component shipping one of its own.
 */
export interface CarouselIcons {
  readonly previous?: ReactNode;
  readonly next?: ReactNode;
}

export interface CarouselStyle extends CSSProperties {
  readonly "--uiify-carousel-slide-size"?: string;
  readonly "--uiify-carousel-gap"?: string;
  readonly "--uiify-carousel-fade-duration"?: string;
}

type CarouselRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = RepeatedSlotProps<
  Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML">,
  TOwned
>;

export interface CarouselSlotProps {
  readonly viewport?: Omit<
    ComponentPropsWithRef<"div">,
    "aria-label" | "children" | "dangerouslySetInnerHTML" | "data-part" | "id" | "role" | "tabIndex"
  > &
    ConsumerDataAttributes & {
      readonly "aria-label"?: never;
      readonly "data-part"?: never;
      readonly id?: never;
      readonly role?: never;
      readonly tabIndex?: never;
    };
  readonly slide?: CarouselRepeatedSlotProps<
    "div",
    {
      readonly "aria-hidden"?: never;
      readonly "aria-label"?: never;
      readonly "aria-roledescription"?: never;
      readonly "data-carousel-index"?: never;
      readonly "data-part"?: never;
      readonly "data-state"?: never;
      readonly id?: never;
      readonly inert?: never;
      readonly role?: never;
    }
  >;
  readonly slideContent?: CarouselRepeatedSlotProps<"div", { readonly "data-part"?: never }>;
  readonly rotationControl?: CarouselRepeatedSlotProps<
    "button",
    {
      readonly "aria-label"?: never;
      readonly "data-carousel-action"?: never;
      readonly "data-part"?: never;
      readonly "data-size"?: never;
      readonly "data-uiify-button"?: never;
      readonly "data-variant"?: never;
      readonly disabled?: never;
      readonly hidden?: never;
      readonly type?: never;
    }
  >;
  readonly previousControl?: CarouselRepeatedSlotProps<
    "button",
    {
      readonly "aria-label"?: never;
      readonly "data-carousel-action"?: never;
      readonly "data-part"?: never;
      readonly "data-size"?: never;
      readonly "data-uiify-button"?: never;
      readonly "data-variant"?: never;
      readonly disabled?: never;
      readonly hidden?: never;
      readonly type?: never;
    }
  >;
  readonly nextControl?: CarouselRepeatedSlotProps<
    "button",
    {
      readonly "aria-label"?: never;
      readonly "data-carousel-action"?: never;
      readonly "data-part"?: never;
      readonly "data-size"?: never;
      readonly "data-uiify-button"?: never;
      readonly "data-variant"?: never;
      readonly disabled?: never;
      readonly hidden?: never;
      readonly type?: never;
    }
  >;
  readonly dots?: Omit<
    ComponentPropsWithRef<"nav">,
    "aria-label" | "children" | "dangerouslySetInnerHTML" | "data-part"
  > &
    ConsumerDataAttributes & {
      readonly "aria-label"?: never;
      readonly "data-part"?: never;
    };
  readonly dot?: CarouselRepeatedSlotProps<
    "a",
    {
      readonly "aria-current"?: never;
      readonly "aria-label"?: never;
      readonly "data-carousel-index"?: never;
      readonly "data-part"?: never;
      readonly href?: never;
    }
  >;
  readonly status?: Omit<
    ComponentPropsWithRef<"div">,
    "aria-atomic" | "aria-live" | "children" | "dangerouslySetInnerHTML" | "data-part"
  > &
    ConsumerDataAttributes & {
      readonly "aria-atomic"?: never;
      readonly "aria-live"?: never;
      readonly "data-part"?: never;
    };
}

export interface CarouselProps
  extends
    Omit<
      ComponentPropsWithoutRef<"section">,
      | "aria-label"
      | "children"
      | "className"
      | "data-axis"
      | "data-enhanced"
      | "data-mode"
      | "data-uiify-carousel"
      | "dangerouslySetInnerHTML"
      | "defaultValue"
      | "dir"
      | "id"
      | "autoplay"
      | "afterChange"
      | "beforeChange"
      | "mouseDrag"
      | "onSelect"
      | "onSwipe"
      | "rewind"
      | "swipe"
      | "style"
      | "value"
    >,
    ConsumerDataAttributes {
  readonly "data-axis"?: never;
  readonly "data-enhanced"?: never;
  readonly "data-mode"?: never;
  readonly "data-uiify-carousel"?: never;
  readonly id: string;
  readonly items: readonly CarouselItem[];
  readonly "aria-label": string;
  readonly axis?: CarouselAxis;
  readonly dir?: "ltr" | "rtl";
  readonly locale?: string;
  readonly navigation?: boolean;
  readonly pagination?: boolean;
  readonly className?: string;
  readonly style?: CarouselStyle;
  readonly labels?: Partial<CarouselLabels>;
  readonly icons?: CarouselIcons;
  readonly slotProps?: CarouselSlotProps;
}

export interface CarouselWithRefProps extends CarouselProps {
  readonly ref?: Ref<HTMLElement>;
}

export interface CarouselChange {
  readonly previousIndex: number;
  readonly index: number;
  readonly reason: CarouselReason;
}

export interface CarouselAutoplayOptions {
  readonly delay?: number;
  readonly paused?: boolean;
  readonly cycles?: number;
  readonly stopOnInteraction?: boolean;
}

export interface CarouselClientProps extends CarouselProps {
  readonly ref?: Ref<CarouselClientHandle>;
  readonly defaultValue?: number;
  readonly value?: number;
  readonly rewind?: boolean;
  readonly mouseDrag?: boolean;
  readonly autoplay?: boolean | CarouselAutoplayOptions;
  readonly onSelect?: (index: number, detail: CarouselChange) => void;
  readonly beforeChange?: (detail: CarouselChange) => void;
  readonly afterChange?: (detail: CarouselChange) => void;
  readonly onSwipe?: (detail: CarouselChange) => void;
}

export interface FadeCarouselClientProps extends Omit<CarouselClientProps, "axis"> {
  readonly swipe?: boolean;
}

export interface CarouselClientHandle {
  readonly next: () => void;
  readonly previous: () => void;
  readonly goTo: (index: number) => void;
  readonly start: () => void;
  readonly stop: () => void;
  readonly reset: () => void;
}

export interface CarouselPage {
  readonly index: number;
  readonly offset: number;
}

export interface CarouselSnapshot {
  readonly settledIndex: number;
  readonly ready: boolean;
  readonly index: number;
  readonly requestedIndex: number | null;
  readonly settledChange: CarouselChange | null;
  readonly pages: readonly CarouselPage[];
  readonly visibleIndices: readonly number[];
  readonly atStart: boolean;
  readonly atEnd: boolean;
  readonly moving: boolean;
  readonly interacting: boolean;
}

export interface CarouselControllerOptions {
  readonly defaultValue: number;
  readonly value?: number;
  readonly rewind: boolean;
  readonly onSelect?: CarouselClientProps["onSelect"];
  readonly beforeChange?: CarouselClientProps["beforeChange"];
  readonly afterChange?: CarouselClientProps["afterChange"];
  readonly onSwipe?: CarouselClientProps["onSwipe"];
}

export interface CarouselController {
  readonly getSnapshot: () => CarouselSnapshot;
  readonly getGeometry: () => CarouselGeometry | undefined;
  readonly subscribe: (listener: () => void) => () => void;
  readonly goTo: (index: number, reason: CarouselReason) => void;
  readonly next: (reason: CarouselReason) => void;
  readonly previous: (reason: CarouselReason) => void;
  readonly setInteracting: (active: boolean) => void;
  readonly update: (options: CarouselControllerOptions) => void;
  readonly refresh: () => void;
  readonly destroy: () => void;
}

export interface CarouselGeometry {
  readonly physicalAxis: "x" | "y";
  readonly sign: 1 | -1;
  readonly viewportSize: number;
  readonly currentOffset: number;
  readonly itemStarts: readonly number[];
  readonly itemSizes: readonly number[];
}

export interface CarouselObservation {
  readonly geometry: CarouselGeometry;
  readonly visibleIndices: readonly number[];
}

export interface CarouselObserver {
  readonly watch: (receive: (index: number, visible: readonly number[]) => void) => void;
  readonly measure: (receive: (value: CarouselObservation) => void) => void;
  readonly destroy: () => void;
}

export interface CarouselAutoplaySnapshot {
  readonly requested: boolean;
  readonly playing: boolean;
  readonly completedAdvances: number;
}

export interface CarouselAutoplayController {
  readonly getSnapshot: () => CarouselAutoplaySnapshot;
  readonly subscribe: (listener: () => void) => () => void;
  readonly start: () => void;
  readonly stop: () => void;
  readonly reset: () => void;
  readonly update: (options: CarouselAutoplayOptions) => void;
  readonly destroy: () => void;
}

export interface CarouselPresentation {
  readonly mode: "scroll" | "fade";
  readonly snapshot: CarouselSnapshot;
  readonly autoplay?: CarouselAutoplaySnapshot;
  readonly preserveFallbackFocus: boolean;
  /** True once mounted client-side, even before the controller reports `ready`. */
  readonly mounted: boolean;
}

export interface CarouselMarkupProps {
  readonly base: CarouselProps;
  readonly rootRef?: Ref<HTMLElement>;
  readonly presentation?: CarouselPresentation;
}

export interface CarouselClientViewProps {
  readonly base: CarouselProps;
  readonly rootRef: Ref<HTMLElement>;
  readonly mode: "scroll" | "fade";
  readonly controller?: CarouselController;
  readonly autoplay?: CarouselAutoplayController;
}

/** Actions accepted by native commandfor buttons targeting the root. */
export interface CarouselCommandController {
  readonly next: () => void;
  readonly previous: () => void;
}
