import type { ReactElement } from "react";
import type { HeaderRootProps } from "./types.js";

export function HeaderRoot({ placement = "static", ...props }: HeaderRootProps): ReactElement {
  return <header {...props} data-uiify-header="" data-placement={placement} />;
}
HeaderRoot.displayName = "HeaderRoot";

export const Header = { Root: HeaderRoot };
