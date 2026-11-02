# Small UI document examples

Choose the relevant example, then read only its selected `agents/reference/ai/` files at the package root. These JSON nodes can be pasted into TypeScript and checked with `satisfies UiNodeInput`. Every node needs `props`; text and nodes belong in `children`.

## GET filter

Read `native.md`, `layout.md`, `select.md` and `button.md`. A native label names the select through matching `htmlFor` and `id`. The browser submits without a handler. This is the small `filterDocument` fixture; the published code is checked by `validateDocument`, rendered HTML validation and axe (contrast requires a browser).

```json
{
  "type": "form",
  "props": { "method": "get", "role": "search" },
  "children": [{
    "type": "Stack",
    "props": { "direction": "block", "gap": "md" },
    "children": [
      { "type": "label", "props": { "htmlFor": "status" }, "children": ["Status"] },
      {
        "type": "Select.Root",
        "props": { "id": "status", "name": "status" },
        "children": [
          { "type": "Select.Item", "props": { "value": "open" }, "children": ["Open"] },
          { "type": "Select.Item", "props": { "value": "closed" }, "children": ["Closed"] }
        ]
      },
      { "type": "Button", "props": { "type": "submit" }, "children": ["Apply"] }
    ]
  }]
}
```

## Unavailable component handoff

Read `native.md`. This tested placeholder is ordinary HTML, with `slot-chart` recorded in the handoff. The id is a naming convention; it adds no document slot behavior. Fill the section with ordinary JSX in the components form, or render that JSX outside the document in document form.

```json
{
  "type": "section",
  "props": { "id": "slot-chart" },
  "children": [{ "type": "h2", "props": {}, "children": ["Activity"] }]
}
```
