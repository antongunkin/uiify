import type { ComponentPropsWithRef, ReactNode } from "react";

/** `"single"` renders `type="radio"`; `"multiple"` renders `type="checkbox"`. */
export type ChoiceKind = "single" | "multiple";

export type ChoiceOrientation = "horizontal" | "vertical";

export interface ChoiceGroupOwnProps {
  readonly children?: ReactNode;
  /**
   * Seeds every child `Choice.Item`'s derived ids and form-control name — pass the same
   * value to each item's own `groupId`. Tier 0 bans `useContext`, so there is no implicit
   * injection from Group to Item; this id is the explicit wiring, the same pattern
   * `@gunkin/uiify/elements/dialog`'s `target` prop uses.
   */
  readonly id: string;
  readonly kind: ChoiceKind;
  readonly orientation?: ChoiceOrientation;
  /**
   * Documents the derived `choiceGroupName(id, kind)` override every child `Choice.Item`
   * should also receive as its own `name` — not read by `Choice.Group` itself (there is
   * nowhere to inject it to without context), but declaring it here keeps the two in sync
   * for anyone reading the JSX.
   */
  readonly name?: string;
}

export type ChoiceGroupProps = ChoiceGroupOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps>;

export interface ChoiceItemOwnProps {
  readonly value: string;
  /** Rendered inside the `<label>`. */
  readonly label: ReactNode;
  /** When present, renders `<div data-part="panel">` as a sibling after the label. */
  readonly panel?: ReactNode;
  /** The `Choice.Group.id` this item belongs to — see `ChoiceGroupOwnProps.id`. */
  readonly groupId: string;
  readonly kind: ChoiceKind;
  /** Overrides the derived `choiceGroupName(groupId, kind)` form-control name. */
  readonly name?: string;
  /** The browser owns the state after first render. */
  readonly defaultChecked?: boolean;
  /** Controlled checked state for client-enhanced choice groups. */
  readonly checked?: boolean;
  readonly disabled?: boolean;
  /** Wrapper `data-part`. Defaults to `"item"` (stepper-shaped consumers use `"step"`). */
  readonly part?: string;
  /** Adds `data-part="label"` to the `<label>`. */
  readonly labelPart?: boolean;
  /** Escape hatch: extra attributes spread onto the `<input>` (for example, `data-part="control"`). */
  readonly inputProps?: Record<string, unknown>;
  /** Escape hatch: extra attributes spread onto the `<label>`. */
  readonly labelProps?: Record<string, unknown>;
  /** Escape hatch: extra attributes spread onto the panel `<div>`. */
  readonly panelProps?: Record<string, unknown>;
  /**
   * Client-only: attaches to the input's native `change`. Passing it does not make this
   * element a client component — the *caller* must already be one. Omitted by every
   * uncontrolled (server) caller, so the server output stays handler-free.
   */
  readonly onChange?: (value: string) => void;
}

export type ChoiceItemProps = ChoiceItemOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof ChoiceItemOwnProps | "children">;
