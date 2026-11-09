import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import type { HeaderProps } from "./types.js";

export function Header({
  placement = "static",
  tone,
  className,
  ...props
}: HeaderProps): ReactElement {
  return (
    <header
      data-placement={placement}
      {...(tone !== undefined && tone !== "default" ? { "data-tone": tone } : {})}
      {...props}
      className={cn("uiify-header", className)}
    />
  );
}
Header.displayName = "Header";
