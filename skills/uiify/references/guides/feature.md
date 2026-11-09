# A feature for the PM

Work without stopping for approval. A gap in the request goes into the brief as `?` and into your report.

## Zone

Write `brief.md`, `DECISION.md`, `designs/**`, `sample.tsx`, `active.ts` and the feature's preview route. Write
`contract.ts` only while no file outside `<dir>` imports the feature's `active.ts` (`grep -r "<feature>/active"`).
Do not edit product pages, slot code, host config or `package.json`. When the request needs one of them, or a new
slot in a connected feature, leave the file alone: add a line to `Open requests` in the brief (what, for which
design) and name it in your report.

## A new feature

1. `brief.md` from the template below, filled from the request.
2. `contract.ts`: one slot per piece of the brief's content; text the designs style is `string`.
3. Three designs that differ in structure (order, grouping, layout), not colour, from the catalog parts.
4. `sample.tsx`: the brief's real copy, one export per state in `States`.
5. `designs/index.ts`, `active.ts` on the first design, then the preview route (`preview.md`). If the host has no
   preview setup (`pageExtensions` on Next.js), that is an open request.
6. Run the checks, then look at the preview as `preview.md` says.

At most three new designs per request; one pull request per feature.

## Choose a design

"Go with X" changes the import in `active.ts`, nothing else, and writes `DECISION.md`. Keep the other designs.
Edits after the choice go into the chosen design only: list them under `Changes` so a later switch can carry them.

## Templates

```markdown
# <Feature>

Problem: <who hits what, when>
User: <who sees this screen>
Metric: <one number that should move>
Content: <the real copy and items>
States: <full, empty, error…>
Not in scope: <what this feature will not do>
Open requests: <for the developer>
```

```markdown
# Decision: <feature>

Date: <YYYY-MM-DD>
Chosen: designs/<name>.tsx
Considered: <name> — <why not>
Why: <what the preview showed, against the metric>
Changes: <edits to the chosen design after the preview>
Experiment: <optional: hypothesis, metric, guardrail, end date, stop rule>
Result: <after release>
```
