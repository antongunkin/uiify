import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface ComponentTierEntry {
  readonly tier: number;
  readonly status: "done" | "pending";
  /** The Tier 0 server shell exists, but the default entry ships the client island instead. */
  readonly clientDefault?: boolean;
}

export interface TierDefinition {
  readonly bannedHooks: readonly string[];
}

export interface TierManifest {
  readonly components: Record<string, ComponentTierEntry>;
  readonly tiers: Record<string, TierDefinition>;
}

const manifestPath = join(dirname(fileURLToPath(import.meta.url)), "../component-tiers.json");

/** Load the tier manifest — single source of truth for the RSC boundary. */
export function loadTierManifest(): TierManifest {
  return JSON.parse(readFileSync(manifestPath, "utf8")) as TierManifest;
}

/** True when the component ships without a `"use client"` banner. */
export function isServerComponent(name: string, manifest = loadTierManifest()): boolean {
  const entry = manifest.components[name];
  if (!entry || entry.status !== "done") return false;
  if (entry.tier !== 0) return false;
  return entry.clientDefault !== true;
}

/** Split manifest components into tsup entry maps keyed by package subpath. */
export function splitComponentEntries(
  manifest = loadTierManifest(),
  entryPath = (name: string) => `src/${name}/index.ts`,
): {
  serverCompatibleEntries: Record<string, string>;
  clientEntries: Record<string, string>;
} {
  const serverCompatibleEntries: Record<string, string> = {};
  const clientEntries: Record<string, string> = { index: "src/index.ts" };

  for (const [name, entry] of Object.entries(manifest.components)) {
    const path = entryPath(name);
    if (entry.status === "done" && isServerComponent(name, manifest)) {
      serverCompatibleEntries[name] = path;
    } else {
      clientEntries[name] = path;
    }
  }

  return { serverCompatibleEntries, clientEntries };
}
