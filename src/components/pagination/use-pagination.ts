"use client";

import { useMemo } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { buildPaginationItems } from "./pagination-engine.js";
import type { UsePaginationParams, UsePaginationReturn } from "./types.js";

export function usePagination(params: UsePaginationParams): UsePaginationReturn {
  const {
    boundaryCount = 1,
    count,
    defaultPage = 1,
    disabled = false,
    onChange,
    page: controlledPage,
    showFirstLast = false,
    siblingCount = 1,
  } = params;

  const [page, setPageState] = useControllableState({
    defaultValue: defaultPage,
    onChange,
    value: controlledPage,
  });

  const items = useMemo(
    () => buildPaginationItems(count, page, siblingCount, boundaryCount, disabled, showFirstLast),
    [boundaryCount, count, disabled, page, showFirstLast, siblingCount],
  );

  const setPage = (next: number) => {
    const clamped = count <= 0 ? 1 : Math.max(1, Math.min(count, next));
    setPageState(clamped);
  };

  return { items, page, setPage };
}
