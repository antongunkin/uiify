import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import {
  NativeDetailsContent,
  NativeDetailsRoot,
  NativeDetailsSummary,
} from "../../elements/native-details/index.js";
import type { CollapsibleProps } from "./types.js";

/** Native disclosure defaults remain replaceable through root and generated-part props. */
export function Collapsible({
  id,
  label,
  content,
  defaultOpen = false,
  disabled = false,
  slotProps,
  ...rootProps
}: CollapsibleProps): ReactElement {
  return (
    <NativeDetailsRoot
      defaultOpen={defaultOpen}
      disabled={disabled}
      id={id}
      {...rootProps}
      className={cn("uiify-collapsible", rootProps.className)}
    >
      <NativeDetailsSummary
        disabled={disabled}
        {...slotProps?.trigger}
        className={cn("uiify-collapsible-trigger", slotProps?.trigger?.className)}
      >
        {label}
      </NativeDetailsSummary>
      <NativeDetailsContent
        {...slotProps?.panel}
        className={cn("uiify-collapsible-panel", slotProps?.panel?.className)}
      >
        {content}
      </NativeDetailsContent>
    </NativeDetailsRoot>
  );
}
Collapsible.displayName = "Collapsible";
