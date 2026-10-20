<!-- Generated from the package source. Do not edit by hand. -->
# @gunkin/uiify — component index

Rules and anti-patterns: [index.md](./index.md). Each entry links to a generated reference with
its exports, props and shapes; exact types are in the `.d.ts` file listed in the Types column.

## Tiers

| Tier | Meaning | Client JavaScript | Without JavaScript |
| --- | --- | --- | --- |
| 0 | RSC — zero client JavaScript | 0 kB | full |
| 1 | RSC shell + thin client island | <= 1 kB | degraded-documented |
| 2 | Client component — pre-hydration SSR | n/a | pre-hydration-only |

## State sources

| Source | Meaning |
| --- | --- |
| S1 | Native element state — browser owns it and updates the accessibility tree itself |
| S2 | Hidden input + :has() propagation — CSS-readable, ARIA needs a client island |
| none | Stateless markup |

## Components

| Component | Import | Tier | State | Native element | Types | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| [accordion](./reference/components/accordion.md) | `@gunkin/uiify/components/accordion` | 0 | S1 | `details[name]` | `dist/components/accordion.d.ts` | Native details/summary disclosure; name groups single-open items. Built on @gunkin/uiify/elements/details. |
| [alert-modal](./reference/components/alert-modal.md) | `@gunkin/uiify/components/alert-modal` | 0 | S1 | `dialog[role=alertdialog] + command=show-modal` | `dist/components/alert-modal.d.ts` | Native modal alertdialog via show-modal; Cancel/Action are request-close invokers. Baseline Chrome 139 / Firefox 147 / Safari 26.2; below it UIEnhance's invoker fallback runs the command after hydration. |
| [breadcrumb](./reference/components/breadcrumb.md) | `@gunkin/uiify/components/breadcrumb` | 0 | none | `nav>ol` | `dist/components/breadcrumb.d.ts` | Ellipsis expand/collapse is a native details/summary disclosure, built on @gunkin/uiify/elements/details. |
| [button](./reference/components/button.md) | `@gunkin/uiify/components/button` | 0 | none | `button` | `dist/components/button.d.ts` |  |
| [candle-chart](./reference/components/candle-chart.md) | `@gunkin/uiify/components/candle-chart` | 0 | none | `figure>ol>li` | `dist/components/candle-chart.d.ts` | Static OHLC geometry is computed during render and expressed as percentage CSS custom properties; the decorative candle glyphs have an accessible table fallback. |
| [line-chart](./reference/components/line-chart.md) | `@gunkin/uiify/components/line-chart` | 0 | none | `figure>ol>li` | `dist/components/line-chart.d.ts` | Static line segments are computed during render and expressed as percentage CSS custom properties; the decorative CSS line has an accessible table fallback. |
| [carousel](./reference/components/carousel.md) | `@gunkin/uiify/components/carousel` | 2 | none | `section > div[scroll-snap]` | `dist/components/carousel.d.ts` | The documented interactive carousel uses /client and requires hydration for synchronized controls. The base entry remains a native no-JS scroller with CSS Scroll Snap and fragment navigation; /fade adds client-driven CSS transitions. |
| [checkbox](./reference/components/checkbox.md) | `@gunkin/uiify/components/checkbox` | 0 | S1 | `input[type=checkbox]` | `dist/components/checkbox.d.ts` | Native checkbox + label; default entry ships controlled callbacks with use client. |
| [collapsible](./reference/components/collapsible.md) | `@gunkin/uiify/components/collapsible` | 0 | S1 | `details` | `dist/components/collapsible.d.ts` | Native details/summary disclosure. Built on @gunkin/uiify/elements/details. |
| [modal](./reference/components/modal.md) | `@gunkin/uiify/components/modal` | 0 | S1 | `dialog + command=show-modal` | `dist/components/modal.d.ts` | True modal via show-modal/request-close; the browser owns inertness, Escape and focus return. Controlled/initially open state lives in @gunkin/uiify/components/modal/client. Trigger/Close built on @gunkin/uiify/elements/dialog. Backdrop tap and swipe-down are optional UIEnhance improvements; without them the modal still closes by icon, Escape and (Chrome/Firefox) backdrop tap. |
| [drawer](./reference/components/drawer.md) | `@gunkin/uiify/components/drawer` | 0 | S1 | `dialog + command=show-modal` | `dist/components/drawer.d.ts` | DrawerPanel native shell + compound Drawer.* client API; snap-point drag on client entry. |
| [field](./reference/components/field.md) | `@gunkin/uiify/components/field` | 0 | none | `div:has(input)` | `dist/components/field.d.ts` | :user-invalid + :has() reveals the error message |
| [form](./reference/components/form.md) | `@gunkin/uiify/components/form` | 0 | none | `form` | `dist/components/form.d.ts` |  |
| [input](./reference/components/input.md) | `@gunkin/uiify/components/input` | 0 | S1 | `input` | `dist/components/input.d.ts` |  |
| [pagination](./reference/components/pagination.md) | `@gunkin/uiify/components/pagination` | 0 | none | `nav>ol>a` | `dist/components/pagination.d.ts` |  |
| [popup](./reference/components/popup.md) | `@gunkin/uiify/components/popup` | 0 | S1 | `[popover]+popovertarget` | `dist/components/popup.d.ts` | Native parts anchor to their invoker (implicit anchor) and carry no aria-expanded; Chromium exposes expanded through the accessibility tree, other engines are unmeasured. The legacy Popup.Root compound keeps UIEnhance for its DOM attribute. Trigger/Content/Close built on @gunkin/uiify/elements/popover. |
| [radio-group](./reference/components/radio-group.md) | `@gunkin/uiify/components/radio-group` | 0 | S1 | `input[type=radio]` | `dist/components/radio-group.d.ts` | Data-driven native radio group; browser owns selection. Built on @gunkin/uiify/elements/choice. |
| [rating](./reference/components/rating.md) | `@gunkin/uiify/components/rating` | 0 | S1 | `input[type=radio]` | `dist/components/rating.d.ts` | Native radio group; hover preview and persisted selection are pure CSS (:checked/:hover sibling rules), no JS. Controlled value/onValueChange lives in the separate rating/client entry. Built on @gunkin/uiify/elements/choice. |
| [segmented-control](./reference/components/segmented-control.md) | `@gunkin/uiify/components/segmented-control` | 0 | S1 | `input[type=radio]` | `dist/components/segmented-control.d.ts` | Built on @gunkin/uiify/elements/choice. |
| [select](./reference/components/select.md) | `@gunkin/uiify/components/select` | 0 | S1 | `select` | `dist/components/select.d.ts` | Native text-only select; appearance:base-select is a Chrome+Safari cosmetic enhancement and Firefox keeps the OS picker. |
| [skeleton](./reference/components/skeleton.md) | `@gunkin/uiify/components/skeleton` | 0 | none | `div` | `dist/components/skeleton.d.ts` |  |
| [slider](./reference/components/slider.md) | `@gunkin/uiify/components/slider` | 0 | S1 | `input[type=range]` | `dist/components/slider.d.ts` |  |
| [spinner](./reference/components/spinner.md) | `@gunkin/uiify/components/spinner` | 0 | none | `div` | `dist/components/spinner.d.ts` |  |
| [switch](./reference/components/switch.md) | `@gunkin/uiify/components/switch` | 0 | S1 | `input[type=checkbox]` | `dist/components/switch.d.ts` |  |
| [table](./reference/components/table.md) | `@gunkin/uiify/components/table` | 0 | none | `table` | `dist/components/table.d.ts` | Native semantic Table parts; selection, sorting and expansion use the explicit /client entry. |
| [textarea](./reference/components/textarea.md) | `@gunkin/uiify/components/textarea` | 0 | S1 | `textarea` | `dist/components/textarea.d.ts` | field-sizing:content replaces the auto-grow JS. Baseline since Firefox 152. |
| [toggle](./reference/components/toggle.md) | `@gunkin/uiify/components/toggle` | 0 | S1 | `input[type=checkbox]` | `dist/components/toggle.d.ts` | Native checkbox + label toggle; browser owns pressed state. |
| [toggle-group](./reference/components/toggle-group.md) | `@gunkin/uiify/components/toggle-group` | 0 | S1 | `input[type=radio\|checkbox]` | `dist/components/toggle-group.d.ts` | Built on @gunkin/uiify/elements/choice. |
| [tooltip](./reference/components/tooltip.md) | `@gunkin/uiify/components/tooltip` | 1 | S1 | `[popover]` | `dist/components/tooltip.d.ts` |  |
| [hover-card](./reference/components/hover-card.md) | `@gunkin/uiify/components/hover-card` | 1 | S1 | `[popover]` | `dist/components/hover-card.d.ts` |  |
| [toast](./reference/components/toast.md) | `@gunkin/uiify/components/toast` | 1 | S1 | `[popover] + aria-live` | `dist/components/toast.d.ts` |  |
| [number-field](./reference/components/number-field.md) | `@gunkin/uiify/components/number-field` | 1 | S1 | `input[type=text][role=spinbutton]` | `dist/components/number-field.d.ts` |  |
| [toolbar](./reference/components/toolbar.md) | `@gunkin/uiify/components/toolbar` | 1 | none | `div[role=toolbar]` | `dist/components/toolbar.d.ts` |  |
| [file-upload](./reference/components/file-upload.md) | `@gunkin/uiify/components/file-upload` | 1 | S1 | `input[type=file]` | `dist/components/file-upload.d.ts` |  |
| [header](./reference/components/header.md) | `@gunkin/uiify/components/header` | 0 | S1 | `header` | `dist/components/header.d.ts` | Semantic header root; compose native navigation with Modal. Full functionality without JavaScript; optional header/client adds scroll hide/reveal. |
| [tabs](./reference/components/tabs.md) | `@gunkin/uiify/components/tabs` | 0 | S1 | `input[type=radio]` | `dist/components/tabs.d.ts` | Data-driven native radio switcher; CSS-only panels. Built on @gunkin/uiify/elements/choice. |
| [dropdown-menu](./reference/components/dropdown-menu.md) | `@gunkin/uiify/components/dropdown-menu` | 2 | S2 | `[popover]+commandfor` | `dist/components/dropdown-menu.d.ts` |  |
| [combobox](./reference/components/combobox.md) | `@gunkin/uiify/components/combobox` | 2 | S2 | `input+listbox` | `dist/components/combobox.d.ts` |  |
| [context-menu](./reference/components/context-menu.md) | `@gunkin/uiify/components/context-menu` | 2 | S2 | `[popover]` | `dist/components/context-menu.d.ts` |  |
| [tags-input](./reference/components/tags-input.md) | `@gunkin/uiify/components/tags-input` | 2 | none | `input` | `dist/components/tags-input.d.ts` |  |
| [otp-input](./reference/components/otp-input.md) | `@gunkin/uiify/components/otp-input` | 2 | none | `input` | `dist/components/otp-input.d.ts` |  |
| [color-picker](./reference/components/color-picker.md) | `@gunkin/uiify/components/color-picker` | 1 | S1 | `input[type=color]` | `dist/components/color-picker.d.ts` |  |
| [virtual-scroll](./reference/components/virtual-scroll.md) | `@gunkin/uiify/components/virtual-scroll` | 2 | none | `div[overflow]` | `dist/components/virtual-scroll.d.ts` |  |
| [table-of-contents](./reference/components/table-of-contents.md) | `@gunkin/uiify/components/table-of-contents` | 2 | S1 | `nav + button[popovertarget] + [popover] + a[href]` | `dist/components/table-of-contents.d.ts` | Base entry is a server-pure native navigation shell; /client adds enhancements. Native links and popover invocation/dismissal work without JavaScript. |
| [aspect-ratio](./reference/components/aspect-ratio.md) | `@gunkin/uiify/components/aspect-ratio` | 0 | none | `div` | `dist/components/aspect-ratio.d.ts` | Static Block; native CSS aspect-ratio isolates child intrinsic sizing. |
| [badge](./reference/components/badge.md) | `@gunkin/uiify/components/badge` | 0 | none | `span` | `dist/components/badge.d.ts` |  |
| [card](./reference/components/card.md) | `@gunkin/uiify/components/card` | 0 | none | `div` | `dist/components/card.d.ts` |  |
| [progress](./reference/components/progress.md) | `@gunkin/uiify/components/progress` | 0 | S1 | `progress` | `dist/components/progress.d.ts` |  |
| [avatar](./reference/components/avatar.md) | `@gunkin/uiify/components/avatar` | 0 | none | `span` | `dist/components/avatar.d.ts` |  |
| [alert](./reference/components/alert.md) | `@gunkin/uiify/components/alert` | 0 | none | `div` | `dist/components/alert.d.ts` |  |
| [input-group](./reference/components/input-group.md) | `@gunkin/uiify/components/input-group` | 0 | none | `div + native controls` | `dist/components/input-group.d.ts` | Static Block; keeps independently labeled native input and action. |
| [empty](./reference/components/empty.md) | `@gunkin/uiify/components/empty` | 0 | none | `section` | `dist/components/empty.d.ts` |  |
| [item](./reference/components/item.md) | `@gunkin/uiify/components/item` | 0 | none | `li` | `dist/components/item.d.ts` |  |
| [date-picker](./reference/components/date-picker.md) | `@gunkin/uiify/components/date-picker` | 0 | native | `input[type=date]` | `dist/components/date-picker.d.ts` | Native date picker; stylesheet styles the outer input only. |
| [fieldset](./reference/components/fieldset.md) | `@gunkin/uiify/components/fieldset` | 0 | native | `fieldset + legend` | `dist/components/fieldset.d.ts` |  |
| [form-error-summary](./reference/components/form-error-summary.md) | `@gunkin/uiify/components/form-error-summary` | 0 | none | `section + heading + ul + links` | `dist/components/form-error-summary.d.ts` | Static server-rendered error links; no alert or focus script. |
| [description-list](./reference/components/description-list.md) | `@gunkin/uiify/components/description-list` | 0 | none | `dl + dt + dd` | `dist/components/description-list.d.ts` |  |

## Elements

| Element | Import | Native mechanism | Parts | Used by | Types |
| --- | --- | --- | --- | --- | --- |
| [invoker](./reference/elements/invoker.md) | `@gunkin/uiify/elements/invoker` | command/commandfor attributes | `Invoker` | dialog | `dist/elements/invoker.d.ts` |
| [dialog](./reference/elements/dialog.md) | `@gunkin/uiify/elements/dialog` | dialog + command=show-modal | `Dialog.Trigger`, `Dialog.Content`, `Dialog.Close` | modal, alert-modal, drawer | `dist/elements/dialog.d.ts` |
| [popover](./reference/elements/popover.md) | `@gunkin/uiify/elements/popover` | [popover] + popovertarget | `Popover.Trigger`, `Popover.Surface`, `Popover.Close` | popup | `dist/elements/popover.d.ts` |
| [details](./reference/elements/details.md) | `@gunkin/uiify/elements/details` | details/summary | `Details.Root`, `Details.Summary`, `Details.Content` | accordion, collapsible, breadcrumb | `dist/elements/details.d.ts` |
| [choice](./reference/elements/choice.md) | `@gunkin/uiify/elements/choice` | input[type=radio\|checkbox] + label | `Choice.Group`, `Choice.Item` | radio-group, tabs, toggle-group, segmented-control, rating | `dist/elements/choice.d.ts` |
