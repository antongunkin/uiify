import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import { ToggleGroup } from "../toggle-group/ToggleGroup.js";
import type {
  ToolbarRootProps,
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarSeparatorProps,
  ToolbarToggleGroupProps,
} from "./types.js";

export function ToolbarRoot(props: ToolbarRootProps): ReactElement | null {
  const {
    children,
    className,
    dir,
    loop: _loop = true,
    orientation = "horizontal",
    ...consumerProps
  } = props;

  return (
    <div
      data-orientation={orientation}
      role="toolbar"
      {...consumerProps}
      className={cn("uiify-toolbar", className)}
      dir={dir}
    >
      {children}
    </div>
  );
}
ToolbarRoot.displayName = "ToolbarRoot";

export function ToolbarButton(props: ToolbarButtonProps): ReactElement | null {
  const { children, className, disabled = false, selected, ...consumerProps } = props;

  return (
    <button
      data-variant="ghost"
      {...(selected !== undefined ? { "aria-pressed": selected } : {})}
      {...consumerProps}
      aria-disabled={disabled || undefined}
      className={cn("uiify-toolbar-item", "uiify-button", className)}
      {...(selected ? { "data-selected": "" } : {})}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
ToolbarButton.displayName = "ToolbarButton";

export function ToolbarLink(props: ToolbarLinkProps): ReactElement | null {
  const { children, className, href, ...consumerProps } = props;

  return (
    <a {...consumerProps} className={cn("uiify-toolbar-item", className)} href={href}>
      {children}
    </a>
  );
}
ToolbarLink.displayName = "ToolbarLink";

export function ToolbarSeparator(props: ToolbarSeparatorProps): ReactElement | null {
  const { className, orientation = "vertical", ...consumerProps } = props;
  return (
    <hr
      aria-orientation={orientation}
      data-orientation={orientation}
      {...consumerProps}
      className={cn("uiify-toolbar-separator", className)}
    />
  );
}
ToolbarSeparator.displayName = "ToolbarSeparator";

export function ToolbarToggleGroupRoot(props: ToolbarToggleGroupProps): ReactElement | null {
  return <ToggleGroup {...props} />;
}
ToolbarToggleGroupRoot.displayName = "ToolbarToggleGroupRoot";

export const ToolbarToggleGroup = ToolbarToggleGroupRoot;

export const Toolbar = {
  Button: ToolbarButton,
  Link: ToolbarLink,
  Root: ToolbarRoot,
  Separator: ToolbarSeparator,
  ToggleGroup: ToolbarToggleGroup,
};
