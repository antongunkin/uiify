---
name: uiify
description: >-
  Use when creating or improving a web page with @gunkin/uiify, especially when a project needs component
  coverage, a distinctive visual direction, or UIify-aware design and implementation guidance.
disable-model-invocation: true
---

# /uiify

Page request: $ARGUMENTS

Add UIify component and UX knowledge to the user's request. Follow the agent's normal workflow and the project's instructions; this skill is a reference, not a separate interaction protocol. Do not add approval gates, fixed stages, routine questions or pauses. Use ordinary language in the user's language for useful progress and results, without internal stage names or machine-readable status markers. Proceed with authorized work autonomously; handle genuine missing requirements through the agent's normal workflow.

## Project context

Use the explicit request in the conversation if the client does not substitute `$ARGUMENTS`. Read repository instructions, the relevant package manifest and framework config, and a route example as needed. Resolve `@gunkin/uiify` from the selected workspace, including hoisted dependencies in parent workspaces. Follow the requested framework's route conventions and RSC/client boundaries. Create the requested route rather than replacing the home page; `src/App.tsx` is a destination only when it matches the request.

Reuse existing design decisions, tokens and conventions, including `DESIGN.md` when present. Do not create `DESIGN.md` or a managed state block merely because this skill was invoked. Create or update planning files only when the user or project workflow calls for them, preserving unrelated content. Keep changes within the requested page and necessary source files; setup and dependency changes follow the user's request and project rules.

## Choose an approach before composition

Use the request to choose an internal approach; do not ask the user to choose a mode:

- Reproduce an explicit visual reference while preserving its layout, content and recognizable details; read the reference guide before choosing composition and compare again after rendering.
- Extend the existing UI for a scoped change; keep surrounding routes and established design choices intact.
- Create or redesign when the request asks for a new page or a broad visual change.
- Audit when the user asks for findings rather than implementation; report observed issues and evidence.

Use this precedence: explicit brief or reference → existing project → selected recipes → aesthetic guidance. This classification only guides the work; continue the agent's normal workflow.

When images or typography shape the composition, read `references/guides/assets.md` before choosing material. Skip it for routine UI changes where imagery and type are not part of the design decision.

## Select knowledge for the page

Match the needed elements to the Index by name or alias. Use the listed component binding; never invent a binding. A `gap` or an unlisted element needs custom UI, not a guessed UIify API.

For each selected element with a fourth-column reference path, read that file once. A blank path means no curated recipe is available. From the Composition index, read only relationships where both elements are needed on the page. Read each selected reference and linked law once, including the related laws named by element recipes. Do not load the complete catalog or unrelated component references.

For mapped components, read the resolved package's `agents/index.md` once and the relevant `agents/reference/components/<name>.md`, then adapt a documented example. Import from `@gunkin/uiify/components/<name>`. Inspect Runtime exports and the Types/declaration file before rendering: use the explicit `NameRoot` export when available. A namespace export is not itself a JSX component; use its `.Root` or an explicit root export. Prefer these version-matched references over memory. Use UIify wherever its documented API covers the interaction; for gaps, use semantic native HTML or custom components following UIify's public styling and accessibility contracts.

## Design guidance

Consult `frontend-design` when available for design direction; if absent, use the built-in guidance below. Consult `vercel-react-best-practices` for relevant React performance decisions and `web-design-guidelines` for reviews. These skills are optional references. UIify's public component and styling contracts take precedence over conflicting advice.

After the page renders, review it with a guide only when its question applies:

- `references/guides/surface.md` — what kind of page is this, and how expressive should it be?
- `references/guides/reference.md` — only when a reference or existing page is being compared.
- `references/guides/assets.md` — only when images or typography shape the composition.
- `references/guides/hierarchy.md` — what leads the eye, and do the parts read in the right order?
- `references/guides/content.md` — does the copy say what this page and each action actually do?
- `references/guides/states.md` — does the page still work outside the happy path?

Ground the visual direction in the subject, audience and primary job. Plan clear typography, hierarchy, grouping, purposeful copy and responsive layout using existing semantic color roles. Choose one signature detail appropriate to the subject and keep the rest restrained. Avoid defaulting to a gradient hero, repeated equal cards or decorative numbering without a reason. Preserve visible focus, keyboard-sized targets and reduced-motion behavior.

For a settings page, group fields by the decision the person makes, keep labels and validation close to controls, and give one `Button` the save action. Use documented anatomy:

```tsx
<Field.Root id="email" invalid={invalid} required>
  <Field.Label fieldId="email" required>Email</Field.Label>
  <Field.Control as="input" fieldId="email" type="email" invalid={invalid} required />
  <Field.Error fieldId="email" invalid={invalid}>Enter a valid email address</Field.Error>
</Field.Root>
<Button type="submit">Save changes</Button>
```

Do not add an unrelated marketing hero or make every field group an equally prominent card. For unresolved gaps, explain material limitations in plain language; research only when it helps the request. Research does not grant approval to change the library's public API or mark a catalog gap accepted.

## Verification guidance

Use applicable project build, typecheck and test commands when permitted. The optional `node <resolved-skill-directory>/scripts/lint.mjs <project-root>` runs the static checks compiled from the published laws when this skill was built and prints their names; it does not read `DESIGN.md` or other design files. It inspects literal attributes of lowercase intrinsic JSX tags and of parts imported from `@gunkin/uiify/components` or `@gunkin/uiify/elements` (for example `Button` or `Field.Control`); other custom components are not analyzed. No findings is not proof of accessibility. Missing parsers or execution failures mean unavailable, never a pass.

Reuse existing browser and accessibility tooling to inspect responsive layouts, keyboard access and requested interactions. When missing tools are needed for quality verification, use Playwright for browser checks and axe-core (or the project's axe integration) for accessibility checks. Before installing missing Playwright or axe-core packages or downloading browser binaries, notify the user briefly in their language, explaining what will be installed and why. For example: “I'll install Playwright and axe-core as development tools to check the page in a browser and catch accessibility issues.” This is a notification, not a confirmation question; continue within existing authorization and respect project installation rules. Use the project's package manager and development dependencies, reuse existing integrations, and install only what is needed.

Repair findings within the task's scope and rerun the affected checks. If commands, installation or browser execution are unavailable or prohibited, report those checks as not run and explain the limitation. Report actual checks and remaining issues in ordinary language; never claim a check passed without running it.

## Index

One line per element: `element|aliases|uiify component or gap|reference path`. A blank final field means no curated reference.

```text
accordion|faq-accordion,disclosure|accordion|references/elements/accordion.md
alert-modal|confirmation-dialog,alert-dialog|alert-modal|references/elements/alert-modal.md
avatar|profile-picture|gap|references/elements/avatar.md
badge|chip,tag|gap|references/elements/badge.md
bar-chart|column-chart|gap|references/elements/bar-chart.md
breadcrumb|breadcrumbs|breadcrumb|references/elements/breadcrumb.md
button|cta-button,icon-button,primary-button|button|references/elements/button.md
candle-chart|candlestick-chart|candle-chart|references/elements/candle-chart.md
card|content-card|gap|references/elements/card.md
carousel|testimonial-carousel,image-slider|carousel|references/elements/carousel.md
checkbox||checkbox|references/elements/checkbox.md
code-block|code-snippet|gap|references/elements/code-block.md
collapsible|expandable-section|collapsible|references/elements/collapsible.md
color-picker||color-picker|references/elements/color-picker.md
combobox|autocomplete,typeahead|combobox|references/elements/combobox.md
command-palette|spotlight-search|gap|references/elements/command-palette.md
context-menu|right-click-menu|context-menu|references/elements/context-menu.md
cookie-banner|cookie-consent|gap|references/elements/cookie-banner.md
date-picker|calendar-picker|gap|references/elements/date-picker.md
divider|separator|gap|references/elements/divider.md
drawer|sheet,off-canvas-menu|drawer|references/elements/drawer.md
dropdown-menu|menu|dropdown-menu|references/elements/dropdown-menu.md
empty-state|no-results|gap|references/elements/empty-state.md
feature-grid|feature-cards,feature-list|gap|references/elements/feature-grid.md
field|form-field|field|references/elements/field.md
file-upload|file-input,dropzone|file-upload|references/elements/file-upload.md
footer|site-footer|gap|references/elements/footer.md
form||form|references/elements/form.md
header|navbar,top-nav|header|references/elements/header.md
hero|hero-section,hero-banner|gap|references/elements/hero.md
hover-card||hover-card|references/elements/hover-card.md
image-gallery|gallery,lightbox|gap|references/elements/image-gallery.md
inline-alert|banner-alert,callout|gap|references/elements/inline-alert.md
input|text-input|input|references/elements/input.md
line-chart|sparkline|line-chart|references/elements/line-chart.md
logo-wall|logo-cloud,customer-logos|gap|references/elements/logo-wall.md
modal|dialog|modal|references/elements/modal.md
number-field|number-input|number-field|references/elements/number-field.md
otp-input|pin-input|otp-input|references/elements/otp-input.md
pagination||pagination|references/elements/pagination.md
password-input|show-hide-password|gap|references/elements/password-input.md
popup|popover|popup|references/elements/popup.md
pricing-table|pricing,plan-cards,pricing-plans|gap|references/elements/pricing-table.md
progress-bar|progress,linear-progress|gap|references/elements/progress-bar.md
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
