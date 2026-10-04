"use client";

import { createElement, useSyncExternalStore } from "react";
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent, ReactElement } from "react";
import { useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { RovingFocusItem } from "@gunkin/uiify/core/roving-focus";
import { TableRow as TableRowElement } from "../TableShell.js";
import type { TableRowProps } from "../types.js";
import { useTableContext } from "./table-context.js";

export function TableRow(props: TableRowProps): ReactElement | null {
  const { disabled = false, id, as, render, ...consumerProps } = props;
  const consumerRef = (props as ComponentPropsWithRef<"tr">).ref;
  const { interactive: selectionEnabled, inBody, store } = useTableContext("Row");
  const interactive = selectionEnabled && inBody;
  useIsomorphicLayoutEffect(
    () => (inBody ? store.registerRow(id) : undefined),
    [id, store, inBody],
  );
  useIsomorphicLayoutEffect(() => {
    if (inBody) store.setRowDisabled(id, disabled);
  }, [id, disabled, store, inBody]);

  const selected = useSyncExternalStore(
    (listener) => store.subscribeRow(id, listener),
    () => store.isRowSelected(id),
    () => false,
  );

  const { onClick: consumerOnClick, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onClick?: (event: MouseEvent<HTMLTableRowElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLTableRowElement>) => void;
  };

  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, button, a, [role='checkbox']")) return;
    store.toggleRow(id, {
      disabled,
      metaKey: event.metaKey || event.ctrlKey,
      shiftKey: event.shiftKey,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === " " && interactive) {
      event.preventDefault();
      store.toggleRow(id, { disabled });
    }
  };

  if (interactive) {
    return createElement(RovingFocusItem, {
      disabled,
      id,
      ...(consumerRef ? { ref: consumerRef } : {}),
      render: (renderProps: Record<string, unknown>) => {
        // T5 — three-way nested composition. `renderProps` is RovingFocusItem's own
        // fully-resolved props (id/aria-disabled/data-current/data-disabled/onFocus/
        // ref/tabIndex, plus its own `onKeyDown` for arrow-key roving + typeahead).
        // Chain innermost first: roving-focus's onKeyDown runs as the outer layer
        // (it never calls preventDefault() for Space), then the real consumer's
        // onKeyDown, then this row's own Space-toggle — preserving Space's today
        // double duty as both a typeahead character and the row-toggle key.
        const { onKeyDown: rovingFocusOnKeyDown, ...restRenderProps } = renderProps as Record<
          string,
          unknown
        > & { onKeyDown?: (event: KeyboardEvent<HTMLTableRowElement>) => void };

        const rowProps = {
          ...consumerProps,
          ...restRenderProps,
          "aria-selected": selected,
          disabled,
          id,
          selected,
          onClick: composeEventHandlers(consumerOnClick, handleClick),
          onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
            if (event.target !== event.currentTarget) {
              consumerOnKeyDown?.(event);
              return;
            }
            composeEventHandlers(
              rovingFocusOnKeyDown,
              composeEventHandlers(consumerOnKeyDown, handleKeyDown),
            )(event);
          },
        };

        if (render) {
          return createElement(TableRowElement, { ...rowProps, render });
        }
        return createElement(TableRowElement, {
          ...rowProps,
          ...(as !== undefined ? { as } : {}),
        });
      },
    });
  }

  const rowProps = {
    ...consumerProps,
    disabled,
    id,
    selected,
  };

  if (render) {
    return createElement(TableRowElement, { ...rowProps, render });
  }

  return createElement(TableRowElement, {
    ...rowProps,
    ...(as !== undefined ? { as } : {}),
  });
}
TableRow.displayName = "TableRow";
