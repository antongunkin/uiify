# Example: table-controls

Element: references/elements/table.md

Export: `TableControls`

## Source

```tsx
"use client";

import { useState } from "react";
import { Input } from "@gunkin/uiify/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gunkin/uiify/components/table";

const people = ["Ada Lovelace", "Grace Hopper", "Katherine Johnson"];

export function TableControls() {
  const [query, setQuery] = useState("");
  const visible = people.filter((person) => person.toLowerCase().includes(query.toLowerCase()));
  return (
    <section>
      <label>
        Filter people <Input value={query} onValueChange={setQuery} />
      </label>
      <Table>
        <TableHeader>
          <TableRow id="header">
            <TableHead id="name-heading">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((person) => (
            <TableRow id={person} key={person}>
              <TableCell>{person}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
```

## CSS

```css
.uiify-field {
  display: grid;
  gap: 0.5rem;
}

.uiify-field input,
.uiify-native-select {
  min-block-size: 2.75rem;
  padding-inline: 0.75rem;
}

table {
  border-collapse: collapse;
  inline-size: 100%;
}

th,
td {
  padding: 0.5rem;
  text-align: start;
}
```
