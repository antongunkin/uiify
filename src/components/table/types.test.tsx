import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { TableHead } from "./client.js";

it("keeps the client column header polymorphic while exposing its sort button slot", () => {
  const header: ReactElement = (
    <TableHead
      allowsSorting
      as="div"
      id="name"
      slotProps={{ sortButton: { className: "sort-button", "data-testid": "sort-button" } }}
    >
      Name
    </TableHead>
  );

  expect(header).toBeTruthy();
});
