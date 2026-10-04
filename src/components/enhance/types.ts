export interface BoxObserver {
  readonly read: (element: Element, callback: (box: DOMRectReadOnly) => void) => void;
  readonly disconnect: () => void;
}
