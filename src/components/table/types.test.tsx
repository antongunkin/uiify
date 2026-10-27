import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { TableClient } from "./client.js";

it("keeps the client column header polymorphic while exposing its sort button slot", () => {
  const header: ReactElement = (
    <TableClient.ColumnHeader
      allowsSorting
      as="div"
      id="name"
      slotProps={{ sortButton: { className: "sort-button", "data-testid": "sort-button" } }}
    >
      Name
    </TableClient.ColumnHeader>
  );

  expect(header).toBeTruthy();
});
