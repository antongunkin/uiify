# Preview the designs of a feature

The preview is a development-only route that renders every design of one feature with `sample.tsx`. The product
page imports only `active.ts`, so the build gets neither the route nor the other designs.
For a Vite app, follow `preview-vite.md` instead of the Next.js steps below.

## Next.js App Router

1. `next.config.ts`: `page.preview.tsx` is a page only in `next dev`. Keep the other settings; if the project sets
   `pageExtensions` (MDX), add `"preview.tsx"` to its list in development only.

   ```ts
   import type { NextConfig } from "next";
   import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

   const pages = ["tsx", "ts", "jsx", "js"];

   export default function config(phase: string): NextConfig {
     return { pageExtensions: phase === PHASE_DEVELOPMENT_SERVER ? [...pages, "preview.tsx"] : pages };
   }
   ```

2. One route per feature, `app/uiify/<feature>/page.preview.tsx`, with the project's import path. If `app/` has no
   `layout.tsx` (root layouts in route groups), use the product page's group, `app/(<group>)/uiify/<feature>/`,
   or `next dev` writes a bare `app/uiify/layout.tsx`.

   ```tsx
   import { Stack } from "@gunkin/uiify";
   import { designs } from "@/ui/features/paywall/designs";
   import * as samples from "@/ui/features/paywall/sample";

   type Query = { design?: string; sample?: string };

   export default async function PaywallPreview({ searchParams }: { searchParams: Promise<Query> }) {
     const { design, sample } = await searchParams;
     const states = Object.entries(samples);
     const [, props] = states.find(([name]) => name === sample) ?? states[0]!;
     const One = Object.entries(designs).find(([name]) => name === design)?.[1];
     if (One) return <One {...props} />;
     return (
       <Stack gap="xl" width="full" minWidth="zero">
         {Object.entries(designs).map(([name, Design]) => (
           <section key={name} aria-label={name}>
             <Design {...props} />
           </section>
         ))}
       </Stack>
     );
   }
   ```

   `/uiify/paywall` stacks every design with the first sample, whatever the host layout;
   `?design=split&sample=onePlan` shows one, as the product page renders it.

3. If `next build` still lists `/uiify/<feature>`, name the file `page.tsx` and start it with
   `if (process.env.NODE_ENV === "production") notFound();`.

## Look at it

- Start the dev server; in the Claude Code desktop app add it to `.claude/launch.json` and open `/uiify/<feature>`
  in the browser pane.
- Screenshot, compare with the brief, and run html-validate and axe on `?design=<name>`: the all-designs page
  repeats each design's `main`, `h1` and ids.
- Edits appear without a reload; a new design appears once it is in `designs/index.ts`.
