import type { ComponentPropsWithRef, ReactNode } from "react";

export interface ConsumerDataAttributes {
  readonly [attribute: `data-${string}`]: string | number | boolean | undefined;
}

/** `"single"` renders `type="radio"`; `"multiple"` renders `type="checkbox"`. */
export type NativeChoiceKind = "single" | "multiple";

export type NativeChoiceOrientation = "horizontal" | "vertical";

export interface NativeChoiceGroupOwnProps {
  readonly children?: ReactNode;
  /**
   * Seeds every child `NativeChoice.Item`'s derived ids and form-control name — pass the same
   * value to each item's own `groupId`. Tier 0 bans `useContext`, so there is no implicit
   * injection from Group to Item; this id is the explicit wiring, the same pattern
   * `@gunkin/uiify/elements/dialog`'s `target` prop uses.
   */
  readonly id: string;
  readonly kind: NativeChoiceKind;
  readonly orientation?: NativeChoiceOrientation;
  /**
   * Documents the derived `choiceGroupName(id, kind)` override every child `NativeChoice.Item`
   * should also receive as its own `name` — not read by `NativeChoice.Group` itself (there is
   * nowhere to inject it to without context), but declaring it here keeps the two in sync
   * for anyone reading the JSX.
   */
  readonly name?: string;
}

export type NativeChoiceGroupProps = NativeChoiceGroupOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof NativeChoiceGroupOwnProps | "dangerouslySetInnerHTML">;

/** Native props of the generated input; consumer values replace the defaults. */
export type NativeChoiceInputSlotProps = Omit<
  ComponentPropsWithRef<"input">,
  "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes;

export type NativeChoiceLabelSlotProps = Omit<
  ComponentPropsWithRef<"label">,
  "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes;

export type NativeChoicePanelSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes;

export interface NativeChoiceItemSlotProps {
  readonly input?: NativeChoiceInputSlotProps;
  readonly label?: NativeChoiceLabelSlotProps;
  readonly panel?: NativeChoicePanelSlotProps;
}

export interface NativeChoiceItemOwnProps {
  readonly value: string;
  /** Rendered inside the `<label>`. */
  readonly label: ReactNode;
  /** When present, renders `<div class="uiify-native-choice-panel">` as a sibling after the label. */
  readonly panel?: ReactNode;
  /** The `NativeChoice.Group.id` this item belongs to — see `NativeChoiceGroupOwnProps.id`. */
  readonly groupId: string;
  readonly kind: NativeChoiceKind;
  /** Overrides the derived `choiceGroupName(groupId, kind)` form-control name. */
  readonly name?: string;
  /** The browser owns the state after first render. */
  readonly defaultChecked?: boolean;
  /** Controlled checked state for client-enhanced choice groups. */
  readonly checked?: boolean;
  readonly disabled?: boolean;
  /** Native props for the generated input, label and optional panel. */
  readonly slotProps?: NativeChoiceItemSlotProps;
  /**
   * Client-only: attaches to the input's native `change`. Passing it does not make this
   * element a client component — the *caller* must already be one. Omitted by every
   * uncontrolled (server) caller, so the server output stays handler-free.
   */
  readonly onValueChange?: (value: string) => void;
}

export type NativeChoiceItemProps = NativeChoiceItemOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    keyof NativeChoiceItemOwnProps | "children" | "dangerouslySetInnerHTML"
  >;
