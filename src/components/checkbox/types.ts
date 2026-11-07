import type { ComponentPropsWithRef, ReactNode } from "react";
import type { RepeatedSlotProps, SlotProps } from "../../core/slot-props.js";
import type {
  NativeCheckControlCheckedState,
  NativeCheckControlSlotProps,
} from "../internal/native-check-control/types.js";

export type CheckedState = NativeCheckControlCheckedState;

export type CheckboxSlotProps = NativeCheckControlSlotProps;

export interface CheckboxOwnProps {
  readonly id: string;
  readonly label?: ReactNode;
  /** Boolean native state; use CheckboxClient from the /client entry for the mixed state. */
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly slotProps?: CheckboxSlotProps;
  readonly "aria-label"?: string;
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<
    ComponentPropsWithRef<"input">,
    keyof CheckboxOwnProps | "type" | "children" | "className" | "dangerouslySetInnerHTML"
  >;

export type CheckboxClientProps = Omit<CheckboxProps, "checked"> & {
  readonly checked?: CheckedState;
};

export type CheckboxGroupRootProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "children" | "className" | "dangerouslySetInnerHTML" | "id" | "name" | "disabled"
>;

export interface CheckboxGroupItem {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
}

export interface CheckboxGroupSlotProps {
  readonly input?: RepeatedSlotProps<SlotProps<"input">>;
  readonly label?: RepeatedSlotProps<SlotProps<"label">>;
  readonly legend?: SlotProps<"legend">;
  /** Props for the client group's generated select-all checkbox wrapper. */
  readonly selectAll?: SlotProps<"div">;
}

export interface CheckboxGroupProps extends CheckboxGroupRootProps {
  readonly id: string;
  /** Visible legend that names the group; use aria-label/aria-labelledby instead when absent. */
  readonly label?: ReactNode;
  readonly items: readonly CheckboxGroupItem[];
  readonly defaultValue?: readonly string[];
  readonly name?: string;
  readonly disabled?: boolean;
  /** Sets data-required only; aggregate constraint validation stays with the consumer. */
  readonly required?: boolean;
  readonly invalid?: boolean;
  readonly orientation?: "horizontal" | "vertical";
  readonly className?: string;
  readonly slotProps?: CheckboxGroupSlotProps;
}

export interface CheckboxGroupLabels {
  readonly selectAll: string;
}

export interface CheckboxGroupClientProps extends CheckboxGroupProps {
  readonly value?: readonly string[];
  readonly onValueChange?: (value: readonly string[]) => void;
  readonly selectAll?: boolean;
  readonly labels?: Partial<CheckboxGroupLabels>;
}

export interface CheckboxGroupShellProps {
  readonly id: string;
  readonly items: readonly CheckboxGroupItem[];
  readonly className?: string;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly isChecked: (item: CheckboxGroupItem) => boolean;
  /** Client groups pass true even for internal state so every input is React-controlled. */
  readonly isControlled: boolean;
  readonly label?: ReactNode;
  readonly name?: string;
  readonly onItemChange?: (item: CheckboxGroupItem, checked: boolean) => void;
  readonly orientation: "horizontal" | "vertical";
  readonly required: boolean;
  readonly rootProps: CheckboxGroupRootProps;
  readonly selectAll?: ReactNode;
  readonly slotProps?: CheckboxGroupSlotProps;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
}
