/** One synchronous geometry read, taken once per user press and never per frame. */
export function readBox(element: Element): DOMRect {
  return element.getBoundingClientRect(); // banned-read-ok: one read per user press, never per frame
}
