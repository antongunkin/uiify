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
      data-part="root"
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
  const { children, className, disabled = false, ...consumerProps } = props;

  return (
    <button
      {...consumerProps}
      aria-disabled={disabled || undefined}
      data-part="item"
      data-uiify-toolbar=""
      disabled={disabled}
      type="button"
      {...(className ? { className } : {})}
    >
      {children}
    </button>
  );
}
ToolbarButton.displayName = "ToolbarButton";

export function ToolbarLink(props: ToolbarLinkProps): ReactElement | null {
  const { children, className, href, ...consumerProps } = props;

  return (
    <a {...consumerProps} className={className} data-part="item" data-uiify-toolbar="" href={href}>
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
      data-part="separator"
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
