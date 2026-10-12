<!-- Generated from the package source. Do not edit by hand. -->
# accordion

- Import: `@gunkin/uiify/components/accordion`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `details[name]`
- Without JavaScript: full
- Types file: `dist/components/accordion.d.ts`
- Note: Native details/summary disclosure; name groups single-open items. Built on @gunkin/uiify/elements/details.

## Exports

- Runtime: `Accordion`
- Types: `AccordionItem`, `AccordionProps`, `AccordionType`

## Values

- `AccordionType`: `"single" | "multiple"`

## Props and shapes

### AccordionItem

Extends: `ChoicePanelItem`

No own members.

### AccordionProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly AccordionItem[]` | yes |  |
| `type` | `AccordionType` | no |  |
| `defaultValue` | `string \| readonly string[]` | no |  |
| `className` | `string` | no |  |
