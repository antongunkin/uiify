# A feature for the developer

The developer may write everything. Read the feature's `brief.md` first: its `Open requests` are yours.

## Connect

The product page imports only `active.ts` and passes the slot code: a string (or the project's `t("…")`) to a
`string` slot, an element to a `ReactNode` slot, one element per row with a `key` to a repeated slot. Slot code is
application code: it may fetch data and use any component.

```tsx
import Paywall from "@/ui/features/paywall/active";

export default async function Page() {
  const plans = await getPlans();
  return <Paywall title="Unlock Pro" plans={plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)} />;
}
```

## Change the contract

Add or rename the slot in `contract.ts`, then run the checks: `design-missing-slot` and `tsc` list every design and
sample to update, connected or not. Update all of them; never delete a design to make the checks pass. Mark the
request done in the brief.

## States and forms

Loading, empty and error are exports of `sample.tsx` for the preview; in the product they are the page's own code
(data fetching, error boundary, a different slot value), never logic inside a design. Every design posts to the
same `action` and `method`; the handler is yours.

## Ship

CI runs the checks before the build: `node .agents/skills/uiify/scripts/sync-agents.mjs --check`,
`node .agents/skills/uiify/scripts/check-screens.mjs <dir>`, which runs `tsc --noEmit` too. Add the steps if CI lacks them.

Run the build. Its route list has no `/uiify/*`, and a text that only another design has is not in the output.

## Roles, only when asked

- CODEOWNERS: `<dir>/` owned by the PM and the developers, everything else by the developers; require review in
  branch protection. This is the gate that holds.
- Claude Code, for the PM's machine: `permissions.deny` with `Edit(/app/**)` and the other developer paths in
  `.claude/settings.local.json`. It does not stop a script that writes files itself.
- The PM's own instructions get one line: `uiify role: pm`. In Claude Code that is `CLAUDE.local.md`.

Do not add hooks for roles.
