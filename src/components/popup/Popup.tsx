import { Children, createElement, isValidElement } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import type {
  AnchorSide,
  AnchorAlign,
  PopupInjectedProps,
  PopupPartName,
  PopupRootProps,
  PopupTriggerInternalProps,
  PopupContentInternalProps,
  PopupCloseInternalProps,
} from "./types.js";

function anchorNameForId(id: string): string {
  return `--${id}-anchor`;
}

function createAnchorTriggerProps(anchorName: string, consumerStyle?: CSSProperties) {
  return {
    "data-anchor": "",
    style: { ...consumerStyle, "--uiify-anchor": anchorName } as CSSProperties,
  } as const;
}

function createAnchorPositionerProps({
  align,
  anchorName,
  consumerStyle,
  side,
}: {
  readonly align: AnchorAlign;
  readonly anchorName: string;
  readonly consumerStyle?: CSSProperties | undefined;
  readonly side: AnchorSide;
}) {
  return {
    "data-align": align,
    "data-anchor": "",
    "data-positioning": "native" as const,
    "data-side": side,
    style: { ...consumerStyle, "--uiify-anchor": anchorName } as CSSProperties,
  };
}

const POPOVER_PART = Symbol.for("@gunkin/uiify/popup/part");

function markPopupPart<T>(component: T, part: PopupPartName): T {
  Object.defineProperty(component, POPOVER_PART, { enumerable: false, value: part });
  return component;
}

function getPopupPart(type: unknown): PopupPartName | undefined {
  if (typeof type === "function" || (typeof type === "object" && type !== null)) {
    return (type as Record<symbol, PopupPartName | undefined>)[POPOVER_PART];
  }
  return undefined;
}

function isPopupPart(type: unknown, part: PopupPartName): boolean {
  return getPopupPart(type) === part;
}

export function PopupRoot(props: PopupRootProps): ReactElement | null {
  const { children, className, id, mode = "auto", ...consumerProps } = props;

  const enhancedChildren = Children.map(children, (child: ReactNode) => {
    if (!isValidElement<PopupInjectedProps>(child)) return child;
    const part = getPopupPart(child.type);
    if (part === "trigger" || part === "content" || part === "close") {
      return createElement(child.type, {
        ...(child.props as Record<string, unknown>),
        __mode: mode,
        __popupId: id,
      });
    }
    return child;
  });

  return createElement(
    "div",
    {
      ...consumerProps,
      ...(className ? { className } : {}),
      // Emit both the current marker and the deprecated marker during the compatibility window.
      "data-uiify-popover-root": "",
      "data-uiify-popup-root": "",
    },
    enhancedChildren,
  );
}
PopupRoot.displayName = "PopupRoot";

export function PopupTrigger(props: PopupTriggerInternalProps): ReactElement | null {
  const { children, className, __mode: _mode, __popupId, ...consumerProps } = props;

  if (!__popupId) {
    throw new Error("Popup.Trigger must be used within Popup.Root");
  }

  const anchorName = anchorNameForId(__popupId);

  return createElement(
    "button",
    {
      ...consumerProps,
      ...createAnchorTriggerProps(anchorName, consumerProps.style),
      "aria-controls": __popupId,
      "aria-expanded": false,
      className,
      command: "toggle-popover",
      commandfor: __popupId,
      type: "button",
    },
    children,
  );
}
PopupTrigger.displayName = "PopupTrigger";

export function PopupContent(props: PopupContentInternalProps): ReactElement | null {
  const {
    align = "center",
    children,
    className,
    side = "bottom",
    __mode = "auto",
    __popupId,
    ...consumerProps
  } = props;

  if (!__popupId) {
    throw new Error("Popup.Content must be used within Popup.Root");
  }

  const anchorName = anchorNameForId(__popupId);

  const enhancedChildren = Children.map(children, (child: ReactNode) => {
    if (isValidElement<PopupInjectedProps>(child) && isPopupPart(child.type, "close")) {
      return createElement(child.type, {
        ...(child.props as Record<string, unknown>),
        __popupId,
      });
    }
    return child;
  });

  return createElement(
    "div",
    {
      ...consumerProps,
      ...createAnchorPositionerProps({
        align,
        anchorName,
        consumerStyle: consumerProps.style,
        side,
      }),
      ...(className ? { className } : {}),
      id: __popupId,
      popover: __mode,
    },
    enhancedChildren,
  );
}
PopupContent.displayName = "PopupContent";

export function PopupClose(props: PopupCloseInternalProps): ReactElement | null {
  const { children, className, __mode: _mode, __popupId, ...consumerProps } = props;

  if (!__popupId) {
    throw new Error("Popup.Close must be used within Popup.Root");
  }

  return createElement(
    "button",
    {
      ...consumerProps,
      ...(className ? { className } : {}),
      command: "hide-popover",
      commandfor: __popupId,
      type: "button",
    },
    children,
  );
}
PopupClose.displayName = "PopupClose";

markPopupPart(PopupTrigger, "trigger");

markPopupPart(PopupContent, "content");

markPopupPart(PopupClose, "close");

export const Popup = {
  Close: PopupClose,
  Content: PopupContent,
  Root: PopupRoot,
  Trigger: PopupTrigger,
};
