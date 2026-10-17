# Example: table-controls

Element: references/elements/table.md

Export: `TableControls`

## Source

```tsx
"use client";

import { useState } from "react";
import { Table } from "@gunkin/uiify";

const people = ["Ada Lovelace", "Grace Hopper", "Katherine Johnson"];

export function TableControls() {
  const [query, setQuery] = useState("");
  const visible = people.filter((person) => person.toLowerCase().includes(query.toLowerCase()));
  return (
    <section>
      <label>Filter people <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} /></label>
      <Table.Root>
        <Table.Header><Table.Row id="header"><Table.ColumnHeader id="name-heading">Name</Table.ColumnHeader></Table.Row></Table.Header>
        <Table.Body>{visible.map((person) => <Table.Row id={person} key={person}><Table.Cell>{person}</Table.Cell></Table.Row>)}</Table.Body>
      </Table.Root>
    </section>
  );
}
```

## CSS

```css
[data-uiify-field] { display: grid; gap: 0.5rem; }
[data-uiify-field] input,
[data-uiify-select] { min-block-size: 2.75rem; padding-inline: 0.75rem; }
table { border-collapse: collapse; inline-size: 100%; }
th, td { padding: 0.5rem; text-align: start; }
```
