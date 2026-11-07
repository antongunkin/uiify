<!-- Generated from the package source. Do not edit by hand. -->
# accordion

- Import: `@gunkin/uiify/components/accordion`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `details[name]`
- Without JavaScript: full
- Types file: `dist/components/accordion.d.ts`
- Related native Element (manifest): [native-details](../elements/native-details.md)
- Note: Compound native details/summary disclosure; the same name on every AccordionItem makes it single-open. Built on @gunkin/uiify/elements/native-details.

## Related knowledge

- Recipe: [accordion](../../../skills/uiify/references/elements/accordion.md)

## Exports

- Runtime: `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`
- Types: `AccordionContentOwnProps`, `AccordionContentProps`, `AccordionItemOwnProps`, `AccordionItemProps`, `AccordionOwnProps`, `AccordionProps`, `AccordionTriggerOwnProps`, `AccordionTriggerProps`

## Props and shapes

### AccordionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | AccordionItem parts. |

### AccordionItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes | Identifies the item; written as data-value. |
| `name` | `string \| undefined` | no | The same literal name on every item makes the group single-open (native exclusive `<details name>`); leave it out for multiple open items. |
| `defaultOpen` | `boolean` | no | Applies the native `open` attribute on first render. |
| `children` | `ReactNode` | no | One AccordionTrigger, then one AccordionContent. |

### AccordionTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no | `aria-disabled` and `tabIndex={-1}` on the summary; it cannot be clicked or focused. |
| `children` | `ReactNode` | no | The visible summary. |

### AccordionContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

## Other types

- `AccordionProps`: `` AccordionOwnProps & // `defaultValue` is omitted: without context a div cannot open an item. Omit<ComponentPropsWithRef<"div">, keyof AccordionOwnProps | "defaultValue"> `` — A `div` around native `<details>` items. It has no `type`, `collapsible` or `defaultValue`: single-open is the same `name` on every AccordionItem, and `defaultOpen` opens an item.
- `AccordionItemProps`: `AccordionItemOwnProps & Omit<ComponentPropsWithRef<"details">, keyof AccordionItemOwnProps>`
- `AccordionTriggerProps`: `AccordionTriggerOwnProps & Omit<ComponentPropsWithRef<"summary">, keyof AccordionTriggerOwnProps>`
- `AccordionContentProps`: `AccordionContentOwnProps & Omit<ComponentPropsWithRef<"div">, keyof AccordionContentOwnProps>`
