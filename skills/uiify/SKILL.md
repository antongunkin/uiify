---
name: uiify
description: >-
  Use when creating or improving a web page with @gunkin/uiify, especially when a project needs component
  coverage, a distinctive visual direction, or UIify-aware design and implementation guidance.
disable-model-invocation: true
---

# /uiify

Brief and flags: $ARGUMENTS

This skill writes only DESIGN.md and files under src/.

## Stage chain

Run the stages R0 to R4 in order and never skip or reorder one. Each stage has a marker line, a result and, except R4, a gate line after it. Every marker, state and gate line is exact and alone on its own line. The first gate, for example, is `UIIFY:GATE R0>R1 auto`. How you output them depends on the flags above.

**Interactive (no `--auto`).** Follow this protocol for every stage:

1. Output the stage marker as plain text before you call any tool for that stage.
2. Do the stage's work; tools are allowed.
3. Output the stage's result.
4. Run the gate: ask once with AskUserQuestion ("Continue to the next stage?" with the options Continue and Stop). On Continue print `UIIFY:GATE <from>><to> asked` and go on. On Stop print `UIIFY:STOPPED` and end the run.

Do not call any tool for a later stage until the current stage's gate line is output. A stage whose marker was not output did not happen.

**Auto (`--auto`).** Ask nothing. Do all tool work first without commentary: read the project (R0) and create `DESIGN.md` when R2 says to. Then output the whole chain in one final message, in stage order: each stage's marker and result, with `UIIFY:GATE <from>><to> auto` between stages, ending as R4 says. Output nothing else before that message.

### R0 activate

Marker `UIIFY:R0 activate`. Work: read the project. Does `package.json` list `@gunkin/uiify` under `dependencies` or `devDependencies`, and does `DESIGN.md` exist at the project root? Result: `UIIFY:STATE uiify=<yes|no> design=<found|missing>`.

### R1 coverage

Marker `UIIFY:R1 coverage`. Work: split the brief into the page elements it needs and match each one to the index below by name or alias. Result: one line per element, `UIIFY:ELEMENT <name>|<binding>`. For an element the index lists, use its index name and its uiify column as the binding (a uiify component name or `gap`). For an element the index does not list, use a kebab-case name and the binding `unknown`.

### R2 design

Marker `UIIFY:R2 design`. Work:

1. Read `DESIGN.md` and reuse its recorded decisions. If missing, create exactly the skeleton below. Preserve the YAML `tokens` and every byte outside the managed block. If its structure or existing managed block is malformed, report the problem and leave it unchanged.
2. Use the R1 bindings as the coverage map. The skill package intentionally contains no private element, law or composition catalog files; do not search for `references/elements/`, `references/laws/` or `references/compositions/` under the skill directory. R3 reads UIify's public component documentation when implementing mapped elements.
3. Consult the `frontend-design` skill when it is available for design direction. Use `web-design-guidelines` only when the task asks for a review, and consult `vercel-react-best-practices` only for a relevant performance decision. These optional skills are references, not dependencies; if absent, use the built-in guidance below. UIify's public component and styling contracts take precedence over any conflicting advice.
4. Ground the page in its actual subject, audience and primary job. Choose a visual direction that follows the brief and is specific to that subject. Plan a clear typography hierarchy, palette using the project's existing semantic roles, responsive layout, purposeful copy and one memorable signature detail. Use restraint around that signature; don't default to a gradient hero, repeated equal cards or decorative numbering without a reason. Preserve visible focus, keyboard-sized targets and reduced-motion behavior.
5. Example: for a settings page, group fields by the decision the person is making, keep labels and validation close to each control, and give one `Button` the save action. Use the package's documented anatomy:

   ```tsx
   <Field.Root id="email" invalid={invalid} required>
     <Field.Label fieldId="email" required>Email</Field.Label>
     <Field.Control as="input" fieldId="email" type="email" invalid={invalid} required />
     <Field.Error fieldId="email" invalid={invalid}>Enter a valid email address</Field.Error>
   </Field.Root>
   <Button type="submit">Save changes</Button>
   ```

   Don't add an unrelated marketing hero or make every field group an equally prominent card.
6. Keep existing decisions and plan the page's element order, hierarchy, grouping, actions and visual direction as a decision with id `page-plan`, a concrete `decision`, `why` and `references`. Reuse an existing plan unless the brief requires an explicit revision; retain other decisions. Research only unresolved gaps or open decisions in a subagent, if both delegation and primary-source retrieval tools are available. Request a short summary with dated primary-source links. If those tools are unavailable, report unresolved gaps and keep them `proposed`. Record dates alongside the source URLs in `sources`. Only explicit owner approval can make a gap `accepted`; `--auto` never grants approval. Follow owner prose and report conflicts with the brief; interactive mode can clarify at the normal gate, while `--auto` preserves recorded choices.
7. Store state only in one JSON block beneath `## Decisions`, delimited by an opening `<!-- uiify:state -->` line and a closing `<!-- /uiify:state -->` line. Its exact shape is `{ "version": 1, "elements": ["R1-name"], "decisions": [{ "id": "page-plan", "decision": "concrete page plan and visual direction", "why": "reason", "references": ["public UIify docs or dated source URLs"] }], "gaps": [{ "element": "gap-name", "status": "proposed", "sources": [] }] }`. Empty lists are allowed; IDs and elements are unique; strings are nonempty. Do not put prose or fences inside the JSON block. Reject duplicate, unclosed, misplaced or invalid blocks. Insert the block immediately after the Decisions heading's newline, without changing surrounding bytes; replace only an existing block and its following newline. If state is unchanged, leave the whole file byte-identical. Keep existing gap acceptance and sources; do not infer approval from research.

Result: summarize the stored page plan, reused decisions and unresolved gaps, including research limitations.

```markdown
---
tokens: {}
---

# Design

## Decisions

## Gaps
```

### R3 build

Marker `UIIFY:R3 build`. Work: if `src/App.tsx` exists, write the page into it (new components go under `src/`), following the R1 table and the stored `page-plan` in `DESIGN.md`. Read `node_modules/@gunkin/uiify/agents/index.md` once and adapt a relevant documented example when it matches the page; for each mapped component, read `node_modules/@gunkin/uiify/agents/reference/components/<name>.md`, then import it from `@gunkin/uiify/components/<name>`. Before rendering an export, inspect its Runtime exports and the Types/declaration file for component shape; use the explicit `NameRoot` export when available. A namespace export is not itself a JSX component; use its `.Root` or the explicit root export. For a `gap` or `unknown` element, use semantic native HTML and UIify's public styling contract, and consult public design-system or platform guidance for unresolved behavior when retrieval is available. Write no file outside `src/` and leave `DESIGN.md` as it is. If `src/App.tsx` does not exist, write nothing. Result: one sentence naming what you wrote and where, or where the page would go.

### R4 verify

Marker `UIIFY:R4 verify`. Work: when commands are permitted and an execution tool is available, run `node <this-skill-directory>/scripts/lint.mjs <project-root>` and report its actual output. The script runs only the static subset enabled by accepted laws; no enabled checks is not proof of accessibility. Missing TypeScript/parser or another execution failure is unavailable, never a pass. If the consuming task prohibits commands, report "lint not run" with that reason; if no execution tool is available, report that limitation. When a browser tool is available and permitted, inspect the page and requested interactions without creating screenshot artifacts; otherwise report that browser verification was not run. Repair findings only under `src/` in at most two rounds, rerunning available checks after each. Do not edit DESIGN.md during repairs. Result: report executed checks, unavailable checks with reasons, repairs and remaining issues; never claim a check passed without running it. Then print `UIIFY:DONE` and stop.

## Hard rules

- Prefer published UIify component documentation over memory when implementing a mapped element.
- Use a uiify component whenever the index names one for the element.
- Ground visual choices in the brief and subject; don't impose one preferred palette or page template.
- Apply optional frontend skills only when available and relevant; UIify's public contracts override generic advice.
- Match elements only against the index: never invent a binding and never use an alias as the element name.
- Run every stage in this conversation and never use context: fork.
- Write only `DESIGN.md` and files under `src/`; R2 changes only its managed state block, R4 repairs only `src/` in at most two rounds.

## Index

One line per element: `element|aliases|uiify component or gap|` (the final field is reserved and empty).

```text
accordion|faq-accordion,disclosure|accordion|
alert-modal|confirmation-dialog,alert-dialog|alert-modal|
avatar|profile-picture|gap|
badge|chip,tag|gap|
bar-chart|column-chart|gap|
breadcrumb|breadcrumbs|breadcrumb|
button|cta-button,icon-button,primary-button|button|
candle-chart|candlestick-chart|candle-chart|
card|content-card|gap|
carousel|testimonial-carousel,image-slider|carousel|
checkbox||checkbox|
code-block|code-snippet|gap|
collapsible|expandable-section|collapsible|
color-picker||color-picker|
combobox|autocomplete,typeahead|combobox|
command-palette|spotlight-search|gap|
context-menu|right-click-menu|context-menu|
cookie-banner|cookie-consent|gap|
date-picker|calendar-picker|gap|
divider|separator|gap|
drawer|sheet,off-canvas-menu|drawer|
dropdown-menu|menu|dropdown-menu|
empty-state|no-results|gap|
feature-grid|feature-cards,feature-list|gap|
field|form-field|field|
file-upload|file-input,dropzone|file-upload|
footer|site-footer|gap|
form||form|
header|navbar,top-nav|header|
hero|hero-section,hero-banner|gap|
hover-card||hover-card|
image-gallery|gallery,lightbox|gap|
inline-alert|banner-alert,callout|gap|
input|text-input|input|
line-chart|sparkline|line-chart|
logo-wall|logo-cloud,customer-logos|gap|
modal|dialog|modal|
number-field|number-input|number-field|
otp-input|pin-input|otp-input|
pagination||pagination|
password-input|show-hide-password|gap|
popup|popover|popup|
pricing-table|pricing,plan-cards,pricing-plans|gap|
progress-bar|progress,linear-progress|gap|
radio-group|radio|radio-group|
rating|star-rating|rating|
search-input|search-box|gap|
segmented-control||segmented-control|
select|native-select|select|
sidebar|sidebar-nav,side-nav|gap|
skeleton|skeleton-loader|skeleton|
slider|range-slider|slider|
spinner|loading-indicator|spinner|
stats-bar|stat-card,metrics|gap|
stepper|step-indicator,wizard-steps|gap|
switch|toggle-switch|switch|
table|data-table,comparison-table|table|
table-of-contents|toc,in-page-nav|table-of-contents|
tabs|tab-navigation|tabs|
tags-input|token-input|tags-input|
testimonial|testimonials,quote-card|gap|
textarea||textarea|
timeline||gap|
toast|snackbar,toast-notification|toast|
toggle|toggle-button|toggle|
toggle-group|button-group|toggle-group|
toolbar||toolbar|
tooltip||tooltip|
virtual-scroll|virtualized-list|virtual-scroll|
```
