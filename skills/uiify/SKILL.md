---
name: uiify
description: >-
  Use when creating or improving a web page with @gunkin/uiify, especially when a project needs component
  coverage, a distinctive visual direction, or UIify-aware design and implementation guidance.
disable-model-invocation: true
---

# /uiify

Page request: $ARGUMENTS

Add UIify knowledge using the agent's normal workflow and project instructions. Do not add approval gates, fixed stages, routine questions or pauses. Work autonomously. Use ordinary language in the user's language, without internal stage names or machine-readable status markers.

## Project context

If `$ARGUMENTS` is not substituted, use the explicit conversation request. Inspect repository instructions and relevant manifest, framework config and route examples. Resolve `@gunkin/uiify` from the selected workspace, including hoisted dependencies. Follow the framework's route conventions and RSC/client boundaries; `src/App.tsx` is a destination only when requested. Preserve the home page when creating another route.

Reuse existing design decisions, tokens and conventions, including `DESIGN.md` when present. Do not create `DESIGN.md` or managed state merely for this skill. Setup, dependencies and planning files follow project rules and the request. Preserve unrelated files, routes and content.

## Choose an approach before composition

Choose internally: reproduce a supplied reference; extend the existing UI for scoped work; create/redesign for a new direction; audit for findings only. For a reference, read its guide before composition and compare again after rendering.

For a compact plan or handoff, use a UI brief:

```text
Place + job: /settings/profile — edit delivery preferences.
Keep + UI: existing routes/theme; Field email, Select frequency, Checkbox marketing, Button save.
Flow + proof: invalid → inline error; valid → demo confirmation + retained values; keyboard, narrow layout.
```

Adapt or reuse the brief in the user's language; no parser, required file or output. Keep exact API names; expand ambiguity before coding.

Use this precedence: explicit brief or reference → existing project → selected recipes → aesthetic guidance.

When images or typography shape the composition, read `references/guides/assets.md` before choosing material.

## Select knowledge for the page

`references/` paths are relative to this skill directory; `agents/` paths are relative to the resolved package root. Read each distinct file once, reusing it across selected elements.

Match the needed elements to the Index by name or alias. Use the listed component binding; never invent a binding. A `gap` or an unlisted element needs custom UI composed from available UIify controls or semantic native HTML, not a guessed UIify API.

For each selected element with a fourth-column reference path, read that file once. A blank path means no curated recipe. Read and adapt its linked example for part wiring. From the Composition index, read only relationships where both elements are needed. Follow each selected reference and linked law, including laws named by element recipes. Do not load unrelated references or the complete catalog.

For mapped components, read the package's `agents/index.md` and `agents/reference/components/<name>.md`. Related knowledge links locate selected packaged recipes/examples. Check Runtime exports: use the explicit `NameRoot` export when available. A namespace export is not itself a JSX component; use its `.Root` or an explicit root export. Import from `@gunkin/uiify/components/<name>`. If the reference leaves an export, required prop or part wiring ambiguous, inspect its listed Types/declaration file and runtime exports. Prefer version-matched references over memory.

Reuse documented UIify components, including controls inside custom gaps. Check `agents/components.md` for controls absent from recipes. Do not replace an available Button, Input, Checkbox or AlertModal with a raw-tag lookalike. Keep native HTML when no component fits, the page demonstrates native semantics, or layer rules prohibit the import; preserve semantic structures such as `fieldset`, `dl` and forms.

## Design guidance

Consult `frontend-design` for visual direction; if absent, use the built-in guidance below. Optional: `vercel-react-best-practices` for React performance, `web-design-guidelines` for reviews. UIify's public component and styling contracts take precedence over conflicting advice.

After the page renders, review it with a guide only when its question applies:

- `references/guides/surface.md` — what kind of page is this, and how expressive should it be?
- `references/guides/reference.md` — only when a reference or existing page is being compared.
- `references/guides/assets.md` — only when images or typography shape the composition.
- `references/guides/hierarchy.md` — what leads the eye, and do the parts read in the right order?
- `references/guides/content.md` — does the copy say what this page and each action actually do?
- `references/guides/states.md` — does the page still work outside the happy path?
- `references/guides/i18n.md` — only when the page is localized, the project has an i18n setup, or the request mentions languages, RTL or CJK.

Ground visual direction in the subject, audience and primary job. Use clear typography, hierarchy, grouping, purposeful copy, responsive layout and existing semantic color roles. Choose one signature detail; keep the rest restrained. Avoid automatic gradient heroes, equal cards or decorative numbering. Preserve visible focus, keyboard-sized targets and reduced-motion behavior.

For a settings page, group fields by decision and give one `Button` the save action. Adapt the Field example in `agents/index.md`: Root gets `id`, Label/Control/Description/Error get the same `fieldId`. Pass `invalid`/`required` to both Root and Control. `Field.Control as="input"` supplies UIify Input and its ID. Keep Field's ID/ARIA wiring and Description mounted when showing Error. Wrap standalone `Select.Root` in a native `<label>`; Field.Label wires only Field.Control.

Wire each requested action through its outcome: a dialog closing is not a mutation. Keep cancel/error paths safe; if an action removes its opener, focus a surviving target, including the empty state. Describe in-memory demos as demos; claim persistence only when implemented.

Do not add an unrelated marketing hero or make every field group an equally prominent card. For unresolved gaps, explain material limitations in plain language; research only when it helps the request. Research does not grant approval to change the library's public API or mark a catalog gap accepted.

## Verification guidance

Finish the edits before running applicable project build, typecheck and test commands. Run relevant verification once against the stable result. On failure, fix related findings together, diagnose with focused checks, then rerun the required final gate. For the optional static lint and its limits, read `references/guides/verification.md`.

Reuse existing browser and accessibility tooling for responsive layouts, keyboard access and requested interactions. Before installing missing Playwright or axe-core tooling or browser binaries, notify the user what is needed and why. This is a notification, not a confirmation question; follow project rules, its package manager and development dependencies. Use Playwright for browser checks and axe-core for accessibility.

Repair findings within scope and rerun affected checks. Report unavailable or prohibited checks as not run, with the reason; never claim a check passed without running it.

## Index

One line per element: `element|aliases|uiify component or gap|reference path`. A blank final field means no curated reference.

```text
accordion|faq-accordion,disclosure|accordion|references/elements/accordion.md
alert-modal|confirmation-dialog,alert-dialog|alert-modal|references/elements/alert-modal.md
aspect-ratio|media-frame,responsive-embed|aspect-ratio|references/elements/aspect-ratio.md
avatar|profile-picture|avatar|references/elements/avatar.md
badge|chip,tag|badge|references/elements/badge.md
bar-chart|column-chart|gap|references/elements/bar-chart.md
breadcrumb|breadcrumbs|breadcrumb|references/elements/breadcrumb.md
button|cta-button,icon-button,primary-button|button|references/elements/button.md
candle-chart|candlestick-chart|candle-chart|references/elements/candle-chart.md
card|content-card|card|references/elements/card.md
carousel|testimonial-carousel,image-slider|carousel|references/elements/carousel.md
checkbox||checkbox|references/elements/checkbox.md
code-block|code-snippet|gap|references/elements/code-block.md
collapsible|expandable-section|collapsible|references/elements/collapsible.md
color-picker||color-picker|references/elements/color-picker.md
combobox|autocomplete,typeahead|combobox|references/elements/combobox.md
command-palette|spotlight-search|gap|references/elements/command-palette.md
context-menu|right-click-menu|context-menu|references/elements/context-menu.md
cookie-banner|cookie-consent|gap|references/elements/cookie-banner.md
date-picker|native-date-field,calendar-picker|date-picker|references/elements/date-picker.md
description-list|definition-list,key-value-list|description-list|references/elements/description-list.md
divider|separator|gap|references/elements/divider.md
drawer|sheet,off-canvas-menu|drawer|references/elements/drawer.md
dropdown-menu|menu|dropdown-menu|references/elements/dropdown-menu.md
empty-state|empty-state|empty|references/elements/empty-state.md
feature-grid|feature-cards,feature-list|gap|references/elements/feature-grid.md
field|form-field|field|references/elements/field.md
fieldset|fieldset-legend|fieldset|references/elements/fieldset.md
file-upload|file-input,dropzone|file-upload|references/elements/file-upload.md
footer|site-footer|gap|references/elements/footer.md
form||form|references/elements/form.md
form-error-summary|error-summary|form-error-summary|references/elements/form-error-summary.md
header|navbar,top-nav|header|references/elements/header.md
hero|hero-section,hero-banner|gap|references/elements/hero.md
hover-card||hover-card|references/elements/hover-card.md
image-gallery|gallery,lightbox|gap|references/elements/image-gallery.md
inline-alert|banner-alert,callout|alert|references/elements/inline-alert.md
input|text-input|input|references/elements/input.md
input-group|input-prefix-suffix|input-group|references/elements/input-group.md
item|list-item|item|references/elements/item.md
line-chart|sparkline|line-chart|references/elements/line-chart.md
logo-wall|logo-cloud,customer-logos|gap|references/elements/logo-wall.md
modal|dialog|modal|references/elements/modal.md
number-field|number-input|number-field|references/elements/number-field.md
otp-input|pin-input|otp-input|references/elements/otp-input.md
pagination||pagination|references/elements/pagination.md
password-input|show-hide-password|gap|references/elements/password-input.md
popup|popover|popup|references/elements/popup.md
pricing-table|pricing,plan-cards,pricing-plans|gap|references/elements/pricing-table.md
progress-bar|progress,linear-progress|progress|references/elements/progress-bar.md
radio-group|radio|radio-group|references/elements/radio-group.md
rating|star-rating|rating|references/elements/rating.md
search-input|search-box|gap|references/elements/search-input.md
segmented-control||segmented-control|references/elements/segmented-control.md
select|native-select|select|references/elements/select.md
sidebar|sidebar-nav,side-nav|gap|references/elements/sidebar.md
skeleton|skeleton-loader|skeleton|references/elements/skeleton.md
slider|range-slider|slider|references/elements/slider.md
spinner|loading-indicator|spinner|references/elements/spinner.md
stats-bar|stat-card,metrics|gap|references/elements/stats-bar.md
stepper|step-indicator,wizard-steps|gap|references/elements/stepper.md
switch|toggle-switch|switch|references/elements/switch.md
table|data-table,comparison-table|table|references/elements/table.md
table-of-contents|toc,in-page-nav|table-of-contents|references/elements/table-of-contents.md
tabs|tab-navigation|tabs|references/elements/tabs.md
tags-input|token-input|tags-input|references/elements/tags-input.md
testimonial|testimonials,quote-card|gap|references/elements/testimonial.md
textarea||textarea|references/elements/textarea.md
timeline||gap|references/elements/timeline.md
toast|snackbar,toast-notification|toast|references/elements/toast.md
toggle|toggle-button|toggle|references/elements/toggle.md
toggle-group|button-group|toggle-group|references/elements/toggle-group.md
toolbar||toolbar|references/elements/toolbar.md
tooltip||tooltip|references/elements/tooltip.md
virtual-scroll|virtualized-list|virtual-scroll|references/elements/virtual-scroll.md
```

## Composition index

One line per accepted relationship: `name|element,element|reference path`.

```text
card-rhythm|feature-grid,card|references/compositions/card-rhythm.md
destructive-confirmation|alert-modal,button|references/compositions/destructive-confirmation.md
form-grouping|form,field|references/compositions/form-grouping.md
hero-actions|hero,button|references/compositions/hero-actions.md
page-frame|header,footer|references/compositions/page-frame.md
pricing-actions|pricing-table,button|references/compositions/pricing-actions.md
save-feedback|button,toast|references/compositions/save-feedback.md
table-controls|table,pagination|references/compositions/table-controls.md
```
