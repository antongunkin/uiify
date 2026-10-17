import type { TableOfContentsScrollSnapshot } from "./types.js";

export function resolveTableOfContentsId(href: string, documentUrl: string): string | null {
  try {
    const base = new URL(documentUrl);
    const link = new URL(href, base);
    if (
      link.origin !== base.origin ||
      link.pathname !== base.pathname ||
      link.search !== base.search ||
      link.hash.length < 2
    )
      return null;
    return decodeURIComponent(link.hash.slice(1));
  } catch {
    return null;
  }
}

export function getTableOfContentsValue({
  targets,
  viewportStart,
  viewportEnd,
  offset,
  contentEnd,
}: TableOfContentsScrollSnapshot): string | null {
  const visible = targets.filter((target) => target.visible);
  if (contentEnd !== null && viewportStart > 0 && contentEnd <= viewportEnd + 1)
    return visible.at(-1)?.value ?? null;
  let active = visible[0]?.value ?? null;
  for (const target of visible)
    if (target.start <= viewportStart + offset + 1) active = target.value;
  return active;
}
