import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import type { HeaderRootProps } from "./types.js";

export function HeaderRoot({
  placement = "static",
  className,
  ...props
}: HeaderRootProps): ReactElement {
  return <header data-placement={placement} {...props} className={cn("uiify-header", className)} />;
}
HeaderRoot.displayName = "HeaderRoot";

export const Header = { Root: HeaderRoot };
