export interface CoreCapabilities {
  readonly anchorPositioning: boolean;
  readonly checkVisibility: boolean;
  readonly dialogRequestClose: boolean;
  readonly popover: boolean;
}

interface CssSupports {
  supports(property: string, value: string): boolean;
}

interface PlatformEnvironment {
  readonly CSS?: CssSupports;
  readonly Element?: typeof Element;
  readonly HTMLDialogElement?: typeof HTMLDialogElement;
  readonly HTMLElement?: typeof HTMLElement;
}

function currentEnvironment(): PlatformEnvironment {
  if (typeof globalThis === "undefined") return {};
  return globalThis;
}

export function supportsPopover(environment: PlatformEnvironment = currentEnvironment()): boolean {
  return (
    typeof environment.HTMLElement !== "undefined" &&
    "showPopover" in environment.HTMLElement.prototype &&
    "hidePopover" in environment.HTMLElement.prototype
  );
}

export function supportsDialogRequestClose(
  environment: PlatformEnvironment = currentEnvironment(),
): boolean {
  return (
    typeof environment.HTMLDialogElement !== "undefined" &&
    "requestClose" in environment.HTMLDialogElement.prototype
  );
}

export function supportsCheckVisibility(
  environment: PlatformEnvironment = currentEnvironment(),
): boolean {
  return (
    typeof environment.Element !== "undefined" && "checkVisibility" in environment.Element.prototype
  );
}

export function supportsAnchorPositioning(
  environment: PlatformEnvironment = currentEnvironment(),
): boolean {
  return environment.CSS?.supports("position-area", "bottom") === true;
}

export function getCoreCapabilities(
  environment: PlatformEnvironment = currentEnvironment(),
): CoreCapabilities {
  return {
    anchorPositioning: supportsAnchorPositioning(environment),
    checkVisibility: supportsCheckVisibility(environment),
    dialogRequestClose: supportsDialogRequestClose(environment),
    popover: supportsPopover(environment),
  };
}

export function getOwnerDocument(node?: Node | null): Document | undefined {
  return node?.ownerDocument ?? (typeof document === "undefined" ? undefined : document);
}

export function getEventPath(event: Event): readonly EventTarget[] {
  return typeof event.composedPath === "function"
    ? event.composedPath()
    : [event.target as EventTarget];
}

export function isEventInsideLayer(
  path: readonly EventTarget[],
  element: Element,
  branches: Iterable<Element>,
): boolean {
  if (path.includes(element)) return true;
  for (const branch of branches) {
    if (path.includes(branch)) return true;
  }
  return false;
}
