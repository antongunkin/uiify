import type { ReactElement } from "react";
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
      {...consumerProps}
      className={className}
      data-orientation={orientation}
      data-uiify-toolbar=""
      dir={dir}
      role="toolbar"
    >
      {children}
    </div>
  );
}
ToolbarRoot.displayName = "ToolbarRoot";

export function ToolbarButton(props: ToolbarButtonProps): ReactElement | null {
  const { children, className, disabled = false, onClick } = props;

  return (
    <button
      aria-disabled={disabled || undefined}
      data-uiify-toolbar-item=""
      disabled={disabled}
      type="button"
      {...(className ? { className } : {})}
      {...(onClick ? { onClick } : {})}
    >
      {children}
    </button>
  );
}
ToolbarButton.displayName = "ToolbarButton";

export function ToolbarLink(props: ToolbarLinkProps): ReactElement | null {
  const { children, className, href } = props;

  return (
    <a data-uiify-toolbar-item="" href={href} {...(className ? { className } : {})}>
      {children}
    </a>
  );
}
ToolbarLink.displayName = "ToolbarLink";

export function ToolbarSeparator(props: ToolbarSeparatorProps): ReactElement | null {
  const { className, orientation = "vertical", ...consumerProps } = props;
  return (
    <hr
      {...consumerProps}
      {...(className ? { className } : {})}
      aria-orientation={orientation}
      data-orientation={orientation}
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
