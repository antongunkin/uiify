export function serializeThreshold(threshold: number | number[] | undefined): string {
  if (threshold === undefined) return "0";
  if (Array.isArray(threshold)) {
    return [...threshold].sort((left, right) => left - right).join(",");
  }
  return String(threshold);
}

export function intersectionEntryChanged(
  previous: IntersectionObserverEntry | undefined,
  next: IntersectionObserverEntry,
): boolean {
  return (
    previous?.isIntersecting !== next.isIntersecting ||
    previous?.intersectionRatio !== next.intersectionRatio
  );
}
