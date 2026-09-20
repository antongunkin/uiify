import type { PaginationItem } from "./types.js";

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += 1) result.push(i);
  return result;
}

export function buildPaginationItems(
  count: number,
  page: number,
  siblingCount: number,
  boundaryCount: number,
  disabled: boolean,
  showFirstLast: boolean,
): PaginationItem[] {
  const items: PaginationItem[] = [];
  const atStart = page <= 1;
  const atEnd = count <= 0 || page >= count;

  if (showFirstLast) {
    items.push({ disabled: disabled || atStart, selected: false, type: "first" });
  }
  items.push({ disabled: disabled || atStart, selected: false, type: "previous" });

  if (count <= 0) {
    items.push({ disabled: true, selected: false, type: "ellipsis" });
  } else if (count <= boundaryCount * 2 + siblingCount * 2 + 3) {
    for (const p of range(1, count)) {
      items.push({ disabled, page: p, selected: p === page, type: "page" });
    }
  } else {
    const startPages = range(1, boundaryCount);
    const endPages = range(count - boundaryCount + 1, count);
    const siblingsStart = Math.max(
      Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2,
    );
    const siblingsEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      count - boundaryCount - 1,
    );

    for (const p of startPages) {
      items.push({ disabled, page: p, selected: p === page, type: "page" });
    }

    if (siblingsStart > boundaryCount + 2) {
      items.push({ disabled, selected: false, type: "ellipsis" });
    } else if (boundaryCount + 1 < count - boundaryCount) {
      items.push({
        disabled,
        page: boundaryCount + 1,
        selected: page === boundaryCount + 1,
        type: "page",
      });
    }

    for (const p of range(siblingsStart, siblingsEnd)) {
      items.push({ disabled, page: p, selected: p === page, type: "page" });
    }

    if (siblingsEnd < count - boundaryCount - 1) {
      items.push({ disabled, selected: false, type: "ellipsis" });
    } else if (count - boundaryCount > boundaryCount) {
      items.push({
        disabled,
        page: count - boundaryCount,
        selected: page === count - boundaryCount,
        type: "page",
      });
    }

    for (const p of endPages) {
      items.push({ disabled, page: p, selected: p === page, type: "page" });
    }
  }

  items.push({ disabled: disabled || atEnd, selected: false, type: "next" });
  if (showFirstLast) {
    items.push({ disabled: disabled || atEnd, selected: false, type: "last" });
  }

  return items;
}
