import { memo, type ReactElement, type ReactNode } from "react";
import type { VirtualScrollItem } from "./types.js";

export interface VirtualScrollRowItemProps<T extends VirtualScrollItem> {
  readonly item: T;
  readonly index: number;
  readonly renderRow: (item: T, index: number) => ReactNode;
}

function VirtualScrollRowItemRender<T extends VirtualScrollItem>({
  item,
  index,
  renderRow,
}: VirtualScrollRowItemProps<T>): ReactElement {
  return <>{renderRow(item, index)}</>;
}
VirtualScrollRowItemRender.displayName = "VirtualScrollRowItemRender";

/** Skips row content re-renders when the pooled slot still shows the same item. */
export const VirtualScrollRowItem = memo(
  VirtualScrollRowItemRender,
  (previous, next) =>
    previous.renderRow === next.renderRow &&
    previous.item.id === next.item.id &&
    previous.index === next.index,
) as typeof VirtualScrollRowItemRender;
