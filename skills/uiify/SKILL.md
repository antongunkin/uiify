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

## Project setup and upgrades

At the start of every run, run `node .agents/skills/uiify/scripts/sync-agents.mjs --check` from the project root (path to this skill). It keeps the catalog in `AGENTS.md` (and `CLAUDE.md`) in step with the package.

- `missing` or `outdated`: run `--write`; tell the user in one line what changed.
- `edited`: show the file and ask before `--write --force`.

For skill install, `skill:` states and upgrades, read `references/guides/setup.md`.

## Choose an approach before composition

To change one selected element, read `references/guides/visual-edits.md`; do not compose a page.

Choose internally: reproduce a supplied reference; extend the existing UI for scoped work; create/redesign for a new direction; audit for findings only. For a reference, read its guide before composition and compare again after rendering.

For a compact plan or handoff, use a UI brief:

```text
Place + job: /settings/profile — edit delivery preferences.
Keep + UI: existing routes/theme; Field email, Select frequency, Checkbox marketing, Button save.
Flow + proof: invalid → inline error; valid → demo confirmation + retained values; keyboard, narrow layout.
```

Adapt the brief to the user's language. Keep exact API names; expand ambiguity before coding.

Use this precedence: explicit brief or reference → existing project → selected recipes → aesthetic guidance.

When images or typography shape the composition, read `references/guides/assets.md` before choosing material.

## Choose the output form

Always describe the page as a UI tree first (`references/guides/document.md`): it is short, checked against the real parts, and cheap to fix. Then choose what it becomes, from the request and the project, without asking.

- **Components** (default): ordinary JSX importing `@gunkin/uiify/components/<name>`, written into the project's own files. A second pass turns the validated tree into JSX (`references/guides/components.md`); give it to a separate agent when the host can run one, with only the tree, the brief and that guide.
- **Document**: the tree itself, rendered by `UiDocument` from `@gunkin/uiify/ai`. Use it only when the request or project says the UI is stored or generated rather than written once: a database, CMS, server-driven or LLM-produced page, an explicit "document" or JSON, or code that already imports `@gunkin/uiify/ai`.

## Select knowledge for the page

`references/` paths are relative to this skill directory; `dist/` and `agents/` paths to the package root. Read each distinct file once.

Match the needed elements to the Index by name or alias; never invent a binding. A `gap` or an unlisted element needs custom UI composed from available UIify controls or semantic native HTML, not a guessed UIify API.

For each selected element with a fourth-column reference path, read that file once. A blank path means no curated recipe. From the Composition index, read only relationships where both elements are needed. Follow each selected reference and linked law, including laws named by element recipes. Do not load unrelated references or the complete catalog.

A reference's JSX is a recipe for structure and ids, not code to paste.

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

For a settings page, group fields by decision and give one `Button` the save action.

Wire each requested action through its outcome: a dialog closing is not a mutation. Keep cancel/error paths safe; if an action removes its opener, focus a surviving target, including the empty state. Describe in-memory demos as demos; claim persistence only when implemented.

Do not add an unrelated marketing hero or make every field group an equally prominent card. For unresolved gaps, explain material limitations in plain language; research only when it helps the request. Research does not grant approval to change the library's public API or mark a catalog gap accepted.

## Verification guidance

Finish the edits first, then verify the stable result once: the project's typecheck (`tsc`), build and tests, `validateDocument` on the tree, and html-validate and axe-core on the rendered HTML, using the project's tooling. On failure, fix related findings together, diagnose with focused checks, then rerun the required gate. For these steps and the optional static lint and its limits, read `references/guides/verification.md`.

Reuse existing browser and accessibility tooling for responsive layouts, keyboard access and requested interactions. Before installing missing Playwright or axe-core tooling, html-validate or browser binaries, notify the user what is needed and why. This is a notification, not a confirmation question; follow project rules, its package manager and development dependencies. Use Playwright for browser checks.

Repair findings within scope and rerun affected checks. Report unavailable or prohibited checks as not run, with the reason; never claim a check passed without running it.

## Index

One line per element: `element|aliases|uiify component or gap|reference path`. A blank final field means no curated reference.

```text
accordion|faq-accordion,disclosure|accordion|references/elements/accordion.md
alert-dialog|confirmation-dialog,alert-modal|alert-dialog|references/elements/alert-dialog.md
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
dialog|modal|dialog|references/elements/dialog.md
drawer|sheet,off-canvas-menu|drawer|references/elements/drawer.md
dropdown-menu|menu|dropdown-menu|references/elements/dropdown-menu.md
empty-state|empty-state|empty|references/elements/empty-state.md
feature-grid|feature-cards,feature-list|feature-grid|references/elements/feature-grid.md
field|form-field,fieldset,fieldset-legend|field|references/elements/field.md
file-upload|file-input,dropzone|file-upload|references/elements/file-upload.md
footer|site-footer|gap|references/elements/footer.md
form||form|references/elements/form.md
form-error-summary|error-summary|form-error-summary|references/elements/form-error-summary.md
header|navbar,top-nav|header|references/elements/header.md
hero|hero-section,hero-banner|hero|references/elements/hero.md
hover-card||hover-card|references/elements/hover-card.md
image-gallery|gallery,lightbox|gap|references/elements/image-gallery.md
inline-alert|banner-alert,callout|alert|references/elements/inline-alert.md
input|text-input|input|references/elements/input.md
input-group|input-prefix-suffix|input-group|references/elements/input-group.md
input-otp|otp-input,pin-input,one-time-code|input-otp|references/elements/input-otp.md
item|list-item|item|references/elements/item.md
layout|layout-primitives,page-layout|layout|references/elements/layout.md
line-chart|sparkline|line-chart|references/elements/line-chart.md
logo-wall|logo-cloud,customer-logos|gap|references/elements/logo-wall.md
native-select|select|native-select|references/elements/native-select.md
number-field|number-input|number-field|references/elements/number-field.md
pagination||pagination|references/elements/pagination.md
password-input|show-hide-password|gap|references/elements/password-input.md
popover|popup|popover|references/elements/popover.md
pricing-table|pricing,plan-cards,pricing-plans|pricing-plans|references/elements/pricing-table.md
progress-bar|progress,linear-progress|progress|references/elements/progress-bar.md
radio-group|radio|radio-group|references/elements/radio-group.md
rating|star-rating|rating|references/elements/rating.md
search-input|search-box|gap|references/elements/search-input.md
segmented-control||segmented-control|references/elements/segmented-control.md
separator|divider,rule|separator|references/elements/separator.md
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
testimonial|testimonials,quote-card|testimonial|references/elements/testimonial.md
textarea||textarea|references/elements/textarea.md
timeline||gap|references/elements/timeline.md
toast|snackbar,toast-notification|toast|references/elements/toast.md
toggle|toggle-button|toggle|references/elements/toggle.md
toggle-group|button-group|toggle-group|references/elements/toggle-group.md
toolbar||toolbar|references/elements/toolbar.md
tooltip||tooltip|references/elements/tooltip.md
typography|text-hierarchy,text-roles|typography|references/elements/typography.md
virtual-scroll|virtualized-list|virtual-scroll|references/elements/virtual-scroll.md
```

## Composition index

One line per accepted relationship: `name|element,element|reference path`.

```text
card-rhythm|feature-grid,card|references/compositions/card-rhythm.md
destructive-confirmation|alert-dialog,button|references/compositions/destructive-confirmation.md
form-grouping|form,field|references/compositions/form-grouping.md
hero-actions|hero,button|references/compositions/hero-actions.md
page-frame|header,footer|references/compositions/page-frame.md
pricing-actions|pricing-table,button|references/compositions/pricing-actions.md
save-feedback|button,toast|references/compositions/save-feedback.md
table-controls|table,pagination|references/compositions/table-controls.md
```
