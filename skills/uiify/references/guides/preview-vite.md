# Preview the designs of a feature with Vite

For a Vite app with `index.html` in the project root (`npm create vite`, client-only or with its own SSR entry). The
preview is an extra HTML page: `vite` serves every HTML file in the root, while `vite build` bundles only the inputs
it is given, `index.html` by default. The build gets neither the preview nor the designs `active.ts` does not import.

1. One page per feature, `uiify/<feature>/index.html` in the project root, served at `/uiify/<feature>/`:

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Preview: paywall</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/uiify/paywall.tsx"></script>
     </body>
   </html>
   ```

2. Its script, `src/uiify/<feature>.tsx`, inside `src` so `tsc` checks it. Import the global styles the way the
   product entry (`src/main.tsx`) does:

   ```tsx
   import "../styles";
   import { Stack } from "@gunkin/uiify";
   import { createRoot } from "react-dom/client";
   import { designs } from "../ui/features/paywall/designs";
   import * as samples from "../ui/features/paywall/sample";

   const query = new URLSearchParams(location.search);
   const states = Object.entries(samples);
   const [, props] = states.find(([name]) => name === query.get("sample")) ?? states[0]!;
   const One = Object.entries(designs).find(([name]) => name === query.get("design"))?.[1];

   createRoot(document.getElementById("root")!).render(
     One ? (
       <One {...props} />
     ) : (
       <Stack gap="xl" width="full" minWidth="zero">
         {Object.entries(designs).map(([name, Design]) => (
           <section key={name} aria-label={name}>
             <Design {...props} />
           </section>
         ))}
       </Stack>
     ),
   );
   ```

3. Keep `uiify/` out of `build.rollupOptions.input` in `vite.config.ts`. If the project lists its inputs, list only
   the product pages. After `vite build`, `dist/` has no `uiify/` folder.

The preview renders in the browser only, also in a project with SSR: it is a development page. Look at it as
`preview.md` says (dev server, `/uiify/<feature>/`, checks on `?design=<name>`).
