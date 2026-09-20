/** Sort items by their associated element's document order. */
export function sortByDocumentOrder<T>(
  items: Iterable<T>,
  getElement: (item: T) => Element | null,
): T[] {
  return [...items].sort((left, right) => {
    const leftElement = getElement(left);
    const rightElement = getElement(right);
    if (!leftElement || !rightElement || leftElement === rightElement) return 0;
    const position = leftElement.compareDocumentPosition(rightElement);
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}
