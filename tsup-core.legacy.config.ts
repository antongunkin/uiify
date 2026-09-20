import { defineConfig } from "tsup";

const isWatch = process.argv.includes("--watch");
// Only wipe dist on the first sequential production pass. Parallel/watch builds
// must not clean — config 0 would delete config 1 outputs mid-rebuild.
const shouldCleanDist = process.env.TSUP_CONFIG_INDEX === "0" && !isWatch;

const common = {
  format: ["esm"] as const,
  target: "es2022" as const,
  dts: true,
  sourcemap: true,
  treeshake: false,
  splitting: false,
  external: ["react", "react-dom", "@gunkin/uiify/hooks"],
};

const serverCompatibleEntries = {
  "compose-event-handlers": "src/compose-event-handlers.ts",
  render: "src/render.ts",
  "visually-hidden": "src/visually-hidden.tsx",
};

const clientEntries = {
  index: "src/index.ts",
  direction: "src/direction.tsx",
  portal: "src/portal.tsx",
  presence: "src/presence.tsx",
  dialog: "src/dialog.ts",
  popover: "src/popover.ts",
  "focus-scope": "src/focus-scope.tsx",
  "dismissable-layer": "src/dismissable-layer.tsx",
  collection: "src/collection.tsx",
  "roving-focus": "src/roving-focus.tsx",
  "anchor-position": "src/anchor-position.ts",
};

const configs = [
  {
    ...common,
    entry: serverCompatibleEntries,
    clean: shouldCleanDist,
  },
  {
    ...common,
    entry: clientEntries,
    clean: false,
    banner: {
      js: '"use client";',
    },
  },
] as const;

// tsup runs array configs in parallel; each spawns a DTS worker that can race or OOM.
// Build sequentially via TSUP_CONFIG_INDEX (see package.json "build" script).
const configIndex = process.env.TSUP_CONFIG_INDEX;

export default defineConfig(
  configIndex != null ? configs[Number(configIndex)]! : configs,
);
